from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class SongCreateInput(BaseModel):
    system_message: str = Field(
        min_length=1,
        max_length=2500,
        description="The pre_prompt provided by the user through the app.",
    )
    prompt: str = Field(
        min_length=1,
        max_length=1000,
        description="The initial prompt provided by the user through the app.",
    )


class SongCreate(SongCreateInput):
    abc: Optional[str] = None
    score: Optional[dict] = None
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SongRead(SongCreate):
    pass
