// src/routes/authorRoutes.js
const express = require('express');
const authorRouter = express.Router();
const authorController = require('../controllers/authorController');

// Usamos el router para expobar todas las rutas de autores en un solo lugar
authorRouter.get('/', authorController.getAllAuthors);
authorRouter.post('/', authorController.createAuthor);
authorRouter.get('/:id', authorController.getAuthorById);
authorRouter.put('/:id', authorController.updateAuthor);
authorRouter.delete('/:id', authorController.deleteAuthor);

module.exports = authorRouter;