//* RESPONSABILIDAD: levantar el servidor y la conexion con la base de datos
const { pool, getDbConfig } = require("./src/config/dbConnect")
const { initializateDatabase } = require("./src/config/initDb")
const { server } = require("./src/server")
require("dotenv").config()

const startServer = async () => {
    const cfg = getDbConfig()
    console.log(`[db] conectando a host=${cfg.host} port=${cfg.port} database=${cfg.database} ssl=${cfg.ssl ? "on" : "off"}`)

    try {
        await pool.query('SELECT 1')
        await initializateDatabase()
        console.log("conexion con postgreSQL exitosa")

        server.listen(process.env.PORT, function(){
          console.log(`Server listen on port: ${process.env.PORT}`)
        })
    } catch (err) {
        console.error(`[db] FALLO al conectar (host=${cfg.host}). Revisa que DATABASE_URL esté disponible en el servicio de Railway.`)
        console.error(err.message)
        process.exit(1)
    }
}

startServer()

process.on("SIGINT", async () => {
  await pool.end()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await pool.end()
  process.exit(0)
})



