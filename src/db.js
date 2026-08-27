const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async (log) => {
  log.info('db.connect.start');
  try {
    await pool.query('SELECT NOW()');
    log.info('db.connect.ok');
  } catch (err) {
    log.error('db.connect.failed', { error: err.message });
    log.warn('db.connect.retry');
  }
};

const queryDb = async (text, params, log) => {
  log.info('db.query.start');
  const res = await pool.query(text, params);
  log.info('db.query.ok', { rowCount: res.rowCount });
  return res;
};

module.exports = { connectDb, queryDb, pool };
