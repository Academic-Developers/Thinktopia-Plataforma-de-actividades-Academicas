import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Materia } from '../../models/materias-models/materia.interface';
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
}