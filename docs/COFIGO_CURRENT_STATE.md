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

# Control de Versiones

| Ambiente   | Versión    | Estado     |
|------------|----------  |------------|
| Producción | v2.3.4     | Operativo  |
| Develop    | v2.3.4     | Operativo  |
| Main       | v2.3.4     | Operativo  |

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
- Interfaz administrativa alineada al estándar visual oficial CofiGO.

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
* Opciones de personalización administrables
* Persistencia histórica en OrderItem
* Visualización en carrito
* Visualización en Mis Pedidos
* Visualización en Administración de Pedidos
* Modal visual mejorado para selección de personalización
* Gestión administrativa de opciones de personalización
* Activación y desactivación de opciones
* Carga dinámica desde backend
* Campo libre de observaciones

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
* Cancelación disponible únicamente para pedidos en estado RECEIVED.
* Navegación persistente mediante menú lateral.
* Título dinámico por rol:
  * Panel administrador (ADMIN)
  * Panel operario (WORKER)
* Registro histórico completo de transiciones de estado mediante OrderStatusEvent.
* Conservación de fecha y hora de cada transición.
* Registro del usuario, rol y origen de cada cambio de estado.

Reglas actuales de horario:

* Las reglas operativas se obtienen dinámicamente desde Configuración de Cafetería.
* La hora mínima de recojo se calcula usando:

  MAX(hora actual, hora apertura) + tiempo mínimo de preparación.

* Si el usuario realiza un pedido antes de la apertura, la preparación inicia desde la hora de apertura.

Estados soportados:

* RECEIVED
* IN_PREPARATION
* READY_FOR_PICKUP
* DELIVERED
* NOT_ATTENDED
* CANCELLED

- Generación dinámica de horarios basada en PICKUP_INTERVAL_MINUTES.
- Corrección de límite de horario de cierre.

---

## Gestión Administrativa

* AdminLayout implementado como layout estándar.
* SideMenu administrativo persistente.
* Navegación unificada entre módulos administrativos.
* Consistencia visual entre Dashboard, Productos, Categorías, Usuarios y Pedidos.

---

## Administración de Pedidos

Estado:

🟢 Completo

Funcionalidades:

* Consulta de pedidos
* Cambio de estado
* Refresco automático
* Indicador de ventas excluye pedidos cancelados.
* Visualización exclusiva de pedidos del día operativo.
* Filtrado utilizando pickupTime.
* Exclusión automática de pedidos históricos.
* Exclusión automática de pedidos futuros.
* Ordenamiento por hora de recojo ascendente.
* El pedido con la hora de recojo más próxima aparece primero para facilitar la atención operativa.
* Mensaje informativo cuando no existen pedidos para el día.
* Cierre operativo diario manual.
* Conversión automática de pedidos pendientes a NOT_ATTENDED.
* Protección de pedidos DELIVERED y CANCELLED.

---

## Navegación por Roles

Estado:

🟢 Completo

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

Características:

* Menú lateral persistente.
* Navegación consistente.
* Sin botones Volver.
* Logout centralizado.

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

* Adaptación Móvil Fase 2 iniciada.
* SideMenu responsive validado.
* AdminLayout estabilizado.
* Perfil validado en desktop y mobile.
* Administración de Pedidos validada en desktop y mobile.
* Configuración de Cafetería validada en desktop y mobile.
* Administración de Productos pendiente de cierre en mobile web.

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

## Gestión de Personalizaciones

Estado:

🟢 Completo

Funcionalidades:

* Consulta administrativa.
* Creación.
* Edición.
* Activación.
* Desactivación.
* Búsqueda.
* Dashboard administrativo.
* Consumo dinámico desde Home.

---

## Reportes

Estado:

🟢 Completo

Funcionalidades:

* Dashboard Analítico.
* Indicadores ejecutivos.
* Ventas por día.
* Pedidos por estado.
* Top productos vendidos.
* Horas pico.
* Filtros por rango de fechas.
* Validación de fechas.
* Dashboard visual.
* Integración con AdminLayout.
* Integración con SideMenu.

Reglas:

* Ventas consideran únicamente pedidos DELIVERED.
* Ticket promedio considera únicamente pedidos DELIVERED.
* Pedidos CANCELLED participan en distribución de estados.

Observación:

La plataforma ya dispone de la información necesaria para incorporar indicadores operativos basados en tiempos por estado del pedido.

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

🟢 Completo

Funcionalidades:

* Consulta de perfil autenticado.
* Edición de nombre.
* Edición de celular.
* Visualización de correo institucional en modo solo lectura.
* Visualización de rol en modo solo lectura.
* Visualización de estado de cuenta en modo solo lectura.
* Visualización de estado de verificación de correo en modo solo lectura.
* Cambio seguro de contraseña.
* Sincronización del nombre actualizado en sesión activa.

Reglas:

* El usuario no puede modificar su correo institucional.
* El usuario no puede modificar su rol.
* El usuario no puede modificar su estado de cuenta.
* El usuario no puede modificar el estado de verificación de correo.
* El celular queda disponible para futuras notificaciones SMS o WhatsApp.

---

## Notificaciones

Estado:

🟢 Completo (Fase Email)

Funcionalidades:

* Notificación visual al usuario cuando un pedido está listo para recoger.
* Notificación automática por correo al cambiar a READY_FOR_PICKUP.
* Integración SendGrid.
* Prevención de notificaciones duplicadas.
* Registro de envío mediante flag en base de datos.

Pendiente:

* WhatsApp READY_FOR_PICKUP.

---

## Auditoría

Estado:

🟡 Parcial

Implementado:

* Auditoría del ciclo de vida de pedidos mediante OrderStatusEvent.

Pendiente:

* Auditoría de Productos.
* Auditoría de Categorías.
* Auditoría de Usuarios.
* Auditoría de Personalizaciones.
* Auditoría de Configuración de Cafetería.

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

🟢 Completo

Funcionalidades:

* Gestión de datos generales de cafetería.
* Gestión de ubicación.
* Gestión de zona horaria.
* Gestión de moneda.
* Gestión de tiempo mínimo de preparación.
* Gestión de intervalo de recojo.
* Gestión de horarios por día.
* Gestión de días cerrados.
* Configuración dinámica consumida por Home.
* Configuración dinámica consumida por OrderService.
* GET /api/cafeteria-settings es público para permitir consumo desde Login y Home.
* PUT /api/cafeteria-settings continúa restringido a ADMIN.

---

# Problemas Conocidos

## Administración de Productos Mobile Web

Estado:

🟡 Pendiente

Descripción:

La pantalla admin-products funciona correctamente en desktop web, pero en mobile web aún presenta problemas de superposición entre el listado de productos y el formulario de creación/edición.

Acción futura:

Revisar patrón responsive tomando como referencia Home y Perfil.

---

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

# Product Backlog Priorizado

Prioridad Alta

1. Repetir Pedido
2. Dashboard Administrativo Avanzado
3. Exportación de Reportes
4. Auditoría Administrativa

Prioridad Media

5. Gestión de Inventario Simple
6. WhatsApp READY_FOR_PICKUP

Prioridad Baja

7. Pagos Online
8. Monedero Universitario
9. Multi Cafetería

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
* Validación del registro histórico de eventos.
* Validación del evento de creación del pedido.
* Validación de cambios manuales de estado.
* Validación del cierre operativo diario.
* Validación del historial mediante consultas SQL.

---

# Responsable de Actualización

Toda modificación funcional deberá actualizar este documento.

---

Fin del documento.
