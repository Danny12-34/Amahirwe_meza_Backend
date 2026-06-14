const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection immediately
db.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Supabase Connected:', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
  });

module.exports = db;