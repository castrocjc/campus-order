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

La Adaptación Móvil Fase 2 se encuentra en progreso.

Ya fueron estabilizadas las pantallas:

* Perfil
* Administración de Pedidos
* Configuración de Cafetería

Adaptación Móvil Fase 2:

Pendientes:

* Administración de Categorías.
* Administración de Personalizaciones.
* Administración de Usuarios.
* Administración de Productos pendiente de cierre en mobile web.

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
* Opciones de personalización administrables
* Persistencia histórica en OrderItem
* Visualización en carrito
* Visualización en Mis Pedidos
* Visualización en Administración de Pedidos
* Gestión administrativa de personalizaciones
* Carga dinámica desde backend
* Campo libre de observaciones

Observación:

Las opciones de personalización son administradas dinámicamente desde backend mediante CustomizationOption.
Actualmente son globales para todos los productos configurables.

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
* Notificación automática por correo al cambiar a READY_FOR_PICKUP.
* Prevención de envíos duplicados mediante flag de notificación.

Administración de Pedidos:

* La pantalla operativa muestra únicamente pedidos del día.
* El filtrado se realiza utilizando pickupTime.
* Los pedidos históricos quedan fuera de la operación diaria.
* Los pedidos futuros quedan fuera de la operación diaria.
* Los pedidos se ordenan por hora de recojo ascendente.
* El backend es la fuente de verdad para el ordenamiento operativo.
* El frontend consume el orden recibido sin aplicar ordenamientos adicionales.
* Existe cierre operativo diario manual.
* Los pedidos pendientes pueden pasar a NOT_ATTENDED.
* El cierre operativo no revierte stock.

Reglas actuales de horario:

* Las reglas operativas son obtenidas dinámicamente desde Configuración de Cafetería.
* La hora mínima de recojo se calcula mediante:

  MAX(hora actual, hora apertura) + tiempo mínimo de preparación.

* Si el usuario accede antes de la apertura, la preparación inicia desde la hora de apertura configurada.

Estados:

* RECEIVED
* IN_PREPARATION
* READY_FOR_PICKUP
* DELIVERED
* NOT_ATTENDED
* CANCELLED

Arquitectura de trazabilidad:

* Cada transición de estado genera un registro en OrderStatusEvent.
* Order conserva únicamente el estado actual del pedido.
* El historial completo del ciclo de vida se obtiene consultando OrderStatusEvent.

---

## Gestión Administrativa

Estado: Completo

Pantallas:

* admin-orders
* admin-products
* admin-users
* admin-categories
* admin-customizations
* Las pantallas administrativas de Dashboard, Productos, Categorías, Usuarios y Pedidos comparten el estándar visual oficial CofiGO mediante AdminLayout y SideMenu.

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

## Configuración de Cafetería

Estado: Completo

Funcionalidades:

* Datos generales.
* Ubicación.
* Zona horaria.
* Moneda.
* Tiempo mínimo de preparación.
* Intervalo de recojo.
* Horarios por día.
* Días cerrados.

Integraciones:

* Home
* OrderService

Seguridad:

* GET /api/cafeteria-settings es público.
* PUT /api/cafeteria-settings requiere rol ADMIN.

---

## Reportes

Estado: Completo

Funcionalidades:

* Dashboard Analítico.
* Indicadores ejecutivos.
* Ventas por día.
* Pedidos por estado.
* Top productos vendidos.
* Horas pico.
* Filtros por fecha.
* Dashboard visual.
* Integración con AdminLayout.
* Integración con SideMenu.
* Indicadores Operativos.
* Integración con OrderStatusEvent.
* Tiempo promedio de preparación.
* Tiempo promedio de entrega.
* Valores promedio, mínimo y máximo.

---

## Perfil de Usuario

Estado: Completo

Funcionalidades:

* Consulta de perfil autenticado.
* Edición de nombre.
* Edición de celular.
* Cambio seguro de contraseña.
* Visualización de correo institucional en solo lectura.
* Visualización de rol en solo lectura.
* Visualización de estado en solo lectura.
* Visualización de verificación de correo en solo lectura.

Reglas:

* El usuario no puede modificar correo institucional.
* El usuario no puede modificar rol.
* El usuario no puede modificar estado.
* El usuario no puede modificar verificación de correo.
* El celular queda disponible para futuras notificaciones SMS o WhatsApp.

---

# Módulos Pendientes

Prioridad Alta:
* Repetir Pedido
* Dashboard Administrativo Avanzado
* Exportación de Reportes
* Auditoría Administrativa

Prioridad Media:
* Gestión de Inventario Simple
* WhatsApp READY_FOR_PICKUP

Prioridad Baja:
* Pagos Online
* Monedero Universitario
* Multi Cafetería

---

# Arquitectura de Datos

Entidades principales:

* User, incluye phone para perfil y futuras notificaciones
* Category
* Product
* Order
    * readyForPickupNotificationSent
* OrderItem

Relaciones:

* Product N:1 Category
* Order 1:N OrderItem

Observaciones:

Order almacena userId.

OrderItem almacena productId y productName para preservar el histórico de ventas.

Nueva entidad:

* OrderStatusEvent

Relaciones:

* Order 1:N OrderItem
* Order 1:N OrderStatusEvent

OperationalMetricsService consume exclusivamente OrderStatusEvent para el cálculo de indicadores operativos.

OrderService no participa en la generación de métricas.

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

Notificaciones implementadas:

* Verificación de correo.
* Recuperación de contraseña.
* READY_FOR_PICKUP.

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

# Navegación por Roles

ADMIN

* Dashboard
* Productos
* Categorías
* Personalizaciones
* Usuarios
* Pedidos
* Reportes

WORKER

* Pedidos

USER

* Menú
* Mis Pedidos
* Perfil

Componentes base:

* AdminLayout
* SideMenu

Regla:

Toda nueva pantalla debe integrarse al layout correspondiente y evitar navegación basada en botones Volver.

---

# Backlog Oficial

La priorización actual del producto es:

1. Repetir Pedido
2. Dashboard Administrativo Avanzado
3. Exportación de Reportes
4. Auditoría Administrativa (Fase 2)

La auditoría del ciclo de vida de pedidos ya fue implementada mediante OrderStatusEvent.

Pendiente extender el mismo patrón a:

* Productos
* Categorías
* Usuarios
* Personalizaciones
* Configuración de Cafetería.
5. Gestión de Inventario Simple
6. WhatsApp READY_FOR_PICKUP
7. Pagos Online
8. Monedero Universitario
9. Multi Cafetería

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
