from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# SQLite connection string — file-based DB in project root
SQLALCHEMY_DATABASE_URL = "sqlite:///./task_manager.db"

# SQLAlchemy engine with SQLite thread-safety workaround
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Session factory for creating scoped database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Declarative base class — all ORM models inherit from this
class Base(DeclarativeBase):
    pass
