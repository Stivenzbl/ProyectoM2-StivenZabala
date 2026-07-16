// src/db/connection.js
//
// Punto único de acceso a PostgreSQL. Reutilizamos el mismo Pool que
// src/config/dbConnect.js (el que ya resuelve DATABASE_URL y habilita SSL
// automáticamente en Railway), para no tener dos configuraciones de conexión
// divergentes en el proyecto.

const { pool } = require('../config/dbConnect');

/**
 * Ejecuta una consulta de forma segura usando el pool de conexiones.
 * @param {string} text - La consulta SQL a ejecutar.
 * @param {Array<any>} [params=[]] - Parámetros para prevenir inyección SQL.
 * @returns {Promise<object[]>} Las filas resultantes de la consulta.
 */
const query = async (text, params = []) => {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (error) {
    console.error('Error de base de datos:', error);
    throw new Error(`Error al ejecutar la consulta SQL: ${error.message}`);
  }
};

// Exportamos query y pool para que los servicios los usen.
module.exports = {
  query,
  pool,
};
