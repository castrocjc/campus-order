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
* IN_PREPARATION
* READY_FOR_PICKUP
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

## v1.5.6 - Junio 2026

### Corrección de inventario al cancelar pedidos

Se corrigió la lógica de cancelación de pedidos para restaurar el stock de los productos asociados al pedido cancelado.

Alcance:

* Cancelación desde Mis Pedidos.
* Cancelación desde Administración de Pedidos.
* Reversa de stock centralizada en backend.
* Prevención de doble reversa cuando el pedido ya está cancelado.

Impacto:

* Mejora la consistencia del inventario.
* No requiere cambios en frontend.
* No requiere cambios en base de datos.

---

---

# v1.5.7 - Estabilidad móvil Safari

Fecha: Junio 2026

## Corrección

### Protección ante datos locales corruptos

Se fortaleció la lectura de datos almacenados en localStorage para evitar errores en navegadores móviles, especialmente Safari iPhone.

Alcance:

* Lectura segura del carrito.
* Lectura segura del usuario autenticado.
* Limpieza automática de datos corruptos.
* Prevención de caída del Home después del login.

### Estabilidad móvil Safari

Se fortaleció la lectura de información almacenada en localStorage para evitar fallos en navegadores móviles.

Incluye:

* Lectura segura del carrito mediante try/catch.
* Lectura segura del usuario autenticado mediante try/catch.
* Limpieza automática de datos corruptos.
* Prevención de errores de renderización en Home después del login.

Archivos modificados:

* home.tsx

Impacto:

* Mejora la estabilidad en Safari iPhone.
* Sin cambios de backend.
* Sin cambios de base de datos.

### Corrección de indicador de ventas administrativas

Se corrigió el cálculo del indicador de ventas mostrado en Administración de Pedidos.

Incluye:

* Exclusión de pedidos CANCELLED del cálculo de ventas.
* Actualización consistente del total de ventas al cancelar pedidos.

Archivos modificados:

* admin-orders.tsx

Impacto:

* Indicadores financieros consistentes con el estado real de los pedidos.

## Frontend

Archivos modificados:

* home.tsx

## Impacto

* Sin cambios de backend.
* Sin cambios de base de datos.
* Sin cambios de API.
* Mejora la estabilidad en navegadores móviles.

---

# v1.5.8 - Seguridad y Control de Usuarios

Fecha: Junio 2026

## Mejoras

### Validación obligatoria de correo institucional

Se centralizó la validación de correo institucional en backend.

Alcance:

* Registro público.
* Creación administrativa de usuarios.
* Edición administrativa de usuarios.

### Seguridad administrativa

Se eliminaron de la interfaz administrativa:

* verificationCode
* passwordResetCode

### Gestión de usuarios pendientes

Se incorporó la opción de reenviar código de verificación desde administración.

## Backend

Archivos modificados:

* UserService.java

## Frontend

Archivos modificados:

* admin-users.tsx
* userService.ts

## Validaciones realizadas

* Registro con correo institucional.
* Bloqueo de correos externos.
* Creación administrativa.
* Edición administrativa.
* Reenvío de código.
* Ocultamiento de códigos sensibles.

## Impacto

Mayor seguridad y consistencia de reglas de negocio.

---

# v1.5.9 - Estabilidad Mobile Web y Validación Defensiva de Imágenes

Fecha: Junio 2026

## Correcciones

### Compatibilidad Mobile Web (Safari iPhone)

Se corrigió una falla de renderización que provocaba el cierre inesperado de la pantalla Home en Safari iPhone durante la carga del catálogo de productos.

Incluye:

* Identificación de imágenes con URLs inválidas.
* Validación defensiva de URLs de imágenes.
* Fallback automático hacia imagen referencial cuando la URL no es válida.
* Compatibilidad validada en Safari iPhone.
* Compatibilidad mantenida en Desktop Web.

### Calidad de Datos

Se detectó y corrigió información inválida en el catálogo:

Producto afectado:

* Producto sin stock demo

URL inválida detectada:

* http://images/inactivo.png

Se reemplazó por una URL válida.

## Frontend

Archivos modificados:

* home.tsx

## Base de Datos

Datos corregidos:

* products.image_url

## Validaciones realizadas

* Chrome Desktop.
* Safari Desktop.
* Safari iPhone.
* Login.
* Home.
* Catálogo.
* Carrito.
* Registro de pedido.
* Visualización de imágenes.

## Impacto

* Mayor estabilidad en Mobile Web.
* Prevención de errores provocados por URLs inválidas.
* Compatibilidad validada en Safari iPhone.

---

# v1.5.10 - Reglas de Cancelación y Validaciones de Usuario

Fecha: Junio 2026

Mejoras

Pedidos

- El botón Cancelar en Mis Pedidos solo se muestra para pedidos en estado RECEIVED.
- Se mantiene alineación completa con las reglas de negocio del backend.

Usuarios

- Mejora de mensajes de validación en Registro Público.
- Mejora de mensajes de validación en Administración de Usuarios.
- Identificación explícita de campos obligatorios faltantes.

Frontend

Archivos modificados:

- my-orders.tsx
- admin-users.tsx
- register.tsx

Impacto

- Mejor experiencia de usuario.
- Menor ambigüedad en formularios.
- Consistencia entre frontend y backend.

---

# v1.5.11 - Gestión de Categorías

Fecha: Junio 2026

## Nuevas funcionalidades

### Administración de Categorías

Se implementó el módulo completo de gestión administrativa de categorías.

Incluye:

* Listado de categorías.
* Búsqueda por nombre y descripción.
* Creación de categorías.
* Edición de categorías.
* Activación de categorías.
* Desactivación de categorías.
* Dashboard de indicadores.
* Prevención de categorías duplicadas.
* Validaciones de negocio.

### Reglas de negocio

* No se permite desactivar una categoría que tenga productos activos asociados.
* Los productos pertenecientes a categorías inactivas no se muestran en el menú digital.
* Las categorías se gestionan mediante eliminación lógica (active/inactive).

## Backend

Archivos modificados:

* CategoryController.java
* CategoryRepository.java
* ProductRepository.java

Archivos creados:

* CategoryService.java

## Frontend

Archivos modificados:

* home.tsx
* categoryService.ts

Archivos creados:

* admin-categories.tsx

## Validaciones realizadas

* Crear categoría.
* Editar categoría.
* Prevención de duplicados.
* Activar categoría.
* Desactivar categoría.
* Bloqueo de desactivación con productos activos.
* Búsqueda.
* Filtro Activas/Inactivas.
* Navegación administrativa.

Impacto:

CofiGO incorpora gestión administrativa completa de categorías y fortalece la integridad del catálogo.

---

# v1.5.12 - Armonización Visual de Administración de Usuarios

Fecha: Junio 2026

## Mejoras

### Unificación visual del Panel Administrativo

Se alineó la pantalla de Administración de Usuarios con el estándar visual oficial utilizado por Administración de Productos y Administración de Categorías.

Incluye:

* Unificación de colores institucionales CofiGO.
* Estandarización de encabezados administrativos.
* Estandarización de tarjetas de indicadores.
* Estandarización de formularios.
* Etiquetas de campos obligatorios (*).
* Placeholders con ejemplos de captura.
* Incorporación de botón Limpiar.
* Incorporación de botón Cancelar durante edición.
* Conservación completa de la compatibilidad responsive.

## Frontend

Archivos modificados:

* admin-users.tsx

## Validaciones realizadas

* Crear usuario.
* Editar usuario.
* Activar usuario.
* Desactivar usuario.
* Resetear contraseña.
* Reenviar código.
* Validación Desktop.
* Validación Mobile Web.

## Impacto

* Sin cambios de backend.
* Sin cambios de API.
* Sin cambios de base de datos.
* Consistencia visual completa del Panel Administrativo.

---

# v1.6 - Dashboard Administrativo, Navegación por Roles y Estandarización Visual

Fecha: Junio 2026

## Mejoras

Esta versión marca la consolidación del Panel Administrativo de CofiGO.

Incluye:

* Dashboard Administrativo.
* Gestión de Productos.
* Gestión de Categorías.
* Gestión de Usuarios.
* Gestión de Pedidos.
* Navegación por roles.
* SideMenu persistente.
* AdminLayout.
* Experiencia WORKER.
* Sincronización visual completa del sistema.

### Navegación persistente por rol

Se implementó una arquitectura de navegación unificada basada en SideMenu para todos los perfiles del sistema.

Roles soportados:

* ADMIN
* WORKER
* USER

### Panel Administrativo

Se consolidó la navegación administrativa mediante AdminLayout.

Incluye:

* Dashboard
* Productos
* Categorías
* Usuarios
* Pedidos

### Panel Operativo

Se habilitó navegación específica para WORKER.

Incluye:

* Pedidos
* Salir

La pantalla de pedidos muestra:

* Panel administrador para ADMIN.
* Panel operario para WORKER.

### Experiencia Usuario

Se unificó la navegación de usuario final.

Incluye:

* Catálogo
* Mis Pedidos
* Perfil
* Salir

### Armonización Visual

Se alinearon visualmente las siguientes pantallas:

* Dashboard
* Productos
* Categorías
* Usuarios
* Pedidos
* Home
* Mis Pedidos

## Frontend

Archivos modificados:

* AdminLayout.tsx
* SideMenu.tsx
* admin-orders.tsx
* admin-products.tsx
* admin-categories.tsx
* admin-users.tsx
* home.tsx
* my-orders.tsx

## Validaciones realizadas

* Navegación ADMIN.
* Navegación WORKER.
* Navegación USER.
* Persistencia de menú lateral.
* Responsive Desktop.
* Responsive Mobile Web.
* Validación funcional completa.

## Impacto

Se establece una arquitectura visual consistente para todos los perfiles del sistema.

---

# v1.7 - Configuración de Cafetería

Fecha: Junio 2026

## Nuevas funcionalidades

### Configuración Operativa de Cafetería

Se implementó un módulo completo para administrar los parámetros operativos de la cafetería sin necesidad de modificar código fuente.

Incluye:

* Nombre de cafetería.
* Descripción.
* Estado activa/inactiva.
* Dirección.
* Referencia.
* Teléfono.
* Zona horaria.
* Moneda.
* Tiempo mínimo de preparación.
* Intervalo de recojo.
* Horarios de atención por día de la semana.
* Días cerrados.

## Backend

Archivos creados:

* CafeteriaSettings.java
* CafeteriaSchedule.java
* CafeteriaSettingsController.java
* CafeteriaSettingsService.java
* CafeteriaSettingsRepository.java
* CafeteriaScheduleRepository.java
* CafeteriaSettingsRequestDTO.java
* CafeteriaSettingsResponseDTO.java

Archivos modificados:

* OrderService.java
* SecurityConfig.java

## Frontend

Archivos creados:

* admin-settings.tsx
* cafeteriaSettingsService.ts

Archivos modificados:

* home.tsx
* orderService.ts
* SideMenu.tsx

## Arquitectura

Se eliminaron los parámetros operativos hardcodeados del sistema:

* Hora de apertura.
* Hora de cierre.
* Tiempo mínimo de preparación.
* Intervalo de recojo.
* Zona horaria.

OrderService y Home ahora consumen la configuración desde CafeteriaSettings.

## Validaciones realizadas

* Cafetería activa.
* Cafetería inactiva.
* Domingo cerrado.
* Horario especial de sábado.
* Tiempo mínimo de preparación configurable.
* Intervalo de recojo configurable.
* Generación dinámica de horarios.
* Consumo de configuración desde Home.
* Validación backend mediante Postman.

## Impacto

CofiGO evoluciona de una configuración basada en código a una configuración administrable desde pantalla.

---

# v1.8 - Perfil de Usuario

Fecha: Junio 2026

## Nuevas funcionalidades

### Perfil de Usuario

Se implementó la pantalla Mi Perfil para usuarios finales.

Incluye:

* Consulta de información personal.
* Edición de nombre.
* Edición de celular.
* Visualización de correo institucional en modo solo lectura.
* Visualización de rol en modo solo lectura.
* Visualización de estado de cuenta en modo solo lectura.
* Visualización de estado de verificación de correo en modo solo lectura.
* Cambio seguro de contraseña desde Perfil.
* Sincronización del nombre actualizado en la sesión activa.
* Integración de Perfil en SideMenu USER.

## Backend

Archivos modificados:

* User.java
* UserController.java
* UserService.java
* UserResponseDTO.java
* SecurityConfig.java

Archivos creados:

* UserProfileUpdateRequestDTO.java
* ChangePasswordRequestDTO.java

## Frontend

Archivos modificados:

* SideMenu.tsx
* userService.ts

Archivos creados:

* profile.tsx

## Base de datos

Nueva columna:

* users.phone

## Endpoints nuevos

* GET /api/users/me
* PUT /api/users/me/profile
* PUT /api/users/me/password

## Validaciones realizadas

* Consulta de perfil autenticado.
* Actualización de nombre.
* Actualización de celular.
* Cambio de contraseña.
* Validación de contraseña actual.
* Validación de longitud mínima de contraseña.
* Validación de confirmación de contraseña.
* Login posterior al cambio de contraseña.
* Navegación USER hacia Perfil.
* Validación visual Desktop.

## Impacto

CofiGO incorpora gestión de perfil personal para usuarios finales y queda preparado para futuras notificaciones por SMS o WhatsApp usando el celular registrado.

---

# v1.9 - Notificaciones READY_FOR_PICKUP

Fecha: Junio 2026

## Nuevas funcionalidades

### Notificación automática de pedido listo para recoger

Se implementó el envío automático de correo electrónico cuando un pedido cambia por primera vez al estado READY_FOR_PICKUP.

Incluye:

* Envío automático mediante SendGrid.
* Plantilla HTML personalizada.
* Inclusión de nombre del usuario.
* Inclusión de número de pedido.
* Inclusión de hora de recojo.
* Inclusión del monto total.
* Prevención de envíos duplicados.
* Registro de estado de notificación en base de datos.

## Backend

Archivos modificados:

* Order.java
* OrderService.java
* EmailService.java

Archivos creados:

* NotificationService.java

## Base de datos

Nueva columna:

* orders.ready_for_pickup_notification_sent

## Arquitectura

Nuevo flujo:

OrderService
→ NotificationService
→ EmailService
→ SendGrid

## Validaciones realizadas

* Cambio RECEIVED → IN_PREPARATION.
* Cambio IN_PREPARATION → READY_FOR_PICKUP.
* Validación de correo enviado.
* Validación de contenido dinámico.
* Prevención de reenvío.
* Validación de flag en base de datos.

## Impacto

CofiGO incorpora notificaciones automáticas para mejorar la experiencia de recojo y queda preparado para futuras integraciones SMS y WhatsApp.

---

# v2.0 - Dashboard de Reportes y Analítica Operativa

Fecha: Junio 2026

## Nuevas funcionalidades

### Dashboard Analítico

Se implementó un módulo independiente de reportes para administración.

Incluye:

* Indicadores ejecutivos.
* Ventas totales.
* Pedidos totales.
* Ticket promedio.
* Productos vendidos.
* Usuarios registrados.
* Usuarios activos.
* Ventas por día.
* Pedidos por estado.
* Top productos vendidos.
* Horas pico.
* Filtros por rango de fechas.
* Validación de fechas.
* Dashboard visual integrado al Panel Administrativo.

## Backend

Archivos creados:

* ReportsController.java
* ReportsService.java

Archivos modificados:

* OrderRepository.java
* UserRepository.java
* ProductRepository.java

## Frontend

Archivos creados:

* admin-reports.tsx
* reportService.ts
* SalesByDayChart.tsx
* OrdersStatusChart.tsx
* PeakHoursChart.tsx

Archivos modificados:

* SideMenu.tsx

## Arquitectura

Se separa la analítica operativa de la gestión transaccional.

Nueva capa:

ReportsController
→ ReportsService
→ Repository

## Reglas de negocio

* Ventas consideran únicamente pedidos DELIVERED.
* Ticket promedio = Ventas entregadas / Pedidos entregados.
* Productos vendidos consideran únicamente pedidos DELIVERED.
* Pedidos CANCELLED aparecen en distribución de estados.
* Ventas excluyen CANCELLED.

## Validaciones realizadas

* Endpoints mediante Postman.
* Dashboard Desktop.
* Dashboard Mobile Web.
* Filtros por fecha.
* Gráfico de estados.
* Gráfico de horas pico.

## Impacto

CofiGO incorpora capacidades analíticas para soporte de decisiones operativas.

---

# v2.0.1 - Operación Diaria de Pedidos

Fecha: Junio 2026

## Mejoras

### Administración de Pedidos

Se ajustó la pantalla administrativa de pedidos para enfocarse exclusivamente en la operación diaria de la cafetería.

Incluye:

* Visualización únicamente de pedidos correspondientes al día operativo actual.
* Filtrado utilizando pickupTime.
* Exclusión automática de pedidos históricos.
* Exclusión automática de pedidos futuros.
* Ordenamiento por hora de recojo descendente.
* Mensaje informativo cuando no existen pedidos para el día.
* Compatibilidad con el mecanismo de refresco automático existente.

## Backend

Archivos modificados:

* OrderController.java
* OrderService.java
* OrderRepository.java

## Frontend

Archivos modificados:

* admin-orders.tsx

## Validaciones realizadas

* Visualización de pedidos del día.
* Exclusión de pedidos históricos.
* Exclusión de pedidos futuros.
* Refresco automático.
* Cambio de estados.
* Cancelación de pedidos.
* Actualización de indicadores.
* Ordenamiento por hora de recojo.

## Impacto

La pantalla de pedidos queda alineada con la operación diaria de la cafetería y preparada para una futura funcionalidad de cierre operativo.

---

# v2.1 - Cierre Operativo Diario

Fecha: Junio 2026

## Nuevas funcionalidades

### Cierre Operativo Diario

Se implementó un mecanismo administrativo para cerrar la operación diaria de pedidos al finalizar la jornada de atención.

Incluye:

* Nuevo estado NOT_ATTENDED.
* Cierre manual desde Administración de Pedidos.
* Conversión automática de pedidos pendientes a NOT_ATTENDED.
* Protección de pedidos DELIVERED.
* Protección de pedidos CANCELLED.
* Exclusión de NOT_ATTENDED del indicador de ventas operativas.
* Visualización de pedidos no atendidos para usuarios y administradores.
* Operación idempotente.

## Backend

Archivos modificados:

* OrderStatus.java
* OrderRepository.java
* OrderService.java
* OrderController.java

## Frontend

Archivos modificados:

* orderService.ts
* admin-orders.tsx
* my-orders.tsx

## Reglas de negocio

Transiciones permitidas:

* RECEIVED → NOT_ATTENDED
* IN_PREPARATION → NOT_ATTENDED
* READY_FOR_PICKUP → NOT_ATTENDED

Estados protegidos:

* DELIVERED
* CANCELLED
* NOT_ATTENDED

Inventario:

* El cierre operativo NO restaura stock.
* La reversa de stock continúa siendo exclusiva de CANCELLED.

## Validaciones realizadas

* Cierre de pedidos RECEIVED.
* Cierre de pedidos IN_PREPARATION.
* Cierre de pedidos READY_FOR_PICKUP.
* Protección de DELIVERED.
* Protección de CANCELLED.
* Validación de stock.
* Validación de interfaz administrativa.
* Validación de Mis Pedidos.

## Impacto

CofiGO incorpora el cierre formal de la jornada operativa y gestión de pedidos no atendidos.

---

Fin del documento.
