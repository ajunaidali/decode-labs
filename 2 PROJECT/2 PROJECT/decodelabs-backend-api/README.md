# DecodeLabs Backend API

**DecodeLabs Full Stack Development — Project 2: Backend API Development**

A beginner-friendly, professionally structured REST API built with **Node.js** and **Express.js**. This project demonstrates how to create API endpoints, validate user input, return structured JSON responses, and handle errors — all key skills for backend development.

The API manages **student tasks** and supports creating, listing, and retrieving tasks through standard HTTP methods.

---

## Project Objectives

This project demonstrates:

- Building a REST API with Node.js and Express.js.
- Creating and using **GET** and **POST** API endpoints.
- Receiving and processing user input from request bodies.
- Returning consistent, structured **JSON** responses.
- Validating user-submitted data and rejecting invalid input.
- Handling errors with appropriate **HTTP status codes**.
- Writing automated tests to prove the API works correctly.

---

## Technology Stack

| Technology   | Purpose                                |
| ------------ | -------------------------------------- |
| Node.js      | JavaScript runtime                     |
| Express.js   | Web framework for building the API     |
| Helmet       | Security middleware (HTTP headers)     |
| CORS         | Cross-Origin Resource Sharing support  |
| uuid         | Generating unique task IDs             |
| dotenv       | Loading environment variables          |
| nodemon      | Auto-restart server during development |
| Node.js Test | Built-in test runner (Node 18+)        |

---

## Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- A terminal / command prompt
- (Optional) **Postman** or **curl** for manual testing

Verify your Node.js version:

```bash
node --version   # Should print v18.x.x or higher
npm --version
```

---

## Installation

1. **Navigate to the project directory:**

```bash
cd "2 PROJECT/decodelabs-backend-api"
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
# Copy the example config
cp .env.example .env
```

Or create a `.env` file manually with:

```
PORT=5000
NODE_ENV=development
```

> **Note:** The `.env` file is git-ignored and should never be committed.

---

## Running the Server

### Production Mode

```bash
npm start
```

### Development Mode (auto-restarts on file changes)

```bash
npm run dev
```

The server will start and display:

```
🚀  DecodeLabs Backend API is running
    Environment : development
    Listening   : http://localhost:5000
    Health check: http://localhost:5000/api/health
```

**Base URL:** `http://localhost:5000`

---

## Running Tests

```bash
npm test
```

This runs 14 automated tests covering all endpoints, validation rules, and error handling. All tests are isolated and repeatable — the in-memory data store is cleared between tests.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### 1. Health Check

| Method | URL           | Description                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/api/health` | Verify the API server is running |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "DecodeLabs Backend API is running",
  "data": {
    "status": "healthy"
  }
}
```

---

### 2. List All Tasks

| Method | URL          | Description          |
| ------ | ------------ | -------------------- |
| GET    | `/api/tasks` | Retrieve all tasks   |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "bcb92dd5-16bc-4026-b801-a0136adf3f55",
      "title": "Learn Backend API Development",
      "description": "Practice Express.js routes and data validation",
      "completed": false,
      "createdAt": "2026-10-28T10:39:47.521Z"
    }
  ]
}
```

Returns an empty array `[]` if no tasks exist.

---

### 3. Get Task by ID

| Method | URL              | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/api/tasks/:id` | Retrieve a specific task    |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "bcb92dd5-16bc-4026-b801-a0136adf3f55",
    "title": "Learn Backend API Development",
    "description": "Practice Express.js routes and data validation",
    "completed": false,
    "createdAt": "2026-10-28T10:39:47.521Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### 4. Create a Task

| Method | URL          | Description        |
| ------ | ------------ | ------------------ |
| POST   | `/api/tasks` | Create a new task  |

**Request Body (JSON):**

```json
{
  "title": "Learn Backend API Development",
  "description": "Practice Express.js routes and data validation"
}
```

| Field         | Type   | Required | Rules                                  |
| ------------- | ------ | -------- | -------------------------------------- |
| `title`       | string | Yes      | Non-empty, max 100 characters          |
| `description` | string | No       | Must be a string, max 500 characters   |

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "bcb92dd5-16bc-4026-b801-a0136adf3f55",
    "title": "Learn Backend API Development",
    "description": "Practice Express.js routes and data validation",
    "completed": false,
    "createdAt": "2026-10-28T10:39:47.521Z"
  }
}
```

> **Note:** The `id`, `completed`, and `createdAt` fields are generated by the server. Client-submitted values for these fields are ignored.

**Response (400 Bad Request — validation error):**

```json
{
  "success": false,
  "message": "Title is required",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

## Response Format

All responses follow a consistent JSON structure:

### Success

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

### Error

```json
{
  "success": false,
  "message": "Human-readable error summary",
  "errors": [
    {
      "field": "fieldName",
      "message": "Detailed error for this field"
    }
  ]
}
```

The `errors` array is only included when there are field-level validation details.

---

## Validation Rules

The API validates all input and returns clear error messages:

| Scenario                      | HTTP Status | Error Message                                |
| ----------------------------- | ----------- | -------------------------------------------- |
| Missing request body          | 400         | Request body is required                     |
| Malformed JSON                | 400         | Malformed JSON in request body               |
| Missing title                 | 400         | Title is required                            |
| Empty / whitespace-only title | 400         | Title must not be empty                      |
| Title too long (> 100 chars)  | 400         | Title must not exceed 100 characters         |
| Title is not a string         | 400         | Title must be a string                       |
| Description is not a string   | 400         | Description must be a string                 |
| Description too long (> 500)  | 400         | Description must not exceed 500 characters   |
| Task not found                | 404         | Task not found                               |
| Unknown route                 | 404         | Route not found: METHOD /path                |
| Server error                  | 500         | An unexpected error occurred on the server   |

---

## Example Requests

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# List all tasks
curl http://localhost:5000/api/tasks

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express.js", "description": "Build REST APIs"}'

# Get a specific task (replace <id> with actual UUID)
curl http://localhost:5000/api/tasks/<id>

# Test validation — missing title
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "No title provided"}'

# Test malformed JSON
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{ broken json }'
```

### Using Postman

1. Open **Postman** and create a new request collection.
2. Set the **Base URL** to `http://localhost:5000`.
3. For each endpoint above, create a new request with the appropriate method (GET or POST).
4. For POST requests:
   - Set the **Body** tab to **raw** → **JSON**.
   - Paste the request body JSON.
5. Click **Send** and inspect the response status code, body, and headers.
6. Test validation by sending requests with missing fields, empty titles, or malformed JSON.

---

## Project Structure

```
decodelabs-backend-api/
├── src/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Entry point — starts the HTTP server
│   ├── routes/
│   │   └── taskRoutes.js       # Maps URL paths to controller functions
│   ├── controllers/
│   │   └── taskController.js   # Handles requests and sends responses
│   ├── services/
│   │   └── taskService.js      # Business logic and in-memory data store
│   ├── middleware/
│   │   ├── validateTask.js     # Input validation for POST /api/tasks
│   │   ├── notFound.js         # 404 handler for unknown routes
│   │   └── errorHandler.js     # Centralised error handling
│   └── utils/
│       └── apiResponse.js      # Consistent JSON response helpers
├── tests/
│   └── taskApi.test.js         # Automated test suite (14 tests)
├── .env.example                # Example environment configuration
├── .gitignore                  # Files excluded from version control
├── package.json                # Project metadata and npm scripts
└── README.md                   # This file
```

### Architecture

- **Routes** → define URL paths and HTTP methods.
- **Controllers** → handle request/response logic.
- **Services** → contain business logic and data access.
- **Middleware** → cross-cutting concerns (validation, errors).
- **Utils** → shared helper functions.

This separation keeps the code modular, testable, and easy to understand.

---

## HTTP Status Codes Used

| Code | Meaning               | When Used                                      |
| ---- | --------------------- | ---------------------------------------------- |
| 200  | OK                    | Successful GET request                         |
| 201  | Created               | Resource successfully created (POST)           |
| 400  | Bad Request           | Invalid input or malformed JSON                |
| 404  | Not Found             | Task not found or unknown route                |
| 500  | Internal Server Error | Unexpected server-side error                   |

---

## Current Limitations

- **In-memory data store:** All tasks are stored in memory. They are **lost when the server restarts**. This is intentional for an educational project. A production application would use a database such as PostgreSQL or MongoDB.
- **No authentication:** The API does not require login or API keys.
- **No UPDATE or DELETE:** The project scope covers GET and POST endpoints only.
- **Single-process:** The server runs as a single Node.js process.

---

## How This Project Satisfies DecodeLabs Project 2 Requirements

| Requirement                          | Implementation                                         |
| ------------------------------------ | ------------------------------------------------------ |
| Backend with Node.js + Express       | ✅ Express.js app with modular architecture             |
| GET and POST endpoints               | ✅ GET `/api/health`, `/api/tasks`, `/api/tasks/:id`; POST `/api/tasks` |
| Receive and process user input       | ✅ JSON request body parsed and validated               |
| Structured JSON responses            | ✅ Consistent `{ success, message, data }` envelope     |
| Data validation                      | ✅ Title required, length limits, type checks           |
| Error handling with HTTP status codes | ✅ 200, 201, 400, 404, 500 with clear messages         |
| Automated testing                    | ✅ 14 tests using Node.js built-in test runner          |
| Environment configuration            | ✅ dotenv with `.env.example`                           |
| Security best practices              | ✅ Helmet, CORS, body size limits                       |
| Clean project structure              | ✅ Routes / Controllers / Services / Middleware          |
| Documentation                        | ✅ Comprehensive README with examples                   |

---

## npm Scripts Reference

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm start`     | Start the server (`node src/server.js`)        |
| `npm run dev`   | Start with auto-restart (`nodemon src/server.js`) |
| `npm test`      | Run automated tests                            |

---

## License

ISC — Educational project for DecodeLabs Full Stack Development course.
