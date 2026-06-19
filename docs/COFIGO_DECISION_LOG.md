# COFIGO_DECISION_LOG.md

# DEC-001

Fecha: 2026-06

Título:
Carrito gestionado exclusivamente en Frontend

Estado:
Aprobada

Contexto:

Durante el diseño inicial de CofiGO se evaluó implementar una entidad Cart en backend para persistir los productos seleccionados por cada usuario.

Decisión:

El carrito se implementa únicamente en frontend mediante estado local.

Justificación:

* Menor complejidad arquitectónica.
* Menor cantidad de tablas.
* Menor cantidad de endpoints.
* Mejor experiencia de usuario.
* Menor carga sobre backend.

Consecuencias:

Positivas:

* Desarrollo más rápido.
* Menor complejidad de mantenimiento.

Negativas:

* El carrito no persiste entre sesiones.
* Si el usuario cierra sesión pierde el carrito.

---

# DEC-002

Fecha: 2026-06

Título:
Uso de JWT para autenticación

Estado:
Aprobada

Contexto:

Se requería una solución moderna para autenticación entre frontend y backend.

Decisión:

Utilizar JSON Web Tokens (JWT).

Justificación:

* Arquitectura stateless.
* Compatible con aplicaciones web modernas.
* Integración nativa con Spring Security.
* Fácil despliegue en Railway y Vercel.

Consecuencias:

Positivas:

* Escalabilidad.
* Bajo acoplamiento.

Negativas:

* Requiere protección adecuada de la llave secreta.

Observación:

Actualmente la llave JWT se encuentra embebida en código y debe migrarse a variables de entorno en una futura mejora.

---

# DEC-003

Fecha: 2026-06

Título:
Uso de SendGrid para envío de correos

Estado:
Aprobada

Contexto:

La solución inicial basada en Gmail presentaba problemas de entregabilidad y clasificación como spam.

Decisión:

Migrar el servicio de correo a SendGrid.

Justificación:

* Mayor reputación de envío.
* Mejor tasa de entrega.
* Integración sencilla con Spring Boot.
* Mejor soporte para ambientes productivos.

Consecuencias:

Positivas:

* Correos de verificación más confiables.
* Mayor estabilidad.

Negativas:

* Dependencia de un servicio externo.

---

# DEC-004

Fecha: 2026-06

Título:
Despliegue en Railway y Vercel

Estado:
Aprobada

Contexto:

Se requería una solución sencilla y económica para ambientes productivos.

Decisión:

Frontend desplegado en Vercel.

Backend y base de datos desplegados en Railway.

Justificación:

* Configuración sencilla.
* Integración con GitHub.
* Bajo costo.
* Adecuado para proyectos académicos y MVP.

Consecuencias:

Positivas:

* Despliegues automáticos.
* Menor esfuerzo operativo.

Negativas:

* Dependencia de servicios SaaS.

---

# DEC-005

Fecha: 2026-06

Título:
Persistencia histórica de productos vendidos

Estado:
Aprobada

Contexto:

Un producto puede cambiar de nombre después de haberse vendido.

Decisión:

OrderItem almacena:

* productId
* productName

Justificación:

Permitir que los pedidos históricos mantengan la información original de la venta.

Consecuencias:

Positivas:

* Integridad histórica.
* Reportes más precisos.

Negativas:

* Duplicación controlada de información.

---

# DEC-006

Fecha: 2026-06

Título:
Order almacena userId en lugar de relación JPA directa

Estado:
Aprobada

Contexto:

Se buscó simplificar el modelo inicial de pedidos.

Decisión:

Order almacena únicamente userId.

Justificación:

* Menor complejidad.
* Desarrollo más rápido.
* Menor acoplamiento.

Consecuencias:

Positivas:

* Simplicidad.

Negativas:

* Algunas consultas requieren lógica adicional.
* Posible refactorización futura si crecen los requerimientos analíticos.

---

# DEC-007

Fecha: 2026-06

Título:
Expo Router como mecanismo de navegación

Estado:
Aprobada

Contexto:

El proyecto fue iniciado utilizando Expo Router.

Decisión:

Mantener Expo Router como estándar de navegación.

Justificación:

* Integración nativa con Expo.
* Menor configuración.
* Estructura basada en archivos.

Consecuencias:

Positivas:

* Desarrollo más rápido.
* Navegación consistente.

Negativas:

* Las futuras funcionalidades deben respetar esta arquitectura.

---

# DEC-008

Fecha: 2026-06

Título:
Activación y desactivación lógica de productos

Estado:
Aprobada

Contexto:

Se requiere preservar información histórica de productos.

Decisión:

Utilizar estado Active/Inactive en lugar de eliminación física.

Justificación:

* Preservar histórico.
* Evitar pérdida accidental de información.

Consecuencias:

Positivas:

* Mayor seguridad de datos.
* Mejor trazabilidad.

Negativas:

* Requiere filtros adicionales en consultas.

---

# DEC-009

Fecha: 2026-06

Título:
Recuperación de contraseña mediante código enviado por correo

Estado:
Aprobada

Contexto:

CofiGO requería permitir que los usuarios recuperen el acceso a su cuenta en caso de olvidar su contraseña, manteniendo el flujo simple y consistente con la verificación de correo ya existente.

Decisión:

Implementar recuperación de contraseña mediante un código de 6 dígitos enviado por correo electrónico usando SendGrid.

El código se almacena temporalmente en la entidad User mediante los campos:

* passwordResetCode
* passwordResetCodeExpiresAt

Justificación:

* Reutiliza el patrón existente de verificación por código.
* Evita crear nuevas tablas para el MVP.
* Reduce complejidad técnica.
* Mantiene bajo impacto sobre login, JWT y registro.
* Aprovecha la integración existente con SendGrid.

Consecuencias:

Positivas:

* Flujo simple para el usuario.
* Bajo impacto arquitectónico.
* Implementación rápida y consistente.
* Compatible con frontend y backend actuales.

Negativas:

* La entidad User asume más responsabilidad.
* En una versión futura podría evaluarse una tabla dedicada para tokens de recuperación.
* La entregabilidad del correo depende de la reputación/configuración de SendGrid.

Observación:

El código expira en 10 minutos. Después de cambiar la contraseña, el código y su fecha de expiración se limpian.

---

# DEC-010

Fecha: 2026-06

Título:
Parámetros de horario de atención y preparación para pedidos

Estado:
Aprobada

Contexto:

La funcionalidad de registro de pedidos permitía seleccionar horarios de recojo sin considerar la hora actual, el horario de atención de la cafetería ni el tiempo mínimo requerido para preparar un pedido.

Decisión:

Implementar reglas de horario para la creación de pedidos.

Parámetros actuales:

* Horario de atención: 07:00 a 21:00
* Tiempo mínimo de preparación: 20 minutos
* Intervalo de recojo: 30 minutos

Para el MVP, estos parámetros quedan centralizados en código en frontend y backend.

El frontend genera dinámicamente los horarios disponibles y bloquea la selección cuando no existen horarios válidos para el día.

El backend valida nuevamente la hora de recojo antes de crear el pedido, actuando como fuente de verdad de la regla de negocio.

Justificación:

* Evitar pedidos con horarios anteriores a la hora actual.
* Evitar pedidos fuera del horario de atención.
* Considerar el tiempo mínimo de preparación.
* Mejorar la experiencia de usuario.
* Proteger el endpoint ante llamadas directas desde herramientas externas como Postman.
* Mantener baja complejidad para el MVP.

Consecuencias:

Positivas:

* Mayor consistencia funcional.
* Mejor control operativo.
* Validación en doble capa: frontend y backend.
* Sin cambios de base de datos en esta iteración.

Negativas:

* Cambios de horario requieren modificación de código y despliegue.
* La configuración aún no puede ser administrada desde una pantalla.

Evolución futura:

Crear una entidad o tabla de configuración de cafetería, por ejemplo `CafeteriaSettings`, para administrar desde una pantalla los parámetros de operación.

Campos sugeridos:

* id
* openTime
* closeTime
* pickupIntervalMinutes
* minPreparationMinutes
* active
* createdAt
* updatedAt

Esta mejora será considerada en una siguiente iteración y servirá como base para Multi Cafetería, horarios especiales y administración operativa sin despliegues.

---

# DEC-011

Fecha: 2026-06

Título:
Personalización simple de productos

Estado:
Aprobada

Contexto:

Se requiere permitir que determinados productos puedan ser personalizados por el usuario al momento de agregarlos al carrito.

Ejemplos:

* Sándwiches
* Hamburguesas
* Productos con salsas o extras

Decisión:

Implementar una personalización simple basada en texto libre almacenado en OrderItem.

Se agregan los campos:

Product:
* customizable

OrderItem:
* customizationNotes

La personalización se selecciona en frontend y se almacena como un snapshot histórico dentro del pedido.

Ejemplo:

Mayonesa
Ketchup
Mostaza

Justificación:

* Baja complejidad.
* Compatible con la arquitectura MVP.
* No requiere nuevas tablas.
* Preserva el histórico de ventas.
* Compatible con reportes futuros.

Consecuencias:

Positivas:

* Implementación rápida.
* Bajo impacto arquitectónico.
* Compatible con pedidos históricos.

Negativas:

* Las opciones de personalización están definidas en código.
* No existe administración dinámica.

Evolución futura:

Crear entidades:

* ProductCustomizationGroup
* ProductCustomizationOption

para administración dinámica desde pantalla.

---

# DEC-012

Fecha: 2026-06

Título:
Administración del atributo personalizable y mejora visual del modal de personalización

Estado:
Aprobada

Contexto:

La funcionalidad de personalización simple ya existía para productos configurables mediante el flag `customizable`, pero el atributo no estaba completamente administrado desde la pantalla de gestión de productos. Además, el modal de selección de personalización en el menú funcionaba correctamente, pero tenía una presentación visual básica.

Decisión:

Incorporar la gestión completa del atributo `customizable` en la administración de productos y mejorar visualmente el modal de personalización mediante una experiencia basada en chips seleccionables.

Alcance implementado:

* Crear productos personalizables desde administración.
* Editar el atributo personalizable de productos existentes.
* Persistir el valor `customizable` desde backend.
* Exponer el valor actualizado en las respuestas de producto.
* Mejorar el modal de personalización en el menú digital.
* Mostrar opciones de personalización como chips visuales.
* Mostrar contador de opciones seleccionadas.
* Mejorar textos, espaciado, bordes y presentación general del modal.

Justificación:

* Permitir al administrador controlar qué productos requieren personalización.
* Evitar cambios manuales en base de datos.
* Mejorar la experiencia del usuario final.
* Mantener la solución alineada al alcance MVP sin crear nuevas tablas.
* Preservar compatibilidad con la persistencia histórica en `OrderItem.customizationNotes`.

Consecuencias:

Positivas:

* Mayor autonomía administrativa.
* Mejor usabilidad en el flujo de compra.
* Menor riesgo de error al configurar productos personalizables.
* Bajo impacto arquitectónico.
* Sin afectación a pedidos históricos.

Negativas:

* Las opciones de personalización continúan definidas en código.
* Aún no existe administración dinámica de grupos y opciones de personalización.

Evolución futura:

Crear entidades dedicadas para administrar opciones de personalización desde pantalla:

* ProductCustomizationGroup
* ProductCustomizationOption

Esto permitirá manejar configuraciones diferentes por producto, por ejemplo salsas para sándwiches, nivel de azúcar para bebidas o extras para platos preparados.

---

# DEC-013

Fecha: 2026-06

Título:
Gestión administrativa de usuarios y nuevo rol WORKER

Estado:
Aprobada

Decisión:

Implementar un módulo de gestión de usuarios y crear el rol WORKER.

Roles oficiales:

* ADMIN
* WORKER
* USER

Capacidades:

* Crear usuarios.
* Editar usuarios.
* Activar y desactivar usuarios.
* Resetear contraseñas.

Evolución futura:

* Evitar que un administrador se desactive a sí mismo.
* Evitar eliminar el último administrador activo.

---

# DEC-014

Fecha: 2026-06

Título:
Calidad de datos y prevención de duplicados en catálogo de productos

Estado:
Aprobada

Contexto:

La administración de productos permitía registrar información válida funcionalmente, pero existían riesgos asociados a duplicados, formatos inconsistentes y errores de captura.

Decisión:

Implementar validaciones adicionales en frontend y backend.

Alcance:

* Validación de nombres.
* Validación de precios.
* Validación de stock.
* Validación de URL.
* Limpieza mediante trim().
* Prevención de productos duplicados.
* Indicadores visuales de inventario.

Justificación:

Garantizar la calidad del catálogo de productos y reducir errores operativos.

Consecuencias positivas:

* Mayor calidad de datos.
* Mejor experiencia administrativa.
* Menor riesgo de inconsistencias.
* Mejor control operativo del inventario.

Consecuencias negativas:

* Reglas más estrictas para captura de datos.

---

# DEC-015

Fecha: 2026-06

Título:
Soporte oficial para pruebas móviles mediante iPhone Simulator

Estado:
Aprobada

Contexto:

El proyecto evolucionó inicialmente con foco en navegadores desktop, generando diferencias visuales y de experiencia en dispositivos móviles.

Decisión:

Incorporar iPhone Simulator como ambiente oficial de validación funcional para frontend.

Alcance:

* Safari Desktop
* Chrome Desktop
* iPhone Simulator
* iPhone físico (validación final)

Justificación:

* Detectar problemas responsive antes de producción.
* Reducir incidencias en dispositivos móviles.
* Mejorar experiencia de usuario.
* Facilitar evolución futura hacia aplicaciones móviles.

Consecuencias positivas:

* Mayor calidad visual.
* Mejor cobertura de pruebas.
* Menor riesgo de regresiones responsive.

Consecuencias negativas:

* Incrementa tiempo de validación previo a despliegue.

Observación:

La Adaptación Móvil Fase 1 se implementó inicialmente sobre home.tsx.

---

# DEC-016

Fecha: 2026-06

Título:
Nomenclatura oficial de estados de pedido

Persistencia:
RECEIVED
IN_PREPARATION
READY_FOR_PICKUP
DELIVERED
CANCELLED

Presentación UI:
Recibido
En Preparación
Listo para recoger
Entregado
Cancelado

---

# DEC-017

Fecha: 2026-06

Título:
Zona horaria oficial del sistema

Estado:
Aprobada

Contexto:

CofiGO será operado por una cafetería ubicada en Perú. Durante las pruebas desde México y despliegue en Railway se detectaron inconsistencias entre la hora del usuario, la hora del servidor y la hora real de operación del negocio.

Decisión:

Adoptar America/Lima como zona horaria oficial para reglas operativas de pedidos.

Alcance:

* Generación de horarios de recojo en frontend.
* Validación de tiempo mínimo de preparación en backend.
* Validación de horario de atención de cafetería.
* Construcción de fecha y hora de pickupTime.

Justificación:

* La cafetería operará en Perú.
* La hora relevante para el negocio es la hora local de Perú.
* Evita rechazos incorrectos de pedidos cuando el usuario prueba desde otro país.
* Reduce dependencia de la zona horaria del servidor Railway.

Consecuencias positivas:

* Mayor consistencia funcional.
* Validación horaria alineada al negocio.
* Mejor experiencia para usuarios fuera de Perú.
* Menor riesgo de errores por zona horaria.

Consecuencias negativas:

* En una futura funcionalidad Multi Cafetería se deberá parametrizar la zona horaria por cafetería.

Evolución futura:

Crear una configuración administrativa de cafetería que permita gestionar:

* Zona horaria.
* Hora de apertura.
* Hora de cierre.
* Tiempo mínimo de preparación.
* Intervalo de recojo.

---

# DEC-018

Fecha: 2026-06

Título:
Reversa de stock centralizada al cancelar pedidos

Estado:
Aprobada

Contexto:

El sistema descuenta stock correctamente al crear pedidos, pero al cancelar un pedido el inventario no se restauraba. La cancelación puede ejecutarse desde Mis Pedidos o desde Administración de Pedidos.

Decisión:

Centralizar la reversa de stock en backend dentro de OrderService.

La reversa se ejecuta únicamente cuando el pedido cambia por primera vez a estado CANCELLED.

Justificación:

* Evitar lógica duplicada en frontend.
* Garantizar consistencia desde cualquier punto de entrada.
* Evitar doble devolución de stock.
* Mantener el backend como fuente de verdad de las reglas de negocio.

Consecuencias positivas:

* Mayor consistencia de inventario.
* Menor riesgo de errores operativos.
* Flujo uniforme para usuario y administrador.
* No requiere cambios en base de datos.

Consecuencias negativas:

* La lógica de inventario queda más acoplada al ciclo de vida del pedido.

Evolución futura:

Agregar manejo transaccional explícito con @Transactional en los métodos de creación, cancelación y actualización de estado de pedidos.

---

# DEC-019

Fecha: 2026-06

Título:
Validación obligatoria de correo institucional y verificación administrativa de usuarios

Estado:
Aprobada

Contexto:

CofiGO requiere que todos los usuarios utilicen correos institucionales. Se detectó que el registro público validaba esta regla, pero la gestión administrativa de usuarios permitía crear o editar usuarios con correos no institucionales.

Decisión:

Centralizar la validación de correo institucional en backend y aplicarla en todos los flujos de creación y edición de usuarios.

Los usuarios creados desde administración se consideran verificados administrativamente, por lo que nacen activos y con emailVerified=true.

Adicionalmente, la pantalla de administración no debe mostrar códigos sensibles de verificación o recuperación. Para usuarios pendientes, se permite reenviar el código de verificación.

Justificación:

* Garantizar consistencia en todos los flujos.
* Mantener backend como fuente de verdad.
* Evitar exposición de códigos sensibles.
* Separar correctamente el registro público del mantenimiento administrativo.
* Reducir riesgo de usuarios externos no institucionales.

Consecuencias positivas:

* Mayor seguridad.
* Mejor control administrativo.
* Regla de negocio centralizada.
* Menor riesgo de inconsistencias.
* Mejor alineamiento con el contexto universitario.

Consecuencias negativas:

* Requiere configurar correctamente el dominio institucional en cada ambiente.

Observación:

La propiedad app.institution.email-domain debe estar configurada en local y producción.

---

# DEC-020

Fecha: 2026-06

Título:
Manejo defensivo de imágenes para Mobile Web

Estado:
Aprobada

Contexto:

Durante las pruebas realizadas en Safari iPhone se detectó que URLs de imágenes inválidas podían provocar errores de renderización en la pantalla Home.

Decisión:

Implementar validación defensiva de URLs de imágenes en frontend.

Cuando una URL no sea válida:

* Se utilizará una imagen referencial.
* Se evitará interrumpir el renderizado del catálogo.

Justificación:

* Mejorar estabilidad Mobile Web.
* Reducir dependencia de la calidad de los datos.
* Evitar caídas de Home por recursos externos inválidos.

Consecuencias positivas:

* Mayor robustez.
* Mejor experiencia móvil.
* Menor impacto de errores de datos.

Consecuencias negativas:

* Una imagen inválida puede ocultarse mediante placeholder y pasar desapercibida si no existe monitoreo administrativo.

Evolución futura:

Implementar validación obligatoria de URLs de imágenes en backend.

---

# DEC-021

Fecha: 2026-06

Título:
Gestión de Categorías y protección de integridad del catálogo

Estado:
Aprobada

Contexto:

Los productos dependen funcionalmente de una categoría. Desactivar categorías con productos activos podría provocar inconsistencias en el menú digital y en la administración del catálogo.

Decisión:

Implementar gestión administrativa completa de categorías mediante activación y desactivación lógica.

Reglas:

* Las categorías no se eliminan físicamente.
* No se permite desactivar categorías que tengan productos activos asociados.
* Los productos pertenecientes a categorías inactivas no se muestran en el menú digital.
* Se previenen categorías duplicadas ignorando mayúsculas y minúsculas.

Justificación:

* Preservar integridad del catálogo.
* Evitar inconsistencias operativas.
* Mantener trazabilidad histórica.
* Mantener alineación con la estrategia de eliminación lógica utilizada en productos.

Consecuencias positivas:

* Mayor calidad de datos.
* Menor riesgo operativo.
* Administración consistente.

Consecuencias negativas:

* Requiere validaciones adicionales entre productos y categorías.

---

# DEC-022

Fecha: 2026-06

Título:
Arquitectura de navegación basada en SideMenu y Layouts por Rol

Estado:
Aprobada

Contexto:

El crecimiento de módulos administrativos y operativos generaba navegación inconsistente mediante botones Volver y accesos independientes.

Decisión:

Implementar navegación persistente mediante SideMenu y layouts reutilizables.

Componentes:

* AdminLayout
* SideMenu

Roles:

ADMIN

* Dashboard
* Productos
* Categorías
* Usuarios
* Pedidos

WORKER

* Pedidos

USER

* Catálogo
* Mis Pedidos
* Perfil

Justificación:

* Mejor experiencia de usuario.
* Menor duplicidad de navegación.
* Consistencia visual.
* Escalabilidad futura.

Consecuencias positivas:

* Navegación uniforme.
* Menor mantenimiento.
* Incorporación sencilla de nuevos módulos.

Consecuencias negativas:

* Mayor dependencia de componentes compartidos.

Observación:

La pantalla de pedidos utiliza título dinámico:

* Panel administrador para ADMIN.
* Panel operario para WORKER.

---

# DEC-023

Fecha: 2026-06

Título:
Configuración dinámica de cafetería mediante entidad CafeteriaSettings

Estado:
Aprobada

Contexto:

Los horarios de atención, tiempo mínimo de preparación, intervalo de recojo y zona horaria se encontraban definidos en código tanto en frontend como en backend.

Decisión:

Crear las entidades:

* CafeteriaSettings
* CafeteriaSchedule

y trasladar la configuración operativa a base de datos.

Alcance:

* Home consume configuración dinámica.
* OrderService consume configuración dinámica.
* Administración mediante pantalla.
* Soporte para horarios diferentes por día.
* Soporte para días cerrados.

Justificación:

* Evitar despliegues por cambios operativos.
* Reducir hardcodeo.
* Mejorar escalabilidad.
* Preparar el camino hacia Multi Cafetería.

Consecuencias positivas:

* Configuración administrable.
* Menor dependencia de desarrolladores.
* Arquitectura más flexible.

Consecuencias negativas:

* Mayor complejidad del modelo de datos.

Observación:

La zona horaria deja de estar fija en America/Lima y pasa a ser configurable.

---

# DEC-024

Fecha: 2026-06

Título:
Perfil de Usuario con edición restringida

Estado:
Aprobada

Contexto:

Se requería habilitar la opción Perfil disponible en la navegación USER, permitiendo que el usuario gestione información personal sin afectar reglas sensibles de seguridad.

Decisión:

Permitir que el usuario edite únicamente:

* Nombre
* Celular

Mantener como solo lectura:

* Correo institucional
* Rol
* Estado de cuenta
* Estado de verificación de correo

Justificación:

* Reduce riesgos de seguridad.
* Evita complejidad por revalidación de correo institucional.
* Evita cambios no autorizados de rol o estado.
* Mantiene la administración de usuarios como fuente de control operativo.
* Permite una experiencia simple para el usuario final.

Consecuencias positivas:

* Perfil funcional con bajo riesgo de regresión.
* Separación clara entre autogestión y administración.
* Mayor control sobre datos sensibles.
* Preparación para futuras notificaciones.

Consecuencias negativas:

* El usuario no puede actualizar su correo desde Perfil.
* Si requiere cambio de correo, deberá gestionarse mediante administración.

---

# DEC-025

Fecha: 2026-06

Título:
Incorporación de celular para futuras notificaciones

Estado:
Aprobada

Contexto:

Se evaluó la posibilidad de notificar al usuario por SMS o WhatsApp cuando un pedido cambie al estado READY_FOR_PICKUP.

Decisión:

Agregar el atributo phone a la entidad User y permitir su gestión desde Perfil.

Justificación:

* Prepara el modelo de datos para futuras notificaciones.
* Evita modificar nuevamente la estructura User cuando se implemente SMS o WhatsApp.
* Permite capturar información de contacto sin obligarla en el registro inicial.
* Mantiene bajo impacto en el onboarding del usuario.

Consecuencias positivas:

* Base preparada para notificaciones móviles.
* Mejor información de contacto del usuario.
* Evolución compatible con SMS, WhatsApp o ambos.

Consecuencias negativas:

* El celular requiere validaciones adicionales.
* En una versión futura se deberá definir consentimiento explícito de notificaciones.

---

# DEC-026

Fecha: 2026-06

Título:
Arquitectura centralizada de notificaciones

Estado:
Aprobada

Contexto:

Se requiere notificar al usuario cuando un pedido cambie al estado READY_FOR_PICKUP.

En versiones futuras se planea incorporar WhatsApp y SMS.

Decisión:

Centralizar toda la lógica de notificaciones en NotificationService.

Arquitectura:

OrderService
→ NotificationService
→ EmailService

Justificación:

* Evitar mezclar reglas de negocio de pedidos con canales de comunicación.
* Facilitar incorporación futura de WhatsApp.
* Facilitar incorporación futura de SMS.
* Reducir duplicidad de lógica.

Consecuencias positivas:

* Mejor mantenibilidad.
* Menor acoplamiento.
* Arquitectura extensible.

Consecuencias negativas:

* Nuevo servicio adicional.

Evolución futura:

NotificationService
→ Email
→ WhatsApp
→ SMS

---

# DEC-027

Fecha: 2026-06

Título:
Arquitectura independiente para Reportes y Analítica Operativa

Estado:
Aprobada

Contexto:

El crecimiento de necesidades analíticas requería evitar agregar responsabilidades de reportes dentro de OrderController y OrderService.

Decisión:

Crear un módulo independiente de reportes compuesto por:

* ReportsController
* ReportsService

La analítica se separa de la operación transaccional.

Reglas oficiales:

* Ventas consideran únicamente pedidos DELIVERED.
* Ticket promedio = Ventas entregadas / Pedidos entregados.
* Productos vendidos consideran únicamente pedidos DELIVERED.
* CANCELLED participa únicamente en análisis de estados.
* CANCELLED no participa en ventas.

Justificación:

* Separación de responsabilidades.
* Escalabilidad futura.
* Mejor mantenibilidad.
* Preparación para exportación y BI.

Consecuencias positivas:

* Menor acoplamiento.
* Mejor organización arquitectónica.
* Facilidad para incorporar nuevos reportes.

Consecuencias negativas:

* Nueva capa funcional.
* Más endpoints que mantener.

---

# DEC-028

Fecha: 2026-06

Título:
Administración de Pedidos enfocada en operación diaria

Estado:
Aprobada

Contexto:

La pantalla administrativa mostraba simultáneamente pedidos históricos y pedidos vigentes, generando ruido operativo para ADMIN y WORKER.

Decisión:

La pantalla administrativa de pedidos mostrará únicamente pedidos cuya fecha de recojo (pickupTime) corresponda al día operativo actual.

El filtrado se realiza en backend.

La fecha operativa utiliza la zona horaria configurada en CafeteriaSettings.

Justificación:

* Reducir ruido visual.
* Facilitar la operación diaria.
* Mantener backend como fuente de verdad.
* Mejorar escalabilidad futura.

Consecuencias positivas:

* Operación más limpia.
* Menor volumen de información.
* Mejor experiencia para ADMIN y WORKER.

Consecuencias negativas:

* Los pedidos históricos dejan de ser visibles desde la pantalla operativa.

Evolución futura:

* Consulta histórica de pedidos.
* Cierre operativo diario.
* Estado NOT_ATTENDED para pedidos no atendidos.

---

Fin del documento.
