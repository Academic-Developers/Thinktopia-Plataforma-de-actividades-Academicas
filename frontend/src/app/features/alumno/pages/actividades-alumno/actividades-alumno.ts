import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadService } from '../../../../services/actividad.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { Actividad } from '../../../../models/actividad-models/actividad.interface';
import { Materia } from '../../../../models/materias-models/materia.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-actividades-alumno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividades-alumno.html',
  styleUrl: './actividades-alumno.css'
})
export class ActividadesAlumno implements OnInit, OnDestroy {
  // Lista de actividades y estados
  actividades: Actividad[] = [];
  loading = false;
  error = '';

  // Materia seleccionada actualmente
  materiaSeleccionada: Materia | null = null;

  // Suscripciones para limpiar en OnDestroy
  private subscriptions = new Subscription();

  constructor(
    private actividadService: ActividadService,
    private materiaService: MateriaService
  ) {}

  ngOnInit(): void {
    // Obtiene la materia seleccionada del servicio
    const sub = this.materiaService.selectedMateria$.subscribe(materia => {
      this.materiaSeleccionada = materia;
      
      if (materia) {
        this.cargarActividades(materia.id);
      }
    });
    
    this.subscriptions.add(sub);

    // Suscribirse al estado de actividades del servicio
    const actividadSub = this.actividadService.actividades$.subscribe(actividades => {
      this.actividades = actividades;
    });
    
    this.subscriptions.add(actividadSub);

    // Suscribirse al estado de loading
    const loadingSub = this.actividadService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
    
    this.subscriptions.add(loadingSub);
  }

  ngOnDestroy(): void {
    // Limpia todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  // Carga actividades de la materia seleccionada
  cargarActividades(materiaId: number): void {
    this.error = '';
    this.actividadService.getActividadesPorMateria(materiaId).subscribe({
      next: () => {
        console.log('Actividades cargadas correctamente');
      },
      error: (err) => {
        this.error = 'Error al cargar las actividades';
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

  // Formatea la fecha para mostrarla de forma legible
  // De: "2025-10-15T23:59:00Z" a: "15 de Octubre, 2025 - 23:59hs"
  formatearFechaLimite(fechaISO: string): string {
    if (!fechaISO) return 'Sin fecha límite';
    
    const fecha = new Date(fechaISO);
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    
    return `${dia} de ${mes}, ${anio} - ${horas}:${minutos}hs`;
  }

  // Verifica si una actividad esta proxima a vencer (menos de 3 dias)
  esProximoAVencer(fechaISO: string): boolean {
    if (!fechaISO) return false;
    
    const fechaLimite = new Date(fechaISO);
    const ahora = new Date();
    const tresDias = 3 * 24 * 60 * 60 * 1000; // 3 dias en milisegundos
    
    return (fechaLimite.getTime() - ahora.getTime()) < tresDias && fechaLimite > ahora;
  }

  // Verifica si una actividad ya vencio
  estaVencida(fechaISO: string): boolean {
    if (!fechaISO) return false;
    
    const fechaLimite = new Date(fechaISO);
    const ahora = new Date();
    
    return fechaLimite < ahora;
  }
}
