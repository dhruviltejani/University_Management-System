const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "University_data",
  password: "0000",
  port: 5432,
});

module.exports = pool;