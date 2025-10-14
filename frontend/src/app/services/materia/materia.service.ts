import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Materia, MateriaRequest } from '../../models/materias-models/materia.interface';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = environment.apiUrl;
  
  // Estado reactivo de materias
  private materiasSubject = new BehaviorSubject<Materia[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedMateriaSubject = new BehaviorSubject<Materia | null>(null);

  // Observables públicos
  public materias$ = this.materiasSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public selectedMateria$ = this.selectedMateriaSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadSelectedMateriaFromStorage();
  }

  // Cargar materia seleccionada desde localStorage
  private loadSelectedMateriaFromStorage(): void {
    try {
      const stored = localStorage.getItem('selectedMateria');
      if (stored) {
        const materia: Materia = JSON.parse(stored);
        this.selectedMateriaSubject.next(materia);
      }
    } catch (error) {
      console.warn('Error al cargar materia desde localStorage:', error);
      localStorage.removeItem('selectedMateria');
    }
  }

  // Obtener materias del usuario actual
  obtenerMaterias(): Observable<Materia[]> {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      console.error('Usuario no autenticado');
      return of([]);
    }

    this.loadingSubject.next(true);
    const url = `${this.apiUrl}materias/?user_id=${userId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.results || response),
      tap(materias => {
        this.materiasSubject.next(materias);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error al obtener materias:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  // Seleccionar materia y guardar en localStorage
  seleccionarMateria(materia: Materia): void {
    this.selectedMateriaSubject.next(materia);
    localStorage.setItem('selectedMateria', JSON.stringify(materia));
  }

  // Limpiar selección
  limpiarSeleccion(): void {
    this.selectedMateriaSubject.next(null);
    localStorage.removeItem('selectedMateria');
  }

  // Obtener materia seleccionada (síncrono)
  getMateriaSeleccionada(): Materia | null {
    return this.selectedMateriaSubject.value;
  }

  // Limpiar estado (para logout)
  limpiarEstado(): void {
    this.materiasSubject.next([]);
    this.selectedMateriaSubject.next(null);
    this.loadingSubject.next(false);
    localStorage.removeItem('selectedMateria');
  }



  // ========== MÉTODOS CRUD ==========

  /**
   * Obtener todas las materias (para administración)
   */
  obtenerTodasLasMaterias(): Observable<Materia[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<any>(`${this.apiUrl}materias/`).pipe(
      map(response => {
        console.log('📥 Respuesta del backend (materias):', response);
        
        // Si es un array directo, retornarlo
        if (Array.isArray(response)) {
          console.log(` ${response.length} materias cargadas (array directo)`);
          return response;
        }
        
        // Si tiene paginación (results), retornar eso
        if (response.results && Array.isArray(response.results)) {
          console.log(` ${response.results.length} materias cargadas (paginado)`);
          return response.results;
        }
        
        // Si no es ninguno de los anteriores, retornar array vacío
        console.warn(' Formato de respuesta no reconocido:', response);
        return [];
      }),
      tap((materias) => {
        // Actualizar el BehaviorSubject con las materias obtenidas
        this.materiasSubject.next(materias);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error(' Error al obtener todas las materias:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  /**
   * Crear una nueva materia
   */
  crearMateria(materia: MateriaRequest): Observable<Materia | null> {
    console.log(' Creando materia:', materia);
    
    return this.http.post<Materia>(`${this.apiUrl}materias/`, materia).pipe(
      tap(nuevaMateria => {
        console.log(' Materia creada:', nuevaMateria);
        // Actualizar lista local
        const materiasActuales = this.materiasSubject.value;
        this.materiasSubject.next([...materiasActuales, nuevaMateria]);
      }),
      catchError(error => {
        console.error(' Error al crear materia:', error);
        return of(null);
      })
    );
  }

  /**
   * Actualizar una materia existente
   */
  actualizarMateria(id: number, materia: MateriaRequest): Observable<Materia | null> {
    console.log('🔄 Actualizando materia:', id, materia);
    
    return this.http.put<Materia>(`${this.apiUrl}materias/${id}/`, materia).pipe(
      tap(materiaActualizada => {
        console.log(' Materia actualizada:', materiaActualizada);
        // Actualizar lista local
        const materiasActuales = this.materiasSubject.value;
        const index = materiasActuales.findIndex(m => m.id === id);
        if (index !== -1) {
          materiasActuales[index] = materiaActualizada;
          this.materiasSubject.next([...materiasActuales]);
        }
      }),
      catchError(error => {
        console.error(' Error al actualizar materia:', error);
        return of(null);
      })
    );
  }

  /**
   * Eliminar una materia
   */
  eliminarMateria(id: number): Observable<boolean> {
    console.log(' Eliminando materia:', id);
    
    return this.http.delete(`${this.apiUrl}materias/${id}/`).pipe(
      map(() => {
        console.log(' Materia eliminada:', id);
        // Actualizar lista local
        const materiasActuales = this.materiasSubject.value;
        this.materiasSubject.next(materiasActuales.filter(m => m.id !== id));
        return true;
      }),
      catchError(error => {
        console.error(' Error al eliminar materia:', error);
        return of(false);
      })
    );
  }

  /**
   * Asignar usuario a una materia
   */
  asignarUsuarioAMateria(materiaId: number, usuarioId: number): Observable<Materia | null> {
    console.log(' Asignando usuario', usuarioId, 'a materia', materiaId);
    
    return this.http.post<Materia>(
      `${this.apiUrl}materias/${materiaId}/`,
      { usuario_id: usuarioId }
    ).pipe(
      tap(materia => console.log(' Usuario asignado:', materia)),
      catchError(error => {
        console.error(' Error al asignar usuario:', error);
        return of(null);
      })
    );
  }

  /**
   * Desasignar usuario de una materia
   */
  desasignarUsuarioDeMateria(materiaId: number, usuarioId: number): Observable<Materia | null> {
    console.log(' Desasignando usuario', usuarioId, 'de materia', materiaId);
    
    return this.http.post<Materia>(
      `${this.apiUrl}materias/${materiaId}/`,
      { usuario_id: usuarioId }
    ).pipe(
      tap(materia => console.log(' Usuario desasignado:', materia)),
      catchError(error => {
        console.error(' Error al desasignar usuario:', error);
        return of(null);
      })
    );
  }
}