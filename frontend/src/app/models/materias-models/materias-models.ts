export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
}

export interface UserMateria {
  id: number;
  user_id: number;
  materia_id: number;
}