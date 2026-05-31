from datetime import datetime, timezone, timedelta, date

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import Task
from app.schemas import TaskCreate, TaskUpdate, TaskStatus

ARCHIVE_AFTER_DAYS = 10


def archive_stale_tasks(db: Session) -> None:
    """Archive completed tasks older than ARCHIVE_AFTER_DAYS."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=ARCHIVE_AFTER_DAYS)
    stale = (
        db.query(Task)
        .filter(
            Task.status == TaskStatus.COMPLETED.value,
            Task.is_archived == False,  # noqa: E712
            Task.completed_at != None,  # noqa: E711
            Task.completed_at < cutoff,
        )
        .all()
    )
    for task in stale:
        task.is_archived = True
    if stale:
        db.commit()


def get_all_tasks(
    db: Session,
    status: TaskStatus | None = None,
    priority: str | None = None,
    include_archived: bool = False,
    skip: int = 0,
    limit: int = 100,
) -> list[Task]:
    archive_stale_tasks(db)

    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status.value)
    if priority:
        query = query.filter(Task.priority == priority)
    if not include_archived:
        query = query.filter(Task.is_archived == False)  # noqa: E712
    return query.order_by(desc(Task.created_at)).offset(skip).limit(limit).all()


def get_task_by_id(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()


def create_task(db: Session, task_data: TaskCreate) -> Task:
    data = task_data.model_dump()
    data["status"] = data["status"].value
    data["priority"] = data["priority"].value

    if data["status"] == TaskStatus.COMPLETED.value:
        data["completed_at"] = datetime.now(timezone.utc)

    task = Task(**data)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task_id: int, task_data: TaskUpdate) -> Task | None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None

    updates = task_data.model_dump(exclude_unset=True)
    old_status = task.status

    if "status" in updates:
        new_status = updates["status"].value
        updates["status"] = new_status

        if new_status == TaskStatus.COMPLETED.value and old_status != TaskStatus.COMPLETED.value:
            updates["completed_at"] = datetime.now(timezone.utc)
            updates["is_archived"] = False
        elif new_status != TaskStatus.COMPLETED.value and old_status == TaskStatus.COMPLETED.value:
            updates["completed_at"] = None
            updates["is_archived"] = False

    if "priority" in updates:
        updates["priority"] = updates["priority"].value

    for field, value in updates.items():
        setattr(task, field, value)

    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int) -> bool:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return False

    db.delete(task)
    db.commit()
    return True


def get_history(db: Session, skip: int = 0, limit: int = 200) -> list[Task]:
    """Return all tasks including archived, newest first."""
    archive_stale_tasks(db)
    return (
        db.query(Task)
        .order_by(desc(Task.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )


def _is_overdue(task: Task) -> bool:
    """Check if a task is overdue (has due_date in the past and not completed)."""
    if not task.due_date or task.status == TaskStatus.COMPLETED.value:
        return False
    try:
        due = date.fromisoformat(task.due_date)
        return due < date.today()
    except ValueError:
        return False


def get_stats(db: Session) -> dict:
    """Return aggregate task counts."""
    archive_stale_tasks(db)
    all_tasks = db.query(Task).all()
    return {
        "total": len(all_tasks),
        "pending": sum(1 for t in all_tasks if t.status == TaskStatus.PENDING.value),
        "in_progress": sum(1 for t in all_tasks if t.status == TaskStatus.IN_PROGRESS.value),
        "completed": sum(
            1 for t in all_tasks
            if t.status == TaskStatus.COMPLETED.value and not t.is_archived
        ),
        "archived": sum(1 for t in all_tasks if t.is_archived),
        "overdue": sum(1 for t in all_tasks if _is_overdue(t)),
    }
