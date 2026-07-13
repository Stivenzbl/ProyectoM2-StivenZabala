-- -----------------------------------------------
-- TABLE CREATION SCRIPT (SETUP)
-- Creamos las tablas de autores, posts y comentarios.
-- Usamos ON DELETE CASCADE para mantener la integridad referencial simple,
-- pero hay que considerar si el negocio requiere un comportamiento más complejo
-- en ciertos niveles (ej. solo anular FKs).

-- 1. Tabla Authors
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla Posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT -- Usamos RESTRICT para forzar la eliminación de posts antes que el author.
);

-- 3. Tabla Comments (Extra Credit)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE -- Si borramos un post, los comentarios desaparecen.
);

-- Índice sugerido para mejorar búsquedas por autor/post
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_comments_post_id ON comments (post_id);