//* RESPONSABILIDAD: buscar/conectarse con la base de datos, para traer informacion y retornarla al controlador

const { pool } = require("../config/dbConnect")

const getUsersService = async () => {
  const { rows }  = await pool.query(`SELECT * FROM users`)
  return rows
}

const getUserByIdService = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])

  if(rows.length === 0){
      const miError = new Error(`No existe un usuario con el id ${id}`)
      miError.status = 400
      throw miError
  }

  return rows
}

const createUserService = async (name, rol) => {

    const query = `
        INSERT INTO users (name, role) 
        VALUES ($1, $2) 
        RETURNING id, name, role
    `
    const { rows } = await pool.query(query, [name , rol ])
    return rows


}

module.exports = {
  getUsersService,
  getUserByIdService,
  createUserService
}