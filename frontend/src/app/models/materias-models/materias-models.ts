export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
}

export interface MateriasResponse {
  cantidad: number;         // Total de materias disponibles
  resultados: Materia[];
}