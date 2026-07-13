# MiniBlog API - Backend Service

## 🎯 Descripción del Proyecto

La MiniBlog API es un servicio RESTful backend desarrollado en **Node.js y Express** para gestionar el contenido principal de la plataforma Miniblog, incluyendo usuarios (authors), publicaciones (posts) y comentarios asociados. Su propósito es proporcionar una capa de datos estable y validada que sirva como base de consumo para los prototipos frontend existentes.

El diseño sigue las mejores prácticas de arquitectura limpia: la lógica de negocio reside en **Services**, la gestión HTTP en **Controllers**, y el acceso a datos está encapsulado en la capa de conexión DB.

## 🚀 Requisitos Previos

Antes de ejecutar la aplicación, debes asegurarte de tener instalado lo siguiente:
1.  **Node.js:** Versión LTS (Se recomienda v18+).
2.  **PostgreSQL Server:** El servidor debe estar corriendo localmente en `localhost:5432`.
3.  **Dependencias del proyecto:**

```bash
npm install
# Se requiere la librería 'dotenv' para cargar las credenciales de entorno.
```

## ⚙️ Configuración Inicial (Setup)

Este proceso inicializa la base de datos con el esquema necesario y carga los datos semilla de ejemplo. **Debe ejecutarse una única vez.**

1.  **Crear Variables de Entorno:** Copia el contenido de `.env.example` a un archivo llamado `.env` en la raíz del proyecto:
    ```bash
    cp .env.example .env
    ```
2.  **Editar `.env`:** Modifica las credenciales (`PG_USER`, `PG_PASSWORD`, etc.) con tus datos de PostgreSQL.

3.  **Ejecutar Setup y Seed (Script SQL):** Para inicializar la base de datos:
    *   Abre tu cliente de PostgreSQL (ej: `psql`).
    *   Conéctate a la base de datos `miniblog_db`.
    *   Ejecuta los scripts en el orden correcto:

    ```sql
    -- 1. Crear Esquema (Authores, Posts, Comments)
    \i src/db/migrations/setup.sql;
    
    -- 2. Insertar Datos de Ejemplo
    \i src/db/migrations/seed.sql;
    ```

## ▶️ Ejecución Local del Servidor

Una vez configurada la DB y las credenciales, puedes iniciar el servidor:

```bash
npm run dev
# O si se usa el script directo: node index.js
```
El servidor debería responder en `http://localhost:3000` con el mensaje "MiniBlog API - Backend funcionando correctamente".

## 🧪 Ejecución de Tests Unitarios

Para verificar la lógica del backend sin afectar la base de datos, los tests están escritos usando Supertest y vitest. **Nota:** Estos tests asumen que se ejecuta un *mock* del servicio para aislar la capa HTTP.

```bash
npx vitest run
# O según el script 'test' definido en package.json
```

## 🌐 Documentación API (OpenAPI)

El contrato de la API está generado y detallado en `openapi.yaml`. Se recomienda utilizar esta especificación para generar documentación interactiva con Swagger UI.

**Consulta la estructura completa aquí:** [`openapi.yaml`](./openapi.yaml)

## ☁️ Guía de Deployment en Railway

Para desplegar este servicio en un entorno productivo como Railway, debes seguir estos pasos:

1.  **Configuración del Servicio:**
    *   Conecta el servicio a tu base de datos PostgreSQL externa.
    *   Crea las siguientes **Variables de Entorno** y asegúrate que los valores son permanentes y seguros:
        ```bash
        PG_HOST=<Host de Railway DB>
        PG_PORT=5432
        PG_USER=<Usuario de la DB>
        PG_PASSWORD=<Contraseña Secreta de la DB>
        PG_DATABASE=miniblog_db
        PORT=3000 # Debe coincidir con el puerto configurado en index.js
        NODE_ENV=production # Es vital establecerlo a production
        ```

2.  **Configuración del Script de Arranque:**
    *   En `package.json`, asegúrate que el script de *start* apunte correctamente:
      `"start": "node index.js"` (o similar, sin ejecutar la lógica de setup/seed).

3.  **Migraciones en Producción:** **¡CRÍTICO!** En un entorno real, nunca se debe incluir `setup.sql` o `seed.sql` directamente al arrancar el servidor. Se debe usar una herramienta dedicada de migraciones (ej: Knex, TypeORM) que corra *antes* del inicio HTTP, garantizando transaccionalmente la creación de tablas y la carga inicial de datos.

## 🧠 Uso de IA en el Proyecto

Se utilizó Claude Code como soporte principal para:
1.  Diseño arquitectónico modular (separación Controller/Service).
2.  Generación de patrones de código estándar (CRUD, middleware de manejo de errores).
3.  Creación y estandarización del contrato OpenAPI.

---
***Este entregable está listo para ser versionado en GitHub.* ---