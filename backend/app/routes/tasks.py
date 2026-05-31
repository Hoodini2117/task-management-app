from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskStatus, StatsResponse
from app.services import task_service

from app.core.config import settings

router = APIRouter(prefix=f"/api/{settings.API_VERSION}/tasks", tags=["tasks"])


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    status: TaskStatus | None = None,
    priority: str | None = Query(default=None),
    include_archived: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return task_service.get_all_tasks(
        db, status=status, priority=priority,
        include_archived=include_archived, skip=skip, limit=limit
    )


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    return task_service.get_stats(db)


@router.get("/history", response_model=list[TaskResponse])
def get_history(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=200, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return task_service.get_history(db, skip=skip, limit=limit)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = task_service.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, task_data)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = task_service.update_task(db, task_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    if not task_service.delete_task(db, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
