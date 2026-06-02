from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import ActivityLog


def get_activity_logs(db: Session, task_id: int) -> list[ActivityLog]:
    """Return activity logs for a task, newest first."""
    return (
        db.query(ActivityLog)
        .filter(ActivityLog.task_id == task_id)
        .order_by(desc(ActivityLog.timestamp))
        .all()
    )
