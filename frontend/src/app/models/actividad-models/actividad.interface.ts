// Interface principal para representar una actividad academica
export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string; // Tipo de actividad: Practico, Teorico, Evaluacion, etc.
  archivo: string; // URL relativa del archivo subido (ej: /media/actividades/documento.pdf)
  fecha_limite: string; // Fecha limite para completar la actividad (formato ISO)
  materia: number; // ID de la materia a la que pertenece
  docente: number; // ID del docente que creo la actividad
  created_at?: string; // Fecha de creacion (opcional, viene del backend)
  updated_at?: string; // Fecha de actualizacion (opcional, viene del backend)
}
