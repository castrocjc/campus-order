# COFIGO_CHANGELOG.md

# Proyecto

CofiGO (Campus Order)

---

# Versión 1.0

Fecha: Junio 2026

Estado:

Primera versión documentada del proyecto.

---

# 2026-06-01

## Infraestructura

### Despliegue inicial

Estado:

Completado

Descripción:

Configuración de ambientes productivos.

Componentes:

* Frontend en Vercel
* Backend en Railway
* Base de datos MySQL Railway

Impacto:

Sistema disponible en ambiente productivo.

---

# 2026-06-02

## Seguridad

### Implementación JWT

Estado:

Completado

Descripción:

Implementación de autenticación basada en JSON Web Token.

Archivos involucrados:

* SecurityConfig.java
* JwtService.java
* JwtAuthenticationFilter.java

Impacto:

Autenticación segura entre frontend y backend.

---

# 2026-06-03

## Usuarios

### Registro de Usuarios

Estado:

Completado

Descripción:

Implementación del proceso de registro de usuarios.

Archivos involucrados:

* UserController.java
* UserService.java
* UserRepository.java
* register.tsx

Impacto:

Permite el alta de nuevos usuarios.

---

# 2026-06-04

## Productos

### CRUD de Productos

Estado:

Completado

Descripción:

Implementación de gestión de productos.

Funcionalidades:

* Crear
* Editar
* Consultar
* Activar
* Desactivar

Archivos involucrados:

* ProductController.java
* ProductService.java
* ProductRepository.java
* admin-products.tsx

Impacto:

Administración completa de productos.

---

# 2026-06-05

## Pedidos

### Gestión de Pedidos

Estado:

Completado

Descripción:

Implementación del flujo completo de pedidos.

Funcionalidades:

* Crear pedido
* Consultar pedido
* Consultar pedidos propios
* Cancelar pedido

Archivos involucrados:

* OrderController.java
* OrderService.java
* orderService.ts
* home.tsx
* my-orders.tsx

Impacto:

Usuarios pueden realizar pedidos.

---

# 2026-06-06

## Administración

### Gestión de Estados de Pedido

Estado:

Completado

Descripción:

Implementación de flujo administrativo de pedidos.

Estados:

* RECEIVED
* PREPARING
* READY
* DELIVERED
* CANCELLED

Archivos involucrados:

* OrderController.java
* OrderService.java
* admin-orders.tsx

Impacto:

Administradores pueden gestionar pedidos.

---

# 2026-06-07

## Correo Electrónico

### Integración SendGrid

Estado:

Completado

Descripción:

Migración del envío de correos desde Gmail hacia SendGrid.

Motivación:

Mejor entregabilidad.

Archivos involucrados:

* EmailService.java
* application.properties
* application-local.properties
* application-prod.properties

Impacto:

Mejora en el envío de correos de verificación.

---

# 2026-06-08

## Usuarios

### Verificación de Correo Electrónico

Estado:

Completado

Descripción:

Implementación de validación mediante código enviado por correo.

Funcionalidades:

* Envío de código
* Validación de código
* Reenvío de código

Archivos involucrados:

Backend:

* UserController.java
* UserService.java
* EmailService.java

Frontend:

* register.tsx
* userService.ts

Impacto:

Validación de identidad de usuarios.

---

# 2026-06-09

## UX/UI

### Mejoras Responsive

Estado:

Completado

Descripción:

Ajustes de visualización para dispositivos móviles.

Archivos involucrados:

* index.tsx
* home.tsx
* admin-products.tsx
* admin-orders.tsx

Impacto:

Mejor experiencia en móviles.

---

# 2026-06-10

## Documentación

### Knowledge Base del Proyecto

Estado:

Completado

Descripción:

Creación de la documentación oficial del proyecto.

Documentos creados:

* COFIGO_PROJECT_KNOWLEDGE_BASE.md
* COFIGO_PROMPT_CONTEXT.md
* COFIGO_DECISION_LOG.md
* COFIGO_CURRENT_STATE.md
* COFIGO_CHANGELOG.md

Impacto:

Se establece una fuente única de verdad para el proyecto.

---

# Plantilla para Nuevas Entradas

## YYYY-MM-DD

### Área

Estado:

Completado | En progreso | Cancelado

Descripción:

Resumen del cambio.

Archivos involucrados:

Backend:

* archivo.java

Frontend:

* archivo.tsx

Base de datos:

* script.sql

Impacto:

Resultado esperado del cambio.

---

# Próxima Entrada Esperada

## Dashboard Administrativo

Estado:

Pendiente

Prioridad:

Alta

---

# v1.1 - Recuperación de Contraseña

Fecha: Junio 2026

## Nuevas funcionalidades

### Recuperación de contraseña

Se implementó un flujo completo de recuperación de contraseña mediante correo electrónico.

Incluye:

* Solicitud de código de recuperación.
* Envío de código mediante SendGrid.
* Validación de código.
* Expiración automática a los 10 minutos.
* Reenvío de código.
* Cambio seguro de contraseña utilizando BCrypt.
* Limpieza automática del código después del cambio exitoso.
* Validación de complejidad mínima de contraseña.
* Pantallas dedicadas:
  * forgot-password.tsx
  * reset-password.tsx

## Backend

Archivos modificados:

* User.java
* AuthService.java
* AuthController.java
* EmailService.java
* SecurityConfig.java

Archivos creados:

* ForgotPasswordRequestDTO.java
* ResetPasswordRequestDTO.java

## Frontend

Archivos modificados:

* index.tsx
* authService.ts
* _layout.tsx

Archivos creados:

* forgot-password.tsx
* reset-password.tsx

## Base de datos

Nuevas columnas:

* password_reset_code
* password_reset_code_expires_at

## Validaciones realizadas

* Solicitud de recuperación.
* Recepción de correo.
* Código inválido.
* Código expirado.
* Reenvío de código.
* Cambio exitoso de contraseña.
* Login posterior al cambio.

---

# v1.2 - Validación de Horarios de Pedido

Fecha: Junio 2026

## Nuevas funcionalidades

### Restricciones de horario de recojo

Se implementó validación integral para la selección de horarios de recojo.

Incluye:

* Horario de atención configurable en código.
* Tiempo mínimo de preparación.
* Generación dinámica de horarios disponibles.
* Bloqueo de horarios vencidos.
* Validación frontend.
* Validación backend.

Parámetros actuales:

* Apertura: 07:00
* Cierre: 21:00
* Preparación mínima: 20 minutos
* Intervalo de recojo: 30 minutos

## Backend

Archivos modificados:

* OrderService.java

## Frontend

Archivos modificados:

* home.tsx
* orderService.ts

## Validaciones realizadas

* Pedido dentro del horario permitido.
* Pedido fuera de horario.
* Pedido con tiempo insuficiente de preparación.
* Validación mediante cambio manual de hora del equipo.
* Validación en frontend y backend.

Impacto:

Se evita la creación de pedidos inválidos y se mejora la experiencia operativa de la cafetería.

---

# v1.3 - Product Customization

Fecha: Junio 2026

## Nuevas funcionalidades

### Personalización de Productos

Se implementó personalización básica de productos mediante selección de salsas.

Incluye:

* Modal de personalización.
* Soporte para productos configurables.
* Persistencia de personalización en pedidos.
* Visualización en carrito.
* Visualización en Mis Pedidos.
* Visualización en Administración de Pedidos.

Backend:

Archivos modificados:

* Product.java
* OrderItem.java
* OrderItemRequestDTO.java
* OrderItemResponseDTO.java
* OrderService.java
* ProductResponseDTO.java
* ProductService.java

Frontend:

Archivos modificados:

* home.tsx
* orderService.ts
* my-orders.tsx
* admin-orders.tsx

Base de datos:

Migración:

* V1_3__product_customization.sql

Nuevas columnas:

products:
* customizable

order_items:
* customization_notes

Validaciones realizadas:

* Producto personalizable.
* Producto no personalizable.
* Dos personalizaciones distintas.
* Eliminación independiente en carrito.
* Persistencia en base de datos.
* Visualización en pedidos.
* Visualización administrativa.

---

# v1.4 - Administración de Productos Personalizables y Mejora Visual del Modal

Fecha: Junio 2026

## Nuevas funcionalidades

### Administración del atributo personalizable

Se completó la gestión del atributo `customizable` desde la administración de productos.

Incluye:

* Creación de productos personalizables.
* Edición de productos personalizables.
* Persistencia del atributo en base de datos.
* Exposición del atributo en las respuestas del API.
* Visualización y edición desde la pantalla administrativa.

### Mejora visual del modal de personalización

Se mejoró la experiencia visual del modal que aparece al seleccionar un producto personalizable.

Incluye:

* Encabezado con nombre del producto.
* Opciones de salsas presentadas como chips seleccionables.
* Contador de opciones seleccionadas.
* Botón principal más claro: Agregar al carrito.
* Modal visualmente más cercano a una aplicación comercial.

## Backend

Archivos modificados:

* ProductRequestDTO.java
* ProductService.java

## Frontend

Archivos modificados:

* admin-products.tsx
* home.tsx

## Base de datos

No se requirieron cambios adicionales de estructura.

La columna `products.customizable` ya existía desde la versión v1.3.

## Validaciones realizadas

* Crear producto personalizable.
* Crear producto no personalizable.
* Editar producto de no personalizable a personalizable.
* Editar producto de personalizable a no personalizable.
* Validar persistencia en base de datos.
* Validar respuesta del API.
* Validar visualización y edición desde administración.
* Validar modal visual de personalización en menú.

Impacto:

La administración de productos personalizables queda completa y el usuario final cuenta con una experiencia visual más clara al personalizar productos.

---

# v1.5 - Gestión de Usuarios y Roles

Fecha: Junio 2026

## Nuevas funcionalidades

### Administración de Usuarios

Se implementó el módulo completo de gestión administrativa de usuarios.

Incluye:

* Listado de usuarios.
* Búsqueda por nombre, correo o rol.
* Filtro por rol.
* Creación de usuarios administrativos.
* Edición de usuarios.
* Activación y desactivación de usuarios.
* Reseteo administrativo de contraseña.
* Visualización de códigos de verificación y recuperación.
* Dashboard con indicadores de usuarios.

### Nuevo Rol WORKER

Roles soportados:

* ADMIN
* WORKER
* USER

## Backend

Archivos modificados:

* UserController.java
* UserService.java
* UserResponseDTO.java
* SecurityConfig.java

Archivos creados:

* UserUpdateRequestDTO.java

## Frontend

Archivos modificados:

* home.tsx
* userService.ts
* apiClient.ts

Archivos creados:

* admin-users.tsx

## Validaciones realizadas

* Crear usuario USER.
* Crear usuario WORKER.
* Crear usuario ADMIN.
* Editar usuario.
* Activar usuario.
* Desactivar usuario.
* Resetear contraseña.
* Login con contraseña temporal.
* Validación de permisos ADMIN.

Impacto:

CofiGO cuenta con gestión administrativa completa de usuarios y soporte para múltiples perfiles operativos.

---

# v1.5.1 - Fortalecimiento de Gestión de Productos

Fecha: Junio 2026

## Mejoras implementadas

### Calidad de datos

- Validación de nombre obligatorio.
- Validación de longitud mínima y máxima.
- Validación de descripción.
- Validación de precio mayor a cero.
- Formato automático de precio con dos decimales.
- Restricción de caracteres inválidos en precio.
- Restricción de caracteres inválidos en stock.
- Validación de URL de imagen.
- Limpieza automática de espacios mediante trim().

### Experiencia de usuario

- Incorporación de etiquetas visibles en formulario.
- Sustitución del selector de personalización por checkbox.
- Mensajes de validación mejorados.

### Inventario

- Indicadores visuales de stock:
  - Stock normal
  - Stock bajo
  - Sin stock

### Backend

- Prevención de productos duplicados.
- Validación de nombres únicos ignorando mayúsculas y minúsculas.

---

## 2026-06-13 - Mejoras Home, Admin Pedidos y Notificación Visual

Estado: Completado

Cambios realizados:

- Se agregó mensaje de bienvenida en Home con el nombre del usuario autenticado.
- Se agregó visualización del rol del usuario en Home.
- Se corrigió la obtención del nombre del usuario desde la información almacenada después del login.
- Se ordenaron los pedidos administrativos por hora de atención / recojo.
- Se corrigió la alineación de estados entre frontend y backend:
  - RECEIVED
  - IN_PREPARATION
  - READY_FOR_PICKUP
  - DELIVERED
  - CANCELLED
- Se implementó notificación visual en Mis Pedidos cuando un pedido está listo para recoger.
- Se validó el flujo completo end-to-end.

Archivos modificados:

- home.tsx
- admin-orders.tsx
- my-orders.tsx
- authService.ts

Resultado:

Sistema validado correctamente en local.

---

## v1.5.2

Fecha: 2026-06

### Mejoras

- Corrección de generación de horarios de recojo.
- Eliminado horario inválido 21:30.
- Refactorización de generatePickupOptions().
- Uso efectivo de PICKUP_INTERVAL_MINUTES.
- Corrección de warning ESLint por dependencia router en useEffect.
- Limpieza de código TypeScript eliminando variable error no utilizada.

### Impacto

- Sin cambios de base de datos.
- Sin cambios de API.
- Sin cambios de despliegue.

---

## v1.5.3

Fecha: 2026-06

### Mejoras

- Incorporado botón Limpiar en registro de productos.
- Incorporado botón Cancelar durante edición de productos.
- Nuevo filtro por estado en administración de productos.
- Filtros disponibles:
  - Todos
  - Activos
  - Inactivos
  - Sin stock

### Impacto

- Sin cambios de base de datos.
- Sin cambios de API.
- Sin cambios de backend.

---

# v1.5.4 - Adaptación Móvil Fase 1

Fecha: 2026-06

## Mejoras

### Adaptación Responsive de Home

Se implementó la primera fase de soporte móvil para la pantalla principal del sistema.

Incluye:

* Layout responsive para dispositivos móviles.
* Reorganización vertical de catálogo y carrito.
* Visualización optimizada de productos en iPhone.
* Mejora de navegación administrativa en móvil.
* Scroll horizontal para categorías.
* Scroll horizontal para acciones administrativas.
* Visualización correcta de mensajes de confirmación dentro del carrito móvil.
* Validación funcional mediante iPhone Simulator.

## Frontend

Archivos modificados:

* home.tsx

## Validaciones realizadas

* Login en iPhone Simulator.
* Navegación en menú digital.
* Scroll vertical de catálogo.
* Scroll horizontal de categorías.
* Productos personalizables.
* Modal de personalización.
* Carrito.
* Selección de horario.
* Registro de pedido.
* Consulta de Mis Pedidos.

## Impacto

CofiGO incorpora soporte funcional para dispositivos iPhone manteniendo compatibilidad completa con la experiencia desktop.

---

# v1.5.5 - Corrección Horaria Perú y Stock Post Pedido

Fecha: 2026-06

## Correcciones

### Zona horaria oficial de cafetería

Se corrigió la validación de horarios de recojo para utilizar la zona horaria oficial de Perú.

Zona horaria oficial:

* America/Lima

Impacto:

* Evita inconsistencias entre la hora del usuario, la hora del servidor Railway y la hora real de operación de la cafetería.
* Permite que usuarios fuera de Perú visualicen y registren pedidos usando la hora oficial del negocio.

### Actualización de stock posterior al pedido

Se corrigió el comportamiento del menú digital para refrescar automáticamente los productos después de registrar un pedido.

Impacto:

* El stock visible se actualiza inmediatamente después de crear el pedido.
* Se evita mostrar stock desactualizado al usuario.
* Se mejora la consistencia entre frontend y backend.

### Mensajes de error

Se validó la propagación de mensajes reales del backend hacia el frontend.

Impacto:

* El usuario visualiza mensajes de negocio más claros.
* Se evita mostrar únicamente mensajes genéricos como "Error creando pedido".

## Backend

Archivos modificados:

* OrderService.java

## Frontend

Archivos modificados:

* home.tsx
* orderService.ts

## Validaciones realizadas

* Generación de horarios usando America/Lima.
* Validación backend usando America/Lima.
* Creación de pedido en producción.
* Actualización inmediata de stock en menú.
* Visualización de mensaje de éxito/error en móvil.

---

Fin del documento.
