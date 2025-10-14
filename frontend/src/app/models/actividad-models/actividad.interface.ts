export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  fechaLimite: string;
  estado: 'Activa' | 'Inactiva' | 'Completada';
  tipo: 'Proyecto' | 'Cuestionario' | 'Examen' | 'Tarea' | 'Quiz';
  materia_id: number;
  docente_id: number;
}

export interface CreateActividadRequest {
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  tipo: string;
  materia_id: number;
  docente_id: number;
}

export interface UpdateActividadRequest extends Partial<CreateActividadRequest> {
  id: number;
}
