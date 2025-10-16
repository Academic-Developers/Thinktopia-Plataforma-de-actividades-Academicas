# 📚 Thinktopia - Backend API

Backend desarrollado con **Django REST Framework** para la gestión de actividades académicas.

---

## 🚀 Tecnologías utilizadas

- **Python 3.x**
- **Django 5.2.6**
- **Django REST Framework** - API RESTful
- **PostgreSQL** - Base de datos
- **django-cors-headers** - Manejo de CORS para el frontend

---

## 📂 Estructura del proyecto

```
backend/
├── academico/          # Módulo de gestión académica (Materias, Materiales, Actividades)
├── users/              # Módulo de gestión de usuarios
├── thinktopia/         # Configuración principal del proyecto
├── media/              # Archivos subidos por los usuarios que son proveniente de Materiales y Actividades
├── manage.py           # Script de gestión de Django
└── requirements.txt    # Dependencias del proyecto
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio y navegar al backend

```bash
cd backend
```

### 2. Crear y activar entorno virtual

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# o
source venv/bin/activate     # Linux/Mac
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con:

```env
SECRET_KEY=tu-clave-secreta
DEBUG=True
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=5432
```

### 5. Aplicar migraciones

```bash
python manage.py migrate
```

### 6. Ejecutar el servidor

```bash
python manage.py runserver
```

El servidor estará disponible en: **http://localhost:8000**

---

## 📡 API Endpoints

### 🔐 Módulo de Usuarios (`/api/`)

#### **Registro de usuario**
- **POST** `/api/registro/`
- **Body:**
  ```json
  {
    "email": "usuario@mail.com",
    "password": "contraseña123",
    "role": "docente" // o "alumno"
  }
  ```
- **Respuesta:** `201 Created`

#### **Login**
- **POST** `/api/login/`
- **Body:**
  ```json
  {
    "email": "usuario@mail.com",
    "password": "contraseña123"
  }
  ```
- **Respuesta:**
  ```json
  {
    "id": 1,
    "email": "usuario@mail.com",
    "role": "docente"
  }
  ```

#### **Listar todos los usuarios**
- **GET** `/api/usuarios/`
- **Respuesta:** Array con `[{ id, email, role }, ...]`

---

### 📚 Módulo Académico (`/api/`)

#### **MATERIAS**

##### Listar materias
- **GET** `/api/materias/` - Lista todas las materias
- **GET** `/api/materias/?user_id=1` - Lista materias de un usuario específico

##### Obtener detalle de una materia
- **GET** `/api/materias/{id}/`

##### Crear materia
- **POST** `/api/materias/`
- **Body:**
  ```json
  {
    "nombre": "Matemáticas",
    "codigo": "MAT101",
    "descripcion": "Descripción de la materia",
    "usuarios": [1, 2, 3]  // IDs de usuarios a asignar (opcional)
  }
  ```

##### Actualizar materia
- **PUT** `/api/materias/{id}/`
- **Body:** Campos a actualizar (igual que crear)

##### Eliminar materia
- **DELETE** `/api/materias/{id}/`
- **Respuesta:** `204 No Content`

---

#### **MATERIALES DE ESTUDIO**

##### Listar materiales de una materia
- **GET** `/api/materialestudio/?materia_id=1`

##### Obtener detalle de un material
- **GET** `/api/materialestudio/{id}/`

##### Crear material de estudio
- **POST** `/api/materialestudio/`
- **Content-Type:** `multipart/form-data`
- **Body (FormData):**
  ```
  titulo: "Guía de ejercicios"
  descripcion: "Material de apoyo"
  archivo: [archivo.pdf]
  materia: 1
  autor: 1
  ```

##### Actualizar material
- **PUT** `/api/materialestudio/{id}/`
- **Content-Type:** `multipart/form-data`

##### Eliminar material
- **DELETE** `/api/materialestudio/{id}/`

---

#### **ACTIVIDADES**

##### Listar actividades de una materia
- **GET** `/api/actividades/?materia_id=1&user_id=1`

##### Obtener detalle de una actividad
- **GET** `/api/actividades/{id}/`

##### Crear actividad
- **POST** `/api/actividades/`
- **Content-Type:** `multipart/form-data`
- **Body (FormData):**
  ```
  titulo: "Trabajo Práctico 1"
  descripcion: "Resolver ejercicios"
  tipo: "Práctico"
  archivo: [archivo.pdf]
  fecha_limite: "2025-12-31T23:59:59Z"
  materia: 1
  docente: 1
  ```

##### Actualizar actividad
- **PUT** `/api/actividades/{id}/`
- **Content-Type:** `multipart/form-data`

##### Eliminar actividad
- **DELETE** `/api/actividades/{id}/`

---

## 📋 Modelos de datos

### Usuario
- `email` (único)
- `password` (hash)
- `role` (docente/alumno)

### Materia
- `nombre`
- `codigo` (único)
- `descripcion`
- `usuarios` (Many-to-Many con Usuario)
- `created_at`, `updated_at`

### Material de Estudio
- `titulo`
- `descripcion`
- `archivo` (FileField)
- `materia` (ForeignKey)
- `autor` (ForeignKey a Usuario)
- `created_at`, `updated_at`

### Actividad
- `titulo`
- `descripcion`
- `tipo`
- `archivo` (FileField)
- `fecha_limite`
- `materia` (ForeignKey)
- `docente` (ForeignKey a Usuario)
- `created_at`, `updated_at`

---

## 📤 Subida de archivos

Los endpoints que manejan archivos (`/api/materialestudio/` y `/api/actividades/`) requieren:

- **Content-Type:** `multipart/form-data`
- **Uso de FormData** en el frontend (no JSON)
- Los archivos se almacenan en el directorio `media/`

**Ejemplo JavaScript:**
```javascript
const formData = new FormData();
formData.append('titulo', 'Mi material');
formData.append('archivo', archivoFile);
formData.append('materia', 1);
formData.append('autor', 1);

fetch('http://localhost:8000/api/materialestudio/', {
  method: 'POST',
  body: formData
});
```

---

## 🔧 Configuración CORS

El backend está configurado para aceptar peticiones desde:
- **http://localhost:4200** (Angular)

Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`

---

## 🗃️ Base de datos

- **Gestor:** PostgreSQL
- **ORM:** Django ORM
- **Migraciones:** `python manage.py migrate`

### Comandos útiles:

```bash
# Crear nuevas migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ver estado de migraciones
python manage.py showmigrations
```

---

## 📝 Notas importantes

### Relaciones en cascada
- Al eliminar una **Materia**, se eliminan automáticamente todos sus **Materiales de Estudio** y **Actividades** asociadas.
- Esto está configurado con `on_delete=models.CASCADE`.

### Validaciones
- Los emails deben ser únicos
- Los códigos de materia deben ser únicos
- Las contraseñas deben tener mínimo 8 caracteres
- Los campos `archivo` son opcionales (pueden ser nulos)

### Seguridad
- Las contraseñas se almacenan hasheadas
- CORS configurado para el origen específico del frontend
- Debug mode debe estar desactivado en producción

---

## 🐛 Solución de problemas comunes

### Error: "no existe la relación"
```bash
python manage.py migrate
```

### Error: "ModuleNotFoundError: No module named 'django'"
```bash
# Activar el entorno virtual
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Error 500 al subir archivos
- Verificar que el directorio `media/` existe
- Verificar que el Content-Type sea `multipart/form-data`
- Verificar que los parsers estén configurados en las vistas

---

## 👥 Roles de usuario

### Docente
- Puede ver materias
- Puede crear, editar y eliminar materiales de estudio
- Puede crear, editar y eliminar actividades


### Alumno
- Puede ver materias asignadas
- Puede ver materiales de estudio
- Puede ver actividades

---

