--
-- Esquema de la Base de Datos para el proyecto 'Thinktopia'
--
-- Este script define la estructura de las tablas de la lógica de negocio.
-- Las tablas de autenticación, usuarios y roles (AUTH_USER, AUTH_GROUP, etc.)
-- se omiten ya que serán gestionadas por el ORM de Django.
--

-- Tabla: USUARIO
-- Simula la tabla de usuarios que usará Django (AUTH_USER).
-- Creamos una versión simplificada para las relaciones de negocio.
CREATE TABLE "usuario" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(254) NOT NULL UNIQUE,
    "role" VARCHAR(20) NOT NULL -- Campo para simular el rol (docente, alumno)
);

-- Tabla: MATERIA
-- Almacena la información de las materias académicas.
CREATE TABLE "materia" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(20) NOT NULL UNIQUE,
    "descripcion" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: USER_MATERIA
-- Tabla de unión para la relación "muchos a muchos" entre usuarios y materias.
-- Registra qué usuarios (docentes y alumnos) están asignados a qué materia.
CREATE TABLE "user_materia" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "usuario"("id") ON DELETE CASCADE,
    "materia_id" INTEGER NOT NULL REFERENCES "materia"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE ("user_id", "materia_id")
);

-- Tabla: MATERIAL_ESTUDIO
-- Almacena los recursos (apuntes, enlaces, etc.) subidos por los docentes.
CREATE TABLE "material_estudio" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "archivo_url" TEXT,
    "enlace" TEXT,
    "materia_id" INTEGER NOT NULL REFERENCES "materia"("id") ON DELETE CASCADE,
    "autor_id" INTEGER NOT NULL REFERENCES "usuario"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: ACTIVIDAD
-- Almacena las tareas o actividades asignadas a los alumnos.
CREATE TABLE "actividad" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "archivo_url" TEXT,
    "fecha_limite" TIMESTAMP WITH TIME ZONE,
    "materia_id" INTEGER NOT NULL REFERENCES "materia"("id") ON DELETE CASCADE,
    "docente_id" INTEGER NOT NULL REFERENCES "usuario"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: ENTREGA
-- Registra las entregas de actividades por parte de los alumnos.
CREATE TABLE "entrega" (
    "id" SERIAL PRIMARY KEY,
    "actividad_id" INTEGER NOT NULL REFERENCES "actividad"("id") ON DELETE CASCADE,
    "alumno_id" INTEGER NOT NULL REFERENCES "usuario"("id") ON DELETE CASCADE,
    "archivo_url" TEXT,
    "comentario" TEXT,
    "fecha_entrega" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "calificacion" DECIMAL(5, 2),
    "feedback" TEXT,
    UNIQUE ("actividad_id", "alumno_id")
);
