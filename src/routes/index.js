//* RESPONSABILIDAD: armar el router y las rutas y exportalo

const { Router } = require("express")
const { getWelcomeController, getUsersController, getUserByIdController } = require("../controllers/users.controller")

const router = Router()


router.get("/", getWelcomeController)

router.get("/users", getUsersController)

router.get("/users/:id", getUserByIdController)

module.exports = {
  router
}