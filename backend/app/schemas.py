from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


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
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: str | None = None
    due_time: str | None = None


class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: str | None = None
    due_time: str | None = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: TaskStatus
    priority: str
    due_date: str | None
    due_time: str | None
    completed_at: datetime | None
    is_archived: bool
    created_at: datetime
    updated_at: datetime


class StatsResponse(BaseModel):
    total: int
    pending: int
    in_progress: int
    completed: int
    archived: int
    overdue: int
