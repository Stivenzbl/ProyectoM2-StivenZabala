// src/services/postService.js

const db = require('../db/connection');

/**
 * Obtiene todos los posts, opcionalmente filtrados por un author_id y paginados.
 */
exports.getAllPosts = async (authorId = null) => {
    let queryText = `SELECT id, title, content, author_id, published, created_at FROM posts`;
    let params = [];

    if (authorId) {
        queryText += ' WHERE author_id = $1';
        params.push(authorId);
    }
    // TODO: Implementación de paginación (LIMIT/OFFSET).

    const result = await db.query(queryText, params);
    return result;
};

/**
 * Crea un nuevo post en la base de datos.
 * @param {object} postData - Objeto con título, contenido y author_id.
 * @returns {Promise<object>} El objeto del post creado.
 */
exports.createPost = async (postData) => {
    // TODO: Implementación de validaciones de inputs (title/content no vacío).
    // Debe verificar si el author_id existe antes de insertar (transaccionalmente es ideal).
    const queryText = `INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING id, title, content, author_id, published, created_at;`;
    // Asumimos que la validación de existencia de author_id se hace en el controlador o middleware.
    return db.query(queryText, [postData.title, postData.content, postData.authorId, postData.published]);
};

/**
 * Obtiene un post por su ID.
 */
exports.getPostById = async (id) => {
    const queryText = `SELECT id, title, content, author_id, published, created_at FROM posts WHERE id = $1;`;
    return db.query(queryText, [id]);
};

/**
 * Obtiene todos los posts de un autor específico (Autor-centric view).
 */
exports.getPostsByAuthor = async (authorId) => {
    // TODO: Simple SELECT filtrado por author_id. Debe ser robusto contra NULLs.
    const queryText = `SELECT id, title, content, author_id, published, created_at FROM posts WHERE author_id = $1 ORDER BY created_at DESC;`;
    return db.query(queryText, [authorId]);
};

/**
 * Actualiza el contenido de un post existente.
 */
exports.updatePost = async (id, updateData) => {
    // TODO: Implementar lógica para actualizar y validar la propiedad 'published' o cualquier otra que pueda afectar el estado del post.
    const queryText = `UPDATE posts SET title = $1, content = $2, published = $3 WHERE id = $4 RETURNING *;`;
    return db.query(queryText, [updateData.title, updateData.content, updateData.published, id]);
};

/**
 * Elimina un post por su ID. Debe considerar el impacto en comments (relación).
 */
exports.deletePost = async (id) => {
    // TODO: Simplemente ejecutar DELETE FROM posts WHERE id = $1;
    // Como definimos ON DELETE CASCADE para comentarios, solo necesitamos borrar aquí.
};