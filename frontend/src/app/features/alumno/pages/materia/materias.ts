import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MateriaService } from '../../../../services/materia/materia.service';
import { Materia } from '../../../../models/materias-models/materia.interface';

@Component({
  selector: 'app-materias-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './materias.html',
  styleUrl: './materias.css'
})
export class MateriasAlumno implements OnInit, OnDestroy {
  materias: Materia[] = [];
  materiaSeleccionada: Materia | null = null;
  loading = false;
  error: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.materiaService.materias$.subscribe(materias => {
        this.materias = materias;
      })
    );

    this.subscriptions.add(
      this.materiaService.selectedMateria$.subscribe(materia => {
        this.materiaSeleccionada = materia;
      })
    );

    this.subscriptions.add(
      this.materiaService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    this.cargarMaterias();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarMaterias(): void {
    this.error = null;
    this.materiaService.obtenerMaterias().subscribe({
      error: (error) => {
        this.error = 'Error al cargar las materias. Intente nuevamente.';
        console.error('Error:', error);
      }
    });
  }

  seleccionarMateria(materia: Materia): void {
    this.materiaService.seleccionarMateria(materia);
  }

  esMateriaSeleccionada(materia: Materia): boolean {
    return this.materiaSeleccionada?.id === materia.id;
  }

  verActividades(): void {
    if (this.materiaSeleccionada) {
      this.router.navigate(['/alumno/actividades']);
    }
  }

  verMateriales(): void {
    if (this.materiaSeleccionada) {
      this.router.navigate(['/alumno/material-estudio']);
    }
  }

  limpiarSeleccion(): void {
    this.materiaService.limpiarSeleccion();
  }
}