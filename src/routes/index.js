//* RESPONSABILIDAD: armar el router y las rutas y exportalo

const { Router } = require("express")
const { getWelcomeController, getUsersController, getUserByIdController, createUserController } = require("../controllers/users.controller")
const { requestLogger, errorHandler } = require("../middlewares")
const { userCreateValidator } = require("../middlewares/userCreateValidator")

const router = Router()


router.get("/", getWelcomeController)

router.get("/users", getUsersController)

router.get("/users/:id", getUserByIdController)

router.post('/users', createUserController)

module.exports = {
  router
}