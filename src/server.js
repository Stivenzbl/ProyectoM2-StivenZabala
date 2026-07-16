//* RESPONSABILIDAD: armar configurar y exportar el servidor

const fs = require("fs")
const path = require("path")
const yaml = require("js-yaml")
const express = require("express")
const swaggerUi = require("swagger-ui-express")
const { router } = require("./routes")
const { requestLogger, errorHandler } = require("./middlewares")

const server = express()

server.use(express.json())
server.use(requestLogger)


server.use(router)

//* Swagger UI: sirve la documentación OpenAPI (openapi.yaml) de forma interactiva.
//* En local: http://localhost:3000/docs  |  En deploy: <URL_RAILWAY>/docs
const openApiSpec = yaml.load(
  fs.readFileSync(path.resolve(__dirname, "..", "openapi.yaml"), "utf8")
)
server.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec))

server.use(errorHandler)

module.exports = {
  server
}