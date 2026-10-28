/**
 * taskApi.test.js — Automated test suite for the DecodeLabs Backend API.
 *
 * Uses the Node.js built-in test runner (available since Node 18).
 * Run with:   npm test
 *
 * HOW IT WORKS
 * ────────────
 * Instead of starting a real HTTP server on a port, we spin up an
 * ephemeral server for each test using `app.listen(0)` (port 0 tells
 * the OS to pick a free port).  After each test we close the server
 * and clear the in-memory task store so tests never leak state into
 * one another.
 *
 * We use the global `fetch` API (built into Node 18+) to make HTTP
 * requests against the ephemeral server.
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');
const { clearAllTasks } = require('../src/services/taskService');

// ---------------------------------------------------------------------------
// Helper: start / stop an ephemeral test server
// ---------------------------------------------------------------------------
let server;
let baseUrl;

/**
 * Start a fresh server before each test and reset the data store.
 */
beforeEach(async () => {
  clearAllTasks();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

/**
 * Shut down the server after each test.
 */
afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
});

// ═══════════════════════════════════════════════════════════════════════════
// 1.  Health endpoint
// ═══════════════════════════════════════════════════════════════════════════

describe('GET /api/health', () => {
  it('should return 200 and a healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'healthy');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2.  GET /api/tasks  (list all)
// ═══════════════════════════════════════════════════════════════════════════

describe('GET /api/tasks', () => {
  it('should return 200 and an empty array when no tasks exist', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data), 'data should be an array');
    assert.equal(body.data.length, 0);
  });

  it('should return tasks that were previously created', async () => {
    // Create two tasks first
    await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Task A' }),
    });
    await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Task B' }),
    });

    const res = await fetch(`${baseUrl}/api/tasks`);
    const body = await res.json();

    assert.equal(body.data.length, 2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3.  POST /api/tasks  (create)
// ═══════════════════════════════════════════════════════════════════════════

describe('POST /api/tasks', () => {
  it('should create a valid task and return 201', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Learn Express.js',
        description: 'Build REST APIs with Express',
      }),
    });

    assert.equal(res.status, 201);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Learn Express.js');
    assert.equal(body.data.description, 'Build REST APIs with Express');
  });

  it('should generate an id and createdAt on the server', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test task' }),
    });

    const body = await res.json();

    // ID should be a non-empty string (UUID)
    assert.ok(typeof body.data.id === 'string' && body.data.id.length > 0, 'id should be a non-empty string');

    // createdAt should be a valid ISO date
    assert.ok(!isNaN(Date.parse(body.data.createdAt)), 'createdAt should be a valid ISO date');
  });

  it('should default completed to false', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Another task' }),
    });

    const body = await res.json();
    assert.equal(body.data.completed, false);
  });

  it('should reject a missing title with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title here' }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  it('should reject an empty title with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  it('should reject a title exceeding 100 characters with 400', async () => {
    const longTitle = 'A'.repeat(101);
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: longTitle }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  it('should reject a non-string description with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Valid title', description: 12345 }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  it('should reject malformed JSON with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json!! }',
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4.  GET /api/tasks/:id  (single task)
// ═══════════════════════════════════════════════════════════════════════════

describe('GET /api/tasks/:id', () => {
  it('should return an existing task by id', async () => {
    // Create a task and capture its id
    const createRes = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Find me' }),
    });
    const created = await createRes.json();
    const taskId = created.data.id;

    // Retrieve it by id
    const res = await fetch(`${baseUrl}/api/tasks/${taskId}`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.id, taskId);
    assert.equal(body.data.title, 'Find me');
  });

  it('should return 404 for a nonexistent task id', async () => {
    const res = await fetch(`${baseUrl}/api/tasks/nonexistent-id-12345`);
    assert.equal(res.status, 404);

    const body = await res.json();
    assert.equal(body.success, false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5.  Unknown routes
// ═══════════════════════════════════════════════════════════════════════════

describe('Unknown routes', () => {
  it('should return a structured 404 for an unknown route', async () => {
    const res = await fetch(`${baseUrl}/api/does-not-exist`);
    assert.equal(res.status, 404);

    const body = await res.json();
    assert.equal(body.success, false);
    assert.ok(body.message.includes('Route not found'));
  });
});
