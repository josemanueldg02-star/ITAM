🛡️ ITAM - IT Asset Management System
Un sistema integral de gestión de activos informáticos (ITAM) con arquitectura Full-Stack, diseñado con un fuerte enfoque en la ciberseguridad, trazabilidad y buenas prácticas de desarrollo empresarial.

🚀 Características Principales
Arquitectura Segura (RBAC): Control de acceso basado en roles. La interfaz y los endpoints se adaptan dinámicamente si el acceso pertenece a un Administrador o a un Usuario estándar.
Autenticación JWT: Gestión de sesiones stateless mediante JSON Web Tokens, protegiendo las rutas privadas y autorizando operaciones críticas.
Auditoría y Trazabilidad: Sistema de logging integrado (SLF4J) que registra en el servidor los eventos críticos de seguridad y los movimientos de hardware.
Validación Defensiva (Input Validation): Protección robusta de entrada de datos mediante Jakarta Validation para prevenir inyecciones y rechazar datos malformados antes de que alcancen la base de datos.
Documentación Viva: API RESTful completamente documentada de forma interactiva mediante Swagger/OpenAPI.
Gestión de Peticiones: Flujo completo de solicitud de hardware por parte de los empleados y su posterior aprobación/rechazo por parte de los administradores.
🛠️ Stack Tecnológico
Backend:
Java 21 / Spring Boot 3.x
Spring Security + JSON Web Tokens (JJWT)
Spring Data JPA (Hibernate)
Springdoc OpenAPI (Swagger)
Frontend:
React (Vite)
Tailwind CSS para el diseño de una UI/UX moderna y responsiva.
React Hot Toast para notificaciones asíncronas.
Base de Datos:
PostgreSQL
⚙️ Instalación y Despliegue Local
Requisitos Previos
Java 21 o superior.
Node.js (v18 o superior).
PostgreSQL ejecutándose localmente en el puerto 5432.
Fase 1: Configuración del Backend
Paso 1. Clonar el repositorio
Descarga el código fuente en tu máquina local.

Paso 2. Preparar la Base de Datos
Crea una base de datos vacía en tu gestor de PostgreSQL y llámala itam.

Paso 3. Configurar los Secretos
Navega a la carpeta del backend (src/main/resources/) y crea un archivo llamado application.properties. Este archivo está excluido en git para proteger tus datos. Añade tus credenciales locales:

Properties
# Conexión a la base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/itam
spring.datasource.username=TU_USUARIO_POSTGRES
spring.datasource.password=TU_PASSWORD_POSTGRES

# Configuración de Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Variables de Entorno (Secretos)
app.admin.username=admin
app.admin.password=admin123
app.default.user.password=1234
Paso 4. Iniciar el Servidor
Ejecuta la aplicación de Spring Boot. Las tablas de la base de datos y el usuario administrador inicial se generarán de forma totalmente automática.

Fase 2: Configuración del Frontend
Paso 1. Abrir la terminal
Abre una nueva terminal en tu sistema y navega hasta la raíz de la carpeta del proyecto frontend llamada itam-frontend.

Paso 2. Instalar dependencias
Ejecuta el gestor de paquetes para descargar e instalar todas las librerías necesarias (incluyendo React, Tailwind y Vite):

Bash
npm install
Paso 3. Iniciar el entorno de desarrollo
Ejecuta el siguiente comando para levantar el servidor local de Vite:

Bash
npm run dev
Paso 4. Acceder al portal
Abre tu navegador web y entra en http://localhost:5173 para ver la aplicación funcionando y conectada al backend de Spring Boot.

📚 Documentación de la API
Una vez que el backend esté en ejecución, puedes explorar, comprender y probar todos los endpoints a través de la interfaz gráfica de Swagger OpenAPI accediendo a:

👉 http://localhost:8081/swagger-ui.html

🛡️ Notas de Ciberseguridad
Este proyecto se ha diseñado aplicando principios básicos de SecDevOps y desarrollo seguro:
Protección de Secretos: Las credenciales temporales y de base de datos nunca se exponen en el código fuente.
Criptografía: Las contraseñas de los usuarios se almacenan cifradas utilizando el algoritmo unidireccional BCrypt.
Defensa en Profundidad: Las rutas de la API están doblemente protegidas (bóveda de Spring Security + Filtro personalizado de validación de firma JWT).
Desarrollado por José Manuel Domínguez García.