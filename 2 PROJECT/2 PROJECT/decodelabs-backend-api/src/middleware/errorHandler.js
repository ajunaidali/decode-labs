/**
 * errorHandler.js — Centralised error-handling middleware.
 *
 * Express recognises a middleware with four parameters (err, req, res, next)
 * as an error handler.  When any middleware or route calls next(err), or
 * when Express catches a thrown error, control jumps here.
 *
 * This handler also catches malformed JSON bodies that Express's built-in
 * JSON parser rejects (they arrive as SyntaxError instances).
 */

const { sendError } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // -----------------------------------------------------------------
  // 1.  Malformed JSON in the request body
  // -----------------------------------------------------------------
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'Malformed JSON in request body');
  }

  // -----------------------------------------------------------------
  // 2.  Log unexpected errors for debugging (never expose to client)
  // -----------------------------------------------------------------
  console.error('[ErrorHandler]', err.message || err);

  // -----------------------------------------------------------------
  // 3.  Determine status code
  // -----------------------------------------------------------------
  const statusCode = err.statusCode || err.status || 500;

  // -----------------------------------------------------------------
  // 4.  Build response — hide internal details in production
  // -----------------------------------------------------------------
  const message =
    statusCode === 500
      ? 'An unexpected error occurred on the server'
      : err.message || 'Something went wrong';

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
