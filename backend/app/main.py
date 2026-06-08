"""Taskly — Task Management API.

A RESTful API for managing tasks with comments, activity tracking,
assignee management, and Kanban board support.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import engine, Base
from app.routes.tasks import router as tasks_router
from app.routes.comments import router as comments_router
from app.routes.activities import router as activities_router

logger = logging.getLogger("taskly")


# Lifespan context manager — runs setup on startup and cleanup on shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown lifecycle."""
    # Create all ORM-defined tables if they don't already exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
    yield


# Initialize FastAPI application with OpenAPI metadata
app = FastAPI(
    title="Taskly — Task Management API",
    description=(
        "A RESTful task management API with support for task identifiers (TSK-XXXX), "
        "assignees, comments, activity tracking, and Kanban board views.\n\n"
        "## Features\n"
        "- **Tasks**: Full CRUD with status workflow, priority system, due dates\n"
        "- **Task IDs**: Auto-generated user-facing identifiers (TSK-0001)\n"
        "- **Assignees**: Lightweight task assignment (name + email)\n"
        "- **Comments**: Add, view, and delete comments on tasks\n"
        "- **Activity Logs**: Automatic tracking of task changes\n"
        "- **Search**: Full-text search across titles, descriptions, IDs, assignees\n"
        "- **History**: Complete task history with archive workflow\n"
    ),
    version="3.0.0",
    lifespan=lifespan,
    responses={
        400: {"description": "Bad Request — invalid input or business rule violation"},
        404: {"description": "Not Found — requested resource does not exist"},
        422: {"description": "Validation Error — request body failed schema validation"},
        500: {"description": "Internal Server Error — unexpected failure"},
    },
)

# CORS middleware — allow frontend dev servers to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Exception Handlers ────────────────────────────────────────────────────────

# Transform Pydantic validation errors into structured 422 responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with clear, structured messages."""
    errors = []
    for err in exc.errors():
        # Build a readable field path from the error location tuple
        field = " → ".join(str(loc) for loc in err.get("loc", []) if loc != "body")
        message = err.get("msg", "Validation error")
        errors.append(f"{field}: {message}" if field else message)

    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation failed",
            "errors": errors,
        },
    )


# Global catch-all — prevents unhandled exceptions from leaking stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all handler — prevents stack traces from leaking to clients."""
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


# ─── Register Routers ──────────────────────────────────────────────────────────

# Mount versioned API routers for tasks, comments, and activity logs
app.include_router(tasks_router)
app.include_router(comments_router)
app.include_router(activities_router)
