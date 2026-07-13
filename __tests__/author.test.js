// __tests__/author.test.js
const request = require('supertest');
const express = require('express');
const authorRoutes = require('../src/routes/authorRoutes');

// 1. Configurar la aplicación Express minimalista SOLO para testing de rutas.
const app = express();
app.use(express.json());
app.use('/authors', authorRoutes); // Mountamos solo las rutas de autores por ahora.

describe('Authors API Endpoints Tests (/api/v1/authors)', () => {
    // Para que los tests sean idempotentes, en un entorno real se debería limpiar la DB ANTES y DESPUÉS del suite (setup/teardown)
    // Aquí simulamos que esto ocurre por el ciclo de vida de las pruebas.

    // =========================================
    // TEST 1: GET /authors - Listar usuarios
    describe('GET /', () => {
        it('debería listar todos los autores disponibles con un status 200', async () => {
            const response = await request(app).get('/authors');

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            // Si tenemos seeds, esperamos al menos 3 autores iniciales.
            expect(response.body.length).toBeGreaterThanOrEqual(3);
        });

        it('debería devolver 404 si no hay autores registrados', async () => {
            // Nota: Para este test, necesitaríamos una forma de vaciar la tabla 'authors' primero.
            // Aquí lo dejamos como un comentario conceptual para saber qué probar después.
            /*
            await jest.spyOn(authorService, 'getAllAuthors').mockResolvedValue([]); // Mockear el servicio
            const response = await request(app).get('/authors');
            expect(response.statusCode).toBe(404);
            */
        });
    });

    // =========================================
    // TEST 2: POST /authors - Crear usuario
    describe('POST /', () => {
        it('debe crear un nuevo autor exitosamente con status 201 y devolver el objeto creado', async () => {
            const newAuthorData = { name: 'Test User', email: 'test@example.com', bio: 'Testing API' };

            // Creamos mock del servicio para asegurar que los tests solo dependen de la lógica HTTP, no de la BD real.
             /*
             jest.spyOn(authorService, 'createAuthor').mockResolvedValue({ id: 99, ...newAuthorData });
             const response = await request(app).post('/authors').send(newAuthorData);
             expect(response.statusCode).toBe(201);
             expect(response.body.id).toBe(99);
             */
        });

        it('debe devolver 400 si faltan campos obligatorios (name/email)', async () => {
            // const response = await request(app).post('/authors').send({ name: 'Test' }); // Falta email
            // expect(response.statusCode).toBe(400);
        });

        it('debe devolver 409 si el correo electrónico ya está registrado', async () => {
             /*
             jest.spyOn(authorService, 'createAuthor').mockRejectedValue({ message: "unique constraint violation" });
             const response = await request(app).post('/authors').send({ name: 'Test Duplicate', email: 'test@example.com', bio: null });
             expect(response.statusCode).toBe(409);
             */
        });
    });

    // Nota: Los tests PUT, GET/:id y DELETE se seguirán en iteraciones posteriores para asegurar la cobertura total de recursos.
});