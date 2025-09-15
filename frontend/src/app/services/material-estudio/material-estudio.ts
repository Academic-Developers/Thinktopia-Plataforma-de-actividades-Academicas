import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MaterialEstudio } from '../../models/materiales-models/materiales-models';

@Injectable({
  providedIn: 'root'
})
export class MaterialEstudioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener todos los materiales
  getMateriales(): Observable<MaterialEstudio[]> {
    return this.http.get<MaterialEstudio[]>(`${this.apiUrl}/material-estudio`).pipe(
      tap(res => console.log('📥 Materiales obtenidos:', res)),
      catchError(err => {
        console.error('❌ Error al obtener materiales:', err);
        return of([]);
      })
    );
  }

  // Agregar material
  addMaterial(material: Omit<MaterialEstudio, 'id'>): Observable<MaterialEstudio> {
    return this.http.post<MaterialEstudio>(`${this.apiUrl}/material-estudio`, material).pipe(
      tap(res => console.log('✅ Material agregado:', res)),
      catchError(err => {
        console.error('❌ Error al agregar material:', err);
        return throwError(() => new Error('No se pudo agregar el material.'));
      })
    );
  }

  // Editar material
  updateMaterial(id: number, material: Partial<MaterialEstudio>): Observable<MaterialEstudio> {
    return this.http.put<MaterialEstudio>(`${this.apiUrl}/material-estudio/${id}`, material).pipe(
      tap(res => console.log('✏️ Material actualizado:', res)),
      catchError(err => {
        console.error('❌ Error al actualizar material:', err);
        return throwError(() => new Error('No se pudo actualizar el material.'));
      })
    );
  }

  // Eliminar material
  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/material-estudio/${id}`).pipe(
      tap(() => console.log('🗑️ Material eliminado:', id)),
      catchError(err => {
        console.error('❌ Error al eliminar material:', err);
        return throwError(() => new Error('No se pudo eliminar el material.'));
      })
    );
  }
}