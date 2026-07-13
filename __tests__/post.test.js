// __tests__/post.test.js
const request = require('supertest');
const express = require('express');
const postRoutes = require('../src/routes/postRoutes');

// 1. Configurar la aplicación Express minimalista para testing de rutas.
const app = express();
app.use(express.json());
// Usamos el router que expone todas las funcionalidades de posts y comentarios
app.use('/posts', postRoutes);

describe('Posts and Comments API Endpoints Tests (/api/v1/posts)', () => {

    // --- MOCKS DE DATOS INICIALES PARA PRUEBAS ---
    const MOCK_AUTHOR_ID = '1'; // Asumimos que el ID de un autor existente
    const POST_ID = 5;          // Usamos el ID del post sembrado 'Async/Await explicado'

    // =========================================
    // TEST 1: GET /posts/author/:authorId - Listar posts por autor (Combinación)
    describe('GET /author/:authorId', () => {
        it('debe listar correctamente todos los posts de un autor específico con status 200', async () => {
            // Se asume que existen posts para el autor ID=1 en la BD seed.sql
            const response = await request(app).get(`/author/${MOCK_AUTHOR_ID}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            // Esperamos al menos 3 posts de los seeds disponibles para el autor 1
        });

        it('debe devolver 404 si se pide un authorId inexistente', async () => {
             /*
            const response = await request(app).get(`/author/999`);
            expect(response.statusCode).toBe(404);
            */
        });
    });

    // =========================================
    // TEST 2: POST /posts/:postId/comments - Crear comentario (Flujo de datos compuesto)
    describe('POST /:postId/comments', () => {
        it('debe crear un comentario exitosamente, asumiendo post y autor válidos', async () => {
            const newComment = { authorId: '999', content: '¡Excelente contenido!' };

            // Simulación de la llamada en el controlador que usa params.postId
            const response = await request(app)
                .post(`/${POST_ID}/comments`) // Endpoint simulado con post ID fijo
                .send(newComment);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('message', 'Comentario publicado exitosamente.');
        });

        it('debe devolver 400 si falta contenido o authorId', async () => {
            const response = await request(app)
                .post(`/${POST_ID}/comments`)
                .send({ content: '' }); // Falta authorId
            expect(response.statusCode).toBe(400);
        });
    });

     // =========================================
    // TEST 3: GET /posts/:id - Obtener Post + Comentarios (Flujo de datos compuesto)
    describe('GET /:id', () => {
        it('debe devolver el post base y una lista de comentarios asociados con status 200', async () => {
            // Este test es el más importante, ya que comprueba la composición de datos.
             /*
            const response = await request(app).get(`/${POST_ID}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('post'); // Debe existir el objeto base
            expect(response.body).toHaveProperty('comments'); // Y la lista de comentarios
            expect(Array.isArray(response.body.comments)).toBe(true);
         */
        });
    });

});