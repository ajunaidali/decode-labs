/**
 * taskRoutes.js — Express router that maps URL paths to controllers.
 *
 * Routes are kept in their own file so they can be imported and mounted
 * on any prefix (in our case `/api`) by app.js.  This separation means
 * you can add new route files (e.g. userRoutes.js) without touching
 * the main application setup.
 */

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const validateTask = require('../middleware/validateTask');

// ----- Health check -----
router.get('/health', taskController.getHealth);

// ----- Task endpoints -----
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);

// POST /tasks uses the validation middleware before the controller
router.post('/tasks', validateTask, taskController.createTask);

module.exports = router;
