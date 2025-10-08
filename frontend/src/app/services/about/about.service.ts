import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Valores,
  EquipoPrincipal,
  EquipoDesarrollo
} from '../../models/about-models/about-models';

@Injectable({
  providedIn: 'root'  // Singleton disponible en toda la app
})
export class AboutService {
  private apiUrl = null;


  constructor(private http: HttpClient) {}


  /**
   * Obtiene los valores corporativos de la empresa
   * @returns Observable<Valores[]> Array de valores corporativos
   */
  getValores(): Observable<Valores[]> {
    console.log('🔄 Cargando valores corporativos...');
   
    return this.http.get<Valores[]>(`${this.apiUrl}valores`).pipe(
      tap(valores => {
        console.log('✅ Valores cargados:', valores);
        console.log(`📊 Total de valores: ${valores.length}`);
      }),
      catchError(err => {
        console.error(' Error cargando valores:', err);
        return throwError(() => new Error('No se pudieron cargar los valores corporativos.'));
      })
    );
  }

  //Obtiene información del equipo directivo/principal

  getEquipoPrincipal(): Observable<EquipoPrincipal[]> {
    console.log('🔄 Cargando equipo principal...');
   
    return this.http.get<EquipoPrincipal[]>(`${this.apiUrl}equipo_principal`).pipe(
      tap(equipo => {
        console.log('✅ Equipo principal cargado:', equipo);
        console.log(`👥 Miembros del equipo principal: ${equipo.length}`);
      }),
      catchError(err => {
        console.error('Error cargando equipo principal:', err);
        return throwError(() => new Error('No se pudo cargar el equipo principal.'));
      })
    );
  }

  // Obtiene información del equipo de desarrollo
  getEquipoDesarrollo(): Observable<EquipoDesarrollo[]> {
    console.log('🔄 Cargando equipo de desarrollo...');
   
    return this.http.get<EquipoDesarrollo[]>(`${this.apiUrl}equipo_desarrollo`).pipe(
      tap(equipo => {
        console.log('✅ Equipo de desarrollo cargado:', equipo);
        console.log(`💻 Desarrolladores: ${equipo.length}`);
      }),
      catchError(err => {
        console.error(' Error cargando equipo de desarrollo:', err);
        return throwError(() => new Error('No se pudo cargar el equipo de desarrollo.'));
      })
    );
  }
}
