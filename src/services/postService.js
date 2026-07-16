const db = require('../db/connection');

exports.getAllPosts = async (authorId = null) => {
  let queryText = 'SELECT id, title, content, author_id, published, created_at FROM posts';
  const params = [];

  if (authorId) {
    queryText += ' WHERE author_id = $1';
    params.push(authorId);
  }

  queryText += ' ORDER BY id ASC';
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
  const queryText = `
    SELECT
      p.id, p.title, p.content, p.author_id, p.published, p.created_at,
      a.name  AS author_name,
      a.email AS author_email
    FROM posts p
    JOIN authors a ON a.id = p.author_id
    WHERE p.author_id = $1
    ORDER BY p.id ASC;
  `;
  const rows = await db.query(queryText, [authorId]);
  // Embebemos el detalle del autor en cada post para cumplir con la consigna
  // "posts con detalle de su author".
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content,
    author_id: r.author_id,
    published: r.published,
    created_at: r.created_at,
    author: {
      id: r.author_id,
      name: r.author_name,
      email: r.author_email,
    },
  }));
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