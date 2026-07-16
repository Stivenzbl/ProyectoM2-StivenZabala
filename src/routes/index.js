const { Router } = require("express")
const authorRoutes = require("./authorRoutes")
const postRoutes = require("./postRoutes")

const router = Router()

router.get("/", (req, res) => {
  res.status(200).json({
    message: "el server esta ok"
  })
})

router.use("/authors", authorRoutes)
router.use("/posts", postRoutes)

module.exports = {
  router
}