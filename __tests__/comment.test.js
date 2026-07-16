import request from 'supertest';
import express from 'express';
import { createRequire } from 'module';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const require = createRequire(import.meta.url);
const commentService = require('../src/services/commentService');
const postRoutes = require('../src/routes/postRoutes');

const app = express();
app.use(express.json());
app.use('/posts', postRoutes);

describe('Comments API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    commentService.createComment = vi.fn();
    commentService.listCommentsByPost = vi.fn();
  });

  it('debería devolver 400 si falta contenido o authorId', async () => {
    const response = await request(app).post('/posts/1/comments').send({ content: '' });

    expect(response.statusCode).toBe(400);
  });

  it('debería listar comentarios de un post con status 200', async () => {
    commentService.listCommentsByPost.mockResolvedValue([
      { id: 1, post_id: 1, author_id: 1, content: 'Comentario', created_at: '2024-01-01T00:00:00.000Z' }
    ]);

    const response = await request(app).get('/posts/1/comments');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});