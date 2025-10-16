# 📚 Thinktopia - Plataforma de Actividades Académicas

> Plataforma web para gestión de contenido educativo entre docentes y alumnos.

---

## 🎯 Descripción del Proyecto

**Thinktopia** es una aplicación web desarrollada con **Angular 20** que permite a docentes gestionar materias, subir material de estudio, crear actividades y recibir entregas de los alumnos (Todavia no aplicado). Los alumnos pueden acceder a sus materias, descargar materiales y entregar sus actividades.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Angular** | 20.1.0 | Framework frontend |
| **TypeScript** | ~5.7.2 | Lenguaje de programación |
| **RxJS** | ~7.8.0 | Programación reactiva |
| **Django REST Framework** | - | Backend API |
| **HttpClient** | Angular | Comunicación con API |
| **Standalone Components** | Angular 20 | Arquitectura modular |

---

## 📁 Estructura del Proyecto

```
src/app/
├── features/              # Módulos principales por rol
│   ├── auth/             # Autenticación (Login/Registro)
│   ├── main/             # Páginas públicas (Home, About)
│   ├── docente/          # Dashboard y funcionalidades de docentes
│   └── alumno/           # Dashboard y funcionalidades de alumnos
│
├── services/             # Servicios para comunicación con API
│   ├── auth/            # Autenticación y autorización
│   ├── materia/         # Gestión de materias
│   ├── material-estudio/ # Materiales de estudio
│   ├── actividad.service.ts    # Gestión de actividades
│   ├── entregas.service.ts     # Gestión de entregas (No esta aplicado aun)
│   └── usuario.service.ts      # Gestión de usuarios
│
├── models/              # Interfaces y modelos TypeScript
│   ├── auth-models/     # User, LoginRequest, RegisterRequest
│   ├── materias-models/ # Materia, MateriaRequest
│   ├── actividad-models/# Actividad, ActividadRequest
│   ├── entregas-models/ # Entrega, EntregaRequest (No esta aplicado aun)
│   └── materiales-models/ # Material, MaterialRequest
│
└── shared/              # Componentes compartidos
    └── components/
        └── gestion-materias/  # CRUD de materias (Admin)
```

---

## 🔐 Módulo de Autenticación (`auth/`)

### **Páginas**
- **`login/`**: Inicio de sesión con email y contraseña
- **`register/`**: Registro de nuevos usuarios (Alumno/Docente)

### **Servicio: `AuthService`**
```typescript
// Métodos principales:
login(email, password)      // Iniciar sesión
register(datos)             // Registrar usuario
logout()                    // Cerrar sesión
getCurrentUser()            // Obtener usuario actual
getCurrentUserId()          // Obtener ID del usuario
isAuthenticated()           // Verificar autenticación
```

**Funcionalidades:**
- ✅ Validación de credenciales
- ✅ Almacenamiento en `localStorage`
- ✅ Gestión de token de sesión (localStorage)
- ✅ Redirección según rol (alumno/docente)
- ✅ Estado reactivo con `BehaviorSubject`

---

## 🏠 Módulo Main (Páginas Públicas)

### **Páginas**
- **`home/`**: Página principal con información del proyecto
- **`about/`**: Información sobre la plataforma
- **`admin-materias/`**: Panel de administración de materias (CRUD)

### **Componentes**
- **`main-header/`**: Barra de navegación principal
- **`main-footer/`**: Pie de página
- **`main-layout/`**: Layout wrapper

---

## 👨‍🏫 Módulo Docente (`docente/`)

### **Páginas**

#### **1. `materias/`**
- Lista de materias que enseña el docente
- Selección de materia para gestionar contenido

#### **2. `gestion-contenido/`**
- Crear y editar materias


#### **3. `material-estudio-docente/`**
- Subir archivos (PDF, Word, PPT, etc.)
- Organizar materiales por materia
- Editar y eliminar materiales

#### **4. `actividades/`**
- Subir archivos (PDF, Word, PPT, etc.)
- Ver todas las actividades creadas
- Editar y eliminar actividades


### **Componentes**
- **`docente-layout/`**: Layout del dashboard docente
- **`dashboard-docente-header/`**: Header con navegación
- **`dashboard-docente-footer/`**: Footer del dashboard
- **`contenido-form-modal/`**: Modal para crear/editar contenido

---

## 👨‍🎓 Módulo Alumno (`alumno/`)

### **Páginas**

#### **1. `materia/`**
- Lista de materias en las que está inscrito
- Selección de materia para acceder al contenido

#### **2. `material-estudio-alumno/`**
- Ver materiales de estudio disponibles
- Descargar archivos
- Organizado por materia seleccionada

#### **3. `actividades-alumno/`**
- Ver actividades asignadas
- Fechas de entrega y estado


### **Componentes**
- **`alumno-layout/`**: Layout del dashboard alumno
- **`dashboard-alumno-header/`**: Header con navegación
- **`dashboard-alumno-footer/`**: Footer del dashboard

---


## 🎨 Componente Compartido: Gestión de Materias

**Ubicación:** `shared/components/gestion-materias/`

### **Funcionalidades**
✅ **Crear materias**: Formulario con validaciones  
✅ **Editar materias**: Modificar información existente  
✅ **Eliminar materias**: Confirmación antes de eliminar  
✅ **Asignar usuarios**: Checkboxes para alumnos y docentes  
✅ **Validaciones**: Nombre (110 chars), código (10 chars)  
✅ **UI Moderna**: Modal responsive con animaciones  

### **Campos del Formulario**
- **Nombre** (requerido, max 110 caracteres)
- **Código** (requerido, max 10 caracteres, único)
- **Descripción** (opcional)
- **Usuarios asignados** (array de IDs, opcional)

---

## 🚀 Instalación y Configuración

### **1. Clonar el repositorio**
```bash
git clone <url-repositorio>
cd frontend
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/'  // URL del backend Django
};
```

### **4. Ejecutar el proyecto**
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

---

## 📡 Endpoints de API (Backend Django)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Iniciar sesión |
| POST | `/api/auth/registro/` | Registrar usuario |
| GET | `/api/materias/` | Listar materias |
| POST | `/api/materias/` | Crear materia |
| PUT | `/api/materias/{id}/` | Actualizar materia |
| DELETE | `/api/materias/{id}/` | Eliminar materia |
| GET | `/api/actividades/` | Listar actividades |
| POST | `/api/actividades/` | Crear actividad |
| GET | `/api/materiales/` | Listar materiales |
| POST | `/api/materiales/` | Subir material |
| GET | `/api/usuarios/` | Listar usuarios |

---

## 🔄 Flujo de Navegación

### **Usuario no autenticado**
```
Home → Login → Dashboard (según rol)
     → Register → Auto-login → Dashboard
```

### **Docente**
```
Dashboard Docente
├── Mis Materias → Seleccionar materia
├── Gestión de Actividades → Crear/Editar actividades
├── Gestion de Material de Estudio → Subir/Gestionar archivos

```

### **Alumno**
```
Dashboard Alumno
├── Mis Materias → Seleccionar materia
├── Material de Estudio → Descargar archivos
└── Actividades → Ver actividades → Subir entrega 
```

---

## 🎓 Características Técnicas

### **Arquitectura**
- ✅ **Standalone Components**: No usa NgModules
- ✅ **Lazy Loading**: Carga bajo demanda por módulos
- ✅ **Reactive Programming**: RxJS Observables
- ✅ **State Management**: BehaviorSubjects
- ✅ **Reactive Forms**: FormBuilder, Validators
- ✅ **HTTP Interceptors**: Manejo de errores y tokens
- ✅ **Guards**: Protección de rutas (CanActivate)
- ✅ **localStorage**: Persistencia de sesión

### **Control Flow Moderno (Angular 20)**
```html
@if (isLoading) {
  <p>Cargando...</p>
}

@for (materia of materias; track materia.id) {
  <div>{{ materia.nombre }}</div>
}
```

---

## 📊 Patrones de Diseño Utilizados

1. **Observer Pattern**: RxJS Observables para comunicación asíncrona
2. **Service Pattern**: Lógica de negocio en servicios inyectables
3. **Component Pattern**: UI dividida en componentes reutilizables
4. **Module Pattern**: Organización por features (auth, docente, alumno)
5. **Reactive Forms Pattern**: Formularios reactivos con validaciones

---

## 📄 Licencia

Este proyecto es un trabajo académico desarrollado para la **Tecnicatura en Desarrollo de Software**.

---


