from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # pending | active | ended
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="pending")

    start_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    max_choices: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # after_vote: can view results after submitting; after_end: only after vote ends
    result_visibility: Mapped[str] = mapped_column(
        String(16), nullable=False, default="after_vote"
    )

    created_by_admin_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("admins.id", ondelete="SET NULL"), nullable=True
    )

    created_by_admin: Mapped[Optional["Admin"]] = relationship("Admin")

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )

    options: Mapped[list["VoteOption"]] = relationship(
        "VoteOption",
        back_populates="vote",
        cascade="all, delete-orphan",
        order_by="VoteOption.sort_index.asc()",
    )


class Admin(Base):
    __tablename__ = "admins"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(60), nullable=False, default="")
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    # super | admin
    role: Mapped[str] = mapped_column(String(16), nullable=False, default="admin")

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )


class VoteOption(Base):
    __tablename__ = "vote_options"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vote_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("votes.id", ondelete="CASCADE"), nullable=False
    )

    text: Mapped[str] = mapped_column(String(200), nullable=False)
    sort_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    vote: Mapped[Vote] = relationship("Vote", back_populates="options")


class VoteRecord(Base):
    __tablename__ = "vote_records"
    __table_args__ = (
        UniqueConstraint("vote_id", "cookie_id", name="uq_vote_cookie"),
        UniqueConstraint("vote_id", "fingerprint", name="uq_vote_fingerprint"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    vote_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("votes.id", ondelete="CASCADE"), nullable=False
    )

    cookie_id: Mapped[str] = mapped_column(String(64), nullable=False)
    fingerprint: Mapped[str] = mapped_column(String(64), nullable=False)
    ip: Mapped[str] = mapped_column(String(64), nullable=False)
    user_agent: Mapped[str] = mapped_column(String(256), nullable=False)

    # JSON-encoded list of option ids
    choices_json: Mapped[str] = mapped_column(Text, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
