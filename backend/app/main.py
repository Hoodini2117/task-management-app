import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import setup_logging, RequestLoggingMiddleware, logger
from app.database import engine, Base
from app.routes.tasks import router as tasks_router

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Taskly API %s", settings.API_VERSION)
    Base.metadata.create_all(bind=engine)
    yield
    logger.info("Shutting down Taskly API")


app = FastAPI(
    title="Taskly — Task Management API",
    version="2.1.0",
    description="Production-ready task management API with priority, filtering, and lifecycle management.",
    docs_url=f"/api/{settings.API_VERSION}/docs",
    redoc_url=f"/api/{settings.API_VERSION}/redoc",
    lifespan=lifespan,
)

app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


app.include_router(tasks_router)
