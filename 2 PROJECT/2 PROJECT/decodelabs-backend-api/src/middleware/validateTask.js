/**
 * validateTask.js — Middleware that validates the request body before
 * a new task is created.
 *
 * Validation runs BEFORE the controller so that invalid data never
 * reaches the service layer or the data store.  If anything is wrong
 * the middleware responds with 400 Bad Request and a detailed error
 * payload; otherwise it calls next() to let the request continue.
 */

const { sendError } = require('../utils/apiResponse');

// ---------------------------------------------------------------------------
// Configuration — tweak these limits as needed
// ---------------------------------------------------------------------------
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Express middleware: validate POST /api/tasks body.
 */
const validateTask = (req, res, next) => {
  const errors = []; // Collect all field-level validation errors

  // ------------------------------------------------------------------
  // 1.  Check that a request body exists
  // ------------------------------------------------------------------
  if (!req.body || typeof req.body !== 'object') {
    return sendError(res, 400, 'Request body is required');
  }

  const { title, description } = req.body;

  // ------------------------------------------------------------------
  // 2.  Title validation
  // ------------------------------------------------------------------
  if (title === undefined || title === null) {
    // Title was not provided at all
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof title !== 'string') {
    // Title was provided but is not a string (e.g. a number or boolean)
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (title.trim().length === 0) {
    // Title is empty or contains only whitespace
    errors.push({ field: 'title', message: 'Title must not be empty' });
  } else if (title.trim().length > MAX_TITLE_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title must not exceed ${MAX_TITLE_LENGTH} characters`,
    });
  }

  // ------------------------------------------------------------------
  // 3.  Description validation (optional field)
  // ------------------------------------------------------------------
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: 'description',
        message: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      });
    }
  }

  // ------------------------------------------------------------------
  // 4.  If errors were collected, reject the request
  // ------------------------------------------------------------------
  if (errors.length > 0) {
    // Use the first error's message as the top-level summary
    return sendError(res, 400, errors[0].message, errors);
  }

  // ------------------------------------------------------------------
  // 5.  Sanitise: trim whitespace and attach cleaned values
  // ------------------------------------------------------------------
  req.body.title = title.trim();
  req.body.description =
    description !== undefined && description !== null
      ? description.trim()
      : '';

  // Everything looks good — pass control to the next handler
  next();
};

module.exports = validateTask;
