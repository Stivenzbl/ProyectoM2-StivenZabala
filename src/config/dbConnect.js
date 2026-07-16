const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  host: process.env.PG_HOST || process.env.DB_HOST || "localhost",
  port: Number(process.env.PG_PORT || process.env.DB_PORT || 5432),
  database: process.env.PG_DATABASE || process.env.DB_NAME || "miniblog_db",
  user: process.env.PG_USER || process.env.DB_USER || "postgres",
  password: process.env.PG_PASSWORD || process.env.DB_PASSWORD || "postgres",
  max: Number(process.env.DB_MAX_CONNECT || 10),
  idleTimeoutMillis: Number(process.env.DB_IDLETIMEOUT || 10_000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTIONTIMEOUT || 5_000)
})

module.exports = {
  pool
}

