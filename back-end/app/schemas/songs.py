from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from app.songGPT.JsonAudio import JsonAudio
from pydantic import BaseModel, Field


class SongCreateInput(BaseModel):
    pre_prompt: str = Field(
        min_length=1,
        max_length=1500,
        description="The pre_prompt provided by the user through the app.",
    )
    prompt: str = Field(
        min_length=1,
        max_length=1000,
        description="The initial prompt provided by the user through the app.",
    )


class SongCreate(SongCreateInput):
    id: UUID = Field(default_factory=uuid4)
    score: Optional[JsonAudio] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SongRead(SongCreate):
    pass
