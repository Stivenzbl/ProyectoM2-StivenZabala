const db = require('../db/connection');

exports.createComment = async (postId, authorId, content) => {
  const queryText = 'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING id, post_id, author_id, content, created_at;';
  const rows = await db.query(queryText, [postId, authorId, content]);
  return rows[0];
};

exports.listCommentsByPost = async (postId) => {
  const queryText = 'SELECT id, author_id, content, created_at FROM comments WHERE post_id = $1 ORDER BY id ASC;';
  return db.query(queryText, [postId]);
};