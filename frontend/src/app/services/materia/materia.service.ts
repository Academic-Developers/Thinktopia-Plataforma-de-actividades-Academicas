import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { User } from '../../models/auth-models/auth-models';
import { Materia, UserMateria } from '../../models/materias-models/materias-models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = environment.urlJsonServer; 

  constructor(private http: HttpClient) {}

  getMaterias(UserId: number): Observable<Materia[]> {
    console.log('🔎 Buscando materias para el usuario con ID:', UserId);
    const url = `${this.apiUrl}user_materia?user_id=${UserId}`;
    console.log('📡 URL de request user_materia:', url);

    return this.http.get<UserMateria[]>(url).pipe(
      tap(res => console.log('📥 Respuesta de user_materia:', res)),

      switchMap(userMaterias => {
        if (userMaterias.length === 0) {
          console.log('⚠️ El usuario no tiene materias asignadas');
          return of([]);
        }
        console.log('✅ UserMaterias encontrados:', userMaterias);

        const materiaRequests = userMaterias.map(um => {
          const materiaUrl = `${this.apiUrl}materias/${um.materia_id}`;
          console.log('📡 Fetching materia:', materiaUrl);
          return this.http.get<Materia>(materiaUrl).pipe(
            tap(m => console.log('📥 Materia obtenida:', m))
          );
        });

        return forkJoin(materiaRequests);
      }),

      catchError(err => {
        console.error('❌ Error en getMaterias:', err);
        return throwError(() => new Error('Could not load subjects.'));
      })
    );
  }

  getMateriaById(id: number): Observable<Materia> {
    const url = `${this.apiUrl}materias/${id}`;
    console.log('📡 Request getMateriaById:', url);

    return this.http.get<Materia>(url).pipe(
      tap(m => console.log('📥 Materia obtenida por ID:', m)),
      catchError(err => {
        console.error(`❌ Error fetching subject with ID ${id}:`, err);
        return throwError(() => new Error('Could not load subject details.'));
      })
    );
  }
}