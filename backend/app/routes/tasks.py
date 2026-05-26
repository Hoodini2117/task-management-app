from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    status: TaskStatus | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return task_service.get_all_tasks(db, status=status, skip=skip, limit=limit)


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
