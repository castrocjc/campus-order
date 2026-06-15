# COFIGO_PROMPT_CONTEXT.md

## Proyecto

Nombre: CofiGO (Campus Order)

Descripción:
Sistema web para gestión de pedidos en cafeterías universitarias que permite a estudiantes realizar pedidos anticipados, seleccionar una hora de recojo y evitar filas. Incluye funcionalidades administrativas para la gestión de productos y pedidos.

---

# Estado Actual

## Estado General

Producto funcional desplegado en producción.

Arquitectura estable.

Los módulos principales se encuentran implementados y operativos.

La pantalla principal Home cuenta con soporte responsive validado mediante iPhone Simulator como parte de la Adaptación Móvil Fase 1.

---

# Tecnologías

## Frontend

* React Native
* Expo
* Expo Router
* TypeScript
* Vercel

## Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA
* Maven
* SendGrid

## Base de Datos

* MySQL

## Infraestructura

Frontend:

* Vercel

Backend:

* Railway

Base de Datos:

* Railway MySQL

---

# Módulos Implementados

## Autenticación

Estado: Completo

Funcionalidades:

* Registro de usuario
* Login
* JWT
* Roles
* Verificación por correo
* Reenvío de código
* Recuperación de contraseña
* Validación obligatoria de correo institucional

---

## Productos

Estado: Completo

Incluye:

* Gestión de productos.
* Productos personalizables.
* Validaciones avanzadas.
* Prevención de duplicados.
* Indicadores visuales de stock.
* Formato monetario automático.

---

## Personalización de Productos

Estado: Completo

Funcionalidades:

* Productos configurables mediante flag customizable
* Selección de salsas desde modal visual
* Persistencia histórica en OrderItem
* Visualización en carrito
* Visualización en Mis Pedidos
* Visualización en Administración de Pedidos

Observación:

Las opciones de personalización se encuentran definidas en frontend como solución MVP.

---

## Menú Digital

Estado: Completo

Funcionalidades:

* Visualización de productos
* Consulta de productos disponibles
* Actualización automática de stock después de registrar pedido.

---

## Carrito

Estado: Completo

Observación:

El carrito existe únicamente en frontend.

No existe entidad Carrito en backend.

---

## Pedidos

Estado: Completo

Funcionalidades:

* Crear pedido
* Consultar pedidos
* Cancelar pedido
* Gestión de estados
* Selección dinámica de hora de recojo
* Validación de horario de atención
* Validación de tiempo mínimo de preparación
* Reversa automática de stock al cancelar pedidos
* Cancelación consistente desde Mis Pedidos y Administración de Pedidos

Reglas actuales de horario:

* Zona horaria oficial: America/Lima
* Horario de atención: 07:00 a 21:00
* Tiempo mínimo de preparación: 20 minutos
* Intervalo de recojo: 30 minutos
* Configuración centralizada en código para el MVP

Estados:

* RECEIVED
* IN_PREPARATION
* READY_FOR_PICKUP
* DELIVERED
* CANCELLED

---

## Gestión Administrativa

Estado: Completo

Pantallas:

* admin-orders
* admin-products
* admin-users
* admin-categories

---

## Gestión de Categorías

Estado: Completo

Funcionalidades:

* Listado administrativo.
* Creación.
* Edición.
* Activación.
* Desactivación.
* Búsqueda.
* Prevención de duplicados.
* Validaciones de negocio.

---

## Reportes

Estado: Parcial

Backend:

* Ventas por día

Frontend:

* No implementado

---

# Módulos Pendientes

Prioridad Alta:

* Dashboard Administrativo
* Reportes Frontend

Prioridad Media:

* Gestión de Configuración de Cafetería
* Perfil de Usuario
* Auditoría
* Notificaciones

Prioridad Baja:

* Pagos Online
* Multi Cafetería

---

# Arquitectura de Datos

Entidades principales:

* User
* Category
* Product
* Order
* OrderItem

Relaciones:

* Product N:1 Category
* Order 1:N OrderItem

Observaciones:

Order almacena userId.

OrderItem almacena productId y productName para preservar el histórico de ventas.

---

# Seguridad

Autenticación:

JWT

Roles:

* ADMIN
* WORKER
* USER

Correo:

SendGrid

Regla de correo institucional:

* Todos los usuarios deben utilizar correo institucional.
* La validación se encuentra centralizada en UserService.
* Aplica a registro público.
* Aplica a creación administrativa de usuarios.
* Aplica a edición administrativa de usuarios.
* Los usuarios creados por ADMIN se consideran verificados administrativamente.
* La administración de usuarios no muestra códigos sensibles de verificación ni recuperación.
* Los usuarios pendientes pueden recibir un nuevo código mediante la opción Reenviar código.

---

# Ambientes

Desarrollo

Frontend:
localhost:8082

Backend:
localhost:8081

Base de Datos:
campus_order_db

---

Producción

Frontend:
Vercel

Backend:
Railway

Base de Datos:
Railway MySQL

---

# Restricciones

Antes de modificar debe realizarse análisis de impacto sobre:

* Login
* Registro
* Verificación de correo
* JWT
* Productos
* Pedidos
* Integración SendGrid
* Configuración Railway
* Configuración Vercel

Estas funcionalidades se consideran estables.

---

# Forma de Trabajo

Al iniciar una nueva sesión:

1. Compartir este archivo.
2. Indicar la funcionalidad a modificar.
3. Analizar impacto.
4. Identificar archivos afectados.
5. Realizar cambios.
6. Actualizar ChangeLog.
7. Actualizar Current State si corresponde.

Validaciones recomendadas antes de despliegue:

1. npm run lint
2. Validación Desktop Chrome
3. Validación Desktop Safari
4. Validación iPhone Simulator
5. Validación productiva en Vercel
6. Validación Mobile Web en iPhone físico

---

Fin del documento.
