// src/services/commentService.js

const db = require('../db/connection');

/**
 * Crea un nuevo comentario para un post existente.
 * @param {string} postId - ID del post al que se adjunta el comentario.
 * @param {string} authorId - ID del autor que comenta (para rastreo).
 * @param {string} content - El contenido del comentario.
 * @returns {Promise<object>} El objeto del comentario creado.
 */
exports.createComment = async (postId, authorId, content) => {
    // TODO: Implementar validaciones: postId debe existir y authorId debe existir.
    const queryText = `INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING id, post_id, author_id, content, created_at;`;
    // Se asume que la verificación de existencia de postId y authorId se maneja en la capa superior.
    return db.query(queryText, [postId, authorId, content]);
};

/**
 * Lista todos los comentarios asociados a un post específico.
 * @param {string} postId - ID del post.
 */
exports.listCommentsByPost = async (postId) => {
    // TODO: Devolver una lista de comentarios para el post dado.
    const queryText = `SELECT id, author_id, content, created_at FROM comments WHERE post_id = $1 ORDER BY created_at ASC;`;
    return db.query(queryText, [postId]);
};

/**
 * Opción avanzada: Obtener el contenido completo de un post incluyendo sus comentarios más recientes.
 */
exports.getFullPostWithComments = async (postId) => {
    // TODO: Implementar una consulta compleja que use JOINs para obtener el post y la lista de comments en una sola petición, o dos peticiones separadas.
};