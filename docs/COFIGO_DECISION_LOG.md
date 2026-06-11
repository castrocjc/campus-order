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

Fin del documento.
