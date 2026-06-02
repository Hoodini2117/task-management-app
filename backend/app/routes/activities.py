"""Activity log API route handlers."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import ActivityLogResponse, ErrorResponse
from app.services import activity_service
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["Activities"])


@router.get(
    "/{task_id}/activities",
    response_model=list[ActivityLogResponse],
    summary="List activity logs for a task",
    description=(
        "Retrieve the activity timeline for a task, ordered newest first. "
        "Activity logs are automatically created for task creation, status changes, "
        "priority changes, assignee changes, comments, and archival events."
    ),
    responses={404: {"model": ErrorResponse, "description": "Task not found"}},
)
def list_activities(task_id: int, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with id={task_id} not found")
    return activity_service.get_activity_logs(db, task_id)
