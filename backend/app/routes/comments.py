"""Comment API route handlers."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import CommentCreate, CommentResponse, ErrorResponse
from app.services import comment_service, task_service

# Comments router — nested under /api/tasks/{task_id}/comments
router = APIRouter(prefix="/api/tasks", tags=["Comments"])


# List all comments for a specific task, ordered newest first
@router.get(
    "/{task_id}/comments",
    response_model=list[CommentResponse],
    summary="List comments for a task",
    description="Retrieve all comments for a given task, ordered newest first.",
    responses={404: {"model": ErrorResponse, "description": "Task not found"}},
)
def list_comments(task_id: int, db: Session = Depends(get_db)):
    # Verify task exists before querying comments
    task = task_service.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with id={task_id} not found")
    return comment_service.get_comments(db, task_id)


# Add a new comment to a task and auto-create an activity log entry
@router.post(
    "/{task_id}/comments",
    response_model=CommentResponse,
    status_code=201,
    summary="Add a comment to a task",
    description=(
        "Create a new comment on a task. An activity log entry is "
        "automatically created recording the comment."
    ),
    responses={
        201: {"description": "Comment created successfully"},
        404: {"model": ErrorResponse, "description": "Task not found"},
        422: {"description": "Validation error in request body"},
    },
)
def create_comment(task_id: int, data: CommentCreate, db: Session = Depends(get_db)):
    # Verify task exists before creating comment
    task = task_service.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with id={task_id} not found")
    return comment_service.create_comment(db, task_id, data)


# Permanently delete a comment by its ID
@router.delete(
    "/{task_id}/comments/{comment_id}",
    status_code=204,
    summary="Delete a comment",
    description="Permanently delete a comment from a task.",
    responses={
        204: {"description": "Comment deleted successfully"},
        404: {"model": ErrorResponse, "description": "Comment not found"},
    },
)
def delete_comment(task_id: int, comment_id: int, db: Session = Depends(get_db)):
    if not comment_service.delete_comment(db, comment_id):
        raise HTTPException(
            status_code=404,
            detail=f"Comment with id={comment_id} not found on task id={task_id}",
        )
