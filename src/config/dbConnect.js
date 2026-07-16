const { Pool } = require("pg")
require("dotenv").config()

const parseDatabaseUrl = (databaseUrl) => {
  if (!databaseUrl) return null

  try {
    const url = new URL(databaseUrl)
    return {
      host: url.hostname,
      port: Number(url.port || 5432),
      database: url.pathname.replace(/^\//, ''),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password)
    }
  } catch {
    return null
  }
}

const getDbConfig = (env = process.env) => {
  const databaseUrlConfig = parseDatabaseUrl(env.DATABASE_URL)

  return {
    host: env.PG_HOST || env.DB_HOST || env.PGHOST || env.PGHOSTADDR || databaseUrlConfig?.host || "localhost",
    port: Number(env.PG_PORT || env.DB_PORT || env.PGPORT || databaseUrlConfig?.port || 5432),
    database: env.PG_DATABASE || env.DB_NAME || env.PGDATABASE || databaseUrlConfig?.database || "miniblog_db",
    user: env.PG_USER || env.DB_USER || env.PGUSER || databaseUrlConfig?.user || "postgres",
    password: env.PG_PASSWORD || env.DB_PASSWORD || env.PGPASSWORD || databaseUrlConfig?.password || "postgres",
    max: Number(env.DB_MAX_CONNECT || 10),
    idleTimeoutMillis: Number(env.DB_IDLETIMEOUT || 10_000),
    connectionTimeoutMillis: Number(env.DB_CONNECTIONTIMEOUT || 5_000)
  }
}

const pool = new Pool(getDbConfig())

module.exports = {
  pool,
  getDbConfig
}

