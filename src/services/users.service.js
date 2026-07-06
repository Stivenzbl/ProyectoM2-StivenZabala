//* RESPONSABILIDAD: buscar/conectarse con la base de datos, para traer informacion y retornarla al controlador

const users = [
  { 
    id: 1,
    nombre: "Joaco",
    rol: 'estudiantes'
  },
  { 
    id: 2,
    nombre: "Jose",
    rol: 'estudiantes'
  }
]

const getUsersService = () => {
  return users
}

const getUserByIdService = (id) => {
  return users.find( user => user.id === Number(id))  
}

module.exports = {
  getUsersService,
  getUserByIdService
}