// src/controllers/authorController.js
/**
 * @module authorController
 * Maneja la lógica de las rutas HTTP para los autores (authors).
 */
const express = require('express');
const router = express.Router();
const authorService = require('../services/authorService');

// Middleware simple para validar si el ID existe o si el body es válido
// (En un entorno real, esto se manejaría con librerías como Joi)

/**
 * GET /authors - Listar todos los autores.
 */
router.get('/', async (req, res) => {
    try {
        const authors = await authorService.getAllAuthors();
        if (!authors || authors.length === 0) {
            return res.status(404).json({ message: "No se encontraron autores." });
        }
        res.status(200).json(authors);
    } catch (error) {
        console.error("Error al listar autores:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la lista de autores." });
    }
});

/**
 * POST /authors - Crear un nuevo autor.
 */
router.post('/', async (req, res) => {
    const { name, email, bio } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Nombre y correo electrónico son campos obligatorios." });
    }

    try {
        // Intentar crear el autor (el servicio debe manejar la validación de email único)
        const newAuthor = await authorService.createAuthor({ name, email, bio || null });
        res.status(201).json(newAuthor); // 201 Created
    } catch (error) {
        // Manejo específico para errores de unicidad de email o DB.
        if (error.message.includes("unique constraint")) {
            return res.status(409).json({ message: "Error: Este correo electrónico ya está registrado." });
        }
        console.error("Error al crear autor:", error);
        res.status(500).json({ message: "No fue posible crear el autor debido a un error interno de la base de datos." });
    }
});

/**
 * GET /authors/:id - Obtener detalle de usuario.
 */
router.get('/:id', async (req, res) => {
    try {
        const author = await authorService.getAuthorById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: `Autor con ID ${req.params.id} no encontrado.` });
        }
        res.status(200).json(author);
    } catch (error) {
        console.error("Error al obtener autor:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

/**
 * PUT /authors/:id - Actualizar la información de un autor.
 */
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    // 1. Verificar existencia del recurso primero (usando el servicio)
    try {
        await authorService.getAuthorById(id); // Esto fallará con 404 si no existe, lo que podemos adaptar en la capa de controlador/middleware.
    } catch (e) {
         // Asumimos que el servicio lanza un error o null si no existe para manejarlo aquí.
        if (!e.message.includes("no records found")) return res.status(404).json({ message: `Autor con ID ${id} no encontrado.` });
    }

    try {
        // Intentar actualizar (el servicio maneja la validación de unicidad y los campos nulos)
        const updatedAuthor = await authorService.updateAuthor(id, updateData);
        res.status(200).json(updatedAuthor);
    } catch (error) {
        // Manejo genérico de errores de actualización
        if (error.message.includes("unique constraint")) {
            return res.status(409).json({ message: "Error al actualizar: El correo electrónico ya está en uso." });
        }
         console.error("Error al actualizar autor:", error);
        res.status(500).json({ message: `No se pudo actualizar el autor, ${error.message}` });
    }
});

/**
 * DELETE /authors/:id - Eliminar un autor por ID.
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await authorService.deleteAuthor(id);
        // Devolvemos 204 No Content en caso de éxito sin contenido
        res.status(204).send();
    } catch (error) {
        if (error.message.includes("fk constraint")) {
            return res.status(409).json({ message: "No se puede eliminar al autor porque aún tiene publicaciones o comentarios asociados." });
        }
        console.error("Error al borrar autor:", error);
        res.status(500).json({ message: `Error interno del servidor: ${error.message}` });
    }
});

module.exports = router;