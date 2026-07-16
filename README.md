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

El contrato de la API está en [openapi.yaml](openapi.yaml) (formato OpenAPI 3.0.3).

Para visualizarla de forma interactiva (Swagger UI) sin instalar nada:

- Abre [https://editor.swagger.io](https://editor.swagger.io) y arrastra/pega el contenido de `openapi.yaml`, o
- Usa [Redoc](https://redocly.github.io/redoc/) apuntando al archivo.

Si prefieres levantarla localmente:

```bash
npx @redocly/cli preview-docs openapi.yaml
# o bien, con Swagger UI en un contenedor:
docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $PWD/openapi.yaml:/openapi.yaml swaggerapi/swagger-ui
```

## Despliegue en Railway

1. En el proyecto de Railway crea el servicio web desde el repositorio de GitHub (build con NIXPACKS, comando de inicio `npm start`).
2. Agrega un servicio de **PostgreSQL** (New → Database → PostgreSQL).
3. En el servicio web → **Variables**, enlaza la base de datos con una referencia:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (escribe `{{` y autocompleta).
   
   Railway también inyecta `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD` y `PGDATABASE`, pero la app prioriza `DATABASE_URL`.
4. Define además:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
5. El servidor crea las tablas y los datos iniciales automáticamente al arrancar (`src/config/initDb.js`), así que no hace falta correr `setup.sql`/`seed.sql` en producción.

**URLs de Railway**
- **Internal URL** (`*.railway.internal`): la usa la app para hablar con Postgres dentro de la misma red privada de Railway (es la que aparece en los logs como `host=...railway.internal`). Requiere SSL, que la app habilita sola cuando el host no es `localhost`.
- **Public URL** (dominio `*.up.railway.app` o el dominio personalizado que configures): es la que compartes para consumir la API desde fuera.

> Si el deploy crashea con `ECONNREFUSED ::1:5432` / `host=localhost`, significa que `DATABASE_URL` no está llegando al servicio web. Revisa el paso 3.

## Registro del uso de AI en el proyecto

Este proyecto fue desarrollado con asistencia de **Claude (Anthropic)** a través de Claude Code, usado como copiloto para:

- Diagnosticar y corregir el fallo de conexión a PostgreSQL en Railway (`ECONNREFUSED` por `DATABASE_URL` faltante y SSL requerido), centralizando la configuración de conexión en un único módulo.
- Diseñar la arquitectura en capas (routes → controllers → services → db) y mantener coherencia con el modelo de la consigna (authors / posts / comments).
- Garantizar integridad referencial (FK `comments → authors`, `comments → posts` en cascada, `posts → authors` con `RESTRICT`).
- Escribir y verificar los tests unitarios con Supertest + Vitest.
- Redactar la documentación (README, OpenAPI) y este registro de uso de AI.

La decisión final de cada implementación y la revisión del código quedaron a cargo del autor humano.

## Estructura del proyecto

- [index.js](index.js) → inicia el servidor y la base de datos
- [src/server.js](src/server.js) → configura Express
- [src/routes](src/routes) → define las rutas de la API
- [src/controllers](src/controllers) → maneja la lógica HTTP
- [src/services](src/services) → encapsula la lógica de negocio y SQL
- [src/config](src/config) → conecta con PostgreSQL y crea el esquema inicial
- [__tests__](__tests__) → pruebas HTTP con Supertest y Vitest