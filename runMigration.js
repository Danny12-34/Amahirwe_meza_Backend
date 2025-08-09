const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',               // your MySQL password if any
      database: 'amahirwemezadb',  // specify your database here!
      multipleStatements: true
    });

    const sql = fs.readFileSync(path.join(__dirname, 'migrations', 'migration.sql'), 'utf8');

    await connection.query(sql);

    console.log('Migration ran successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error running migration:', error);
  }
}

runMigration();
