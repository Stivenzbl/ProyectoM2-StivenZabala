const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/postController');

postRouter.get('/', postController.getAllPosts);
postRouter.post('/', postController.createPost);
postRouter.get('/author/:authorId', postController.getPostsByAuthor);
postRouter.post('/:postId/comments', postController.createComment);
postRouter.get('/:postId/comments', postController.listCommentsByPost);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);

module.exports = postRouter;