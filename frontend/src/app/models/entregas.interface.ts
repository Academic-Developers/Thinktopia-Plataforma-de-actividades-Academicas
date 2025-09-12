export interface Entrega {
    id: number;
    actividad_id: number;
    alumno_id: number;
    materia_id: number;
    archivo_url: string;
    fecha_entrega: string;
    estado: 'Pendiente' | 'Entregada' | 'Calificada' | 'Atrasada';
    calificacion: number | null;
    comentarios_estudiante: string | null;
    comentarios_docente: string | null;
    
    // Propiedades transformadas para UI (opcionales)
    actividad_titulo?: string;
    estudiante_nombre?: string;
    materia_nombre?: string;
    fechaEntrega?: string;
}

export interface CreateEntregaRequest {
    actividad_id: number;
    alumno_id: number;
    archivo_url: string;
}

export interface UpdateEntregaEstudianteRequest {
    id: number;
    archivo_url?: string;
    estado?: 'Entregada';
}

export interface UpdateEntregaDocenteRequest extends Partial<CreateEntregaRequest> {
    id: number;
    calificacion?: number;
    comentarios_docente?: string;
    estado?: 'Calificada' |  'Atrasada';
}
