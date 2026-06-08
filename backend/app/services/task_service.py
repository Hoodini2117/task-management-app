from datetime import datetime, timezone, timedelta, date

from sqlalchemy import desc, func, or_
from sqlalchemy.orm import Session

from app.models import Task, ActivityLog
from app.schemas import TaskCreate, TaskUpdate, TaskStatus

# Completed tasks are auto-archived after this many days
ARCHIVE_AFTER_DAYS = 10

# Human-readable labels for activity log messages
STATUS_LABELS = {
    "pending": "Pending",
    "in-progress": "In Progress",
    "completed": "Completed",
}

PRIORITY_LABELS = {
    "low": "Low",
    "medium": "Medium",
    "high": "High",
}


def _next_task_code(db: Session) -> tuple[int, str]:
    """Generate the next task_sequence and task_code."""
    # Query the current max sequence to generate the next incremental code
    max_seq = db.query(func.max(Task.task_sequence)).scalar()
    next_seq = (max_seq or 0) + 1
    code = f"TSK-{next_seq:04d}"
    return next_seq, code


def _create_activity(db: Session, task_id: int, action: str) -> None:
    """Create an activity log entry."""
    log = ActivityLog(task_id=task_id, action=action)
    db.add(log)


def _task_to_response_dict(task: Task) -> dict:
    """Convert a task ORM object to a dict with comment_count and activity_count."""
    return {
        "id": task.id,
        "task_code": task.task_code,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": task.due_date,
        "due_time": task.due_time,
        "assignee_name": task.assignee_name,
        "assignee_email": task.assignee_email,
        "completed_at": task.completed_at,
        "is_archived": task.is_archived,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        # Compute relationship counts eagerly loaded via selectin
        "comment_count": len(task.comments) if task.comments else 0,
        "activity_count": len(task.activity_logs) if task.activity_logs else 0,
    }


def archive_stale_tasks(db: Session) -> None:
    """Archive completed tasks older than ARCHIVE_AFTER_DAYS."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=ARCHIVE_AFTER_DAYS)
    # Find completed, non-archived tasks that passed the cutoff threshold
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
        _create_activity(db, task.id, "Archived")
    if stale:
        db.commit()


# Core query method — supports filtering, search, pagination, and archive toggling
def get_all_tasks(
    db: Session,
    status: TaskStatus | None = None,
    priority: str | None = None,
    include_archived: bool = False,
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
) -> list[dict]:
    # Auto-archive stale completed tasks before returning results
    archive_stale_tasks(db)

    query = db.query(Task)
    # Apply optional filters progressively
    if status:
        query = query.filter(Task.status == status.value)
    if priority:
        query = query.filter(Task.priority == priority)
    if not include_archived:
        query = query.filter(Task.is_archived == False)  # noqa: E712
    # Full-text search across multiple columns using ILIKE
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term),
                Task.task_code.ilike(search_term),
                Task.assignee_name.ilike(search_term),
                Task.assignee_email.ilike(search_term),
            )
        )
    tasks = query.order_by(desc(Task.created_at)).offset(skip).limit(limit).all()
    return [_task_to_response_dict(t) for t in tasks]


def get_task_by_id(db: Session, task_id: int) -> dict | None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    return _task_to_response_dict(task)


def create_task(db: Session, task_data: TaskCreate) -> dict:
    # Convert Pydantic model to dict and extract enum values
    data = task_data.model_dump()
    data["status"] = data["status"].value
    data["priority"] = data["priority"].value

    # Auto-set completion timestamp if task is created as completed
    if data["status"] == TaskStatus.COMPLETED.value:
        data["completed_at"] = datetime.now(timezone.utc)

    # Generate unique sequential task code (TSK-XXXX)
    seq, code = _next_task_code(db)
    data["task_sequence"] = seq
    data["task_code"] = code

    task = Task(**data)
    db.add(task)
    # Flush to get the auto-generated ID before creating activity logs
    db.flush()

    _create_activity(db, task.id, "Task Created")

    # Log initial assignment if an assignee was provided at creation
    if task.assignee_name:
        _create_activity(db, task.id, f"Assigned to {task.assignee_name}")

    db.commit()
    db.refresh(task)
    return _task_to_response_dict(task)


def update_task(db: Session, task_id: int, task_data: TaskUpdate) -> dict | None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None

    # Only process fields that were explicitly sent in the request
    updates = task_data.model_dump(exclude_unset=True)
    # Capture old values for activity log diff detection
    old_status = task.status
    old_priority = task.priority
    old_assignee = task.assignee_name

    # Handle status transition side effects (completed_at, is_archived)
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

    # Apply all updates to the ORM object dynamically
    for field, value in updates.items():
        setattr(task, field, value)

    task.updated_at = datetime.now(timezone.utc)
    db.flush()

    # Activity logs for changes
    if "status" in updates and updates["status"] != old_status:
        old_label = STATUS_LABELS.get(old_status, old_status)
        new_label = STATUS_LABELS.get(updates["status"], updates["status"])
        _create_activity(db, task.id, f"Status changed: {old_label} → {new_label}")

    if "priority" in updates and updates["priority"] != old_priority:
        old_label = PRIORITY_LABELS.get(old_priority, old_priority)
        new_label = PRIORITY_LABELS.get(updates["priority"], updates["priority"])
        _create_activity(db, task.id, f"Priority changed: {old_label} → {new_label}")

    # Track assignee changes — distinguish between reassign and unassign
    if "assignee_name" in updates:
        new_assignee = updates["assignee_name"]
        if new_assignee != old_assignee:
            if new_assignee:
                _create_activity(db, task.id, f"Assigned to {new_assignee}")
            else:
                _create_activity(db, task.id, "Unassigned")

    db.commit()
    db.refresh(task)
    return _task_to_response_dict(task)


def delete_task(db: Session, task_id: int) -> bool:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return False

    # Cascade delete removes associated comments and activity logs
    db.delete(task)
    db.commit()
    return True


def get_history(db: Session, skip: int = 0, limit: int = 200) -> list[dict]:
    """Return all tasks including archived, newest first."""
    archive_stale_tasks(db)
    tasks = (
        db.query(Task)
        .order_by(desc(Task.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_task_to_response_dict(t) for t in tasks]


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
    # Load all tasks once and compute counts in-memory for simplicity
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
