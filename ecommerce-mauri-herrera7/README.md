# E-commerce API

API REST de e-commerce construida con NestJS, PostgreSQL, TypeORM y Cloudinary.

## Puesta en marcha local

Requiere Node.js 22.12+ (se recomienda Node.js 24) y PostgreSQL 16+.

```bash
npm ci
Copy-Item .env.example .env
# Completar .env con credenciales locales válidas
npm run migration:run
npm run start:dev
```

Para una base local con Docker, puede usarse la plantilla incluida:

```bash
docker compose -f docker-compose.example.yml up -d
```

La documentación Swagger está disponible sólo fuera de producción, por defecto en `http://localhost:3000/api`.

## Variables de entorno

Copiar [`.env.example`](.env.example). Las variables obligatorias son `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `CLOUD_NAME`, `API_KEY` y `API_SECRET`. Como alternativa, los cuatro valores de base de datos pueden reemplazarse por `DATABASE_URL`, pensado para proveedores administrados como Render.

- `JWT_SECRET` debe tener por lo menos 32 caracteres y provenir de un gestor de secretos.
- En producción, `CORS_ORIGINS` es obligatorio y debe contener los orígenes de frontend separados por coma.
- `DB_SSL=true` habilita SSL para PostgreSQL administrado.
- No se versionan archivos `.env`; las credenciales expuestas anteriormente deben revocarse y reemplazarse antes de publicar.

## Seguridad y autorización

- Contraseñas con bcrypt y respuestas que eliminan `password` recursivamente.
- JWT de vida corta (`JWT_EXPIRES_IN`, 15 minutos por defecto), validado mediante `Bearer` tokens.
- Los usuarios sólo pueden editar su propio perfil; administradores pueden gestionar usuarios y catálogo.
- No hay endpoint HTTP para otorgar permisos de administrador. Tras registrar un usuario, hacerlo administrador desde una consola de confianza:

```bash
npm run admin:grant -- user@example.com
```

- Login y registro llevan limitación básica por IP. En un despliegue con varias réplicas se debe sustituir su almacenamiento en memoria por Redis.
- Las cargas sólo aceptan JPG, PNG o WEBP de hasta 1 MB y Cloudinary las guarda como `image`.

## Órdenes

`POST /orders` requiere un JWT. El usuario se deriva exclusivamente del token; nunca se acepta `userId` en el cuerpo.

```json
{
  "items": [{ "productId": "product-uuid", "quantity": 2 }]
}
```

El checkout requiere además un header `Idempotency-Key` único por intención de compra (hasta 128 caracteres). El mismo usuario puede reintentar esa clave sin duplicar la orden ni descontar stock otra vez. El checkout combina productos repetidos, bloquea las filas de producto durante la operación, valida stock antes de persistir y descuenta inventario dentro de una transacción. Cada ítem conserva `unitPrice` y `productName` como instantánea histórica. Un cliente sólo puede consultar sus propias órdenes; un administrador puede consultar cualquiera.

Los seeders de categorías y productos ahora son `POST`, requieren administrador y devuelven 404 en producción.

## Esquema y migraciones

`synchronize` está deshabilitado en todos los entornos. Aplicar migraciones explícitamente:

```bash
npm run migration:show
npm run migration:run
```

La migración inicial establece tablas `users`, `categories`, `products`, `orders` y `order_items` con claves foráneas, índices y restricciones de stock/precio. **No apuntar esta migración a una base ya poblada con el esquema antiguo sin probar antes una migración de datos en staging.** Hacer backup verificable y un plan de rollback.

## Calidad

```bash
npm run typecheck
npm run lint:check
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

El flujo de CI en [`.github/workflows/ci.yml`](.github/workflows/ci.yml) ejecuta instalación reproducible, chequeo de tipos, lint, pruebas, build y auditoría de dependencias.

## Despliegue

El [Dockerfile](Dockerfile) construye una imagen multi-stage y ejecuta el proceso como el usuario no privilegiado `node`.

1. Configure secretos y `NODE_ENV=production` en el proveedor de despliegue.
2. Ejecute `npm run migration:run:prod` como un job único de la misma imagen antes de liberar nuevas réplicas.
3. Despliegue la imagen con `node dist/main`.
4. Configure el balanceador para usar `GET /health/live` como liveness y `GET /health/ready` como readiness.
5. Active HTTPS en el proxy de borde. La app añade HSTS en producción.

Los logs HTTP se emiten como JSON e incluyen `requestId`, método, ruta, código y duración. Los endpoints de salud nunca exponen secretos.

### Render

El Blueprint [`render.yaml`](../render.yaml) está en la raíz del repositorio porque esta API vive en el subdirectorio `ecommerce-mauri-herrera7`. Al crear un **New > Blueprint** en Render y seleccionar este repositorio, provisiona:

- Un Web Service Docker en Virginia, con health check en `/health/ready` y despliegue automático sólo después de que pase CI.
- Una instancia Render Postgres 16 en la misma región, conectada por red privada. La base no acepta conexiones públicas.
- Migraciones antes de cada despliegue mediante `npm run migration:run:prod`.

Render genera `JWT_SECRET` y solicitará durante el primer alta `CORS_ORIGINS`, `CLOUD_NAME`, `API_KEY` y `API_SECRET`. Usar el origen exacto del frontend en `CORS_ORIGINS`; no incluir secretos en el repositorio. El Blueprint usa planes administrados mínimos (`0.5c-512mb` web y `0.5c-1g` Postgres); revisarlos en Render antes de crear recursos porque son facturables.

## Pendiente de integrar antes del cobro real

El modelo incluye estados `pending`, `paid` y `cancelled`, pero no procesa pagos todavía. Antes de cobrar dinero integrar un proveedor de pagos con webhooks firmados, una cola/reintentos y una transición transaccional de estado. Los usuarios se eliminan de forma lógica; para auditoría de negocio y observabilidad operativa aún conviene incorporar eventos de auditoría persistentes, métricas y alertas centralizadas.
