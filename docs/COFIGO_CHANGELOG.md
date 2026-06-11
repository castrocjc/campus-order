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

Fin del documento.
