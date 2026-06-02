# Task Management API

Taskly is a modern full-stack task management application designed to help users organize, prioritize, and track their work efficiently. The application combines a FastAPI backend with a React frontend to provide a responsive and intuitive task management experience. Users can create tasks, assign priorities, manage statuses, track deadlines, and monitor overall productivity through a dashboard-driven interface.
The project follows a layered architecture that separates API handling, business logic, validation, and data persistence. The backend exposes a RESTful API built with FastAPI and SQLAlchemy, while the frontend provides a modern user interface for managing tasks and visualizing task-related analytics. The application was developed with scalability and maintainability in mind, making it suitable for extension with advanced features such as task assignments, collaboration tools and overview boards,.
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

## Validation and Error handling

Input validation is enforced through Pydantic schemas to ensure data integrity and prevent invalid requests from reaching the business layer. Required fields, supported status values, and other constraints are verified before processing. The application also implements centralized error handling to return meaningful and consistent responses for validation failures, missing resources, and unexpected server-side errors. Appropriate HTTP status codes are used throughout the API to clearly communicate the result of each request.

## Future Enhancements

The current implementation establishes a strong foundation for additional productivity and collaboration features. Planned enhancements include unique task identifiers, task assignments, comments, activity timelines, Kanban-style task boards, Docker containerization, cloud deployment on AWS, Kubernetes orchestration, automated testing, and CI/CD pipelines. These additions will further evolve Taskly from a personal task manager into a more comprehensive project management platform.
