-- -----------------------------------------------
-- DATA SEED SCRIPT (SEED)
-- Inserta datos iniciales de ejemplo para hacer prueba los endpoints CRUD inmediatamente después del setup.

BEGIN;

-- 1. Seed Authors (Users) - Se insertan primero para que sean referenciables por FKs
INSERT INTO authors (name, email, bio) VALUES
('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST');

-- Obtenemos los IDs para asegurar que las inserciones siguientes son correctas
WITH author_ids AS (
    SELECT email, id FROM authors WHERE name IN ('Ana García', 'Carlos Ruiz', 'María López')
)
INSERT INTO posts (title, content, author_id, published) VALUES
('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', (SELECT id FROM author_ids WHERE email = 'ana@example.com'), TRUE),
('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', (SELECT id FROM author_ids WHERE email = 'carlos@example.com'), TRUE),
('APIs RESTful', 'REST es un estilo arquitectónico...', (SELECT id FROM author_ids WHERE email = 'ana@example.com'), TRUE),
('Manejo de errores en Express', 'El manejo apropiado de errores...', (SELECT id FROM author_ids WHERE email = 'maria@example.com'), FALSE),
('Async/Await explicado', 'Las promesas simplifican el código asíncrono...', (SELECT id FROM author_ids WHERE email = 'ana@example.com'), FALSE);

-- 2. Seed Comments (Extra Credit)
INSERT INTO comments (post_id, author_id, content) VALUES
(
    (SELECT id FROM posts JOIN authors ON posts.author_id = authors.id WHERE title = 'Introducción a Node.js' LIMIT 1), -- Post 1 ID
    (SELECT id FROM author_ids WHERE email = 'carlos@example.com'), -- Autor 2 ID
    'Buen resumen, pero faltó mencionar el soporte para Web Workers.'
),
(
    (SELECT id FROM posts JOIN authors ON posts.author_id = authors.id WHERE title = 'APIs RESTful' LIMIT 1), -- Post 3 ID
    (SELECT id FROM author_ids WHERE email = 'maria@example.com'), -- Autor 3 ID
    'Muy cierto, y aquí es donde la estandarización ayuda muchísimo.'
);

COMMIT;