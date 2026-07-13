// src/controllers/postController.js
/**
 * @module postController
 * Maneja la lógica de las rutas HTTP para los posts y comentarios relacionados.
 */
const express = require('express');
const router = express.Router();
const postService = require('../services/postService');
const commentService = require('../services/commentService');

// --- Posts Endpoints ---

/**
 * GET /posts - Listar todos los posts (puedo agregar paginación y filtros en el futuro).
 */
router.get('/', async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error al listar posts:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la lista de posts." });
    }
});

/**
 * POST /posts - Crear un nuevo post.
 */
router.post('/', async (req, res) => {
    const { title, content, authorId, published } = req.body;

    if (!title || !content || !authorId) {
        return res.status(400).json({ message: "Título, contenido y autor_id son campos obligatorios." });
    }

    try {
        // Aquí se podría agregar un middleware para validar que authorId exista antes de llamar al servicio.
        const newPost = await postService.createPost({ title, content, authorId, published: !!published }); // Aseguramos booleanos
        res.status(201).json(newPost);
    } catch (error) {
        // Manejo de errores comunes de la DB (ej: FK constraint violation)
        console.error("Error al crear post:", error);
        res.status(500).json({ message: `No se pudo crear el post. Asegúrate de que author_id (${authorId}) sea válido.` });
    }
});

/**
 * GET /posts/:id - Obtener detalle completo de un post (incluyendo comentarios si aplica).
 */
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        // 1. Obtener el Post base
        const post = await postService.getPostById(postId);

        if (!post) {
            return res.status(404).json({ message: `Post con ID ${postId} no encontrado.` });
        }

        // 2. Obtener los comentarios asociados (Combinando datos en el controlador/respuesta)
        const comments = await commentService.listCommentsByPost(postId);

        res.status(200).json({
            post, // El post principal
            comments: comments // La lista de comentarios
        });

    } catch (error) {
        console.error("Error al obtener post:", error);
        res.status(500).json({ message: "Error interno del servidor al recuperar el post y sus comentarios." });
    }
});


// --- Author-centric Endpoints ---

/**
 * GET /posts/author/:authorId - Obtener todos los posts de un autor específico.
 */
router.get('/author/:authorId', async (req, res) => {
    const authorId = req.params.authorId;
    try {
        const posts = await postService.getPostsByAuthor(authorId);

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: `No se encontraron publicaciones para el autor con ID ${authorId}.` });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error al obtener posts por autor:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

/**
 * POST /posts/:postId/comments - Crear un comentario para el post.
 */
router.post('/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    const { authorId, content } = req.body;

    if (!authorId || !content) {
        return res.status(400).json({ message: "Author ID y contenido son obligatorios para comentar." });
    }

    try {
        // Validaciones: Deberíamos verificar si el post y el autor existen antes de intentar insertar.
        await commentService.createComment(postId, authorId, content);
        return res.status(201).json({ message: "Comentario publicado exitosamente." });
    } catch (error) {
        console.error("Error al comentar:", error);
        // Nota: El servicio de comentario debe manejar explícitamente la verificación de FKs faltantes.
        res.status(500).json({ message: `No se pudo publicar el comentario: ${error.message}` });
    }
});

/**
 * PUT /posts/:id - Actualizar post. (Se puede hacer aquí, pero es más limpio hacerlo en servicios y llamarlo desde el controlador principal)
 */
// Los endpoints de PUT/DELETE para posts seguirán la misma lógica que los de authors,
// por lo que se mantendrán los placeholders o serán refactorizados a partir del postController.js.

module.exports = router;