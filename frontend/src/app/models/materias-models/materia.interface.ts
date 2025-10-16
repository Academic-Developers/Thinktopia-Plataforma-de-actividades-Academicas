export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  usuarios?: number[];  // IDs de usuarios asignados
}

export interface MateriaResponse {
  count: number;
  results: Materia[];
}

// Para crear/actualizar materias
export interface MateriaRequest {
  nombre: string;
  codigo: string;
  descripcion?: string;
  usuarios?: number[];  
}