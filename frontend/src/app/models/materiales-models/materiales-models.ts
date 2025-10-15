export interface MaterialEstudio {
  id: number;
  materia_id: number;
  titulo: string;
  descripcion: string;
  archivo: string; // URL relativa del archivo subido (ej: /media/materiales_estudio/documento.pdf)
  autor_id: number; // ID del docente que creo el material
}

