from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import ActivityLog


# Query activity logs for a given task, ordered by most recent first
def get_activity_logs(db: Session, task_id: int) -> list[ActivityLog]:
    """Return activity logs for a task, newest first."""
    return (
        db.query(ActivityLog)
        .filter(ActivityLog.task_id == task_id)
        .order_by(desc(ActivityLog.timestamp))
        .all()
    )
