const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT, 10) || 5432,
      database: process.env.PGDATABASE || 'decodelabs_project3',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
    };

const pool = new Pool(poolConfig);

/**
 * Verify the database connection by running a test query.
 */
async function connectDB() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`[DB] Connected to PostgreSQL at ${result.rows[0].now}`);
  } catch (err) {
    console.error('[DB] Failed to connect to PostgreSQL:', err.message);
    throw err;
  }
}

/**
 * Gracefully close the pool.
 */
async function closeDB() {
  try {
    await pool.end();
    console.log('[DB] Connection pool closed');
  } catch (err) {
    console.error('[DB] Error closing connection pool:', err.message);
  }
}

module.exports = { pool, connectDB, closeDB };
