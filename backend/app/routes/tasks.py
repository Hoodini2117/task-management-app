"""Task API route handlers."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import (
    TaskCreate, TaskUpdate, TaskResponse,
    TaskStatus, TaskPriority, StatsResponse, ErrorResponse,
)
from app.services import task_service

# Task router — all endpoints prefixed with /api/tasks
router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


# Retrieve paginated tasks with optional filtering and full-text search
@router.get(
    "/",
    response_model=list[TaskResponse],
    summary="List tasks",
    description=(
        "Retrieve a paginated list of tasks with optional filtering by status, "
        "priority, and full-text search across title, description, task code, "
        "and assignee fields."
    ),
)
def list_tasks(
    status: TaskStatus | None = Query(
        default=None, description="Filter by task status"
    ),
    priority: TaskPriority | None = Query(
        default=None, description="Filter by priority level"
    ),
    include_archived: bool = Query(
        default=False, description="Include archived tasks in results"
    ),
    search: str | None = Query(
        default=None, max_length=200,
        description="Search across title, description, task code, assignee name/email",
    ),
    skip: int = Query(default=0, ge=0, description="Number of records to skip"),
    limit: int = Query(default=100, ge=1, le=200, description="Maximum records to return"),
    db: Session = Depends(get_db),
):
    # Delegate filtering and pagination to the service layer
    return task_service.get_all_tasks(
        db,
        status=status,
        priority=priority.value if priority else None,
        include_archived=include_archived,
        skip=skip,
        limit=limit,
        search=search,
    )


# Return aggregate task counts for dashboard statistics cards
@router.get(
    "/stats",
    response_model=StatsResponse,
    summary="Get task statistics",
    description="Return aggregate counts of tasks by status, including archived and overdue.",
)
def get_stats(db: Session = Depends(get_db)):
    return task_service.get_stats(db)


# Fetch complete task history including archived tasks for the audit view
@router.get(
    "/history",
    response_model=list[TaskResponse],
    summary="Get task history",
    description=(
        "Return all tasks including archived ones, ordered by creation date "
        "(newest first). Used for the history/audit view."
    ),
)
def get_history(
    skip: int = Query(default=0, ge=0, description="Number of records to skip"),
    limit: int = Query(default=200, ge=1, le=500, description="Maximum records to return"),
    db: Session = Depends(get_db),
):
    return task_service.get_history(db, skip=skip, limit=limit)


# Retrieve a single task by its database primary key
@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get a task by ID",
    description="Retrieve a single task by its database ID.",
    responses={404: {"model": ErrorResponse, "description": "Task not found"}},
)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with id={task_id} not found")
    return task


# Create a new task with auto-generated task code and activity log
@router.post(
    "/",
    response_model=TaskResponse,
    status_code=201,
    summary="Create a task",
    description=(
        "Create a new task. A unique task code (TSK-XXXX) is auto-generated. "
        "Activity logs are created automatically for the creation event "
        "and any initial assignment."
    ),
    responses={
        201: {"description": "Task created successfully"},
        422: {"description": "Validation error in request body"},
    },
)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, task_data)


# Partially update a task — only provided fields are modified
@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Update a task",
    description=(
        "Update one or more fields of an existing task. Only provided fields "
        "are updated. Activity logs are created automatically for status, "
        "priority, and assignee changes."
    ),
    responses={
        200: {"description": "Task updated successfully"},
        404: {"model": ErrorResponse, "description": "Task not found"},
        422: {"description": "Validation error in request body"},
    },
)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = task_service.update_task(db, task_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with id={task_id} not found")
    return task


# Permanently delete a task and all associated comments/activity logs
@router.delete(
    "/{task_id}",
    status_code=204,
    summary="Delete a task",
    description="Permanently delete a task and all associated comments and activity logs.",
    responses={
        204: {"description": "Task deleted successfully"},
        404: {"model": ErrorResponse, "description": "Task not found"},
    },
)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    if not task_service.delete_task(db, task_id):
        raise HTTPException(status_code=404, detail=f"Task with id={task_id} not found")
