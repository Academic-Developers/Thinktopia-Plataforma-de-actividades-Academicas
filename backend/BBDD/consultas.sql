-- Datos simulados
INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES
('Ana Saquilan', 'ana_saquilan@thinktopia.com', '4532145a', 'docente'),
('Juan Pérez', 'juanperez@gmail.com', '23135790g.', 'estudiante'),
('Luisa López', 'luisa_lopez@gmail.com', '123980764', 'estudiante'),
('Pedro Gómez', 'pedrogomez@gmail.com', '21123456', 'estudiante'),
('Sofía Torres', 'sofiatorres@gmail.com', '09123218', 'estudiante'),
('Milagros Gonzalez', 'mili_gonzalez@gmail.com', '12345621', 'estudiante'),
('Leonel Moure', 'leonel_moure@thinktopia.com', '123', 'estudiante'),
('Juliana Cortez', 'julicortez@thinktopia.com', '90097123', 'docente'),
('Ariana Ciarma', 'ariana_ciarma@thinktopia.com', '11230983', 'docente'),
('Cristian Toro ', 'cristoro@thinktopia.com', '89123321', 'docente'),

('Estudiante10', 'estu10@tt.com', '123', 'estudiante'),
('Estudiante11', 'estu11@tt.com', '123', 'estudiante'),
('Estudiante12', 'estu12@tt.com', '123', 'estudiante'),
('Estudiante13', 'estu13@tt.com', '123', 'estudiante'),
('Estudiante14', 'estu14@tt.com', '123', 'estudiante');

INSERT INTO docentes (usuario_id, especialidad) VALUES
(1, 'Matemática');
(2, 'Sistemas y Organizaciones'); 
(3, 'Sistemas Operativos'); 
(4, 'Programacion 1'); 

INSERT INTO estudiantes (usuario_id, nivel_academico) VALUES
(2, 'Secundario'), (3, 'Terciaario'), (4, 'Secundario'), (5, 'Terciario'),
(6, 'Secundario'), (7, 'Terciario'),

INSERT INTO actividades (docente_id, titulo, descripcion, tipo_actividad, fecha_inicio, plazo_entrega) VALUES
(1, 'Tarea 1', 'Resolver ejercicios de fracciones', 'tarea', '2025-04-10', '2025-04-20'),
(8, 'Parcial 1', 'Evaluación del primer módulo', 'examen', '2025-05-10', '2025-05-15'),
(9, 'Práctica Grupal', 'Trabajo colaborativo sobre datos', 'proyecto', '2025-06-01', '2025-06-15');
(10, 'Parcial 1', 'examen', 'proyecto', '2025-04-21', '2025-04-29')

INSERT INTO entregas (actividad_id, estudiante_id, fecha_entrega, contenido, estado, puntaje) VALUES
(1, 2, '2025-04-18', 'PDF entregado', 'entregado', 8.5),
(8, 3, '2025-04-19', 'PDF entregado', 'entregado', 7.0),
(9, 4, '2025-04-22', 'Entregado tarde', 'tarde', 6.0),
(10, 5, '2025-05-12', 'Parcial completo', 'entregado', 9.0),
(9, 6, NULL, '', 'pendiente', NULL),
(1, 7, '2025-05-14', 'Tarea entregada', 'entregado', 10),


(3, 2, '2025-06-10', 'Trabajo entregado', 'entregado', 10.0);

INSERT INTO asistencias (actividad_id, estudiante_id, fecha, presente) VALUES
(1, 2, '2025-04-10', TRUE),
(8, 3, '2025-04-10', FALSE),
(9, 4, '2025-04-10', TRUE),
(10, 5, '2025-05-10', TRUE),
(8, 6, '2025-05-10', TRUE),
(10, 7, '2025-05-10', FALSE);

INSERT INTO notificaciones (usuario_id, mensaje) VALUES
(2, '¡Felicidades! Has aprobado.'),
(3, 'Has recibido 5 puntos por tu participación.'),
(4, 'No entregaste la actividad a tiempo.'),
(5, '¡Buen trabajo en el parcial!');
(6,'No entregaste la actividad a tiempo.'); 
(7, 'Aprobado'); 
