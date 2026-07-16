const db = require('../db/connection');

exports.getAllAuthors = async () => {
  const queryText = 'SELECT id, name, email, bio, created_at FROM authors ORDER BY created_at DESC;';
  return db.query(queryText);
};

exports.createAuthor = async (authorData) => {
  const queryText = 'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id, name, email, bio, created_at;';
  const rows = await db.query(queryText, [authorData.name, authorData.email, authorData.bio]);
  return rows[0];
};

exports.getAuthorById = async (id) => {
  const queryText = 'SELECT id, name, email, bio, created_at FROM authors WHERE id = $1;';
  const rows = await db.query(queryText, [id]);
  return rows[0] || null;
};

exports.updateAuthor = async (id, updateData) => {
  const allowedFields = ['name', 'email', 'bio'];
  const entries = Object.entries(updateData).filter(([key, value]) => allowedFields.includes(key) && value !== undefined);

  if (entries.length === 0) {
    return exports.getAuthorById(id);
  }

  const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
  const values = entries.map(([, value]) => value === '' ? null : value);
  values.push(id);

  const queryText = `UPDATE authors SET ${setClauses} WHERE id = $${entries.length + 1} RETURNING id, name, email, bio, created_at;`;
  const rows = await db.query(queryText, values);
  if (!rows[0]) {
    const error = new Error('Autor no encontrado');
    error.status = 404;
    throw error;
  }
  return rows[0];
};

exports.deleteAuthor = async (id) => {
  const queryText = 'DELETE FROM authors WHERE id = $1 RETURNING id;';
  const rows = await db.query(queryText, [id]);
  if (!rows[0]) {
    const error = new Error('Autor no encontrado');
    error.status = 404;
    throw error;
  }
};