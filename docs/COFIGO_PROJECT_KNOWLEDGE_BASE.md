# COFIGO_PROJECT_KNOWLEDGE_BASE.md

## 1. Información General

### Nombre del Proyecto

CofiGO (Campus Order)

### Descripción

Sistema web para gestión de pedidos en cafeterías universitarias que permite a estudiantes realizar pedidos anticipados, seleccionar una hora de recojo y evitar filas. Incluye funcionalidades administrativas para la gestión de productos, categorías y pedidos.

### Estado Actual

Producto funcional desplegado en ambiente productivo.

---

# 2. Arquitectura General

## Arquitectura de Alto Nivel

```text
Frontend (React Native + Expo)
        |
        | REST API + JWT
        |
Backend (Spring Boot)
        |
        | JPA/Hibernate
        |
MySQL
```

---

## Frontend

### Tecnologías

* React Native
* Expo
* Expo Router
* TypeScript
* Vercel

### Estructura Principal

```text
app/
├── index.tsx
├── register.tsx
├── home.tsx
├── my-orders.tsx
├── admin-products.tsx
├── admin-orders.tsx
└── _layout.tsx
```

### Servicios

```text
src/services/
├── apiClient.ts
├── authService.ts
├── userService.ts
├── categoryService.ts
├── productService.ts
└── orderService.ts
```

---

## Backend

### Tecnologías

* Java 21
* Spring Boot 3
* Spring Security
* Spring Data JPA
* JWT
* Maven
* SendGrid

### Arquitectura por Capas

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controllers

```text
AuthController
UserController
ProductController
CategoryController
OrderController
```

### Services

```text
AuthService
UserService
ProductService
OrderService
EmailService
```

### Repositories

```text
UserRepository
ProductRepository
CategoryRepository
OrderRepository
```

### Seguridad

```text
SecurityConfig
JwtAuthenticationFilter
JwtService
```

---

# 3. Modelo de Datos

## User

| Campo                      | Tipo          |
| -------------------------  | ------------- |
| id                         | Long          |
| name                       | String        |
| email                      | String        |
| password                   | String        |
| role                       | String        |
| active                     | Boolean       |
| emailVerified              | Boolean       |
| verificationCode           | String        |
| verificationCodeExpiresAt  | LocalDateTime |
| passwordResetCode          | String        |
| passwordResetCodeExpiresAt | LocalDateTime |

---

## Category

| Campo       | Tipo    |
| ----------- | ------- |
| id          | Long    |
| name        | String  |
| description | String  |
| active      | Boolean |

---

## Product

| Campo        | Tipo       |
| -----------  | ---------- |
| id           | Long       |
| name         | String     |
| description  | String     |
| price        | BigDecimal |
| stock        | Integer    |
| imageUrl     | String     |
| active       | Boolean    |
| categoryId   | Long       |
| customizable | Boolean    |

### Relación

```text
Product N : 1 Category
```

---

## Order

| Campo       | Tipo          |
| ----------- | ------------- |
| id          | Long          |
| userId      | Long          |
| status      | OrderStatus   |
| pickupTime  | LocalDateTime |
| totalAmount | BigDecimal    |
| createdAt   | LocalDateTime |
| updatedAt   | LocalDateTime |

### Relación

```text
Order 1 : N OrderItem
```

---

## OrderItem

| Campo              | Tipo       |
| -----------        | ---------- |
| id                 | Long       |
| productId          | Long       |
| productName        | String     |
| quantity           | Integer    |
| unitPrice          | BigDecimal |
| subtotal           | BigDecimal |
| orderId            | Long       |
| customizationNotes | String     |

---

# 4. Seguridad

## Método de Autenticación

JWT (JSON Web Token)

---

## Roles

### USER

Permisos:

* Consultar menú
* Crear pedidos
* Consultar pedidos propios
* Cancelar pedidos

### ADMIN

Permisos:

* Administrar productos
* Administrar pedidos
* Consultar información administrativa
* Cambiar estados de pedidos

---

## Correo

Proveedor:

SendGrid

Funcionalidades:

* Verificación de correo
* Reenvío de código
* Recuperación de contraseña
* Reenvío de código de recuperación

---

# 5. APIs Principales

## Autenticación

```http
POST /api/auth/login

POST /api/auth/forgot-password

POST /api/auth/reset-password
```

---

## Usuarios

```http
POST /api/users

POST /api/users/verify-email

POST /api/users/resend-code

GET /api/users
```

---

## Categorías

```http
POST /api/categories

GET /api/categories
```

---

## Productos

```http
POST   /api/products

GET    /api/products

PUT    /api/products/{id}

DELETE /api/products/{id}

GET    /api/products/menu

GET    /api/products/admin

GET    /api/products/search

GET    /api/products/paged
```

---

## Pedidos

```http
POST /api/orders

GET /api/orders

GET /api/orders/my-orders

GET /api/orders/user/{userId}

PUT /api/orders/{orderId}/cancel

PUT /api/orders/{orderId}/status

GET /api/orders/reports/sales-by-day
```

---

# 6. Módulos Implementados

| Módulo                 | Estado   |
| ---------------------- | -------- |
| Login                  | Completo |
| Registro               | Completo |
| Verificación Correo    | Completo |
| JWT                    | Completo |
| Roles                  | Completo |
| Productos              | Completo |
| Personalización Productos | Completo |
| Menú Digital           | Completo |
| Carrito                | Completo |
| Pedidos                | Completo |
| Gestión Pedidos        | Completo |
| Reporte Ventas por Día | Parcial  |
| Recuperar Contraseña   | Completo |

---

# 7. Módulos Pendientes

## Prioridad Alta

* Dashboard Administrativo
* Gestión de Categorías
* Reportes Frontend

## Prioridad Media

* Perfil de Usuario
* Auditoría
* Notificaciones

## Prioridad Baja

* Pagos Online
* Multi Cafetería

---

# 8. Ambientes

## Desarrollo

### Frontend

```text
localhost:8082
```

### Backend

```text
localhost:8081
```

### Base de Datos

```text
campus_order_db
```

---

## Producción

### Frontend

Vercel

### Backend

Railway

### Base de Datos

Railway MySQL

---

# 9. Restricciones Técnicas

Las siguientes funcionalidades se consideran estables y requieren análisis de impacto antes de ser modificadas:

* Login
* Registro
* Verificación de correo
* JWT
* Productos
* Pedidos
* Integración SendGrid
* Configuración Railway
* Configuración Vercel

---

# 10. Riesgos Conocidos

## JWT Secret Hardcodeado

Pendiente migrar a variable de entorno.

---

## Order utiliza userId

Actualmente no existe relación JPA directa con User.

---

## Carrito Local

El carrito se almacena únicamente en frontend.

No persiste entre sesiones.

# Reglas Operativas de Pedidos

Horario de atención:

07:00 - 21:00

Tiempo mínimo de preparación:

20 minutos

Intervalo de recojo:

30 minutos

Validaciones implementadas:

* No se permiten horarios pasados.
* No se permiten horarios fuera del horario de atención.
* Debe existir al menos 20 minutos de preparación.
* El frontend genera dinámicamente los horarios válidos.
* El backend valida nuevamente la hora seleccionada.

---

# Personalización de Productos

Implementación actual:

Modelo MVP basado en texto.

Product:

* customizable

OrderItem:

* customizationNotes

Opciones actuales:

* Mayonesa
* Ketchup
* Mostaza

Administración actual:

* El atributo `customizable` puede gestionarse desde la pantalla de productos.
* El administrador puede crear y editar productos personalizables.
* La columna `products.customizable` define si un producto abre el modal de personalización.

Experiencia actual:

* Modal visual mejorado en menú.
* Opciones mostradas como chips seleccionables.
* Contador de opciones seleccionadas.
* Botón de confirmación Agregar al carrito.

Observaciones:

* Las opciones se encuentran definidas en frontend.
* La personalización se almacena como snapshot histórico.
* No existe administración dinámica de opciones.

Evolución futura:

* ProductCustomizationGroup
* ProductCustomizationOption

---

# 11. Próxima Evolución Recomendada

1. Dashboard Administrativo
2. Gestión de Categorías
3. Reportes Frontend
4. Gestión de Configuración de Cafetería
5. Perfil de Usuario

---

# Historial del Documento

Versión: 1.0

Fecha de creación: Junio 2026

Estado: Vigente

Propietario: Proyecto CofiGO

Fin del documento.
