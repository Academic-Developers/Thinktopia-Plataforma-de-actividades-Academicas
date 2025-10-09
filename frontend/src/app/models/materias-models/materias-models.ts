export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
}

export interface MateriasResponse {
  count: number;         // Total de materias disponibles
  results: Materia[]; 
}