// lib/db.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Uncomment the following line if your database requires an SSL connection
  // ssl: { rejectUnauthorized: false },
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
