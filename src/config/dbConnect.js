const { Pool } = require("pg")

const shouldLoadEnvFile = () => {
  const hasDatabaseSettings = Boolean(
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.PGHOST ||
    process.env.PGHOSTADDR ||
    process.env.PGUSER ||
    process.env.PGDATABASE ||
    process.env.PGPASSWORD
  )

  return !hasDatabaseSettings
}

if (shouldLoadEnvFile()) {
  require("dotenv").config()
}

const parseDatabaseUrl = (databaseUrl) => {
  if (!databaseUrl) return null

  try {
    const url = new URL(databaseUrl)
    const sslMode = url.searchParams.get("sslmode")

    return {
      host: url.hostname,
      port: Number(url.port || 5432),
      database: url.pathname.replace(/^\//, ''),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      ssl: sslMode ? { rejectUnauthorized: false } : undefined
    }
  } catch {
    return null
  }
}

const getDbConfig = (env = process.env) => {
  const databaseUrlConfig = parseDatabaseUrl(env.DATABASE_URL || env.POSTGRES_URL || env.POSTGRES_PRISMA_URL || env.DB_URL)

  const host = databaseUrlConfig?.host || env.PGHOST || env.PG_HOST || env.DB_HOST || env.PGHOSTADDR || "localhost"
  const isLocal = host === "localhost" || host === "127.0.0.1"

  return {
    host,
    port: Number(databaseUrlConfig?.port || env.PGPORT || env.PG_PORT || env.DB_PORT || 5432),
    database: databaseUrlConfig?.database || env.PGDATABASE || env.PG_DATABASE || env.DB_NAME || "miniblog_db",
    user: databaseUrlConfig?.user || env.PGUSER || env.PG_USER || env.DB_USER || "postgres",
    password: databaseUrlConfig?.password || env.PGPASSWORD || env.PG_PASSWORD || env.DB_PASSWORD || "postgres",
    // Railway (y la mayoría de Postgres en la nube) exigen SSL. Si el host es
    // remoto y no venía sslmode en la URL, lo activamos para evitar el siguiente error.
    ssl: databaseUrlConfig?.ssl || (isLocal ? undefined : { rejectUnauthorized: false }),
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

