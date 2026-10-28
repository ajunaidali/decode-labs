/**
 * apiResponse.js — Utility helpers for consistent JSON responses.
 *
 * Every endpoint returns the same envelope so the client always knows
 * what shape to expect:
 *
 *   { success: true/false, message: "...", data: ... }
 *
 * Error responses may also include an `errors` array with field-level
 * details so the client can highlight specific form fields.
 */

/**
 * Send a successful JSON response.
 *
 * @param {import('express').Response} res  — Express response object.
 * @param {number}  statusCode              — HTTP status code (e.g. 200, 201).
 * @param {string}  message                 — Human-readable success message.
 * @param {*}       [data=null]             — Payload to include in the response.
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  const body = { success: true, message };

  // Only attach the `data` key when there is something to send.
  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
};

/**
 * Send an error JSON response.
 *
 * @param {import('express').Response} res  — Express response object.
 * @param {number}  statusCode              — HTTP status code (e.g. 400, 404, 500).
 * @param {string}  message                 — Human-readable error summary.
 * @param {Array}   [errors=[]]             — Optional array of field-level error objects.
 */
const sendError = (res, statusCode, message, errors = []) => {
  const body = { success: false, message };

  // Attach the field-level errors array only when there are items.
  if (errors.length > 0) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
