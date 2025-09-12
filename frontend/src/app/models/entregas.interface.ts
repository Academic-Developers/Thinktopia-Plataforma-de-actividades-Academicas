export interface Entrega {
    id: number;
    actividad_id: number;
    user_id: number;
    archivo_url: string;
    fecha_entrega: string;
    estado: 'Pendiente' | 'Entregado' | 'Calificado' | 'Atrasado';
    calificacion: number | null;
    comentarios: string | null;
}

export interface CreateEntregaRequest {
    actividad_id: number;
    user_id: number;
    archivo_url: string;
}

export interface UpdateEntregaEstudianteRequest {
    id: number;
    archivo_url?: string;
    estado?: 'Entregado';
}

export interface UpdateEntregaDocenteRequest extends Partial<CreateEntregaRequest> {
    id: number;
    calificacion?: number;
    comentarios?: string;
    estado?: 'Calificado' |  'Atrasado';
}
