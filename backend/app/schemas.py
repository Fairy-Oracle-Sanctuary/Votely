from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

VoteStatus = Literal["pending", "active", "ended"]
ResultVisibility = Literal["after_vote", "after_end"]
VoteMode = Literal["normal", "tiered"]


class VoteOptionOut(BaseModel):
    id: str
    text: str


class VoteOut(BaseModel):
    id: str
    title: str
    description: str
    status: VoteStatus
    startAt: datetime
    endAt: datetime
    mode: VoteMode = "normal"
    tierConfig: dict[str, int] | None = None
    rulesText: str = ""
    maxChoices: int
    resultVisibility: ResultVisibility


class VoteListItemOut(VoteOut):
    totalVotes: int


class VoteDetailOut(VoteOut):
    options: list[VoteOptionOut]


class VoteCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="")
    startAt: datetime
    endAt: datetime
    mode: VoteMode = Field(default="normal")
    tierConfig: dict[str, int] | None = None
    rulesText: str = Field(default="")
    maxChoices: int = Field(default=1, ge=1, le=50)
    resultVisibility: ResultVisibility = Field(default="after_vote")
    options: list[str] = Field(min_length=2)


class VoteUpdateIn(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    startAt: datetime | None = None
    endAt: datetime | None = None
    mode: VoteMode | None = None
    tierConfig: dict[str, int] | None = None
    rulesText: str | None = None
    maxChoices: int | None = Field(default=None, ge=1, le=50)
    resultVisibility: ResultVisibility | None = None
    options: list[str] | None = None


class VoteStatusUpdateIn(BaseModel):
    status: VoteStatus


class SubmitVoteIn(BaseModel):
    choices: list[str] = Field(min_length=1)
    fingerprint: str = Field(default="", max_length=64)
    powChallenge: str = Field(default="")
    powNonce: int = Field(default=0)


class SubmitVoteOut(BaseModel):
    ok: bool


class ResultItemOut(BaseModel):
    optionId: str
    text: str
    votes: int
    percent: float


class TieredResultItemOut(BaseModel):
    optionId: str
    text: str
    mainVotes: int = 0
    secondaryVotes: int = 0
    normalVotes: int = 0
    totalVotes: int = 0
    percent: float = 0.0


class VoteResultsOut(BaseModel):
    voteId: str
    total: int
    items: list[ResultItemOut]
    tieredItems: list[TieredResultItemOut] | None = None
