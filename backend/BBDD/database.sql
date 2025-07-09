CREATE DATABASE IF NOT EXISTS thinktopia;
USE thinktopia;

-- ▼ Tabla usuarios (base de herencia)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol ENUM('estudiante','docente') NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ▼ Subclase estudiantes
CREATE TABLE estudiantes (
  usuario_id INT PRIMARY KEY,
  nivel_academico VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ▼ Subclase docentes
CREATE TABLE docentes (
  usuario_id INT PRIMARY KEY,
  especialidad VARCHAR(150),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ▼ Tabla actividades
CREATE TABLE actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  docente_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  tipo_actividad ENUM('tarea','examen','proyecto') NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  plazo_entrega DATETIME NOT NULL,
  porcentaje_asistencia DECIMAL(5,2), -- opcional
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (docente_id) REFERENCES docentes(usuario_id) ON DELETE SET NULL
);

-- ▼ Tabla entregas
CREATE TABLE entregas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actividad_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  fecha_entrega DATETIME NOT NULL,
  contenido TEXT,
  estado ENUM('pendiente','entregado','tarde','revisado') NOT NULL DEFAULT 'pendiente',
  puntaje DECIMAL(5,2),
  FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(usuario_id) ON DELETE CASCADE
);

-- ▼ Tabla asistencia
CREATE TABLE asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actividad_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  fecha DATETIME NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(usuario_id) ON DELETE CASCADE,
  UNIQUE (actividad_id, estudiante_id, fecha)
);

-- ▼ Tabla notificaciones
CREATE TABLE notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
