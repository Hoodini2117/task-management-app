# Task Management API

A RESTful task management API built with FastAPI, SQLAlchemy, and SQLite.

## Tech Stack

- **Framework:** FastAPI
- **ORM:** SQLAlchemy 2.0
- **Database:** SQLite
- **Validation:** Pydantic v2

## Getting Started

### Prerequisites

- Python 3.11+

### Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

Interactive docs at `http://127.0.0.1:8000/docs`.

## API Endpoints

| Method | Endpoint | Description |
|--------|---------------------|-----------------|
| GET | /api/tasks | List all tasks |
| GET | /api/tasks/{id} | Get a task |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |

## Project Structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app initialization and lifespan
│   ├── database.py         # SQLAlchemy engine, session, and base
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic request/response schemas
│   ├── dependencies.py     # Dependency injection (DB sessions)
│   ├── routes/
│   │   └── tasks.py        # Task API route handlers
│   └── services/
│       └── task_service.py # Business logic layer
├── requirements.txt
├── .gitignore
└── README.md
```

## Architecture

- **Routes** handle HTTP concerns (status codes, error responses)
- **Services** contain business logic and database operations
- **Schemas** validate input and serialize output
- **Dependencies** manage shared resources like DB sessions

## Upcoming

- Full CRUD logic
- Frontend integration
- Docker containerization
- Deployment configuration
