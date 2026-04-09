# Practical Task — Project Management REST API

A Node.js/Express REST API for managing projects, tasks, subtasks, and users with role-based access control and activity logging.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (access token + refresh token)
- **Validation:** Joi
- **Password hashing:** bcryptjs

---

## Project Structure

```
├── index.js                    # App entry point
├── config/
│   └── db.js                   # MongoDB connection
├── models/
│   ├── userModel.js
│   ├── projectModel.js
│   ├── taskModel.js
│   ├── subtaskModel.js
│   └── activityLogsModel.js
└── src/
    ├── controllers/
    │   ├── authController.js
    │   ├── projectController.js
    │   ├── taskController.js
    │   └── activityLogController.js
    ├── middleware/
    │   ├── auth.js             # JWT verification
    │   ├── role.js             # Role-based access
    │   └── validate.js         # Joi validation
    ├── routes/
    │   ├── authRoute.js
    │   ├── projectRouter.js
    │   ├── taskRoute.js
    │   └── activityLogRoute.js
    ├── utils/
    │   └── activityLogger.js   # Activity log helper
    └── validator/
        ├── authValidator.js
        ├── projectValidator.js
        └── taskValidator.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/practical-task
JWT_SECRET=your_jwt_secret_here
```

### Run

```bash
npm start        # uses nodemon for auto-reload
```

---

## Roles

| Role      | Permissions |
|-----------|-------------|
| `admin`   | Full access to all endpoints + activity logs |
| `manager` | Create/update/delete projects and tasks |
| `user`    | View projects, create/update tasks & subtasks |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Access | Description |
|--------|-------------|--------|-------------|
| POST   | `/register` | Public | Register a new user |
| POST   | `/login`    | Public | Login and receive tokens |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login response:**
```json
{
  "message": "Login successful",
  "response": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "<access_token>",
    "refreshToken": "<refresh_token>"
  }
}
```

> All protected routes require the header:
> `Authorization: Bearer <token>`

---

### Projects — `/api/projects`

| Method | Endpoint | Role           | Description |
|--------|----------|----------------|-------------|
| POST   | `/`      | admin, manager | Create a project |
| GET    | `/list`  | all            | List all projects (paginated) |
| GET    | `/dd`    | all            | Project dropdown (id + name) |
| PATCH  | `/:id`   | admin, manager | Update a project |
| DELETE | `/:id`   | admin, manager | Soft-delete a project |

**Query params for `/list`:** `page`, `limit`

---

### Tasks — `/api/tasks`

| Method | Endpoint              | Role           | Description |
|--------|-----------------------|----------------|-------------|
| POST   | `/`                   | all            | Create a task |
| POST   | `/create-subtask`     | all            | Create a subtask |
| PATCH  | `/update-subtask/:id` | all            | Update subtask status/title |
| GET    | `/:projectId`         | all            | List tasks for a project |
| DELETE | `/:id`                | admin, manager | Soft-delete a task |

**Task list query params:** `page`, `limit`, `status`, `priority`, `user`, `sort` (asc/desc)

**Task status values:** `pending`, `in-progress`, `completed`
**Task priority values:** `low`, `medium`, `high`

---

### Activity Logs — `/api/activity-logs`

| Method | Endpoint | Role  | Description |
|--------|----------|-------|-------------|
| GET    | `/list`  | admin | Retrieve all activity logs |

**Query params:** `page`, `limit`, `action`, `userId`, `projectId`, `taskId`

**Logged actions:**

| Action            | Trigger |
|-------------------|---------|
| `USER_REGISTERED` | New user registers |
| `USER_LOGGED_IN`  | User logs in |
| `PROJECT_CREATED` | Project created |
| `PROJECT_UPDATED` | Project updated |
| `PROJECT_DELETED` | Project soft-deleted |
| `TASK_CREATED`    | Task created |
| `TASK_DELETED`    | Task soft-deleted |
| `SUBTASK_CREATED` | Subtask created |
| `SUBTASK_UPDATED` | Subtask updated |

---

## Data Models

### User
| Field        | Type     | Notes |
|--------------|----------|-------|
| name         | String   | |
| email        | String   | unique |
| password     | String   | bcrypt hashed |
| role         | String   | `user` \| `admin` \| `manager` |
| refreshToken | String   | |

### Project
| Field       | Type             | Notes |
|-------------|------------------|-------|
| name        | String           | |
| description | String           | |
| createdBy   | ObjectId → User  | |
| isDeleted   | Boolean          | soft delete |

### Task
| Field       | Type               | Notes |
|-------------|--------------------|-------|
| title       | String             | |
| description | String             | |
| projectId   | ObjectId → Project | |
| assignedTo  | ObjectId → User    | |
| createdBy   | ObjectId → User    | |
| priority    | String             | `low` \| `medium` \| `high` |
| status      | String             | `pending` \| `in-progress` \| `completed` |
| isDeleted   | Boolean            | soft delete |

### Subtask
| Field  | Type           | Notes |
|--------|----------------|-------|
| title  | String         | |
| taskId | ObjectId → Task | |
| status | String         | `pending` \| `in-progress` \| `completed` |

### ActivityLog
| Field     | Type               |
|-----------|--------------------|
| action    | String             |
| userId    | ObjectId → User    |
| projectId | ObjectId → Project |
| taskId    | ObjectId → Task    |
| subtaskId | ObjectId → Subtask |
