//* RESPONSABILIDAD DE LOS CONTROLADORES: 
//* 1- recibir la informacion necesaria para procesar la solicitud -> request -> params, query, body
//* 2- llamar a un servicio encargado de traer la informacion de la base de datos.
//* 3- responder al cliente de forma adecuada

const { getUsersService, getUserByIdService, createUserService } = require("../services/users.service")

const getWelcomeController = (req, res, next) => {
  try {
      res.status(200).json({
        message: 'server is running ok'
      })
  } catch (error) {
      next(error)
  }
  
}

const getUsersController = async (req, res, next) => {
  try {
    const users = await getUsersService()
    res.status(200).json({
      message: 'usuarios encontrados',
      data: users
    })
  } catch (error) {
      next(error)
  }
  
}

const getUserByIdController = async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await getUserByIdService(id)
      res.status(200).json({
        msg: 'usuario encontrado',
        data: user
      })
    } catch (error) {
      next(error)
    }
    
}


const createUserController = async (req, res, next) => {

    try {
        const { name, rol } = req.body
        const dbResponse = await createUserService(name, rol)
        res.status(201).json({
          msg: 'usuario creado con exito',
          data: dbResponse
        })
      
    } catch (error) {
      next(error)
    }

}

module.exports = {
  getWelcomeController,
  getUsersController,
  getUserByIdController,
  createUserController
}