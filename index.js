//* RESPONSABILIDAD: levantar el servidor y la conexion con la base de datos

const { pool } = require("./src/config/dbConnect")
const { server } = require("./src/server")

const { loadEnvFile  } =  require("node:process")
loadEnvFile('.env')

const startServer = async () => {

    await pool.query('SELECT 1')
    console.log("conexion con postgreSQL exitosa")

    server.listen(process.env.PORT, function(){
      console.log(`Server listen on port: ${process.env.PORT}`)
    })

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



