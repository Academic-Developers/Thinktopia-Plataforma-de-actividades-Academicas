-- ============================================================================
-- SCRIPT DE DATOS DE PRUEBA - THINKTOPIA
-- ============================================================================
-- Este script inserta datos de ejemplo para probar la aplicación
-- 
-- IMPORTANTE: Las contraseñas están hasheadas con el algoritmo de Django
-- Todas las contraseñas de prueba son: "password123"
--
-- USUARIOS DE PRUEBA:
-- 1. profesor1@mail.com / password123 (Docente)
-- 2. profesor2@mail.com / password123 (Docente)
-- 3. alumno1@mail.com / password123 (Alumno)
-- 4. alumno2@mail.com / password123 (Alumno)
-- 5. alumno3@mail.com / password123 (Alumno)
-- ============================================================================

-- ============================================================================
-- LIMPIEZA DE DATOS EXISTENTES
-- ============================================================================
-- Este script elimina TODOS los datos existentes antes de insertar los nuevos
-- El orden es importante debido a las relaciones de Foreign Key

TRUNCATE TABLE academico_actividad CASCADE;
TRUNCATE TABLE academico_materialestudio CASCADE;
TRUNCATE TABLE academico_materia_usuarios CASCADE;
TRUNCATE TABLE academico_materia CASCADE;
TRUNCATE TABLE users_usuario CASCADE;

-- ============================================================================
-- 1. INSERTAR USUARIOS
-- ============================================================================

-- Hash generado con Django para la contraseña "password123"
-- Comando usado: python manage.py shell
--                from django.contrib.auth.hashers import make_password
--                print(make_password('password123'))

INSERT INTO users_usuario (id, password, last_login, email, role, is_active) VALUES
(1, 'pbkdf2_sha256$1000000$23f7B5SAhSn4CuDukIkMbx$0dJB5D+vhK7un+Znu94lPZH7dHrj2w8hRIeCzM49ANw=', NULL, 'profesor1@mail.com', 'docente', true),
(2, 'pbkdf2_sha256$1000000$23f7B5SAhSn4CuDukIkMbx$0dJB5D+vhK7un+Znu94lPZH7dHrj2w8hRIeCzM49ANw=', NULL, 'profesor2@mail.com', 'docente', true),
(3, 'pbkdf2_sha256$1000000$23f7B5SAhSn4CuDukIkMbx$0dJB5D+vhK7un+Znu94lPZH7dHrj2w8hRIeCzM49ANw=', NULL, 'alumno1@mail.com', 'alumno', true),
(4, 'pbkdf2_sha256$1000000$23f7B5SAhSn4CuDukIkMbx$0dJB5D+vhK7un+Znu94lPZH7dHrj2w8hRIeCzM49ANw=', NULL, 'alumno2@mail.com', 'alumno', true),
(5, 'pbkdf2_sha256$1000000$23f7B5SAhSn4CuDukIkMbx$0dJB5D+vhK7un+Znu94lPZH7dHrj2w8hRIeCzM49ANw=', NULL, 'alumno3@mail.com', 'alumno', true);

-- Reiniciar la secuencia del ID (para que los próximos usuarios empiecen en 6)
SELECT setval('users_usuario_id_seq', 5, true);

-- ============================================================================
-- 2. INSERTAR MATERIAS
-- ============================================================================

INSERT INTO academico_materia (id, nombre, codigo, descripcion, created_at, updated_at) VALUES
(1, 'Matemáticas I', 'MAT101', 'Introducción al álgebra y cálculo diferencial', NOW(), NOW()),
(2, 'Programación Web', 'PROG201', 'Desarrollo de aplicaciones web con frameworks modernos', NOW(), NOW()),
(3, 'Base de Datos', 'BD301', 'Diseño y administración de bases de datos relacionales', NOW(), NOW()),
(4, 'Historia Argentina', 'HIST101', 'Historia argentina desde la independencia hasta la actualidad', NOW(), NOW());

-- Reiniciar la secuencia del ID
SELECT setval('academico_materia_id_seq', 4, true);

-- ============================================================================
-- 3. ASIGNAR USUARIOS A MATERIAS (Relación Many-to-Many)
-- ============================================================================

-- Matemáticas I: 1 docente + 3 alumnos
INSERT INTO academico_materia_usuarios (id, materia_id, usuario_id) VALUES
(1, 1, 1),  -- Profesor 1 en Matemáticas
(2, 1, 3),  -- Alumno 1 en Matemáticas
(3, 1, 4),  -- Alumno 2 en Matemáticas
(4, 1, 5),  -- Alumno 3 en Matemáticas

-- Programación Web: 1 docente + 2 alumnos
(5, 2, 1),  -- Profesor 1 en Programación Web
(6, 2, 3),  -- Alumno 1 en Programación Web
(7, 2, 4),  -- Alumno 2 en Programación Web

-- Base de Datos: 1 docente + 3 alumnos
(8, 3, 2),  -- Profesor 2 en Base de Datos
(9, 3, 3),  -- Alumno 1 en Base de Datos
(10, 3, 4), -- Alumno 2 en Base de Datos
(11, 3, 5), -- Alumno 3 en Base de Datos

-- Historia Argentina: 1 docente + 1 alumno
(12, 4, 2), -- Profesor 2 en Historia
(13, 4, 5); -- Alumno 3 en Historia

-- Reiniciar la secuencia del ID
SELECT setval('academico_materia_usuarios_id_seq', 13, true);

-- ============================================================================
-- 4. INSERTAR MATERIALES DE ESTUDIO
-- ============================================================================

INSERT INTO academico_materialestudio (id, titulo, descripcion, archivo, materia_id, autor_id, created_at, updated_at) VALUES
(1, 'Guía de Ejercicios - Álgebra', 'Ejercicios prácticos de álgebra lineal y ecuaciones', '', 1, 1, NOW(), NOW()),
(2, 'Apuntes de Cálculo Diferencial', 'Teoría y ejemplos de límites y derivadas', '', 1, 1, NOW(), NOW()),
(3, 'Introducción a HTML y CSS', 'Fundamentos del desarrollo web frontend', '', 2, 1, NOW(), NOW()),
(4, 'Tutorial de JavaScript', 'Conceptos básicos de JavaScript ES6+', '', 2, 1, NOW(), NOW()),
(5, 'Modelo Entidad-Relación', 'Guía para diseño de bases de datos relacionales', '', 3, 2, NOW(), NOW()),
(6, 'SQL Básico', 'Consultas SELECT, INSERT, UPDATE y DELETE', '', 3, 2, NOW(), NOW()),
(7, 'La Independencia Argentina', 'Material histórico sobre los sucesos de 1810-1816', '', 4, 2, NOW(), NOW());

-- Reiniciar la secuencia del ID
SELECT setval('academico_materialestudio_id_seq', 7, true);

-- ============================================================================
-- 5. INSERTAR ACTIVIDADES
-- ============================================================================

INSERT INTO academico_actividad (id, titulo, descripcion, tipo, archivo, fecha_limite, materia_id, docente_id, created_at, updated_at) VALUES
(1, 'Trabajo Práctico N°1 - Ecuaciones', 'Resolver los ejercicios del capítulo 3', 'Práctico', '', '2025-11-15 23:59:59', 1, 1, NOW(), NOW()),
(2, 'Parcial - Cálculo Diferencial', 'Evaluación de límites y derivadas', 'Evaluación', '', '2025-11-20 10:00:00', 1, 1, NOW(), NOW()),
(3, 'Proyecto Final - Sitio Web', 'Desarrollar un sitio web responsive con HTML, CSS y JS', 'Proyecto', '', '2025-12-10 23:59:59', 2, 1, NOW(), NOW()),
(4, 'Ejercicios de JavaScript', 'Resolver los ejercicios de la guía de funciones', 'Práctico', '', '2025-11-18 23:59:59', 2, 1, NOW(), NOW()),
(5, 'Diseño de Base de Datos', 'Crear el diagrama ER para un sistema de biblioteca', 'Práctico', '', '2025-11-25 23:59:59', 3, 2, NOW(), NOW()),
(6, 'Consultas SQL Avanzadas', 'Resolver las consultas propuestas en el material', 'Práctico', '', '2025-11-22 23:59:59', 3, 2, NOW(), NOW()),
(7, 'Ensayo - Revolución de Mayo', 'Escribir un ensayo de 3 páginas sobre la Revolución de Mayo', 'Teórico', '', '2025-11-30 23:59:59', 4, 2, NOW(), NOW());

-- Reiniciar la secuencia del ID
SELECT setval('academico_actividad_id_seq', 7, true);

-- ============================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================================================

-- Contar registros insertados
SELECT 'Usuarios insertados:' as tabla, COUNT(*) as cantidad FROM users_usuario
UNION ALL
SELECT 'Materias insertadas:', COUNT(*) FROM academico_materia
UNION ALL
SELECT 'Relaciones Materia-Usuario:', COUNT(*) FROM academico_materia_usuarios
UNION ALL
SELECT 'Materiales de Estudio:', COUNT(*) FROM academico_materialestudio
UNION ALL
SELECT 'Actividades:', COUNT(*) FROM academico_actividad;

-- ============================================================================
-- CONSULTAS DE PRUEBA (Opcional)
-- ============================================================================

-- Ver todos los usuarios
-- SELECT id, email, role FROM users_usuario ORDER BY id;

-- Ver materias con cantidad de usuarios
-- SELECT m.id, m.nombre, m.codigo, COUNT(mu.usuario_id) as cant_usuarios
-- FROM academico_materia m
-- LEFT JOIN academico_materia_usuarios mu ON m.id = mu.materia_id
-- GROUP BY m.id, m.nombre, m.codigo
-- ORDER BY m.id;

-- Ver materiales de una materia específica
-- SELECT me.id, me.titulo, m.nombre as materia, u.email as autor
-- FROM academico_materialestudio me
-- JOIN academico_materia m ON me.materia_id = m.id
-- JOIN users_usuario u ON me.autor_id = u.id
-- ORDER BY me.id;

-- Ver actividades de una materia específica
-- SELECT a.id, a.titulo, a.tipo, m.nombre as materia, u.email as docente
-- FROM academico_actividad a
-- JOIN academico_materia m ON a.materia_id = m.id
-- JOIN users_usuario u ON a.docente_id = u.id
-- ORDER BY a.id;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
