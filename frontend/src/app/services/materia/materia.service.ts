import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth-service';
import { Materia, MateriasResponse } from '../../models/materias-models/materias-models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private readonly apiUrl = `${environment.apiUrl}academico/materias/`;
  private readonly SELECTED_MATERIA_KEY = 'selected_materia_id';

  // Estado reactivo de la materia seleccionada
  private selectedMateriaSubject = new BehaviorSubject<number | null>(this.getSelectedMateriaFromStorage());
  public selectedMateria$ = this.selectedMateriaSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener materias del usuario autenticado
  getMaterias(): Observable<Materia[]> {
    const userId = this.authService.getCurrentUserId();

    if (!userId || userId <= 0) {
      return throwError(() => new Error('Usuario no autenticado. Inicie sesión.'));
    }

    const params = new HttpParams().set('user_id', userId.toString());

    return this.http.get<MateriasResponse>(this.apiUrl, { params }).pipe(
      map((response: MateriasResponse) => response.resultados),
      tap((materias: Materia[]) => {
        console.log(`Materias obtenidas: ${materias.length}`);
      }),
      catchError((error) => {
        let errorMessage = 'Error al obtener materias';
        if (error.status === 401) errorMessage = 'No autorizado';
        else if (error.status === 403) errorMessage = 'Sin permisos';
        else if (error.status === 500) errorMessage = 'Error del servidor';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Obtener materia específica por ID
  getMateriaById(materiaId: number): Observable<Materia> {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const params = new HttpParams()
      .set('user_id', userId.toString())
      .set('materia_id', materiaId.toString());

    const url = `${this.apiUrl}${materiaId}/`;

    return this.http.get<Materia>(url, { params }).pipe(
      tap((materia: Materia) => {
        console.log(`Materia obtenida: ${materia.nombre}`);
      }),
      catchError((error) => {
        let errorMessage = `Error al obtener materia ${materiaId}`;
        if (error.status === 404) {
          errorMessage = 'Materia no encontrada';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Seleccionar una materia y guardar en localStorage
  selectMateria(materiaId: number): void {
    localStorage.setItem(this.SELECTED_MATERIA_KEY, materiaId.toString());
    this.selectedMateriaSubject.next(materiaId);
    console.log(`Materia seleccionada: ${materiaId}`);
  }

  // Obtener ID de la materia seleccionada actualmente
  getSelectedMateriaId(): number | null {
    const materiaId = localStorage.getItem(this.SELECTED_MATERIA_KEY);
    return materiaId ? parseInt(materiaId, 10) : null;
  }

  // Limpiar selección de materia
  clearSelectedMateria(): void {
    localStorage.removeItem(this.SELECTED_MATERIA_KEY);
    this.selectedMateriaSubject.next(null);
    console.log('Selección de materia limpiada');
  }

  // Obtener materia seleccionada desde localStorage al inicializar
  private getSelectedMateriaFromStorage(): number | null {
    const materiaId = localStorage.getItem(this.SELECTED_MATERIA_KEY);
    return materiaId ? parseInt(materiaId, 10) : null;
  }

  // Verificar si hay una materia seleccionada
  hasSelectedMateria(): boolean {
    return this.getSelectedMateriaId() !== null;
  }
}