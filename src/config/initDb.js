const { pool } = require("./dbConnect");

const initializateDatabase = async ( ) => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'student'
    )
    `)

  const { rows }  = await pool.query(`SELECT COUNT(*)::int AS total FROM users`)
  if(rows[0].total === 0 ){
      pool.query(`
        INSERT INTO users(name, role) VALUES ($1, $2), ($3, $4)
        `, 
        ['tami', 'estudiante', 'ludmi', 'estudiante'])
  }
}

module.exports = {
  initializateDatabase
}