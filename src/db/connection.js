// src/db/connection.js

const { Pool } = require('pg');
require('dotenv').config(); // Asegura que las variables del .env estén disponibles

/**
 * Configura y exporta el pool de conexión a PostgreSQL.
 */
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT, // Usamos el puerto definido en .env (3000 es nuestro PORT de la API)
});

/**
 * Función para ejecutar consultas de forma segura usando el pool de conexiones.
 * @param {string} text - La consulta SQL a ejecutar.
 * @param {Array<any>} [params=[]] - Parámetros para prevenir inyección SQL.
 * @returns {Promise<object|array>} Los resultados de la consulta.
 */
const query = async (text, params = []) => {
    try {
        // console.log(\`DEBUG QUERY: \${text} with params: \${params}\`); // Debugging tool
        const res = await pool.query(text, params);
        return res.rows;
    } catch (error) {
        console.error("Error de base de datos:", error);
        throw new Error(`Error al ejecutar la consulta SQL: ${error.message}`);
    }
};

// Exponemos el pool y la función query para que los servicios puedan usarlo.
module.exports = {
    query,
    pool // También exportamos pool si algún servicio necesita funciones avanzadas del Pool (ej. transacciones)
};