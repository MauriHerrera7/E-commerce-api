# 🛒 E-commerce Backend API

## 📋 Descripción

Este proyecto consiste en el desarrollo del backend de una plataforma de e-commerce construida con **NestJS**. Utiliza una arquitectura modular para gestionar productos, categorías, usuarios, órdenes y autenticación, proporcionando una API REST completa y segura.

## 🚀 Tecnologías Utilizadas

- **NestJS** - Framework de Node.js para aplicaciones escalables
- **TypeScript** - Lenguaje de programación tipado
- **TypeORM** - ORM para bases de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **Swagger** - Documentación de API
- **Bcrypt** - Encriptación de contraseñas
- **Cloudinary** - Gestión de imágenes
- **Class Validator** - Validación de datos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migration:run

# Iniciar el servidor de desarrollo
npm run start:dev
```

## 🔧 Scripts Disponibles

```bash
npm run start          # Iniciar aplicación
npm run start:dev      # Iniciar en modo desarrollo
npm run start:prod     # Iniciar en modo producción
npm run build          # Construir aplicación
npm run test           # Ejecutar tests
npm run lint           # Linter
npm run migration:run  # Ejecutar migraciones
```

## 📚 Documentación de API

La documentación completa de la API está disponible en: `http://localhost:3000/api` (Swagger UI)

---

## 🔐 Autenticación y Usuarios

### 1. Registro de Usuario

**Endpoint:** `POST /auth/register`

Permite registrar un nuevo usuario en el sistema.

**Cuerpo de la petición:**
```json
{
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "password": "MiPassword123!",
  "confirmPassword": "MiPassword123!",
  "address": "Calle Falsa 123",
  "phone": 123456789,
  "country": "Argentina",
  "city": "Buenos Aires"
}
```

**Validaciones:**
- Email válido y único
- Nombre mínimo 3 caracteres
- Contraseña: 8-15 caracteres, debe incluir mayúscula, minúscula, número y carácter especial
- Confirmación de contraseña debe coincidir
- Dirección: 3-80 caracteres
- País y ciudad: 5-20 caracteres

**Respuesta exitosa:**
```json
{
  "success": "USUARIO REGISTRADO CON ÉXITO",
  "data": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "address": "Calle Falsa 123",
    "phone": 123456789,
    "country": "Argentina",
    "city": "Buenos Aires",
    "isAdmin": false
  }
}
```

### 2. Login de Usuario

**Endpoint:** `POST /auth/login`

Permite autenticar a un usuario existente.

**Cuerpo de la petición:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Respuesta exitosa:**
```json
{
  "message": "USUARIO LOGEADO CORRECTAMENTE",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "isAdmin": false
  }
}
```

---

## 👥 Gestión de Usuarios

### 3. Obtener Todos los Usuarios (Solo Administradores)

**Endpoint:** `GET /users`
**Autenticación:** Bearer Token requerido
**Permisos:** Solo administradores

**Parámetros de consulta opcionales:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 5)

**Ejemplo:** `GET /users?page=1&limit=10`

### 4. Obtener Usuario por ID (Solo Administradores)

**Endpoint:** `GET /users/:id`
**Autenticación:** Bearer Token requerido
**Permisos:** Solo administradores

### 5. Actualizar Usuario (Solo Administradores)

**Endpoint:** `PUT /users/:id`
**Autenticación:** Bearer Token requerido
**Permisos:** Solo administradores

### 6. Eliminar Usuario (Solo Administradores)

**Endpoint:** `DELETE /users/:id`
**Autenticación:** Bearer Token requerido
**Permisos:** Solo administradores

---

## 🏷️ Categorías

### 7. Obtener Todas las Categorías

**Endpoint:** `GET /categories`

Obtiene todas las categorías disponibles con paginación.

**Parámetros de consulta opcionales:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 5)

**Ejemplo:** `GET /categories?page=1&limit=10`

### 8. Seeder de Categorías

**Endpoint:** `GET /categories/seeder`

Genera categorías predeterminadas en la base de datos para desarrollo y testing.

---

## 📦 Productos

### 9. Obtener Todos los Productos

**Endpoint:** `GET /products`

Obtiene todos los productos disponibles con paginación.

**Parámetros de consulta opcionales:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 5)

**Ejemplo:** `GET /products?page=1&limit=10`

**Respuesta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Producto Ejemplo",
      "description": "Descripción del producto",
      "price": 99.99,
      "stock": 50,
      "imgUrl": "https://example.com/image.jpg",
      "category": {
        "id": "uuid",
        "name": "Categoría"
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### 10. Actualizar Producto (Solo Administradores)

**Endpoint:** `PUT /products/:id`
**Autenticación:** Bearer Token requerido
**Permisos:** Solo administradores

**Cuerpo de la petición:**
```json
{
  "name": "Nuevo nombre del producto",
  "description": "Nueva descripción",
  "price": 149.99,
  "stock": 25
}
```

**Respuesta exitosa:**
```json
{
  "message": "PRODUCTO ACTUALIZADO CORRECTAMENTE",
  "product": {
    "id": "uuid",
    "name": "Nuevo nombre del producto",
    "description": "Nueva descripción",
    "price": 149.99,
    "stock": 25
  }
}
```

### 11. Seeder de Productos

**Endpoint:** `GET /products/seeder`

Genera productos predeterminados en la base de datos para desarrollo y testing.

---

## 🛍️ Órdenes de Compra

### 12. Crear Nueva Orden

**Endpoint:** `POST /orders`

Permite crear una nueva orden de compra.

**Cuerpo de la petición:**
```json
{
  "userId": "e25479b9-26b3-43c3-936a-518500f0f44e",
  "products": [
    {
      "id": "product-uuid-1"
    },
    {
      "id": "product-uuid-2"
    }
  ]
}
```

**Validaciones:**
- `userId`: Debe ser un UUID válido
- `products`: Debe ser un arreglo con al menos un producto

**Respuesta exitosa:**
```json
{
  "id": "order-uuid",
  "date": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user-uuid",
    "name": "Juan Pérez"
  },
  "orderDetails": [
    {
      "id": "detail-uuid",
      "price": 99.99,
      "product": {
        "id": "product-uuid",
        "name": "Producto Ejemplo"
      }
    }
  ]
}
```

### 13. Obtener Detalle de Orden

**Endpoint:** `GET /orders/:id`

Obtiene los detalles completos de una orden específica.

**Parámetros:**
- `id`: UUID de la orden

**Respuesta:**
```json
{
  "id": "order-uuid",
  "date": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user-uuid",
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com"
  },
  "orderDetails": [
    {
      "id": "detail-uuid",
      "price": 99.99,
      "product": {
        "id": "product-uuid",
        "name": "Producto Ejemplo",
        "description": "Descripción del producto"
      }
    }
  ],
  "total": 99.99
}
```

---

## 📸 Subida de Archivos

### 14. Subir Imagen de Producto (Solo Administradores)

**Endpoint:** `POST /file/uploadImage/:productId`
**Autenticación:** Bearer Token requerido
**Permisos:** Solo administradores

Permite subir una imagen para un producto específico.

**Parámetros:**
- `productId`: UUID del producto

**Cuerpo de la petición:**
- `file`: Archivo de imagen (multipart/form-data)

**Restricciones:**
- Tamaño máximo: 1MB
- Formatos permitidos: jpg, jpeg, png, webp

**Ejemplo con cURL:**
```bash
curl -X POST \
  http://localhost:3000/file/uploadImage/product-uuid \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@imagen.jpg"
```

**Respuesta exitosa:**
```json
{
  "message": "Imagen subida correctamente",
  "imageUrl": "https://cloudinary-url/imagen.jpg",
  "product": {
    "id": "product-uuid",
    "name": "Producto",
    "imgUrl": "https://cloudinary-url/imagen.jpg"
  }
}
```

---

## 🔒 Sistema de Autenticación y Autorización

### Roles de Usuario

El sistema maneja dos tipos de roles:

1. **Usuario Regular** (`user`): Puede realizar compras y gestionar sus órdenes
2. **Administrador** (`admin`): Tiene acceso completo a todas las funcionalidades

### Protección de Rutas

Las rutas protegidas requieren:

1. **Token JWT válido** en el header `Authorization: Bearer <token>`
2. **Rol adecuado** para acceder a endpoints específicos

### Guards Implementados

- **AuthGuard**: Verifica que el usuario esté autenticado
- **RolesGuard**: Verifica que el usuario tenga el rol necesario

---

## 🗄️ Base de Datos

### Entidades Principales

1. **User** - Usuarios del sistema
2. **Product** - Productos disponibles
3. **Category** - Categorías de productos
4. **Order** - Órdenes de compra
5. **OrderDetail** - Detalles de cada orden

### Migraciones

```bash
# Crear nueva migración
npm run migration:create -- src/migrations/nombre-migracion

# Generar migración automática
npm run migration:generate -- src/migrations/nombre-migracion

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert
```

---

## 🌐 Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_de_datos

# JWT
JWT_SECRET=tu_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Puerto
PORT=3000
```

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

---

## 📝 Validaciones y Middleware

### Interceptores
- **ExcludePasswordInterceptor**: Excluye automáticamente las contraseñas de las respuestas

### Middleware
- **LoggerMiddleware**: Registra todas las peticiones HTTP

### Validaciones
- Uso de `class-validator` para validación de DTOs
- Validación automática de tipos UUID
- Validación de archivos subidos

---

## 🚀 Despliegue

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor crear un issue en el repositorio.

---

## 📄 Licencia

Este proyecto es privado y no tiene licencia específica.
