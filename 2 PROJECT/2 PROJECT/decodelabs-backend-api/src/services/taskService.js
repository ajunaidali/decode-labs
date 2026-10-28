/**
 * taskService.js — Business-logic layer for tasks.
 *
 * This module owns the in-memory data store and all operations on it.
 * Controllers call these functions instead of touching the store directly,
 * which keeps the code modular and easier to test or refactor later.
 *
 * IMPORTANT: Because tasks live in memory, they are lost every time the
 * server restarts.  This is intentional for an educational project — a
 * real production app would use a database such as PostgreSQL or MongoDB.
 */

const { v4: uuidv4 } = require('uuid');

// ---------------------------------------------------------------------------
// In-memory data store
// ---------------------------------------------------------------------------
// This simple array acts as our "database".  Every task object added here
// is available until the Node.js process stops.
let tasks = [];

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Return a shallow copy of every task in the store.
 * Returning a copy prevents callers from accidentally mutating the store.
 */
const getAllTasks = () => [...tasks];

/**
 * Find a single task by its unique ID.
 *
 * @param   {string}       id — The UUID of the task to look up.
 * @returns {object|null}      The task object, or null if not found.
 */
const getTaskById = (id) => tasks.find((task) => task.id === id) || null;

/**
 * Create a new task, assign it a server-generated ID and timestamp,
 * store it, and return the created task object.
 *
 * @param   {string}  title       — Required task title (already validated).
 * @param   {string}  description — Optional description (already validated).
 * @returns {object}               The newly created task.
 */
const createTask = (title, description = '') => {
  const newTask = {
    id: uuidv4(),                       // Server-generated unique ID
    title,
    description,
    completed: false,                    // Always starts as incomplete
    createdAt: new Date().toISOString(), // Server-generated ISO timestamp
  };

  tasks.push(newTask);
  return newTask;
};

/**
 * Remove every task from the store.
 * This is used by the automated test suite to reset state between tests
 * so that tests remain isolated and repeatable.
 */
const clearAllTasks = () => {
  tasks = [];
};

module.exports = { getAllTasks, getTaskById, createTask, clearAllTasks };
