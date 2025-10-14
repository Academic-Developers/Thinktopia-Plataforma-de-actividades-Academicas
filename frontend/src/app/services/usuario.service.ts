import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  email: string;
  role: 'alumno' | 'docente';
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los usuarios del sistema
   */
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>(`${this.apiUrl}auth/usuarios/`).pipe(
      map(response => response.results || response),
      catchError(error => {
        console.error(' Error al obtener usuarios:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener usuarios por rol
   */
  obtenerUsuariosPorRol(rol: 'alumno' | 'docente'): Observable<Usuario[]> {
    return this.http.get<any>(`${this.apiUrl}auth/usuarios/?role=${rol}`).pipe(
      map(response => response.results || response),
      catchError(error => {
        console.error(' Error al obtener usuarios por rol:', error);
        return of([]);
      })
    );
  }
}
