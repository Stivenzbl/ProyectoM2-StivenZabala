const db = require('../db/connection');

exports.getAllPosts = async (authorId = null) => {
  let queryText = 'SELECT id, title, content, author_id, published, created_at FROM posts';
  const params = [];

  if (authorId) {
    queryText += ' WHERE author_id = $1';
    params.push(authorId);
  }

  queryText += ' ORDER BY created_at DESC';
  const rows = await db.query(queryText, params);
  return rows;
};

exports.createPost = async (postData) => {
  const queryText = 'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING id, title, content, author_id, published, created_at;';
  const rows = await db.query(queryText, [postData.title, postData.content, postData.authorId, postData.published]);
  return rows[0];
};

exports.getPostById = async (id) => {
  const queryText = 'SELECT id, title, content, author_id, published, created_at FROM posts WHERE id = $1;';
  const rows = await db.query(queryText, [id]);
  return rows[0] || null;
};

exports.getPostsByAuthor = async (authorId) => {
  const queryText = 'SELECT id, title, content, author_id, published, created_at FROM posts WHERE author_id = $1 ORDER BY created_at DESC;';
  return db.query(queryText, [authorId]);
};

exports.updatePost = async (id, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.title !== undefined) {
    fields.push('title = $1');
    values.push(updateData.title);
  }
  if (updateData.content !== undefined) {
    fields.push(`content = $${values.length + 1}`);
    values.push(updateData.content);
  }
  if (updateData.published !== undefined) {
    fields.push(`published = $${values.length + 1}`);
    values.push(updateData.published);
  }

  if (fields.length === 0) {
    return exports.getPostById(id);
  }

  values.push(id);
  const queryText = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING id, title, content, author_id, published, created_at;`;
  const rows = await db.query(queryText, values);
  if (!rows[0]) {
    const error = new Error('Post no encontrado');
    error.status = 404;
    throw error;
  }
  return rows[0];
};

exports.deletePost = async (id) => {
  const queryText = 'DELETE FROM posts WHERE id = $1 RETURNING id;';
  const rows = await db.query(queryText, [id]);
  if (!rows[0]) {
    const error = new Error('Post no encontrado');
    error.status = 404;
    throw error;
  }
};