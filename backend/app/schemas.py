from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class TaskBase(BaseModel):
    @field_validator("title", mode="before", check_fields=False)
    @classmethod
    def strip_title(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip()
        return v


class TaskCreate(TaskBase):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus = TaskStatus.PENDING


class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
