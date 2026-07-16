const { pool } = require("./dbConnect");

const initializateDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS authors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      bio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      published BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `)

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts (author_id)`)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id)`)

  // Garantiza la integridad referencial comments -> authors de forma idempotente.
  // (En el esquema inicial nos faltó esta FK; este bloque la agrega si no existe,
  // sin romper despliegues ya existentes). Al borrar un autor se eliminan en
  // cascada sus comentarios; los posts usan ON DELETE RESTRICT (arriba).
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_comments_author' AND table_name = 'comments'
      ) THEN
        ALTER TABLE comments
          ADD CONSTRAINT fk_comments_author
          FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `)

  await pool.query(`
    INSERT INTO authors (name, email, bio)
    SELECT 'Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'
    WHERE NOT EXISTS (SELECT 1 FROM authors WHERE email = 'ana@example.com')
  `)

  await pool.query(`
    INSERT INTO authors (name, email, bio)
    SELECT 'Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'
    WHERE NOT EXISTS (SELECT 1 FROM authors WHERE email = 'carlos@example.com')
  `)

  await pool.query(`
    INSERT INTO authors (name, email, bio)
    SELECT 'María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST'
    WHERE NOT EXISTS (SELECT 1 FROM authors WHERE email = 'maria@example.com')
  `)

  await pool.query(`
    INSERT INTO posts (title, content, author_id, published)
    SELECT 'Introducción a Node.js', 'Node.js es un runtime de JavaScript...', author.id, TRUE
    FROM authors author
    WHERE author.email = 'ana@example.com'
      AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'Introducción a Node.js')
  `)

  await pool.query(`
    INSERT INTO posts (title, content, author_id, published)
    SELECT 'PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', author.id, TRUE
    FROM authors author
    WHERE author.email = 'carlos@example.com'
      AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'PostgreSQL vs MySQL')
  `)

  await pool.query(`
    INSERT INTO posts (title, content, author_id, published)
    SELECT 'APIs RESTful', 'REST es un estilo arquitectónico...', author.id, TRUE
    FROM authors author
    WHERE author.email = 'ana@example.com'
      AND NOT EXISTS (SELECT 1 FROM posts WHERE title = 'APIs RESTful')
  `)

  await pool.query(`
    INSERT INTO comments (post_id, author_id, content)
    SELECT post.id, author.id, 'Buen resumen, pero faltó mencionar el soporte para Web Workers.'
    FROM posts post
    JOIN authors author ON author.email = 'carlos@example.com'
    WHERE post.title = 'Introducción a Node.js'
      AND NOT EXISTS (SELECT 1 FROM comments WHERE content = 'Buen resumen, pero faltó mencionar el soporte para Web Workers.')
  `)
}

module.exports = {
  initializateDatabase
}