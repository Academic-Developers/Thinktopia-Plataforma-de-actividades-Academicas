import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialEstudioService } from '../../../../services/material-estudio/material-estudio.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { MaterialEstudio } from '../../../../models/materiales-models/materiales-models';
import { Materia } from '../../../../models/materias-models/materia.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-material-estudio-alumno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-estudio-alumno.html',
  styleUrl: './material-estudio-alumno.css'
})
export class MaterialEstudioAlumno implements OnInit, OnDestroy {
  // Lista de materiales y estados
  materiales: MaterialEstudio[] = [];
  loading = false;
  error = '';

  // Materia seleccionada actualmente
  materiaSeleccionada: Materia | null = null;

  // Suscripciones para limpiar en OnDestroy
  private subscriptions = new Subscription();

  constructor(
    private materialService: MaterialEstudioService,
    private materiaService: MateriaService
  ) {}

  ngOnInit(): void {
    // Obtiene la materia seleccionada del servicio
    const sub = this.materiaService.selectedMateria$.subscribe(materia => {
      this.materiaSeleccionada = materia;
      
      if (materia) {
        this.cargarMateriales(materia.id);
      }
    });
    
    this.subscriptions.add(sub);

    // Suscribirse al estado de materiales del servicio
    const materialSub = this.materialService.materiales$.subscribe(materiales => {
      this.materiales = materiales;
    });
    
    this.subscriptions.add(materialSub);

    // Suscribirse al estado de loading
    const loadingSub = this.materialService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
    
    this.subscriptions.add(loadingSub);
  }

  ngOnDestroy(): void {
    // Limpia todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  // Carga materiales de la materia seleccionada
  cargarMateriales(materiaId: number): void {
    this.error = '';
    this.materialService.getMaterialesPorMateria(materiaId).subscribe({
      next: () => {
        console.log('Materiales cargados correctamente');
      },
      error: (err) => {
        this.error = 'Error al cargar los materiales de estudio';
        console.error(err);
      }
    });
  }

  // Construye la URL completa del archivo
  obtenerUrlArchivo(rutaArchivo: string): string {
    if (!rutaArchivo) return '';
    
    if (rutaArchivo.startsWith('http')) {
      return rutaArchivo;
    }
    
    const baseUrl = 'http://localhost:8000';
    const ruta = rutaArchivo.startsWith('/') ? rutaArchivo : `/${rutaArchivo}`;
    
    return `${baseUrl}${ruta}`;
  }

  // Extrae el nombre del archivo de la ruta
  obtenerNombreArchivo(rutaArchivo: string): string {
    if (!rutaArchivo) return 'archivo';
    return rutaArchivo.split('/').pop() || 'archivo';
  }
}
