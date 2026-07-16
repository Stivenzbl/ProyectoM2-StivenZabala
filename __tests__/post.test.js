import request from 'supertest';
import express from 'express';
import { createRequire } from 'module';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const require = createRequire(import.meta.url);
const postService = require('../src/services/postService');
const commentService = require('../src/services/commentService');
const postRoutes = require('../src/routes/postRoutes');

const app = express();
app.use(express.json());
app.use('/posts', postRoutes);

describe('Posts API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postService.getAllPosts = vi.fn();
    postService.getPostById = vi.fn();
    postService.createPost = vi.fn();
    postService.getPostsByAuthor = vi.fn();
    postService.updatePost = vi.fn();
    postService.deletePost = vi.fn();
    commentService.createComment = vi.fn();
    commentService.listCommentsByPost = vi.fn();
  });

  it('debería listar posts con status 200', async () => {
    postService.getAllPosts.mockResolvedValue([
      { id: 1, title: 'Hola', content: 'Contenido', author_id: 1, published: true, created_at: '2024-01-01T00:00:00.000Z' }
    ]);

    const response = await request(app).get('/posts');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería crear un post con status 201', async () => {
    const payload = { title: 'Nuevo post', content: 'Contenido del post', authorId: 1, published: true };
    postService.createPost.mockResolvedValue({ id: 10, ...payload, created_at: '2024-01-01T00:00:00.000Z' });

    const response = await request(app).post('/posts').send(payload);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(10);
  });

  it('debería devolver 400 si faltan datos obligatorios', async () => {
    const response = await request(app).post('/posts').send({ title: 'Falta contenido' });

    expect(response.statusCode).toBe(400);
  });

  it('debería listar posts por autor con status 200', async () => {
    postService.getPostsByAuthor.mockResolvedValue([
      { id: 2, title: 'Post de autor', content: 'Contenido', author_id: 1, published: true, created_at: '2024-01-01T00:00:00.000Z' }
    ]);

    const response = await request(app).get('/posts/author/1');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('debería crear un comentario con status 201', async () => {
    commentService.createComment.mockResolvedValue({ id: 1, post_id: 1, author_id: 1, content: 'Muy bueno', created_at: '2024-01-01T00:00:00.000Z' });

    const response = await request(app).post('/posts/1/comments').send({ authorId: 1, content: 'Muy bueno' });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Comentario publicado exitosamente.');
  });
});