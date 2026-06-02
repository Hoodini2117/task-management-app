from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import Comment, ActivityLog
from app.schemas import CommentCreate


def get_comments(db: Session, task_id: int) -> list[Comment]:
    """Return comments for a task, newest first."""
    return (
        db.query(Comment)
        .filter(Comment.task_id == task_id)
        .order_by(desc(Comment.created_at))
        .all()
    )


def create_comment(db: Session, task_id: int, data: CommentCreate) -> Comment:
    """Add a comment and create an activity log entry."""
    comment = Comment(
        task_id=task_id,
        author_name=data.author_name,
        message=data.message,
    )
    db.add(comment)

    log = ActivityLog(
        task_id=task_id,
        action=f"Comment added by {data.author_name}",
    )
    db.add(log)

    db.commit()
    db.refresh(comment)
    return comment


def delete_comment(db: Session, comment_id: int) -> bool:
    """Delete a comment by its ID."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        return False

    db.delete(comment)
    db.commit()
    return True
