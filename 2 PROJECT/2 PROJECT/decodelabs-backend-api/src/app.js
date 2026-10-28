/**
 * app.js — Express application setup.
 *
 * This module creates and configures the Express app but does NOT start
 * listening on a port.  That responsibility belongs to server.js.
 *
 * Separating "app configuration" from "server startup" makes it easy to
 * import the app into automated tests without actually binding to a port.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// ---------------------------------------------------------------------------
// Create the Express application
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Global middleware — runs on EVERY incoming request
// ---------------------------------------------------------------------------

// Helmet sets various HTTP headers that help protect the app from common
// web vulnerabilities (e.g. XSS, clickjacking, MIME-type sniffing).
app.use(helmet());

// CORS (Cross-Origin Resource Sharing) allows requests from other origins.
// For local development we permit all origins; in production you would
// restrict this to specific domains.
app.use(cors());

// Parse incoming JSON bodies.  The `limit` option prevents excessively
// large payloads from consuming too much memory.
app.use(express.json({ limit: '16kb' }));

// ---------------------------------------------------------------------------
// API routes — all endpoints are prefixed with /api
// ---------------------------------------------------------------------------
app.use('/api', taskRoutes);

// ---------------------------------------------------------------------------
// Error-handling middleware (must be registered AFTER routes)
// ---------------------------------------------------------------------------

// Catch-all for routes that were not matched above → 404
app.use(notFound);

// Centralised error handler (malformed JSON, unexpected throws, etc.)
app.use(errorHandler);

module.exports = app;
