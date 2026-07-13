// src/routes/postRoutes.js
const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postController');

// 1. CRUD principales de Posts
postRouter.get('/', postController.getAllPosts); // GET /posts
postRouter.post('/', postController.createPost); // POST /posts
postRouter.get('/:id', postController.getPostById); // GET /posts/:id

// 2. Endpoints específicos por autor y comentarios (Extra Credit)
postRouter.get('/author/:authorId', postController.getPostsByAuthor);
postRouter.post('/:postId/comments', postController.createComment);
postRouter.get('/:id/comments', postController.listCommentsByPost); // GET /posts/:postId/comments

// Para simplificar el manejo de PUT/DELETE, por ahora usaremos los mismos routers que en authors si la lógica no varía mucho.
// PUT y DELETE se manejarán globalmente o se refactorizará para usar patrones genéricos (como hicimos con otros recursos).
// Por ahora, solo expongo las rutas clave: GET, POST, GET /author/:id, POST /comments.

module.exports = postRouter;