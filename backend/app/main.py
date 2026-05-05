from __future__ import annotations

import hashlib
import html
import json
import os
import time
from datetime import datetime
from uuid import uuid4

from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .db import SessionLocal, engine
from .models import Admin, Base, Vote, VoteOption, VoteRecord
from .schemas import (
    SubmitVoteIn,
    SubmitVoteOut,
    VoteCreateIn,
    VoteDetailOut,
    VoteListItemOut,
    VoteResultsOut,
    VoteStatusUpdateIn,
    VoteUpdateIn,
)

APP_COOKIE_NAME = "votely_id"
ADMIN_COOKIE_NAME = "votely_admin"


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def sanitize(text: str) -> str:
    """Strip HTML tags and escape special characters."""
    return html.escape(text.strip(), quote=True)


try:
    from .admins_config import ADMINS_CONFIG
except ImportError:
    ADMINS_CONFIG = []

# Override super token from env if set
_env_super = os.getenv("VOTELY_SUPER_ADMIN_TOKEN")
if _env_super:
    ADMINS_CONFIG[0]["token"] = _env_super


def create_app() -> FastAPI:
    app = FastAPI(title="Votely API")

    ALLOWED_ORIGINS = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    }

    # ── Anti-crawler middleware ────────────────────────────────
    BOT_UA_PATTERNS = [
        "bot",
        "crawl",
        "spider",
        "scrape",
        "curl",
        "wget",
        "python-requests",
        "python-urllib",
        "httpclient",
        "java/",
        "node-fetch",
        "axios/",
        "got/",
        "postmanruntime",
        "insomnia",
    ]

    _global_rate: dict[str, list[float]] = {}

    @app.middleware("http")
    async def anti_crawler(request: Request, call_next):
        # 1) Block bot User-Agents
        ua = (request.headers.get("user-agent") or "").lower()
        if not ua or len(ua) < 10:
            return JSONResponse(status_code=403, content={"detail": "Forbidden"})
        for pattern in BOT_UA_PATTERNS:
            if pattern in ua:
                return JSONResponse(status_code=403, content={"detail": "Forbidden"})

        # 2) Validate Origin/Referer on API routes
        if request.url.path.startswith("/api/"):
            origin = request.headers.get("origin") or ""
            referer = request.headers.get("referer") or ""
            if request.method in ("POST", "PUT", "DELETE"):
                if origin and origin not in ALLOWED_ORIGINS:
                    return JSONResponse(
                        status_code=403, content={"detail": "Forbidden"}
                    )
                if not origin and not referer:
                    return JSONResponse(
                        status_code=403, content={"detail": "Forbidden"}
                    )

        # 3) Global rate limit: 60 requests per IP per minute
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        hits = _global_rate.get(client_ip, [])
        hits = [t for t in hits if now - t < 60]
        if len(hits) >= 60:
            return JSONResponse(
                status_code=429, content={"detail": "Too many requests"}
            )
        hits.append(now)
        _global_rate[client_ip] = hits

        return await call_next(request)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(ALLOWED_ORIGINS),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)

    @app.get("/api/health")
    def health() -> dict:
        return {"ok": True}

    # ── Proof-of-Work for vote submission ─────────────────────
    POW_DIFFICULTY = 4  # number of leading zero bits (4 = ~16 attempts avg)
    _pow_challenges: dict[str, float] = {}  # challenge -> expiry timestamp

    @app.get("/api/pow/challenge")
    def get_pow_challenge():
        challenge = uuid4().hex
        expiry = time.time() + 300  # valid for 5 minutes
        _pow_challenges[challenge] = expiry
        # Prune expired
        now = time.time()
        expired = [k for k, v in _pow_challenges.items() if v < now]
        for k in expired:
            del _pow_challenges[k]
        return {"challenge": challenge, "difficulty": POW_DIFFICULTY}

    def verify_pow(challenge: str, nonce: int) -> bool:
        if challenge not in _pow_challenges:
            return False
        if _pow_challenges[challenge] < time.time():
            del _pow_challenges[challenge]
            return False
        h = hashlib.sha256(f"{challenge}{nonce}".encode()).digest()
        # Check leading zero bits
        zero_bits = POW_DIFFICULTY
        full_bytes = zero_bits // 8
        remaining = zero_bits % 8
        for i in range(full_bytes):
            if h[i] != 0:
                return False
        if remaining and (h[full_bytes] >> (8 - remaining)) != 0:
            return False
        # Consume challenge (one-time use)
        del _pow_challenges[challenge]
        return True

    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    def seed_admins(db: Session) -> None:
        for cfg in ADMINS_CONFIG:
            th = hash_token(cfg["token"])
            exists = db.execute(
                select(Admin.id).where(Admin.token_hash == th)
            ).scalar_one_or_none()
            if exists:
                continue
            db.add(
                Admin(
                    id=str(uuid4()),
                    name=cfg["name"],
                    token_hash=th,
                    role=cfg["role"],
                    created_at=datetime.utcnow(),
                )
            )
        db.commit()

    def resolve_admin(
        x_admin_token: str | None = Header(default=None),
        admin_cookie: str | None = Cookie(default=None, alias=ADMIN_COOKIE_NAME),
        db: Session = Depends(get_db),
    ) -> Admin | None:
        seed_admins(db)
        token = x_admin_token or admin_cookie
        if not token:
            return None
        return db.execute(
            select(Admin).where(Admin.token_hash == hash_token(token))
        ).scalar_one_or_none()

    def require_admin(
        admin: Admin | None = Depends(resolve_admin),
    ) -> Admin:
        if not admin:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return admin

    def require_super(admin: Admin = Depends(require_admin)) -> Admin:
        if admin.role != "super":
            raise HTTPException(status_code=403, detail="Forbidden")
        return admin

    # ── Admin Auth APIs ──────────────────────────────────────

    @app.post("/api/admin/login")
    def admin_login(
        response: Response,
        payload: dict,
        db: Session = Depends(get_db),
    ):
        seed_admins(db)
        token = str(payload.get("token") or "").strip()
        if not token:
            raise HTTPException(status_code=400, detail="token is required")
        admin = db.execute(
            select(Admin).where(Admin.token_hash == hash_token(token))
        ).scalar_one_or_none()
        if not admin:
            raise HTTPException(status_code=401, detail="Invalid token")
        response.set_cookie(
            key=ADMIN_COOKIE_NAME,
            value=token,
            httponly=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 7,  # 7 days
        )
        return {"ok": True, "name": admin.name, "role": admin.role}

    @app.post("/api/admin/logout")
    def admin_logout(response: Response):
        response.delete_cookie(key=ADMIN_COOKIE_NAME)
        return {"ok": True}

    @app.get("/api/admin/me")
    def admin_me(admin: Admin | None = Depends(resolve_admin)):
        if not admin:
            return {"ok": False}
        return {"ok": True, "name": admin.name, "role": admin.role}

    def ensure_cookie(response: Response, cookie_id: str | None) -> str:
        if cookie_id:
            return cookie_id
        new_id = uuid4().hex
        response.set_cookie(
            key=APP_COOKIE_NAME,
            value=new_id,
            httponly=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 365,
        )
        return new_id

    def get_client_ip(request: Request) -> str:
        # Prefer direct client; if you add a reverse proxy later, consider trusting X-Forwarded-For.
        client = request.client
        return client.host if client else "unknown"

    def effective_status(vote: Vote) -> str:
        # If admin has force-ended, respect that
        if vote.status == "ended":
            return "ended"
        now = datetime.utcnow()
        if now < vote.start_at:
            return "pending"
        if now > vote.end_at:
            return "ended"
        return "active"

    def vote_is_active(vote: Vote) -> bool:
        return effective_status(vote) == "active"

    def validate_vote_times(start_at: datetime, end_at: datetime) -> None:
        if end_at <= start_at:
            raise HTTPException(status_code=400, detail="endAt must be after startAt")

    # ── Public APIs ──────────────────────────────────────────

    @app.get("/api/votes", response_model=list[VoteListItemOut])
    def list_votes(
        response: Response,
        request: Request,
        q: str | None = None,
        status: str | None = None,
        limit: int = 20,
        offset: int = 0,
        cookie_id: str | None = Cookie(default=None, alias=APP_COOKIE_NAME),
        db: Session = Depends(get_db),
    ):
        _ = ensure_cookie(response, cookie_id)

        stmt = select(Vote).order_by(Vote.created_at.desc())
        if q:
            like = f"%{q.strip()}%"
            stmt = stmt.where((Vote.title.like(like)) | (Vote.description.like(like)))

        stmt = stmt.limit(limit).offset(offset)
        items = db.execute(stmt).scalars().all()

        out: list[VoteListItemOut] = []
        for v in items:
            es = effective_status(v)
            if status and es != status:
                continue
            total_stmt = select(func.count(VoteRecord.id)).where(
                VoteRecord.vote_id == v.id
            )
            # Count vote records, not total option votes (since we store records)
            total = db.execute(total_stmt).scalar_one()
            out.append(
                VoteListItemOut(
                    id=v.id,
                    title=v.title,
                    description=v.description,
                    status=effective_status(v),
                    startAt=v.start_at,
                    endAt=v.end_at,
                    maxChoices=v.max_choices,
                    resultVisibility=v.result_visibility,
                    totalVotes=total,
                )
            )
        return out

    @app.get("/api/votes/{vote_id}", response_model=VoteDetailOut)
    def get_vote(
        vote_id: str,
        response: Response,
        cookie_id: str | None = Cookie(default=None, alias=APP_COOKIE_NAME),
        db: Session = Depends(get_db),
    ):
        _ = ensure_cookie(response, cookie_id)

        v = db.get(Vote, vote_id)
        if not v:
            raise HTTPException(status_code=404, detail="Vote not found")

        return VoteDetailOut(
            id=v.id,
            title=v.title,
            description=v.description,
            status=effective_status(v),
            startAt=v.start_at,
            endAt=v.end_at,
            maxChoices=v.max_choices,
            resultVisibility=v.result_visibility,
            options=[{"id": o.id, "text": o.text} for o in v.options],
        )

    # ── Anti-brushing: in-memory rate limiter ────────────────────
    _rate_store: dict[str, list[float]] = {}

    def check_rate_limit(ip: str, max_per_minute: int = 10) -> None:
        now = datetime.utcnow().timestamp()
        key = ip
        hits = _rate_store.get(key, [])
        # Prune entries older than 60s
        hits = [t for t in hits if now - t < 60]
        if len(hits) >= max_per_minute:
            raise HTTPException(status_code=429, detail="Too many requests")
        hits.append(now)
        _rate_store[key] = hits

    MAX_VOTES_PER_IP = 3

    @app.post("/api/votes/{vote_id}/submit", response_model=SubmitVoteOut)
    def submit_vote(
        vote_id: str,
        body: SubmitVoteIn,
        response: Response,
        request: Request,
        cookie_id: str | None = Cookie(default=None, alias=APP_COOKIE_NAME),
        db: Session = Depends(get_db),
    ):
        cookie_id = ensure_cookie(response, cookie_id)
        client_ip = get_client_ip(request)

        # 1) Rate limit: max 10 submissions per IP per minute
        check_rate_limit(client_ip)

        # 2) Proof-of-Work verification
        if not body.powChallenge or not verify_pow(body.powChallenge, body.powNonce):
            raise HTTPException(status_code=400, detail="Invalid proof-of-work")

        v = db.get(Vote, vote_id)
        if not v:
            raise HTTPException(status_code=404, detail="Vote not found")

        if not vote_is_active(v):
            raise HTTPException(status_code=403, detail="Voting is not allowed")

        # 2) Fingerprint validation: reject empty fingerprint
        if not body.fingerprint or len(body.fingerprint.strip()) < 8:
            raise HTTPException(status_code=400, detail="Fingerprint is required")

        # 3) IP limit: same IP can only vote N times per vote
        ip_count = db.execute(
            select(func.count(VoteRecord.id))
            .where(VoteRecord.vote_id == vote_id)
            .where(VoteRecord.ip == client_ip)
        ).scalar_one()
        if ip_count >= MAX_VOTES_PER_IP:
            raise HTTPException(status_code=429, detail="Too many votes from this IP")

        choices = list(dict.fromkeys(body.choices))
        if len(choices) == 0:
            raise HTTPException(status_code=400, detail="choices is required")
        if len(choices) > v.max_choices:
            raise HTTPException(status_code=400, detail="Too many choices")

        allowed_option_ids = {o.id for o in v.options}
        if any(c not in allowed_option_ids for c in choices):
            raise HTTPException(status_code=400, detail="Invalid option")

        record = VoteRecord(
            id=str(uuid4()),
            vote_id=v.id,
            cookie_id=cookie_id,
            fingerprint=body.fingerprint.strip(),
            ip=client_ip,
            user_agent=(request.headers.get("user-agent") or "")[:256],
            choices_json=json.dumps(choices, ensure_ascii=False),
        )

        db.add(record)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=409, detail="Already voted")

        return SubmitVoteOut(ok=True)

    @app.get("/api/votes/{vote_id}/results", response_model=VoteResultsOut)
    def get_results(
        vote_id: str,
        response: Response,
        request: Request,
        admin: Admin | None = Depends(resolve_admin),
        cookie_id: str | None = Cookie(default=None, alias=APP_COOKIE_NAME),
        db: Session = Depends(get_db),
    ):
        cookie_id = ensure_cookie(response, cookie_id)

        v = db.get(Vote, vote_id)
        if not v:
            raise HTTPException(status_code=404, detail="Vote not found")

        # Admin can bypass checks only if super, or creator of this vote
        allow_admin_bypass = False
        if admin and (admin.role == "super" or v.created_by_admin_id == admin.id):
            allow_admin_bypass = True

        if not allow_admin_bypass:
            es = effective_status(v)
            vis = v.result_visibility

            if vis == "after_end" and es != "ended":
                raise HTTPException(
                    status_code=403,
                    detail="Results are only visible after the vote ends",
                )

            voted = db.execute(
                select(VoteRecord.id)
                .where(VoteRecord.vote_id == vote_id)
                .where(VoteRecord.cookie_id == cookie_id)
                .limit(1)
            ).scalar_one_or_none()
            if not voted:
                raise HTTPException(
                    status_code=403, detail="Submit vote to view results"
                )

        # Aggregate counts by option id
        counts = {o.id: 0 for o in v.options}
        records = db.execute(
            select(VoteRecord.choices_json).where(VoteRecord.vote_id == vote_id)
        ).all()
        total = 0
        for (choices_json,) in records:
            try:
                ch = json.loads(choices_json)
            except json.JSONDecodeError:
                ch = []
            if isinstance(ch, list):
                for oid in ch:
                    if oid in counts:
                        counts[oid] += 1
                        total += 1

        items = []
        for o in v.options:
            votes_n = counts.get(o.id, 0)
            percent = (votes_n / total * 100.0) if total > 0 else 0.0
            items.append(
                {
                    "optionId": o.id,
                    "text": o.text,
                    "votes": votes_n,
                    "percent": percent,
                }
            )

        return VoteResultsOut(voteId=vote_id, total=total, items=items)

    # ── Admin APIs ───────────────────────────────────────────

    @app.get(
        "/api/admin/votes",
        response_model=list[VoteListItemOut],
    )
    def admin_list_votes(
        admin: Admin = Depends(require_admin),
        db: Session = Depends(get_db),
    ):
        stmt = select(Vote).order_by(Vote.created_at.desc())
        if admin.role != "super":
            stmt = stmt.where(Vote.created_by_admin_id == admin.id)
        rows = db.execute(stmt).scalars().all()
        out = []
        for v in rows:
            total = db.execute(
                select(func.count(VoteRecord.id)).where(VoteRecord.vote_id == v.id)
            ).scalar_one()
            out.append(
                VoteListItemOut(
                    id=v.id,
                    title=v.title,
                    description=v.description,
                    status=effective_status(v),
                    startAt=v.start_at,
                    endAt=v.end_at,
                    maxChoices=v.max_choices,
                    resultVisibility=v.result_visibility,
                    totalVotes=total,
                )
            )
        return out

    @app.post(
        "/api/admin/votes",
        response_model=VoteDetailOut,
    )
    def admin_create_vote(
        body: VoteCreateIn,
        admin: Admin = Depends(require_admin),
        db: Session = Depends(get_db),
    ):
        validate_vote_times(body.startAt, body.endAt)

        vote_id = str(uuid4())
        v = Vote(
            id=vote_id,
            title=sanitize(body.title),
            description=sanitize(body.description),
            status="pending",
            start_at=body.startAt,
            end_at=body.endAt,
            max_choices=body.maxChoices,
            result_visibility=body.resultVisibility,
            created_by_admin_id=admin.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        opts: list[VoteOption] = []
        for idx, text in enumerate(body.options):
            t = sanitize(text)
            if not t:
                continue
            opts.append(
                VoteOption(
                    id=str(uuid4()),
                    vote_id=vote_id,
                    text=t,
                    sort_index=idx,
                )
            )

        if len(opts) < 2:
            raise HTTPException(
                status_code=400, detail="At least 2 options are required"
            )

        v.options = opts
        db.add(v)
        db.commit()
        db.refresh(v)

        return VoteDetailOut(
            id=v.id,
            title=v.title,
            description=v.description,
            status=effective_status(v),
            startAt=v.start_at,
            endAt=v.end_at,
            maxChoices=v.max_choices,
            resultVisibility=v.result_visibility,
            options=[{"id": o.id, "text": o.text} for o in v.options],
        )

    @app.put(
        "/api/admin/votes/{vote_id}",
        response_model=VoteDetailOut,
    )
    def admin_update_vote(
        vote_id: str,
        body: VoteUpdateIn,
        admin: Admin = Depends(require_admin),
        db: Session = Depends(get_db),
    ):
        v = db.get(Vote, vote_id)
        if not v:
            raise HTTPException(status_code=404, detail="Vote not found")

        if admin.role != "super" and v.created_by_admin_id != admin.id:
            raise HTTPException(status_code=403, detail="Forbidden")

        if body.title is not None:
            v.title = sanitize(body.title)
        if body.description is not None:
            v.description = sanitize(body.description)
        if body.startAt is not None:
            v.start_at = body.startAt
        if body.endAt is not None:
            v.end_at = body.endAt
        if body.maxChoices is not None:
            v.max_choices = body.maxChoices
        if body.resultVisibility is not None:
            v.result_visibility = body.resultVisibility

        validate_vote_times(v.start_at, v.end_at)

        if body.options is not None:
            new_opts = [sanitize(t) for t in body.options if t.strip()]
            if len(new_opts) < 2:
                raise HTTPException(
                    status_code=400, detail="At least 2 options are required"
                )
            # Replace options
            v.options = [
                VoteOption(id=str(uuid4()), vote_id=v.id, text=t, sort_index=i)
                for i, t in enumerate(new_opts)
            ]

        v.updated_at = datetime.utcnow()
        db.add(v)
        db.commit()
        db.refresh(v)

        return VoteDetailOut(
            id=v.id,
            title=v.title,
            description=v.description,
            status=effective_status(v),
            startAt=v.start_at,
            endAt=v.end_at,
            maxChoices=v.max_choices,
            resultVisibility=v.result_visibility,
            options=[{"id": o.id, "text": o.text} for o in v.options],
        )

    @app.post(
        "/api/admin/votes/{vote_id}/status",
        response_model=dict,
    )
    def admin_update_status(
        vote_id: str,
        body: VoteStatusUpdateIn,
        admin: Admin = Depends(require_admin),
        db: Session = Depends(get_db),
    ):
        v = db.get(Vote, vote_id)
        if not v:
            raise HTTPException(status_code=404, detail="Vote not found")

        if admin.role != "super" and v.created_by_admin_id != admin.id:
            raise HTTPException(status_code=403, detail="Forbidden")
        v.status = body.status
        v.updated_at = datetime.utcnow()
        db.add(v)
        db.commit()
        return {"ok": True, "status": v.status}

    @app.delete(
        "/api/admin/votes/{vote_id}",
        response_model=dict,
    )
    def admin_delete_vote(
        vote_id: str,
        admin: Admin = Depends(require_admin),
        db: Session = Depends(get_db),
    ):
        v = db.get(Vote, vote_id)
        if not v:
            raise HTTPException(status_code=404, detail="Vote not found")

        if admin.role != "super" and v.created_by_admin_id != admin.id:
            raise HTTPException(status_code=403, detail="Forbidden")

        db.delete(v)
        db.commit()
        return {"ok": True}

    @app.post(
        "/api/admin/admins",
        response_model=dict,
        dependencies=[Depends(require_super)],
    )
    def admin_create_admin(
        payload: dict,
        db: Session = Depends(get_db),
    ):
        # Minimal admin creation endpoint for MVP
        token = str(payload.get("token") or "").strip()
        name = str(payload.get("name") or "").strip()
        role = str(payload.get("role") or "admin").strip()

        if role not in ("admin", "super"):
            raise HTTPException(status_code=400, detail="Invalid role")
        if not token:
            raise HTTPException(status_code=400, detail="token is required")

        th = hash_token(token)
        exists = db.execute(
            select(Admin.id).where(Admin.token_hash == th)
        ).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=409, detail="token already exists")

        a = Admin(
            id=str(uuid4()),
            name=name,
            token_hash=th,
            role=role,
            created_at=datetime.utcnow(),
        )
        db.add(a)
        db.commit()
        return {"ok": True, "id": a.id, "role": a.role}

    return app


app = create_app()
