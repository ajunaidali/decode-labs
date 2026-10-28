/**
 * notFound.js — Catch-all middleware for undefined routes.
 *
 * This middleware is registered AFTER all real routes.  If no earlier
 * route matched the incoming request, Express falls through to this
 * handler, which responds with a structured 404 JSON message.
 */

const { sendError } = require('../utils/apiResponse');

const notFound = (req, res, _next) => {
  sendError(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
};

module.exports = notFound;
