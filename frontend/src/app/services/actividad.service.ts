import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Actividad } from '../models/actividad-models/actividad.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private apiUrl = environment.apiUrl;

  // Estado reactivo: almacena la lista actual de actividades
  private actividadesSubject = new BehaviorSubject<Actividad[]>([]);
  
  // Estado de carga: indica si hay una operacion en progreso
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publicos para que los componentes se suscriban
  public actividades$ = this.actividadesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener actividades filtradas por materia
  // Este es el metodo principal que usaras en los componentes
  getActividadesPorMateria(materiaId: number): Observable<Actividad[]> {
    this.loadingSubject.next(true);
    
    // Construye la URL con query parameter para filtrar por materia
    const url = `${this.apiUrl}actividades/?materia_id=${materiaId}`;

    return this.http.get<any>(url).pipe(
      // Extrae el array de resultados (Django puede envolver en 'results')
      map(response => response.results || response),
      
      // Actualiza el estado reactivo con las actividades obtenidas
      tap(actividades => {
        this.actividadesSubject.next(actividades);
        this.loadingSubject.next(false);
        console.log('Actividades obtenidas:', actividades.length);
      }),
      
      // Maneja errores sin romper la aplicacion
      catchError(error => {
        console.error('Error al obtener actividades:', error);
        this.loadingSubject.next(false);
        return of([]); // Retorna array vacio en caso de error
      })
    );
  }

  // Obtener detalle de una actividad especifica por su ID
  getActividadPorId(id: number): Observable<Actividad | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}actividades/${id}/`;

    return this.http.get<Actividad>(url).pipe(
      tap(actividad => {
        this.loadingSubject.next(false);
        console.log('Actividad obtenida:', actividad.titulo);
      }),
      catchError(error => {
        console.error('Error al obtener actividad:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Crear nueva actividad (solo docentes)
  // Acepta FormData para permitir subida de archivos
  // NOTA: Angular HttpClient detecta FormData automaticamente y establece
  // Content-Type: multipart/form-data con el boundary correcto
  crearActividad(actividadData: FormData | Omit<Actividad, 'id'>): Observable<Actividad | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}actividades/`;

    // NO establecer headers manualmente cuando se usa FormData
    return this.http.post<Actividad>(url, actividadData).pipe(
      tap(nuevaActividad => {
        // Agrega la nueva actividad al estado actual
        const actividadesActuales = this.actividadesSubject.value;
        this.actividadesSubject.next([...actividadesActuales, nuevaActividad]);
        this.loadingSubject.next(false);
        console.log('Actividad creada exitosamente:', nuevaActividad.titulo);
      }),
      catchError(error => {
        console.error('Error al crear actividad:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Actualizar actividad existente (solo docentes)
  // Acepta FormData para permitir actualizacion del archivo
  // Al editar, el archivo es opcional (solo se actualiza si se envia uno nuevo)
  actualizarActividad(id: number, actividadData: FormData | Partial<Actividad>): Observable<Actividad | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}actividades/${id}/`;

    // NO establecer headers manualmente cuando se usa FormData
    return this.http.put<Actividad>(url, actividadData).pipe(
      tap(actividadActualizada => {
        // Actualiza la actividad en el estado reactivo
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
    const url = `${this.apiUrl}actividades/${id}/`;

    return this.http.delete<void>(url).pipe(
      map(() => {
        // Remueve la actividad del estado reactivo
        const actividadesActuales = this.actividadesSubject.value;
        const actividadesFiltradas = actividadesActuales.filter(a => a.id !== id);
        this.actividadesSubject.next(actividadesFiltradas);
        this.loadingSubject.next(false);
        console.log('Actividad eliminada, ID:', id);
        return true; // Indica exito
      }),
      catchError(error => {
        console.error('Error al eliminar actividad:', error);
        this.loadingSubject.next(false);
        return of(false); // Indica fallo
      })
    );
  }

  // Limpiar estado (util para cambio de materia o logout)
  limpiarEstado(): void {
    this.actividadesSubject.next([]);
    this.loadingSubject.next(false);
  }

  // Obtener actividades actuales de forma sincrona (sin Observable)
  // Util para verificaciones rapidas en componentes
  getActividadesActuales(): Actividad[] {
    return this.actividadesSubject.value;
  }
}