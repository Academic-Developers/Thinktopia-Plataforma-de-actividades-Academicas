import { Component, OnInit } from '@angular/core';
import { MaterialEstudioService } from '../../../../services/material-estudio/material-estudio';
import { MaterialEstudio } from '../../../../models/materiales-models/materiales-models';

@Component({
  selector: 'app-material-estudio-docente',
  imports: [],
  templateUrl: './material-estudio-docente.html',
  styleUrl: './material-estudio-docente.css'
})

export class MaterialEstudioDocente implements OnInit {
  materiales: MaterialEstudio[] = [];
  loading = false;
  error = '';

  constructor(private materialService: MaterialEstudioService) {}

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.loading = true;
    this.error = '';
    this.materialService.getMateriales().subscribe({
      next: (data) => {
        this.materiales = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar materiales';
        this.loading = false;
      }
    });
  }

  eliminarMaterial(id: number): void {
    this.materialService.deleteMaterial(id).subscribe({
      next: () => this.cargarMateriales(),
      error: () => this.error = 'Error al eliminar material'
    });
  }
}