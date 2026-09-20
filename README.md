<h1 align="center">🛒 E-commerce REST API</h1>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge&logo=typeorm&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<p align="center">
  API REST de backend para una plataforma de e-commerce, construida con NestJS. Implementa autenticación JWT, control de roles, transacciones atómicas con idempotencia en el checkout, carga de imágenes a Cloudinary y despliegue con Docker en Render.
</p>

---

## ✨ Características principales

| Área | Detalle |
|---|---|
| **Autenticación** | Registro y login con JWT de corta duración (15 min) y hashing con bcrypt |
| **Control de acceso** | Sistema de roles `user` / `admin` con guards de NestJS |
| **Checkout transaccional** | Transacción atómica con bloqueo pesimista de filas (`SELECT FOR UPDATE`) y descuento de stock |
| **Idempotencia** | Header `Idempotency-Key` en el checkout: reintentos seguros sin duplicar órdenes ni descontar stock dos veces |
| **Carga de imágenes** | Upload de imágenes (JPG, PNG, WEBP ≤ 1 MB) a Cloudinary por producto |
| **Paginación** | Parámetros `page` y `limit` en productos, categorías y usuarios |
| **Migraciones explícitas** | `synchronize` deshabilitado en todos los entornos; migraciones con TypeORM CLI |
| **Eliminación lógica** | Los usuarios no se borran físicamente de la base de datos |
| **Health checks** | `/health/live` y `/health/ready` para liveness/readiness de Kubernetes o balanceadores |
| **Observabilidad** | Logs HTTP en JSON con `requestId`, método, ruta, código y duración |
| **Rate limiting** | Límite de peticiones por IP en login y registro (configurable) |
| **CI/CD** | Pipeline en GitHub Actions: typecheck, lint, tests unitarios y e2e, build y auditoría de dependencias |
| **Despliegue** | Imagen Docker multi-stage + Blueprint de Render (web service + PostgreSQL 16) |

---

## 🏗️ Arquitectura

```
src/
├── modules/
│   ├── auth/           → Login, registro, JWT guard, roles guard
│   ├── users/          → CRUD de usuarios, eliminación lógica
│   ├── products/       → Catálogo de productos, paginación, seeder
│   ├── categories/     → Categorías, seeder
│   ├── orders/         → Checkout transaccional con idempotencia
│   ├── file-upload/    → Subida de imágenes a Cloudinary
│   └── health/         → Liveness y readiness probes
├── common/
│   ├── decorators/     → @CurrentUser, etc.
│   ├── filters/        → HttpExceptionFilter
│   ├── guards/         → LoginRateLimitGuard
│   └── middleware/     → SecurityMiddleware
├── config/             → TypeORM, Cloudinary, validación de env
├── interceptors/       → ExcludePasswordInterceptor
├── middleware/         → LoggerMiddleware (JSON)
├── migrations/         → Migraciones TypeORM versionadas
└── scripts/            → grant-admin.ts (CLI para promover admins)
```

---

## 📡 Endpoints

### Auth — `/auth`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/auth/register` | Registrar nuevo usuario | Público |
| `POST` | `/auth/login` | Iniciar sesión, devuelve JWT | Público |

### Users — `/users`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/users` | Listar todos los usuarios (paginado) | Admin |
| `GET` | `/users/:id` | Obtener usuario por ID | Admin |
| `PUT` | `/users/:id` | Actualizar perfil (propio o admin) | JWT |
| `DELETE` | `/users/:id` | Eliminación lógica | Admin |

### Categories — `/categories`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/categories` | Listar categorías (paginado) | Público |
| `POST` | `/categories/seeder` | Cargar categorías de prueba | Admin |

### Products — `/products`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/products` | Listar productos (paginado) | Público |
| `PUT` | `/products/:id` | Actualizar producto | Admin |
| `POST` | `/products/seeder` | Cargar productos de prueba | Admin |

### Orders — `/orders`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/orders` | Crear orden (requiere `Idempotency-Key`) | JWT |
| `GET` | `/orders/:id` | Obtener detalle de orden | JWT / Admin |

### File Upload — `/file`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/file/uploadImage/:productId` | Subir imagen de producto a Cloudinary | Admin |

### Health — `/health`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health/live` | Liveness probe |
| `GET` | `/health/ready` | Readiness probe |

---

## 🔒 Seguridad

- **JWT de vida corta** — tokens con expiración de 15 minutos (configurable con `JWT_EXPIRES_IN`)
- **Hashing con bcrypt** — las contraseñas nunca se almacenan en texto plano
- **Strip de contraseñas** — el interceptor `ExcludePasswordInterceptor` elimina el campo `password` recursivamente de cualquier respuesta
- **RBAC** — los guards `AuthGuard` y `RolesGuard` protegen rutas sensibles con decoradores `@Roles()`
- **Rate limiting por IP** — los endpoints de login y registro tienen límite de peticiones para mitigar ataques de fuerza bruta
- **HSTS** — el middleware de seguridad añade `Strict-Transport-Security` en producción
- **Privilegios de administrador por CLI** — no existe endpoint HTTP para otorgar el rol admin; se hace desde consola de confianza:
  ```bash
  npm run admin:grant -- user@example.com
  ```

---

## ⚙️ Flujo del Checkout

```
POST /orders
  Header: Idempotency-Key: <uuid>
  Body: { "items": [{ "productId": "...", "quantity": 2 }] }
```

1. Valida el `Idempotency-Key` (obligatorio, máx. 128 chars).
2. Busca si ya existe una orden con esa clave para el usuario → devuelve la existente sin efectos secundarios.
3. Inicia una **transacción PostgreSQL**:
   - Bloquea las filas de producto con `SELECT FOR UPDATE` (bloqueo pesimista).
   - Agrupa ítems duplicados, valida stock.
   - Persiste la orden con `total`, `unitPrice` y `productName` como snapshot histórico.
   - Descuenta el inventario.
4. Maneja la condición de carrera: si dos peticiones concurrentes pasan la verificación inicial simultáneamente, el único que ganó la constraint `UNIQUE` devuelve éxito; el otro recupera la orden existente.

---

## 🚀 Puesta en marcha local

**Requisitos:** Node.js 22.12+ y PostgreSQL 16+

```bash
# 1. Instalar dependencias
npm ci

# 2. Configurar variables de entorno
Copy-Item .env.example .env
# Editar .env con tus credenciales

# 3. Ejecutar migraciones
npm run migration:run

# 4. Iniciar en modo desarrollo
npm run start:dev
```

Swagger UI disponible en `http://localhost:3000/api` (solo fuera de producción).

### Con Docker Compose (base de datos local)

```bash
docker compose -f docker-compose.example.yml up -d
```

---

## 🌍 Variables de entorno

Copiar `.env.example` y completar las obligatorias:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (alternativa a las variables individuales) |
| `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Credenciales de base de datos (local) |
| `JWT_SECRET` | Mínimo 32 caracteres — usar un gestor de secretos |
| `JWT_EXPIRES_IN` | Duración del token (ej: `15m`, `1h`) |
| `CLOUD_NAME`, `API_KEY`, `API_SECRET` | Credenciales de Cloudinary |
| `CORS_ORIGINS` | Orígenes permitidos separados por coma (solo si hay frontend en otro origen) |
| `DB_SSL` | `true` para conexiones PostgreSQL administradas con SSL |
| `ENABLE_SWAGGER` | `true` para exponer Swagger UI |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting en ms |
| `RATE_LIMIT_MAX` | Máximo de requests por ventana |

---

## 🧪 Tests y calidad

```bash
npm run typecheck       # Chequeo de tipos TypeScript
npm run lint:check      # ESLint
npm test -- --runInBand # Tests unitarios
npm run test:e2e -- --runInBand # Tests end-to-end
npm run build           # Build de producción
```

El pipeline de CI en [`.github/workflows/ci.yml`](.github/workflows/ci.yml) ejecuta todos estos pasos automáticamente en cada push.

---

## 📦 Despliegue

### Docker

El [Dockerfile](Dockerfile) usa una imagen **multi-stage**:
1. **Stage `build`** — compila TypeScript y poda dependencias de desarrollo.
2. **Stage `production`** — imagen mínima que ejecuta el proceso como el usuario no privilegiado `node`.

Al arrancar el contenedor, ejecuta automáticamente las migraciones pendientes antes de iniciar el servidor:

```dockerfile
CMD ["node", "./node_modules/typeorm/cli.js", "migration:run", "-d", "./dist/config/typeorm.js", "&&", "exec", "node", "dist/main"]
```

### Render (Blueprint)

El archivo [`render.yaml`](../render.yaml) en la raíz del repositorio provisiona con un clic:

- **Web Service Docker** en Virginia con health check en `/health/ready` y deploy automático solo si el CI pasa.
- **PostgreSQL 16** en la misma región, conectado por red privada (sin acceso público).
- **Migraciones automáticas** antes de cada deploy.

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|-----------|-----|
| **NestJS 12** | Framework principal, arquitectura modular |
| **TypeScript 5** | Tipado estático en toda la base de código |
| **PostgreSQL 16** | Base de datos relacional |
| **TypeORM 0.3** | ORM, migraciones y transacciones |
| **JWT + bcrypt** | Autenticación y hashing de contraseñas |
| **Cloudinary SDK** | Almacenamiento de imágenes en la nube |
| **Swagger / OpenAPI** | Documentación interactiva de la API |
| **Docker** | Containerización multi-stage |
| **Render** | Plataforma de despliegue (PaaS) |
| **GitHub Actions** | CI/CD |
| **Jest + Supertest** | Tests unitarios y e2e |
| **ESLint + Prettier** | Calidad y formato de código |

---

## ⚠️ Pendiente antes de producción real

El modelo de datos incluye los estados `pending`, `paid` y `cancelled`, pero **no procesa pagos reales**. Antes de cobrar dinero:

- Integrar un proveedor de pagos con webhooks firmados
- Implementar una cola con reintentos para eventos de pago
- Agregar transición transaccional de estado de la orden

Adicionalmente, para observabilidad completa en producción conviene incorporar:
- Eventos de auditoría persistentes
- Métricas centralizadas y alertas

---

## 👤 Autor

**Mauricio Herrera** — [GitHub](https://github.com/MauriHerrera7)
