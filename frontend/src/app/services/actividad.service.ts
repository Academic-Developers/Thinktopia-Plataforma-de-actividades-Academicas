import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of, tap, switchMap } from 'rxjs';
import { Actividad, CreateActividadRequest, UpdateActividadRequest } from '../models/actividad.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ActividadService {
    private apiUrl = environment.urlJsonServer;

    // BehaviorSubject para estado reactivo
    private actividadesSubject = new BehaviorSubject<Actividad[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    // Observables públicos
    public actividades$ = this.actividadesSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Obtener todas las actividades
    obtenerActividades(): Observable<Actividad[]> {
        console.log('🔄 Iniciando obtenerActividades() - URL:', `${this.apiUrl}/actividades`);
        this.loadingSubject.next(true);

        return this.http.get<Actividad[]>(`${this.apiUrl}/actividades`).pipe(
            tap(actividades => {
                console.log('✅ Actividades obtenidas:', actividades);
                // Actualizar el BehaviorSubject con los datos obtenidos
                this.actividadesSubject.next(actividades);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('❌ Error al obtener actividades:', error);
                this.loadingSubject.next(false);
                return of([]); // Retornar array vacío en caso de error
            })
        );
    }

    // Obtener actividades por docente
    obtenerActividadesPorDocente(docenteId: number): Observable<any[]> {
        this.loadingSubject.next(true);

        return this.http.get<any[]>(`${this.apiUrl}/actividades?docente_id=${docenteId}`).pipe(
            tap(actividades => {
                this.actividadesSubject.next(actividades);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('Error al obtener actividades por docente:', error);
                this.loadingSubject.next(false);
                return of([]);
            })
        );
    }

    // Obtener actividades por estudiante (para vista alumno)
    obtenerActividadesEstudiante(estudianteId: number): Observable<any[]> {
        this.loadingSubject.next(true);

        // Primero obtener asignaciones del estudiante, luego las actividades
        return this.http.get<any[]>(`${this.apiUrl}/asignaciones?alumno_id=${estudianteId}`).pipe(
            map(asignaciones => asignaciones.map(a => a.actividad_id)),
            switchMap(actividadIds =>
                this.http.get<any[]>(`${this.apiUrl}/actividades`).pipe(
                    map(actividades => actividades.filter(act => actividadIds.includes(act.id)))
                )
            ),
            tap(actividades => {
                this.actividadesSubject.next(actividades);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('Error al obtener actividades del estudiante:', error);
                this.loadingSubject.next(false);
                return of([]);
            })
        );
    }

    // Obtener actividades por materia
    obtenerActividadesPorMateria(materiaId: number, estudianteId?: number): Observable<any[]> {
        this.loadingSubject.next(true);

        let url = `${this.apiUrl}/actividades?materia_id=${materiaId}`;

        return this.http.get<any[]>(url).pipe(
            map(actividades => {
                // Si es estudiante, filtrar solo las asignadas a él
                if (estudianteId) {
                    // Aquí podrías hacer una llamada adicional para verificar asignaciones
                    return actividades; // Por simplicidad, retornamos todas por ahora
                }
                return actividades;
            }),
            tap(actividades => {
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('Error al obtener actividades por materia:', error);
                this.loadingSubject.next(false);
                return of([]);
            })
        );
    }

    // Crear nueva actividad
    crearActividad(actividad: CreateActividadRequest): Observable<Actividad> {
        this.loadingSubject.next(true);

        return this.http.post<Actividad>(`${this.apiUrl}/actividades`, actividad).pipe(
            tap(nuevaActividad => {
                // Actualizar el estado local agregando la nueva actividad
                const actividadesActuales = this.actividadesSubject.value;
                this.actividadesSubject.next([...actividadesActuales, nuevaActividad]);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('Error al crear actividad:', error);
                this.loadingSubject.next(false);
                throw error; // Re-lanzar el error para que el componente lo maneje
            })
        );
    }

    // Actualizar actividad
    actualizarActividad(id: number, actividad: any): Observable<any> {
        this.loadingSubject.next(true);

        return this.http.put<any>(`${this.apiUrl}/actividades/${id}`, actividad).pipe(
            tap(actividadActualizada => {
                // Actualizar el estado local
                const actividadesActuales = this.actividadesSubject.value;
                const index = actividadesActuales.findIndex(act => act.id === id);
                if (index !== -1) {
                    actividadesActuales[index] = actividadActualizada;
                    this.actividadesSubject.next([...actividadesActuales]);
                }
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('Error al actualizar actividad:', error);
                this.loadingSubject.next(false);
                throw error;
            })
        );
    }

    // Eliminar actividad
    eliminarActividad(id: number): Observable<any> {
        this.loadingSubject.next(true);

        return this.http.delete(`${this.apiUrl}/actividades/${id}`).pipe(
            tap(() => {
                // Actualizar el estado local eliminando la actividad
                const actividadesActuales = this.actividadesSubject.value;
                const actividadesFiltradas = actividadesActuales.filter(act => act.id !== id);
                this.actividadesSubject.next(actividadesFiltradas);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                console.error('Error al eliminar actividad:', error);
                this.loadingSubject.next(false);
                throw error;
            })
        );
    }

    // Obtener actividad por ID
    obtenerActividadPorId(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/actividades/${id}`).pipe(
            catchError(error => {
                console.error('Error al obtener actividad:', error);
                return of(null);
            })
        );
    }

    // Asignar actividad a estudiantes
    asignarActividad(actividadId: number, estudiantesIds: number[]): Observable<any> {
        this.loadingSubject.next(true);

        // Crear múltiples asignaciones
        const asignaciones = estudiantesIds.map(estudianteId => ({
            actividad_id: actividadId,
            alumno_id: estudianteId,
            fecha_asignacion: new Date().toISOString()
        }));

        // Enviar todas las asignaciones
        const requests = asignaciones.map(asignacion =>
            this.http.post(`${this.apiUrl}/asignaciones`, asignacion)
        );

        // Usar forkJoin para esperar que todas las requests terminen
        return new Observable(observer => {
            Promise.all(requests.map(req => req.toPromise()))
                .then(results => {
                    this.loadingSubject.next(false);
                    observer.next(results);
                    observer.complete();
                })
                .catch(error => {
                    console.error('Error al asignar actividad:', error);
                    this.loadingSubject.next(false);
                    observer.error(error);
                });
        });
    }

    // Método para refrescar datos (útil para actualizaciones)
    refrescarActividades(): void {
        this.obtenerActividades().subscribe();
    }

    // Limpiar estado (útil para logout)
    limpiarEstado(): void {
        this.actividadesSubject.next([]);
        this.loadingSubject.next(false);
    }
}