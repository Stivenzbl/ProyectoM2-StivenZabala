// src/services/authorService.js

const db = require('../db/connection'); // Utilizamos la función query de conexión

/**
 * Obtiene todos los autores de forma paginada y ordenada.
 */
exports.getAllAuthors = async () => {
    // TODO: Implementar consulta parametrizada para listar todos los authors.
    // Debe manejar el caso de no resultados (array vacío).
    const queryText = `SELECT id, name, email, bio, created_at FROM authors ORDER BY created_at DESC;`;
    return db.query(queryText);
};

/**
 * Crea un nuevo autor en la base de datos después de validar inputs críticos.
 * @param {object} authorData - Objeto con nombre y email.
 * @returns {Promise<object>} El objeto del autor creado.
 */
exports.createAuthor = async (authorData) => {
    // TODO: VALIDACIÓN CRÍTICA: Verificar que el email NO exista en la DB antes de insertar.
    const queryText = `INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id, name, email, bio, created_at;`;
    // Implementación con valores parametrizados y manejo de UNIQUE constraint violation en PG.
    return db.query(queryText, [authorData.name, authorData.email, authorData.bio]);
};

/**
 * Obtiene un autor por su ID.
 */
exports.getAuthorById = async (id) => {
    // TODO: Implementar consulta parametrizada para buscar por ID.
    const queryText = `SELECT id, name, email, bio, created_at FROM authors WHERE id = $1;`;
    return db.query(queryText, [id]);
};

/**
 * Actualiza la información de un autor existente.
 * @param {string} id - ID del autor a modificar.
 * @param {object} updateData - Datos parciales a actualizar (name, email, bio).
 * @returns {Promise<object>} El objeto del autor actualizado.
 */
exports.updateAuthor = async (id, updateData) => {
    // TODO: Implementar consulta que actualice solo los campos proporcionados y verifique la unicidad del nuevo email.
};

/**
 * Elimina un autor por ID. Debe manejar la lógica de integridad referencial
 * para evitar borrar autores con posts asociados (ON DELETE RESTRICT).
 * @param {string} id - ID del autor a eliminar.
 */
exports.deleteAuthor = async (id) => {
    // TODO: Implementar consulta DELETE. Debería verificar si existen posts o comentarios antes de permitir la eliminación, o dejar que PG lo maneje con una excepción.
};