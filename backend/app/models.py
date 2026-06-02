from datetime import datetime, timezone

from sqlalchemy import String, Text, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    task_sequence: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    task_code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, default=None)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    priority: Mapped[str] = mapped_column(String(10), default="medium")
    due_date: Mapped[str | None] = mapped_column(String(10), default=None)
    due_time: Mapped[str | None] = mapped_column(String(5), default=None)
    assignee_name: Mapped[str | None] = mapped_column(String(255), default=None)
    assignee_email: Mapped[str | None] = mapped_column(String(255), default=None)
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None
    )
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    comments: Mapped[list["Comment"]] = relationship(
        back_populates="task", cascade="all, delete-orphan", lazy="selectin"
    )
    activity_logs: Mapped[list["ActivityLog"]] = relationship(
        back_populates="task", cascade="all, delete-orphan", lazy="selectin"
    )


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    author_name: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    task: Mapped["Task"] = relationship(back_populates="comments")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    task: Mapped["Task"] = relationship(back_populates="activity_logs")
