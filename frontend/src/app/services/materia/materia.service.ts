import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth-service';
import { Materia, MateriasResponse } from '../../models/materias-models/materias-models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private readonly apiUrl = `${environment.apiUrl}materias/`;

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  // Obtener todas las materias del usuario autenticado
  getMaterias(): Observable<Materia[]> {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId || userId <= 0) {
      return throwError(() => new Error('Usuario no autenticado. Inicie sesión.'));
    }

    const params = new HttpParams().set('user_id', userId.toString());

    return this.http.get<MateriasResponse>(this.apiUrl, { params }).pipe(
      map((response: MateriasResponse) => response.results),
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

  // Obtener una materia específica por ID
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

  // Verificar si el usuario tiene acceso a una materia específica
  hasAccessToMateria(materiaId: number): Observable<boolean> {
    return this.getMateriaById(materiaId).pipe(
      map(() => true),
      catchError(() => throwError(() => false))
    );
  }
}