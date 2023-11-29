const { createPool } = require("mysql2");

// Create a connection pool with the provided configuration
const pool = createPool({
  port: process.env.DB_PORT,          // Port number of the database server
  host: process.env.DB_HOST,          // Hostname of the database server
  user: process.env.DB_USER,          // Database user
  password: process.env.DB_PASSWORD,  // Password for the database user
  database: process.env.MYSQL_DB,     // Name of the MySQL database
  timezone: "Z",                      // Set timezone to UTC
}).promise();                         // Use promises for better async handling

module.exports = pool;
