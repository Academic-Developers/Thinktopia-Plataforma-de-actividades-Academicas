

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Entrega, CreateEntregaRequest, UpdateEntregaDocenteRequest, UpdateEntregaEstudianteRequest } from '../models/entregas-models/entregas.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntregasService {
  private apiUrl = environment.urlJsonServer;

  // BehaviorSubject para estado reactivo
  private entregasSubject = new BehaviorSubject<Entrega[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public entregas$ = this.entregasSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  // =======================================
  // MÉTODOS BÁSICOS CRUD
  // ========================================

  // Obtener todas las entregas
  obtenerEntregas(): Observable<Entrega[]> {
    console.log('🔄 Iniciando obtenerEntregas() - URL:', `${this.apiUrl}/entregas`);
    this.loadingSubject.next(true);

    return this.http.get<Entrega[]>(`${this.apiUrl}/entregas`).pipe(
      tap(entregas => {
        console.log('✅ Entregas obtenidas:', entregas);
        // Actualizar el BehaviorSubject con los datos obtenidos
        this.entregasSubject.next(entregas);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error al obtener Entregas:', error);
        this.loadingSubject.next(false);
        return of([]); // Retornar array vacío en caso de error
      })
    );
  }

  obtenerEntregaPorId(id: number): Observable<Entrega | null> {
    return this.http.get<Entrega>(`${this.apiUrl}/entregas/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener entrega:', error);
        return of(null);
      })
    );
  }

  // ========================================
  // MÉTODOS PARA ESTUDIANTE
  // ========================================

  crearEntrega(entrega: CreateEntregaRequest): Observable<Entrega> {
    console.log('Iniciando crearEntrega() - Datos:', entrega);
    this.loadingSubject.next(true);

    return this.http.post<Entrega>(`${this.apiUrl}/entregas`, entrega).pipe(
      tap(nuevaEntrega => {
        console.log('✅ Entrega creada:', nuevaEntrega);

        // Actualizar el BehaviorSubject con la nueva entrega
        const entregasActuales = this.entregasSubject.value;
        this.entregasSubject.next([...entregasActuales, nuevaEntrega]);

        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error al crear Entrega:', error);
        this.loadingSubject.next(false);
        throw error;// Re-lanzar el error para que el componente lo maneje
      })
    );

  }

  actualizarEntregaPorEstudiante(entrega: UpdateEntregaEstudianteRequest): Observable<Entrega> {
    console.log('Iniciando actualizarEntregaPorEstudiante() - Datos:', entrega);
    this.loadingSubject.next(true);

    return this.http.patch<Entrega>(`${this.apiUrl}/entregas/${entrega.id}`, entrega).pipe(
      tap(entregaActualizada => {
        console.log('✅ Entrega actualizada por estudiante:', entregaActualizada);

        // Actualizar el BehaviorSubject con la entrega actualizada
        const entregasActuales = this.entregasSubject.value;
        const index = entregasActuales.findIndex(e => e.id === entregaActualizada.id);

        if (index !== -1) {
          entregasActuales[index] = entregaActualizada;
          this.entregasSubject.next([...entregasActuales]);
        }

        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error al actualizar Entrega:', error);
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  // ========================================
  // MÉTODOS PARA DOCENTE
  // ========================================

  actualizarEntregaPorDocente(entrega: UpdateEntregaDocenteRequest): Observable<Entrega> {
    console.log('Iniciando actualizarEntregaPorDocente() - Datos:', entrega);
    this.loadingSubject.next(true);

    return this.http.patch<Entrega>(`${this.apiUrl}/entregas/${entrega.id}`, entrega).pipe(
      tap(entregaActualizada => {
        console.log('✅ Entrega actualizada por docente:', entregaActualizada);

        // Actualizar el BehaviorSubject con la entrega actualizada
        const entregasActuales = this.entregasSubject.value;
        const index = entregasActuales.findIndex(e => e.id === entregaActualizada.id);
        if (index !== -1) {
          entregasActuales[index] = entregaActualizada;
          this.entregasSubject.next([...entregasActuales]);
        }

        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error al actualizar Entrega:', error);
        this.loadingSubject.next(false);
        throw error; // Re-lanzar el error para que el componente lo maneje
      })
    );
  }

  obtenerEntregasPorActividad(actividadId: number): Observable<Entrega[]> {
    console.log('Obteniendo entregas de actividad:', actividadId);
    this.loadingSubject.next(true);

    return this.http.get<Entrega[]>(`${this.apiUrl}/entregas?actividad_id=${actividadId}`).pipe(
      tap(entregas => {
        console.log('✅ Entregas de actividad obtenidas:', entregas);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('❌ Error al obtener entregas por actividad:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  // ========================================
  // MÉTODOS UTILITARIOS
  // ========================================

  // Método para refrescar datos (útil para actualizaciones)
  refrescarEntregas(): void {
    this.obtenerEntregas().subscribe();
  }


  // Obtener todos los usuarios (alumnos y docentes)
  obtenerUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // Limpiar estado (útil para logout)
  limpiarEstado(): void {
    this.entregasSubject.next([]);
    this.loadingSubject.next(false);
  }

  /**
   * Obtiene todas las entregas de las materias asignadas a un docente
   * @param docenteId ID del docente logueado
   * @returns Observable<Entrega[]>
   */
  obtenerEntregasDeMateriasDelDocente(docenteId: number): Observable<Entrega[]> {
    this.loadingSubject.next(true);
    const urlUserMaterias = `${this.apiUrl}user_materia?user_id=${docenteId}`;
    return this.http.get<any[]>(urlUserMaterias).pipe(
      switchMap((userMaterias: any[]) => {
        const materiaIds: number[] = userMaterias.map((um: any) => um.materia_id);
  // console.log('[LOG] materiaIds para docente:', materiaIds);
        if (materiaIds.length === 0) {
          this.loadingSubject.next(false);
          this.entregasSubject.next([]);
          return of([]);
        }
        // Obtener todas las entregas de las materias
        const entregasRequests = materiaIds.map((materiaId: number) => {
          const entregasUrl = `${this.apiUrl}entregas?materia_id=${materiaId}`;
          return this.http.get<Entrega[]>(entregasUrl);
        });
        // También obtener usuarios, actividades y materias para enriquecer los datos
        const usuarios$ = this.http.get<any[]>(`${this.apiUrl}users`);
        const actividades$ = this.http.get<any[]>(`${this.apiUrl}actividades`);
        const materias$ = this.http.get<any[]>(`${this.apiUrl}materias`);
        return forkJoin([
          forkJoin(entregasRequests).pipe(map((resultados: Entrega[][]) => resultados.flat())),
          usuarios$,
          actividades$,
          materias$
        ]).pipe(
          map(([entregas, usuarios, actividades, materias]) => {
            // Enriquecer entregas, asegurando que los IDs sean comparados como números
            return entregas.map((entrega: any) => {
              const alumnoId = Number(entrega.alumno_id);
              const actividadId = Number(entrega.actividad_id);
              const materiaId = Number(entrega.materia_id);
              const estudiante = usuarios.find((u: any) => Number(u.id) === alumnoId);
              const actividad = actividades.find((a: any) => Number(a.id) === actividadId);
              const materia = materias.find((m: any) => Number(m.id) === materiaId);
              return {
                ...entrega,
                estudiante_nombre: estudiante ? estudiante.nombre : '',
                actividad_titulo: actividad ? actividad.titulo : '',
                materia_nombre: materia ? materia.nombre : '',
                fechaEntrega: entrega.fechaEntrega || entrega.fecha_entrega || entrega.fechaEntrega // compatibilidad
              };
            });
          }),
          tap((entregas: Entrega[]) => {
            this.entregasSubject.next(entregas);
            this.loadingSubject.next(false);
          })
        );
      }),
      catchError(error => {
        console.error('Error al obtener entregas de materias del docente:', error);
        this.loadingSubject.next(false);
        this.entregasSubject.next([]);
        return of([]);
      })
    );
  }
}


