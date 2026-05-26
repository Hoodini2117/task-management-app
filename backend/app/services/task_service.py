from datetime import datetime, timezone

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import Task
from app.schemas import TaskCreate, TaskUpdate, TaskStatus


def get_all_tasks(
    db: Session,
    status: TaskStatus | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Task]:
    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status.value)
    return query.order_by(desc(Task.created_at)).offset(skip).limit(limit).all()


def get_task_by_id(db: Session, task_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id).first()


def create_task(db: Session, task_data: TaskCreate) -> Task:
    data = task_data.model_dump()
    data["status"] = data["status"].value
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
    if "status" in updates:
        updates["status"] = updates["status"].value
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
