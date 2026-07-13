const { pool } = require("../config/dbConnect")

const userCreateValidator = (req,res,next ) => {

  const { name, rol } = req.body
  

  if(!name || !rol){
    return res.status(400).json({
        error: 'no se envio toda la informacion necesaria para crear el usuario, falta name y rol'
    })
  }

  if(rol !== 'student'){
    return res.status(400).json({
        error: 'el rol del usuario debe ser "student" '
    })
  }

  next()
}

module.exports = {
  userCreateValidator
}

