export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  fechaLimite: string;
  estado: 'Activa' | 'Inactiva' | 'Completada';
  tipo: 'Proyecto' | 'Cuestionario' | 'Examen' | 'Tarea' | 'Quiz';
  materia_id: number;
  docente_id: number | string;
  puntos: number;
  instrucciones?: string;
}

export interface CreateActividadRequest {
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  tipo: string;
  puntos: number;
  materia_id: number;
  docente_id: number | string;
  instrucciones?: string;
}

export interface UpdateActividadRequest extends Partial<CreateActividadRequest> {
  id: number | string;
}
