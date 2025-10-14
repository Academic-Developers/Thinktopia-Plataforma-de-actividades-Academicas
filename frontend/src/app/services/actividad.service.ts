import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Actividad, CreateActividadRequest, UpdateActividadRequest } from '../models/actividad-models/actividad.interface';
import { AuthService } from './auth/auth.service';
import { MateriaService } from './materia/materia.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = environment.apiUrl;

  // Estado reactivo de actividades
  private actividadesSubject = new BehaviorSubject<Actividad[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public actividades$ = this.actividadesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private materiaService: MateriaService
  ) {}

  // Obtener actividades filtradas por materia
  getActividadesPorMateria(materiaId: number): Observable<Actividad[]> {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('Usuario no autenticado');
      return of([]);
    }

    this.loadingSubject.next(true);
    
    // Construye la URL con query parameters para filtrar
    const url = `${this.apiUrl}academico/actividades/?user_id=${userId}&materia_id=${materiaId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.results || response),
      tap(actividades => {
        this.actividadesSubject.next(actividades);
        this.loadingSubject.next(false);
        console.log('Actividades obtenidas:', actividades.length);
      }),
      catchError(error => {
        console.error('Error al obtener actividades:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  // Crear nueva actividad (solo docentes)
  crearActividad(actividadData: CreateActividadRequest): Observable<Actividad | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}academico/actividades/`;

    return this.http.post<Actividad>(url, actividadData).pipe(
      tap(nuevaActividad => {
        const actividadesActuales = this.actividadesSubject.value;
        this.actividadesSubject.next([...actividadesActuales, nuevaActividad]);
        this.loadingSubject.next(false);
        console.log('Actividad creada:', nuevaActividad.titulo);
      }),
      catchError(error => {
        console.error('Error al crear actividad:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Actualizar actividad existente (solo docentes)
  actualizarActividad(id: number, actividadData: UpdateActividadRequest): Observable<Actividad | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}academico/actividades/${id}/`;

    return this.http.put<Actividad>(url, actividadData).pipe(
      tap(actividadActualizada => {
        const actividadesActuales = this.actividadesSubject.value;
        const index = actividadesActuales.findIndex(a => a.id === id);
        
        if (index !== -1) {
          actividadesActuales[index] = actividadActualizada;
          this.actividadesSubject.next([...actividadesActuales]);
        }
        
        this.loadingSubject.next(false);
        console.log('Actividad actualizada:', actividadActualizada.titulo);
      }),
      catchError(error => {
        console.error('Error al actualizar actividad:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Eliminar actividad (solo docentes)
  eliminarActividad(id: number): Observable<boolean> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}academico/actividades/${id}/`;

    return this.http.delete<void>(url).pipe(
      map(() => {
        const actividadesActuales = this.actividadesSubject.value;
        const actividadesFiltradas = actividadesActuales.filter(a => a.id !== id);
        this.actividadesSubject.next(actividadesFiltradas);
        this.loadingSubject.next(false);
        console.log('Actividad eliminada, ID:', id);
        return true;
      }),
      catchError(error => {
        console.error('Error al eliminar actividad:', error);
        this.loadingSubject.next(false);
        return of(false);
      })
    );
  }

  // Obtener detalle de una actividad específica
  getActividadPorId(id: number): Observable<Actividad | null> {
    const url = `${this.apiUrl}academico/actividades/${id}/`;

    return this.http.get<Actividad>(url).pipe(
      catchError(error => {
        console.error('Error al obtener actividad por ID:', error);
        return of(null);
      })
    );
  }

  // Limpiar estado (útil para cambio de materia o logout)
  limpiarEstado(): void {
    this.actividadesSubject.next([]);
    this.loadingSubject.next(false);
  }

  // Obtener actividades actuales de forma síncrona
  getActividadesActuales(): Actividad[] {
    return this.actividadesSubject.value;
  }
}