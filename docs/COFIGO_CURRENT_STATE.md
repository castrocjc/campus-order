# COFIGO_CURRENT_STATE.md

## Estado General

Fecha actualización: Junio 2026

Estado del proyecto:

🟢 Operativo en Producción

Ambiente Productivo:

* Frontend desplegado en Vercel
* Backend desplegado en Railway
* Base de datos MySQL en Railway

---

# Versión Actual

Versión funcional:

v1.5.11

Estado:

MVP Operativo

---

# Funcionalidades Completadas

## Autenticación

Estado:

🟢 Completo

Funcionalidades:

* Registro de usuario
* Login
* JWT
* Roles
* Verificación de correo electrónico
* Reenvío de código de verificación
* Logout

---


## Gestión de Usuarios

Estado:

🟢 Completo

Funcionalidades:

* Consulta de usuarios.
* Creación de usuarios administrativos.
* Edición de usuarios.
* Activación y desactivación.
* Reseteo de contraseña.
* Gestión de roles.
* Validación obligatoria de correo institucional.
* Reenvío de código de verificación desde mantenimiento para usuarios pendientes.
* Ocultamiento de códigos sensibles en pantalla administrativa.
* Usuarios creados por ADMIN se consideran verificados administrativamente.
- Validación detallada de campos obligatorios en formularios administrativos.

Roles soportados:

* ADMIN
* WORKER
* USER

---

## Gestión de Productos

Estado:

🟢 Completo

Funcionalidades:

* Crear producto
* Editar producto
* Activar producto
* Desactivar producto
* Gestión de stock
* Gestión de imágenes
* Asociación a categoría
* Productos personalizables
* Administración completa del atributo customizable en creación y edición de productos
* Validación de productos duplicados
* Validación avanzada de formularios
* Formato monetario automático
* Indicadores visuales de stock
* Limpieza automática de datos
* Filtros por estado (Activos, Inactivos, Sin stock)
* Limpieza rápida de formulario
* Cancelación de edición

---

## Personalización de Productos

Estado:

🟢 Completo

Funcionalidades:

* Productos configurables mediante flag customizable
* Selección de salsas
* Persistencia histórica en OrderItem
* Visualización en carrito
* Visualización en Mis Pedidos
* Visualización en Administración de Pedidos
* Modal visual mejorado para selección de personalización

---

## Menú Digital

Estado:

🟢 Completo

Funcionalidades:

* Consulta de productos disponibles
* Visualización de imágenes
* Filtrado por disponibilidad
* Experiencia responsive validada en iPhone Simulator
* Actualización automática de stock después de registrar pedido
* Validación defensiva de URLs de imágenes.
* Fallback automático a imagen referencial para Mobile Web.
* Compatibilidad validada con Safari iPhone físico.

---

## Carrito

Estado:

🟢 Completo

Funcionalidades:

* Agregar productos
* Modificar cantidades
* Eliminar productos
* Calcular total

Observación:

El carrito se almacena únicamente en frontend.

---

## Gestión de Pedidos

Estado:

🟢 Completo

Funcionalidades:

* Crear pedido
* Consultar pedidos
* Consultar pedidos propios
* Cancelar pedido
* Actualización automática
* Selección dinámica de hora de recojo
* Bloqueo de horarios vencidos
* Validación de horario de atención de cafetería
* Validación de tiempo mínimo de preparación
* Validación horaria basada en zona oficial America/Lima.
* Reversa automática de stock al cancelar pedidos.
* Cancelación consistente desde Mis Pedidos y Administración de Pedidos.
- Cancelación disponible únicamente para pedidos en estado RECEIVED.

Reglas actuales de horario:

* Horario de atención: 07:00 a 21:00
* Tiempo mínimo de preparación: 20 minutos
* Intervalo de recojo: 30 minutos
* Los parámetros se encuentran centralizados en código como solución MVP

Estados soportados:

* RECEIVED
* IN_PREPARATION
* READY_FOR_PICKUP
* DELIVERED
* CANCELLED

- Generación dinámica de horarios basada en PICKUP_INTERVAL_MINUTES.
- Corrección de límite de horario de cierre.

---

## Administración de Pedidos

Estado:

🟢 Completo

Funcionalidades:

* Consulta de pedidos
* Cambio de estado
* Refresco automático
* Indicador de ventas excluye pedidos cancelados.

---

## Experiencia Móvil

Estado:

🟢 Completo (Fase 1)

Funcionalidades:

* Layout responsive para Home.
* Catálogo optimizado para iPhone.
* Carrito adaptado para móvil.
* Navegación administrativa visible en móvil.
* Categorías con scroll horizontal.
* Mensajes operativos visibles en móvil.
* Protección ante datos locales corruptos en Safari iPhone.
* Lectura segura de carrito y usuario desde localStorage.
* Protección ante datos corruptos en localStorage.
* Compatibilidad validada con Safari iPhone.
* Validación realizada en iPhone físico mediante Mobile Web.
* Compatibilidad validada con Safari iPhone físico.
* Manejo seguro de imágenes inválidas.

Validado en:

* iPhone Simulator (Xcode)

---

# Funcionalidades Parciales

## Gestión de Categorías

Estado:

🟢 Completo

Funcionalidades:

* Consulta de categorías activas.
* Consulta administrativa de categorías.
* Creación de categorías.
* Edición de categorías.
* Activación y desactivación.
* Búsqueda por nombre y descripción.
* Dashboard administrativo.
* Prevención de categorías duplicadas.
* Validación de nombre obligatorio.
* Validación de longitud de nombre.
* Validación de longitud de descripción.
* Bloqueo de desactivación con productos activos.
* Exclusión automática de categorías inactivas en el menú digital.

---

## Reportes

Estado:

🟡 Parcial

Backend:

* Ventas por día

Frontend:

* No implementado

Pendiente:

* Dashboard visual
* Exportación
* Filtros

---

# Funcionalidades No Implementadas

## Dashboard Administrativo

Estado:

🔴 Pendiente

---

## Recuperar Contraseña

Estado:

🟢 Completo

Funcionalidades:

* Solicitud de código de recuperación por correo electrónico
* Envío de código mediante SendGrid
* Validación de código de recuperación
* Expiración de código
* Reenvío de código
* Cambio seguro de contraseña con BCrypt
* Limpieza del código después del cambio exitoso
* Validación mínima de contraseña en frontend

---

## Perfil de Usuario

Estado:

🔴 Pendiente

---

## Notificaciones

Estado:

🟡 Parcial

Funcionalidades:

- Notificación visual al usuario cuando un pedido está listo para recoger.

Pendiente:

- Notificación por correo cuando el pedido cambie a READY_FOR_PICKUP.

---

## Auditoría

Estado:

🔴 Pendiente

---

## Pagos Online

Estado:

🔴 Pendiente

---

## Multi Cafetería

Estado:

🔴 Pendiente

---

## Configuración de Cafetería

Estado:

🔴 Pendiente

Descripción:

Funcionalidad futura para administrar desde pantalla los parámetros operativos de la cafetería, como hora de apertura, hora de cierre, tiempo mínimo de preparación e intervalo de recojo.

Objetivo:

Evitar modificar código cuando cambien los horarios de atención o reglas operativas.

---

# Problemas Conocidos

## JWT Secret

Estado:

🟡 Mejora futura

Descripción:

La llave JWT se encuentra embebida en código.

Acción futura:

Migrar a variable de entorno.

---

## Persistencia del Carrito

Estado:

🟡 Comportamiento conocido

Descripción:

El carrito se pierde cuando el usuario abandona la sesión.

No representa un error.

---

# Funcionalidades Estables

Las siguientes funcionalidades se consideran estables y no deben modificarse sin análisis de impacto:

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

# Próximo Objetivo del Proyecto

Prioridad Alta:

1. Dashboard Administrativo
2. Reportes Frontend
3. Gestión de Configuración de Cafetería
4. Perfil de Usuario

---

# Última Validación Funcional

Estado:

🟢 Sistema operativo

Validaciones realizadas:

* Registro de usuario
* Verificación por correo
* Login
* Gestión de productos
* Gestión de productos personalizables desde administración
* Gestión de pedidos
* Validación de horarios de recojo
* Bloqueo de pedidos fuera de horario
* Despliegue en Railway
* Despliegue en Vercel
* Validación completa de Home en iPhone Simulator.
* Validación de flujo de compra móvil.
* Validación de creación de pedidos con zona horaria America/Lima.
* Validación de actualización inmediata de stock posterior al pedido.
* Validación de reversa de stock al cancelar pedidos desde Mis Pedidos.
* Validación de reversa de stock al cancelar pedidos desde Administración de Pedidos.
* Validación de prevención de doble reversa de stock en pedidos ya cancelados.
* Validación de login y carga de Home en Safari iPhone después de limpiar datos del sitio.
* Validación de lectura segura de localStorage en Home.
* Validación de Home después de login en Safari iPhone.
* Validación de recuperación ante datos corruptos en localStorage.
* Validación de actualización de ventas después de cancelar pedidos.
* Validación de correo institucional en registro público.
* Validación de correo institucional en administración de usuarios.
* Validación de reenvío de código desde mantenimiento.
* Validación de ocultamiento de códigos sensibles.
* Validación completa de Home en Safari iPhone físico.
* Validación de imágenes con fallback automático.
* Validación de catálogo Mobile Web.
* Validación de flujo completo de compra desde iPhone.

---

# Responsable de Actualización

Toda modificación funcional deberá actualizar este documento.

---

Fin del documento.
