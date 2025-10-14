import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { MaterialEstudio } from '../../models/materiales-models/materiales-models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialEstudioService {
  private apiUrl = environment.apiUrl;

  // Estado reactivo: almacena la lista actual de materiales
  private materialesSubject = new BehaviorSubject<MaterialEstudio[]>([]);
  
  // Estado de carga: indica si hay una operacion en progreso
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables publicos para que los componentes se suscriban
  public materiales$ = this.materialesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener materiales filtrados por materia
  // Este es el metodo principal que usaras en los componentes
  getMaterialesPorMateria(materiaId: number): Observable<MaterialEstudio[]> {
    this.loadingSubject.next(true);
    
    // Construye la URL con query parameter para filtrar por materia
    const url = `${this.apiUrl}materialestudio/?materia_id=${materiaId}`;

    return this.http.get<any>(url).pipe(
      // Extrae el array de resultados (Django puede envolver en 'results')
      map(response => response.results || response),
      
      // Actualiza el estado reactivo con los materiales obtenidos
      tap(materiales => {
        this.materialesSubject.next(materiales);
        this.loadingSubject.next(false);
        console.log('Materiales obtenidos:', materiales.length);
      }),
      
      // Maneja errores sin romper la aplicacion
      catchError(error => {
        console.error('Error al obtener materiales:', error);
        this.loadingSubject.next(false);
        return of([]); // Retorna array vacio en caso de error
      })
    );
  }

  // Obtener detalle de un material especifico por su ID
  getMaterialPorId(id: number): Observable<MaterialEstudio | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}materialestudio/${id}/`;

    return this.http.get<MaterialEstudio>(url).pipe(
      tap(material => {
        this.loadingSubject.next(false);
        console.log('Material obtenido:', material.titulo);
      }),
      catchError(error => {
        console.error('Error al obtener material:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Crear nuevo material (solo docentes)
  // Acepta FormData para permitir subida de archivos
  // NOTA: Angular HttpClient detecta FormData automaticamente y establece
  // Content-Type: multipart/form-data con el boundary correcto
  crearMaterial(materialData: FormData | Omit<MaterialEstudio, 'id'>): Observable<MaterialEstudio | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}materialestudio/`;

    // NO establecer headers manualmente cuando se usa FormData
    return this.http.post<MaterialEstudio>(url, materialData).pipe(
      tap(nuevoMaterial => {
        // Agrega el nuevo material al estado actual
        const materialesActuales = this.materialesSubject.value;
        this.materialesSubject.next([...materialesActuales, nuevoMaterial]);
        this.loadingSubject.next(false);
        console.log('Material creado exitosamente:', nuevoMaterial.titulo);
      }),
      catchError(error => {
        console.error('Error al crear material:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Actualizar material existente (solo docentes)
  // Acepta FormData para permitir actualizacion del archivo
  // Al editar, el archivo es opcional (solo se actualiza si se envia uno nuevo)
  actualizarMaterial(id: number, materialData: FormData | Partial<MaterialEstudio>): Observable<MaterialEstudio | null> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}materialestudio/${id}/`;

    // NO establecer headers manualmente cuando se usa FormData
    return this.http.put<MaterialEstudio>(url, materialData).pipe(
      tap(materialActualizado => {
        // Actualiza el material en el estado reactivo
        const materialesActuales = this.materialesSubject.value;
        const index = materialesActuales.findIndex(m => m.id === id);
        
        if (index !== -1) {
          materialesActuales[index] = materialActualizado;
          this.materialesSubject.next([...materialesActuales]);
        }
        
        this.loadingSubject.next(false);
        console.log('Material actualizado:', materialActualizado.titulo);
      }),
      catchError(error => {
        console.error('Error al actualizar material:', error);
        this.loadingSubject.next(false);
        return of(null);
      })
    );
  }

  // Eliminar material (solo docentes)
  eliminarMaterial(id: number): Observable<boolean> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}materialestudio/${id}/`;

    return this.http.delete<void>(url).pipe(
      map(() => {
        // Remueve el material del estado reactivo
        const materialesActuales = this.materialesSubject.value;
        const materialesFiltrados = materialesActuales.filter(m => m.id !== id);
        this.materialesSubject.next(materialesFiltrados);
        this.loadingSubject.next(false);
        console.log('Material eliminado, ID:', id);
        return true; // Indica exito
      }),
      catchError(error => {
        console.error('Error al eliminar material:', error);
        this.loadingSubject.next(false);
        return of(false); // Indica fallo
      })
    );
  }

  // Limpiar estado (util para cambio de materia o logout)
  limpiarEstado(): void {
    this.materialesSubject.next([]);
    this.loadingSubject.next(false);
  }

  // Obtener materiales actuales de forma sincrona (sin Observable)
  // Util para verificaciones rapidas en componentes
  getMaterialesActuales(): MaterialEstudio[] {
    return this.materialesSubject.value;
  }
}