const mysql = require("mysql2/promise");
const { Pool, Client } = require("pg");

const connectionDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
});

const connectionPgDB = new Pool({
  host: process.env.PG_DB_HOST,
  user: process.env.PG_DB_USER,
  database: process.env.PG_DB_DATABASE,
  port: process.env.PG_DB_PORT,
  password: process.env.PG_DB_PASSWORD,
  ssl: true,
});

module.exports = { connectionDB, connectionPgDB };
