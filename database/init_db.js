const fs = require('fs');
const path = require('path');

let mysql, dotenv;
try {
  mysql = require('mysql2/promise');
  dotenv = require('dotenv');
} catch (e) {
  mysql = require(path.join(__dirname, '../backend/node_modules/mysql2/promise'));
  dotenv = require(path.join(__dirname, '../backend/node_modules/dotenv'));
}

const envPath = fs.existsSync(path.join(__dirname, '../backend/.env'))
  ? path.join(__dirname, '../backend/.env')
  : path.join(__dirname, '../.env');

dotenv.config({ path: envPath });

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'root';
  const port = process.env.DB_PORT || 3306;

  console.log(`Connecting to MySQL server at ${host}:${port} as user '${user}'...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
      ssl: {
        rejectUnauthorized: false
      },
    });

    console.log('Executing database/schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schemaSql);

    console.log('Executing database/seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await connection.query(seedSql);

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.log('Database setup notice:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase();
