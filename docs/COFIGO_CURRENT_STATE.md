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

v1.4

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

Reglas actuales de horario:

* Horario de atención: 07:00 a 21:00
* Tiempo mínimo de preparación: 20 minutos
* Intervalo de recojo: 30 minutos
* Los parámetros se encuentran centralizados en código como solución MVP

Estados soportados:

* RECEIVED
* PREPARING
* READY
* DELIVERED
* CANCELLED

---

## Administración de Pedidos

Estado:

🟢 Completo

Funcionalidades:

* Consulta de pedidos
* Cambio de estado
* Refresco automático

---

# Funcionalidades Parciales

## Categorías

Estado:

🟡 Parcial

Backend:

* Crear categoría
* Consultar categorías

Frontend:

* Consumo de categorías

Pendiente:

* Pantalla dedicada de administración
* Edición de categorías
* Activación / Desactivación
* Eliminación lógica

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

🔴 Pendiente

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
2. Gestión de Categorías
3. Reportes Frontend

Prioridad Media Alta:

1. Gestión de Configuración de Cafetería

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

---

# Responsable de Actualización

Toda modificación funcional deberá actualizar este documento.

Fin del documento.
