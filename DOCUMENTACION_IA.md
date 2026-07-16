# Documentación del uso de Inteligencia Artificial en el proyecto FT76 (MiniBlog API)

> Este documento registra de forma transparente cómo se utilizó Inteligencia
> Artificial en el desarrollo de la **MiniBlog API** (proyecto FT76). Su objetivo
> es cumplir con el requisito de documentación de IA y dejar claro qué partes
> fueron asistidas por IA y qué partes quedaron bajo responsabilidad humana.

---

## 1. Propósito de este documento

- Dejar constancia del uso de herramientas de IA generativa en el proyecto.
- Explicar **qué** se delegó, **cómo** se usó y **bajo qué supervisión**.
- Servir como referencia para docentes/evaluadores y para futuros mantenedores.
- Explicitar limitaciones y el rol de la revisión humana.

---

## 2. Herramientas de IA utilizadas

| Herramienta | Proveedor | Rol en el proyecto |
| --- | --- | --- |
| **Claude** (modelo de la familia Claude Opus, Anthropic) | Anthropic | Generación de código, explicaciones y redacción. |
| **Claude Code** (CLI de agente de Anthropic) | Anthropic | Asistente en bucle: lee el repositorio, propone y aplica cambios, corre comandos y ejecuta pruebas. |

No se utilizaron otros modelos de IA para la lógica del producto (la API en sí
**no** integra LLMs ni genera contenido con IA; la IA se usó solo como apoyo de
ingeniería).

---

## 3. Alcance de la asistencia de IA

Claude/Claude Code actuó como **copiloto de desarrollo**. Las áreas donde
aportó fueron:

1. **Arquitectura y estructura del proyecto**
   - Definición de la arquitectura en capas: `routes → controllers → services → db`.
   - Coherencia con el modelo de la consigna (autores / posts / comentarios).

2. **Implementación de la API REST**
   - Endpoints CRUD para `authors`, `posts` y `comments`.
   - Manejo de errores HTTP (400, 404, 409, 500) y validaciones de entrada.

3. **Conexión a base de datos y despliegue**
   - Diagnóstico y corrección del fallo `ECONNREFUSED` al conectar PostgreSQL en
     Railway (variable `DATABASE_URL` faltante y requisito de SSL).
   - Centralización de la configuración de conexión en un único módulo
     (`src/config/dbConnect.js`) con detección automática de entorno (local vs. nube).
   - Creación automática de esquema y datos iniciales al arrancar (`src/config/initDb.js`),
     evitando correr `setup.sql`/`seed.sql` a mano en producción.

4. **Integridad referencial**
   - Definición de claves foráneas: `comments → posts` (CASCADE), `comments → authors`
     (CASCADE) y `posts → authors` (RESTRICT).

5. **Documentación de la API (OpenAPI / Swagger)**
   - Redacción del contrato `openapi.yaml` (OpenAPI 3.0.3) con esquemas y respuestas.
   - Integración de **Swagger UI en la propia API** (ruta `/docs` mediante
     `swagger-ui-express`), de modo que la documentación —incluida la URL de
     despliegue de Railway como `server`— queda servida en vivo.

6. **Pruebas automatizadas**
   - Tests HTTP con **Supertest + Vitest** (`__tests__/`, `src/test/`).

7. **Documentación del proyecto**
   - `README.md` y este documento de uso de IA.

---

## 4. Flujo de trabajo

El trabajo se realizó de forma iterativa y conversacional:

1. El humano planteaba una necesidad o problema (por ejemplo: *"la API no
   conecta en Railway"*, *"agregá documentación Swagger"*).
2. Claude Code inspeccionaba el estado real del repositorio (archivos, rutas,
   configuración) antes de proponer cambios.
3. Se generaba el código o la documentación y, cuando era pertinente, se
   verificaba con comandos (arranque de la API, `GET /docs`, ejecución de tests).
4. El humano revisaba, pedía ajustes y tomaba la decisión final de integrar los
   cambios y desplegar.

> Principio: la IA proponía; el humano decidía y validaba.

---

## 5. Ejemplos de interacciones (resumidas)

Para ilustrar el uso sin reproducir conversaciones completas:

- *"Diagnosticá por qué falla la conexión a PostgreSQL en Railway"* → se
  identificó que `DATABASE_URL` no llegaba al servicio web y que se requería SSL;
  se centralizó la configuración y se habilitó SSL automático fuera de `localhost`.
- *"Hacé que la API sirva Swagger UI"* → se agregó `swagger-ui-express` + `js-yaml`,
  se montó `/docs` en `src/server.js` y se actualizó el README.
- *"Escribí tests para los endpoints"* → se crearon pruebas con Supertest sobre
  el servidor Express.
- *"Documentá el uso de IA"* → se generó este archivo.

---

## 6. Supervisión y responsabilidad humana

- **Revisión de código:** todo lo generado por IA fue leído y validado por el
  autor humano antes de integrarse.
- **Decisiones finales:** la arquitectura, las dependencias y el despliegue
  fueron aprobados por el humano.
- **Verificación:** se ejecutaron las pruebas (`npm test`) y se comprobó que
  `/docs` responde correctamente antes de considerar la tarea terminada.
- **Seguridad:** las credenciales viven en `.env` (ignorado por git) y no se
  incluyeron en la documentación ni en el repositorio.

---

## 7. Limitaciones y consideraciones

- La IA puede cometer errores o proponer código que no compila; por eso toda
  salida fue verificada.
- El contenido semántico del blog (posts/comentarios) es de ejemplo y fue
  definido por el equipo, no generado por IA en runtime.
- El uso de IA no exime de entender el código: la responsabilidad final del
  funcionamiento y de la entrega es del autor humano.

---

## 8. Conclusión

La Inteligencia Artificial (Claude a través de Claude Code) aceleró el
desarrollo de la MiniBlog API actuando como copiloto en arquitectura, debugging
de despliegue, documentación y pruebas. El resultado es un proyecto coherente,
documentado y desplegable, con la decisión y la revisión final a cargo del
autor humano.
