export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
}

export interface MateriaResponse {
  count: number;
  results: Materia[];
}