//* RESPONSABILIDAD DE LOS CONTROLADORES: 
//* 1- recibir la informacion necesaria para procesar la solicitud -> request -> params, query, body
//* 2- llamar a un servicio encargado de traer la informacion de la base de datos.
//* 3- responder al cliente de forma adecuada

const { getUsersService, getUserByIdService } = require("../services/users.service")

const getWelcomeController = (req, res) => {
  res.status(200).json({
      message: 'el server esta ok'
  })
}

const getUsersController = (req, res) => {
  const users = getUsersService()
  res.status(200).json({
    message: 'usuarios encontrados',
    data: users
  })
}

const getUserByIdController = (req, res) => {

    const { id } = req.params
    const user = getUserByIdService(id)
    res.status(200).json({
      msg: 'usuario encontrado',
      data: user
    })
}



module.exports = {
  getWelcomeController,
  getUsersController,
  getUserByIdController
}