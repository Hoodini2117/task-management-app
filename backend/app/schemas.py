"""Pydantic schemas for request validation and response serialization."""

import re
from datetime import datetime, date
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


# ─── Enums ──────────────────────────────────────────────────────────────────────

class TaskStatus(str, Enum):
    """Valid task status values."""
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class TaskPriority(str, Enum):
    """Valid task priority values."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# ─── Shared Error Response ──────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    """Standard API error response."""
    detail: str = Field(description="Human-readable error message")


# ─── Validation Helpers ─────────────────────────────────────────────────────────

_EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
_DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_TIME_REGEX = re.compile(r"^\d{2}:\d{2}$")


# ─── Task Schemas ───────────────────────────────────────────────────────────────

class TaskBase(BaseModel):
    """Base task schema with shared validation."""

    @field_validator("title", mode="before", check_fields=False)
    @classmethod
    def strip_title(cls, v: str) -> str:
        """Strip whitespace from task title."""
        if isinstance(v, str):
            stripped = v.strip()
            if not stripped:
                raise ValueError("Title must not be empty or whitespace only")
            return stripped
        return v


class TaskCreate(TaskBase):
    """Schema for creating a new task."""

    title: str = Field(
        min_length=1, max_length=255,
        description="Task title (1–255 characters)",
        json_schema_extra={"examples": ["Design landing page"]},
    )
    description: str | None = Field(
        default=None, max_length=2000,
        description="Optional task description (max 2000 characters)",
    )
    status: TaskStatus = Field(
        default=TaskStatus.PENDING,
        description="Initial task status",
    )
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM,
        description="Task priority level",
    )
    due_date: str | None = Field(
        default=None,
        description="Due date in YYYY-MM-DD format",
        json_schema_extra={"examples": ["2026-06-15"]},
    )
    due_time: str | None = Field(
        default=None,
        description="Due time in HH:MM format (24-hour)",
        json_schema_extra={"examples": ["14:30"]},
    )
    assignee_name: str | None = Field(
        default=None, max_length=255,
        description="Name of the person assigned to this task",
    )
    assignee_email: str | None = Field(
        default=None, max_length=255,
        description="Email of the assignee",
        json_schema_extra={"examples": ["john@example.com"]},
    )

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v: str | None) -> str | None:
        """Validate due_date is a valid YYYY-MM-DD date and not in the past."""
        if v is None:
            return v
        if not _DATE_REGEX.match(v):
            raise ValueError("due_date must be in YYYY-MM-DD format")
        try:
            parsed = date.fromisoformat(v)
        except ValueError:
            raise ValueError(f"Invalid date: {v}")
        if parsed < date.today():
            raise ValueError("Due date cannot be in the past")
        return v

    @field_validator("due_time")
    @classmethod
    def validate_due_time(cls, v: str | None) -> str | None:
        """Validate due_time is a valid HH:MM string."""
        if v is None:
            return v
        if not _TIME_REGEX.match(v):
            raise ValueError("due_time must be in HH:MM format (e.g. 14:30)")
        hours, minutes = map(int, v.split(":"))
        if hours > 23 or minutes > 59:
            raise ValueError("due_time has invalid hours or minutes")
        return v

    @field_validator("assignee_email")
    @classmethod
    def validate_assignee_email(cls, v: str | None) -> str | None:
        """Validate assignee_email is a valid email format if provided."""
        if v is None or v.strip() == "":
            return None
        if not _EMAIL_REGEX.match(v):
            raise ValueError("assignee_email must be a valid email address")
        return v.strip().lower()

    @field_validator("assignee_name")
    @classmethod
    def validate_assignee_name(cls, v: str | None) -> str | None:
        """Strip and normalize assignee_name."""
        if v is None or v.strip() == "":
            return None
        return v.strip()

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        """Normalize empty description to None."""
        if v is not None and v.strip() == "":
            return None
        return v


class TaskUpdate(TaskBase):
    """Schema for updating an existing task. All fields are optional."""

    title: str | None = Field(
        default=None, min_length=1, max_length=255,
        description="Updated task title (1–255 characters)",
    )
    description: str | None = Field(
        default=None, max_length=2000,
        description="Updated task description (max 2000 characters)",
    )
    status: TaskStatus | None = Field(
        default=None,
        description="Updated task status",
    )
    priority: TaskPriority | None = Field(
        default=None,
        description="Updated task priority",
    )
    due_date: str | None = Field(
        default=None,
        description="Updated due date in YYYY-MM-DD format",
    )
    due_time: str | None = Field(
        default=None,
        description="Updated due time in HH:MM format",
    )
    assignee_name: str | None = Field(
        default=None, max_length=255,
        description="Updated assignee name",
    )
    assignee_email: str | None = Field(
        default=None, max_length=255,
        description="Updated assignee email",
    )

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v: str | None) -> str | None:
        """Validate due_date is a valid YYYY-MM-DD date string."""
        if v is None:
            return v
        if not _DATE_REGEX.match(v):
            raise ValueError("due_date must be in YYYY-MM-DD format")
        try:
            date.fromisoformat(v)
        except ValueError:
            raise ValueError(f"Invalid date: {v}")
        return v

    @field_validator("due_time")
    @classmethod
    def validate_due_time(cls, v: str | None) -> str | None:
        """Validate due_time is a valid HH:MM string."""
        if v is None:
            return v
        if not _TIME_REGEX.match(v):
            raise ValueError("due_time must be in HH:MM format (e.g. 14:30)")
        hours, minutes = map(int, v.split(":"))
        if hours > 23 or minutes > 59:
            raise ValueError("due_time has invalid hours or minutes")
        return v

    @field_validator("assignee_email")
    @classmethod
    def validate_assignee_email(cls, v: str | None) -> str | None:
        """Validate assignee_email is a valid email format if provided."""
        if v is None or v.strip() == "":
            return None
        if not _EMAIL_REGEX.match(v):
            raise ValueError("assignee_email must be a valid email address")
        return v.strip().lower()

    @field_validator("assignee_name")
    @classmethod
    def validate_assignee_name(cls, v: str | None) -> str | None:
        """Strip and normalize assignee_name."""
        if v is None or v.strip() == "":
            return None
        return v.strip()


# ─── Task Response ──────────────────────────────────────────────────────────────

class TaskResponse(BaseModel):
    """Task response with all fields including computed counts."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Internal task database ID")
    task_code: str = Field(description="User-facing task identifier (e.g. TSK-0001)")
    title: str = Field(description="Task title")
    description: str | None = Field(description="Task description")
    status: TaskStatus = Field(description="Current task status")
    priority: str = Field(description="Task priority level")
    due_date: str | None = Field(description="Due date (YYYY-MM-DD)")
    due_time: str | None = Field(description="Due time (HH:MM)")
    assignee_name: str | None = Field(description="Assignee name")
    assignee_email: str | None = Field(description="Assignee email")
    completed_at: datetime | None = Field(description="Completion timestamp (UTC)")
    is_archived: bool = Field(description="Whether the task is archived")
    created_at: datetime = Field(description="Creation timestamp (UTC)")
    updated_at: datetime = Field(description="Last update timestamp (UTC)")
    comment_count: int = Field(default=0, description="Number of comments")
    activity_count: int = Field(default=0, description="Number of activity log entries")


# ─── Stats Response ─────────────────────────────────────────────────────────────

class StatsResponse(BaseModel):
    """Aggregate task statistics."""

    total: int = Field(description="Total number of tasks")
    pending: int = Field(description="Number of pending tasks")
    in_progress: int = Field(description="Number of in-progress tasks")
    completed: int = Field(description="Number of completed (non-archived) tasks")
    archived: int = Field(description="Number of archived tasks")
    overdue: int = Field(description="Number of overdue tasks")


# ─── Comment Schemas ────────────────────────────────────────────────────────────

class CommentCreate(BaseModel):
    """Schema for creating a new comment on a task."""

    author_name: str = Field(
        min_length=1, max_length=255,
        description="Name of the comment author (1–255 characters)",
    )
    message: str = Field(
        min_length=1, max_length=5000,
        description="Comment message text (1–5000 characters)",
    )

    @field_validator("author_name")
    @classmethod
    def strip_author_name(cls, v: str) -> str:
        """Strip whitespace from author name."""
        stripped = v.strip()
        if not stripped:
            raise ValueError("Author name must not be empty or whitespace only")
        return stripped

    @field_validator("message")
    @classmethod
    def strip_message(cls, v: str) -> str:
        """Strip whitespace from message."""
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message must not be empty or whitespace only")
        return stripped


class CommentResponse(BaseModel):
    """Comment response with all fields."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Comment ID")
    task_id: int = Field(description="Associated task ID")
    author_name: str = Field(description="Comment author name")
    message: str = Field(description="Comment message text")
    created_at: datetime = Field(description="Creation timestamp (UTC)")


# ─── Activity Log Schemas ───────────────────────────────────────────────────────

class ActivityLogResponse(BaseModel):
    """Activity log entry response."""

    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Activity log entry ID")
    task_id: int = Field(description="Associated task ID")
    action: str = Field(description="Description of the activity")
    timestamp: datetime = Field(description="Timestamp of the activity (UTC)")
