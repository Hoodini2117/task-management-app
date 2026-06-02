# Taskly — Task Management API

Taskly is a modern full-stack task management application designed to help users organize, prioritize, and track their work efficiently. The application combines a FastAPI backend with a React frontend to provide a responsive and intuitive task management experience. Users can create tasks, assign priorities, manage statuses, track deadlines, and monitor overall productivity through a dashboard-driven interface. The project follows a layered architecture that separates API handling, business logic, validation, and data persistence. The backend exposes a RESTful API built with FastAPI and SQLAlchemy, while the frontend provides a modern user interface for managing tasks and visualizing task-related analytics. The application was developed with scalability and maintainability in mind, making it suitable for extension with advanced features such as task assignments, collaboration tools and overview boards,.
## Tech Stack

- **Framework:** FastAPI 0.100+
- **ORM:** SQLAlchemy 2.0
- **Database:** SQLite
- **Validation:** Pydantic v2
- **Python:** 3.11+

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

Interactive Swagger docs at `http://127.0.0.1:8000/docs`.

---

## API Endpoints

### Tasks

| Method | Endpoint             | Status | Description                |
|--------|----------------------|--------|----------------------------|
| GET    | /api/tasks/          | 200    | List tasks (with filters)  |
| GET    | /api/tasks/stats     | 200    | Get aggregate task stats   |
| GET    | /api/tasks/history   | 200    | Get full task history      |
| GET    | /api/tasks/{id}      | 200    | Get a single task          |
| POST   | /api/tasks/          | 201    | Create a new task          |
| PUT    | /api/tasks/{id}      | 200    | Update an existing task    |
| DELETE | /api/tasks/{id}      | 204    | Delete a task              |

### Comments

| Method | Endpoint                              | Status | Description              |
|--------|---------------------------------------|--------|--------------------------|
| GET    | /api/tasks/{id}/comments              | 200    | List comments for a task |
| POST   | /api/tasks/{id}/comments              | 201    | Add a comment to a task  |
| DELETE | /api/tasks/{id}/comments/{comment_id} | 204    | Delete a comment         |

### Activity Logs

| Method | Endpoint                     | Status | Description                      |
|--------|------------------------------|--------|----------------------------------|
| GET    | /api/tasks/{id}/activities   | 200    | List activity logs for a task    |

---

## Request & Response Examples

### Create a Task

**Request:**

```http
POST /api/tasks/
Content-Type: application/json

{
  "title": "Design landing page",
  "description": "Create mockups for the new homepage",
  "priority": "high",
  "status": "pending",
  "due_date": "2026-06-15",
  "due_time": "14:30",
  "assignee_name": "John Doe",
  "assignee_email": "john@example.com"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "task_code": "TSK-0001",
  "title": "Design landing page",
  "description": "Create mockups for the new homepage",
  "status": "pending",
  "priority": "high",
  "due_date": "2026-06-15",
  "due_time": "14:30",
  "assignee_name": "John Doe",
  "assignee_email": "john@example.com",
  "completed_at": null,
  "is_archived": false,
  "created_at": "2026-06-02T19:51:20.508332",
  "updated_at": "2026-06-02T19:51:20.508342",
  "comment_count": 0,
  "activity_count": 2
}
```

### Update a Task

**Request:**

```http
PUT /api/tasks/1
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "medium"
}
```

**Response (200 OK):**

Returns the full updated task object (same shape as create response).

### List Tasks (with Filters)

**Request:**

```http
GET /api/tasks/?status=pending&priority=high&search=landing&skip=0&limit=50
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "task_code": "TSK-0001",
    "title": "Design landing page",
    "...": "..."
  }
]
```

**Query Parameters:**

| Parameter         | Type    | Default | Description                                       |
|-------------------|---------|---------|---------------------------------------------------|
| status            | string  | null    | Filter: `pending`, `in-progress`, `completed`     |
| priority          | string  | null    | Filter: `low`, `medium`, `high`                   |
| search            | string  | null    | Search title, description, task code, assignee     |
| include_archived  | boolean | false   | Include archived tasks                             |
| skip              | integer | 0       | Pagination offset                                  |
| limit             | integer | 100     | Max results (1–200)                                |

### Add a Comment

**Request:**

```http
POST /api/tasks/1/comments
Content-Type: application/json

{
  "author_name": "Jane Smith",
  "message": "Looking great! Let me know when the first draft is ready."
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "task_id": 1,
  "author_name": "Jane Smith",
  "message": "Looking great! Let me know when the first draft is ready.",
  "created_at": "2026-06-02T19:55:10.123456"
}
```

### Get Activity Logs

**Request:**

```http
GET /api/tasks/1/activities
```

**Response (200 OK):**

```json
[
  {
    "id": 3,
    "task_id": 1,
    "action": "Comment added by Jane Smith",
    "timestamp": "2026-06-02T19:55:10.123456"
  },
  {
    "id": 2,
    "task_id": 1,
    "action": "Assigned to John Doe",
    "timestamp": "2026-06-02T19:51:20.511975"
  },
  {
    "id": 1,
    "task_id": 1,
    "action": "Task Created",
    "timestamp": "2026-06-02T19:51:20.511964"
  }
]
```

---

## Status Codes

| Code | Meaning              | When                                          |
|------|----------------------|-----------------------------------------------|
| 200  | OK                   | Successful GET or PUT                         |
| 201  | Created              | Successful POST (task or comment created)     |
| 204  | No Content           | Successful DELETE                             |
| 400  | Bad Request          | Business rule violation                       |
| 404  | Not Found            | Task or comment does not exist                |
| 422  | Validation Error     | Request body fails Pydantic validation        |
| 500  | Internal Server Error| Unexpected server failure                     |

---

## Validation Rules

### Task Fields

| Field          | Type     | Required | Constraints                                      |
|----------------|----------|----------|--------------------------------------------------|
| title          | string   | Yes      | 1–255 characters, no whitespace-only              |
| description    | string   | No       | Max 2000 characters                               |
| status         | enum     | No       | `pending`, `in-progress`, `completed`             |
| priority       | enum     | No       | `low`, `medium`, `high`                           |
| due_date       | string   | No       | YYYY-MM-DD format, cannot be in the past          |
| due_time       | string   | No       | HH:MM format (00:00–23:59)                        |
| assignee_name  | string   | No       | Max 255 characters                                |
| assignee_email | string   | No       | Valid email format, max 255 characters             |

### Comment Fields

| Field       | Type   | Required | Constraints                            |
|-------------|--------|----------|----------------------------------------|
| author_name | string | Yes      | 1–255 characters, no whitespace-only   |
| message     | string | Yes      | 1–5000 characters, no whitespace-only  |

---

## Error Response Examples

### 404 Not Found

```json
{
  "detail": "Task with id=999 not found"
}
```

### 422 Validation Error

```json
{
  "detail": "Validation failed",
  "errors": [
    "title: String should have at least 1 character",
    "due_date: Value error, Due date cannot be in the past",
    "assignee_email: Value error, assignee_email must be a valid email address"
  ]
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error. Please try again later."
}
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, middleware, exception handlers
│   ├── database.py          # SQLAlchemy engine, session, base
│   ├── models.py            # ORM models (Task, Comment, ActivityLog)
│   ├── schemas.py           # Pydantic request/response schemas + validation
│   ├── dependencies.py      # Dependency injection (DB sessions)
│   ├── routes/
│   │   ├── tasks.py         # Task CRUD endpoints
│   │   ├── comments.py      # Comment endpoints
│   │   └── activities.py    # Activity log endpoints
│   └── services/
│       ├── task_service.py   # Task business logic
│       ├── comment_service.py# Comment business logic
│       └── activity_service.py# Activity log queries
├── requirements.txt
└── README.md
```

## Architecture

- **Routes** handle HTTP concerns (status codes, error responses, OpenAPI docs)
- **Services** contain business logic and database operations
- **Schemas** validate input, enforce constraints, and serialize output
- **Dependencies** manage shared resources like DB sessions
- **Exception Handlers** ensure consistent, safe error responses
