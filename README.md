# Thinktopia-Plataforma-de-actividades-Academicas

## Descripción del Proyecto
Este proyecto consiste en la creación de una plataforma web para gestionar y registrar actividades académicas en instituciones educativas. La plataforma busca mejorar la organización, participación y motivación de los estudiantes.


---

## Propósito
El propósito principal del sistema es facilitar la organización de actividades académicas, permitiendo a docentes y estudiantes registrar, gestionar y seguir el progreso de las actividades mediante una interfaz intuitiva y motivacional.

---

## Audiencia Objetivo
- Docentes y estudiantes de instituciones secundarias y universitarias.

---

## Objetivos Específicos
- Diseñar una interfaz accesible y comprensible que favorezca la interacción autónoma y significativa de estudiantes y docentes con la plataforma.
- Desarrollar herramientas que faciliten la planificación, entrega y seguimiento de actividades académicas, integrando la retroalimentación continua.
- Implementar un sistema de ingreso con validación de identidad y asignación de roles, que garantice un entorno seguro y acorde a las funciones pedagógicas de cada usuario.
- Integrar las capas del frontend y backend para lograr un sistema Full-Stack funcional, escalable y seguro


---

## Funcionalidades Claves
- Registro e inicio de sesión de usuarios (solo nombre, correo y rol).
- Gestión básica de actividades por parte del docente (crear, editar, eliminar).
- Visualización y entrega de actividades por parte del estudiante.
- Seguimiento básico de entrega (entregada / no entregada).


---

## Tecnologías Utilizadas
- **Frontend:** HTML, CSS, TypeScript, Angular, Boostrap.
- **Backend:** Django (Python).
- **Base de Datos:** POSTGRESQL.
  
---
## Requisitos Previos
Para ejecutar el proyecto, asegúrate de tener instalados los siguientes programas:
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [Python](https://www.python.org/) (versión 3.9 o superior)
* [Angular CLI](https://angular.io/cli) 

---

## Instalación y Ejecución
Sigue estos pasos para poner el proyecto en marcha:

### 1. Backend (Django)
1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/Thinktopia.git](https://github.com/tu-usuario/Thinktopia.git)
    cd Thinktopia/backend
    ```
2.  Crea y activa un entorno virtual (recomendado):
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```
3.  Instala las dependencias de Python:
    ```bash
    pip install -r requirements.txt
    ```
4.  Aplica las migraciones de la base de datos:
    ```bash
    python manage.py migrate
    ```
5.  Inicia el servidor local:
    ```bash
    python manage.py runserver
    ```

### 2. Frontend (Angular)
1.  Navega a la carpeta del frontend:
    ```bash
    cd ../frontend
    ```
2.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```
3.  Inicia la aplicación en el navegador:
    ```bash
    ng serve --open
    ```
    La aplicación estará disponible en `http://localhost:4200`.

---

## Personal Involucrado
| Nombre | Rol | Responsabilidades | Contacto |
|---------|-----|---------------------|----------|
| Francisco Nicolas Toro Goitea | Desarrollador | Gestión, análisis, diseño, testing  | torofrancisco13@gmail.com |
| Milagros Magaly Cabrera | Scrum | Gestión,desarrollo, análisis, diseño              | milagrosmagalycabrera@gmail.com |

---
##  Diseño y Metodología
Este proyecto se desarrolla bajo una **metodología ágil (Scrum)**, con un enfoque centrado en las necesidades del usuario.

### Estándares y Documentación

**Especificación de Requisitos:** El desarrollo se guía por el documento de **Especificación de Requisitos Software (ERS)**, estructurado según el estándar **ANSI/IEEE 830*.Este documento detalla los **Requisitos Funcionales (RF)**, **No Funcionales (RNF)**

**Planificación Ágil:** La priorización del trabajo se basa en un **Product Backlog** de Historias de Usuario (ej. US01, US02) inicialmente y luego en el **Kanban** de Github con sus  respectivas Historias de Usuario.

---
## Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Edge)
- Conexión a Internet

---
## Notas adicionales

•	Este proyecto se desarrolla bajo una metodología ágil, con énfasis en la flexibilidad y en las necesidades del usuario final.

• No se implementan protocolos avanzados de autenticación (ej. JWT, OAuth).

• Funcionalidades excluidas: Recuperación de Contraseña, Soporte Multilingüe, Chat/Videollamadas, Desbloqueo de Logros y Ranking.

•	La interfaz inicial tendrá accesibilidad limitada, priorizando funcionalidades clave en etapas tempranas.
________________________________________
## Licencia
Este proyecto es de uso académico y de colaboración abierto. Para mayor información, contacta a los responsables del proyecto.
________________________________________



