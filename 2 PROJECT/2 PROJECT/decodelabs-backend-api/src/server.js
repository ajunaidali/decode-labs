/**
 * server.js — Entry point that starts the HTTP server.
 *
 * This file loads environment variables, imports the configured Express
 * app, and begins listening for requests.
 *
 * Usage:
 *   npm start        → node src/server.js
 *   npm run dev      → nodemon src/server.js  (auto-restarts on changes)
 */

// Load .env variables into process.env BEFORE anything else reads them.
require('dotenv').config();

const app = require('./app');

// ---------------------------------------------------------------------------
// Read configuration from the environment (with sensible defaults)
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ---------------------------------------------------------------------------
// Start listening
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀  DecodeLabs Backend API is running`);
  console.log(`    Environment : ${NODE_ENV}`);
  console.log(`    Listening   : http://localhost:${PORT}`);
  console.log(`    Health check: http://localhost:${PORT}/api/health\n`);
});
