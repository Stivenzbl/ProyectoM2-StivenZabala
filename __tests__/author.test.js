import request from 'supertest';
import express from 'express';
import { createRequire } from 'module';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const require = createRequire(import.meta.url);
const authorService = require('../src/services/authorService');
const authorRoutes = require('../src/routes/authorRoutes');

const app = express();
app.use(express.json());
app.use('/authors', authorRoutes);

describe('Authors API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorService.getAllAuthors = vi.fn();
    authorService.getAuthorById = vi.fn();
    authorService.createAuthor = vi.fn();
    authorService.updateAuthor = vi.fn();
    authorService.deleteAuthor = vi.fn();
  });

  it('debería listar autores con status 200', async () => {
    authorService.getAllAuthors.mockResolvedValue([
      { id: 1, name: 'Ana', email: 'ana@example.com', bio: 'Bio', created_at: '2024-01-01T00:00:00.000Z' }
    ]);

    const response = await request(app).get('/authors');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].name).toBe('Ana');
  });

  it('debería crear un autor con status 201', async () => {
    const payload = { name: 'Test User', email: 'test@example.com', bio: 'Testing API' };
    authorService.createAuthor.mockResolvedValue({ id: 99, ...payload, created_at: '2024-01-01T00:00:00.000Z' });

    const response = await request(app).post('/authors').send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(99);
  });

  it('debería devolver 400 si faltan datos obligatorios', async () => {
    const response = await request(app).post('/authors').send({ name: 'Test User' });

    expect(response.statusCode).toBe(400);
  });
});