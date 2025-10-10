import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MateriaService } from '../../../../services/materia/materia.service';
import { Materia } from '../../../../models/materias-models/materias-models';

@Component({
  selector: 'app-materia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './materias.html',
  styleUrl: './materias.css'
})
export class MateriaComponent implements OnInit, OnDestroy {
  
  // Estado del componente
  materias: Materia[] = [];
  materiaSeleccionada: Materia | null = null;
  loading: boolean = false;
  error: string | null = null;
  
  // Gestión de suscripciones
  private subscription = new Subscription();

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
    this.escucharMateriaSeleccionada();
  }

  // Cargar lista de materias del usuario
  public cargarMaterias(): void {
    this.loading = true;
    this.error = null;

    const materiasSubscription = this.materiaService.getMaterias().subscribe({
      next: (materias: Materia[]) => {
        this.materias = materias;
        this.loading = false;
        console.log(`Materias cargadas: ${materias.length}`);
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
        this.materias = [];
        console.error('Error cargando materias:', error);
      }
    });

    this.subscription.add(materiasSubscription);
  }

  // Escuchar cambios en la materia seleccionada
  private escucharMateriaSeleccionada(): void {
    const seleccionSubscription = this.materiaService.selectedMateria$.subscribe({
      next: (materiaId: number | null) => {
        if (materiaId) {
          this.materiaSeleccionada = this.materias.find(m => m.id === materiaId) || null;
          console.log(`Materia seleccionada actualizada: ${this.materiaSeleccionada?.nombre}`);
        } else {
          this.materiaSeleccionada = null;
        }
      }
    });

    this.subscription.add(seleccionSubscription);
  }

  // Método para seleccionar una materia
  seleccionarMateria(materia: Materia): void {
    this.materiaService.selectMateria(materia.id);
    console.log(`Usuario seleccionó: ${materia.nombre}`);
  }

  // Navegar a actividades de la materia seleccionada
  verActividades(): void {
    if (this.materiaSeleccionada) {
      this.router.navigate(['/docente/actividades']);
      console.log(`Navegando a actividades de: ${this.materiaSeleccionada.nombre}`);
    } else {
      this.error = 'Selecciona una materia primero';
    }
  }

  // Navegar a materiales de la materia seleccionada
  verMateriales(): void {
    if (this.materiaSeleccionada) {
      this.router.navigate(['/docente/materiales']);
      console.log(`Navegando a materiales de: ${this.materiaSeleccionada.nombre}`);
    } else {
      this.error = 'Selecciona una materia primero';
    }
  }

  // Limpiar selección actual
  limpiarSeleccion(): void {
    this.materiaService.clearSelectedMateria();
    this.error = null;
    console.log('Selección limpiada');
  }

  // Verificar si una materia está seleccionada
  esMateriaSeleccionada(materia: Materia): boolean {
    return this.materiaSeleccionada?.id === materia.id;
  }

  // Cleanup al destruir componente
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('Suscripciones del componente limpiadas');
  }
}