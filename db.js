/*const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'Pakistan400',
  database: 'dummyproject',
});

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch((err) => console.error('Connection error:', err.message));

module.exports = pool;*/
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Supabase PostgreSQL connected'))
  .catch((err) => console.error('Connection error:', err.message));

module.exports = pool;