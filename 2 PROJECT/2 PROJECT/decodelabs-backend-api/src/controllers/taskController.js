/**
 * taskController.js — Route handlers (controllers) for task endpoints.
 *
 * Controllers are the "glue" between HTTP and business logic.  They:
 *   1. Read data from the request (params, body, query).
 *   2. Call the appropriate service function.
 *   3. Send a structured JSON response.
 *
 * Controllers should NOT contain validation rules or data-store logic —
 * that work belongs in middleware and services respectively.
 */

const taskService = require('../services/taskService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// -----------------------------------------------------------------------
// GET /api/health
// -----------------------------------------------------------------------

/**
 * Health-check endpoint — confirms the server is up and responding.
 */
const getHealth = (_req, res) => {
  sendSuccess(res, 200, 'DecodeLabs Backend API is running', {
    status: 'healthy',
  });
};

// -----------------------------------------------------------------------
// GET /api/tasks
// -----------------------------------------------------------------------

/**
 * Return every task currently stored in memory.
 * If no tasks exist yet, the data array will simply be empty.
 */
const getAllTasks = (_req, res) => {
  const tasks = taskService.getAllTasks();
  sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
};

// -----------------------------------------------------------------------
// GET /api/tasks/:id
// -----------------------------------------------------------------------

/**
 * Return a single task identified by its UUID.
 * Responds with 404 if no matching task is found.
 */
const getTaskById = (req, res) => {
  const { id } = req.params;
  const task = taskService.getTaskById(id);

  if (!task) {
    return sendError(res, 404, 'Task not found');
  }

  sendSuccess(res, 200, 'Task retrieved successfully', task);
};

// -----------------------------------------------------------------------
// POST /api/tasks
// -----------------------------------------------------------------------

/**
 * Create a new task.
 *
 * By the time this handler runs the request body has already been
 * validated and sanitised by the validateTask middleware, so we can
 * safely forward the values to the service layer.
 */
const createTask = (req, res) => {
  const { title, description } = req.body;
  const newTask = taskService.createTask(title, description);

  sendSuccess(res, 201, 'Task created successfully', newTask);
};

module.exports = { getHealth, getAllTasks, getTaskById, createTask };
