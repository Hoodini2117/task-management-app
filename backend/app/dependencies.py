from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database import SessionLocal


# Dependency injection — yields a DB session per request and closes it after
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
