# MiniBlog API

## Descripción

Esta API REST construida con Node.js y Express permite gestionar autores, posts y comentarios de una plataforma tipo blog. El proyecto sigue una estructura modular con rutas, controladores, servicios y acceso a PostgreSQL.

## Requisitos

- Node.js 18 o superior
- PostgreSQL en ejecución
- npm

## Instalación

1. Clona el repositorio y entra a la carpeta del proyecto.
2. Instala las dependencias:

```bash
npm install
```

3. Copia el archivo de ejemplo de variables de entorno:

```bash
copy .env.example .env
```

4. Ajusta los valores de conexión en el archivo `.env`.

## Variables de entorno

El proyecto acepta estas variables:

```env
PORT=3000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=miniblog_db
PG_USER=postgres
PG_PASSWORD=postgres
DB_MAX_CONNECT=10
DB_IDLETIMEOUT=10000
DB_CONNECTIONTIMEOUT=5000
```

> El servidor también soporta nombres alternativos como `DB_HOST`, `DB_NAME` y `DB_PASSWORD`, pero se recomienda usar `PG_*`.

## Ejecución local

Inicia la API con:

```bash
npm run dev
```

La aplicación levantará el servidor en el puerto configurado y, al arrancar, creará automáticamente las tablas necesarias y insertará datos iniciales si aún no existen.

## Endpoints principales

- `GET /` → confirma que el servidor está activo
- `GET /authors` → lista autores
- `POST /authors` → crea un autor
- `GET /authors/:id` → obtiene un autor
- `PUT /authors/:id` → actualiza un autor
- `DELETE /authors/:id` → elimina un autor
- `GET /posts` → lista posts
- `POST /posts` → crea un post
- `GET /posts/author/:authorId` → lista posts por autor
- `GET /posts/:id` → obtiene un post con sus comentarios
- `POST /posts/:postId/comments` → crea un comentario
- `GET /posts/:postId/comments` → lista comentarios de un post
- `PUT /posts/:id` → actualiza un post
- `DELETE /posts/:id` → elimina un post

## Pruebas

Ejecuta la suite de pruebas con:

```bash
npm test
```

## Documentación OpenAPI

El contrato de la API está en [openapi.yaml](openapi.yaml).

## Despliegue en Railway

Para desplegar en Railway:

1. Agrega una base de datos PostgreSQL y anexa las variables de entorno correspondientes.
2. Define `PORT` y `NODE_ENV=production`.
3. Usa `npm start` como comando de inicio.
4. Asegura que la base de datos esté accesible desde la instancia desplegada.

## Estructura del proyecto

- [index.js](index.js) → inicia el servidor y la base de datos
- [src/server.js](src/server.js) → configura Express
- [src/routes](src/routes) → define las rutas de la API
- [src/controllers](src/controllers) → maneja la lógica HTTP
- [src/services](src/services) → encapsula la lógica de negocio y SQL
- [src/config](src/config) → conecta con PostgreSQL y crea el esquema inicial
- [__tests__](__tests__) → pruebas HTTP con Supertest y Vitest