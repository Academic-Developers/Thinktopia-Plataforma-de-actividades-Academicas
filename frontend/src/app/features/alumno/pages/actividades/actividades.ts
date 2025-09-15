import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject, combineLatest, map, of, takeUntil } from 'rxjs';
import { Actividad } from '../../../../models/actividad-models/actividad.interface';
import { Materia } from '../../../../models/materias-models/materias-models';
import { ActividadService } from '../../../../services/actividad.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { AuthService } from '../../../../services/auth/auth-service';
import { GenericTableComponent } from '../../../docente/components/generic-table/generic-table.component';
import { FilterConfig, FiltersComponent } from '../../../docente/components/filters/filters.component';

@Component({
  selector: 'app-actividades-alumno',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, FiltersComponent],
  templateUrl: './actividades.html',
  styleUrls: ['./actividades.css']
})
export class ActividadesAlumnoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Estado
  actividades$ = new BehaviorSubject<(Actividad & { materia_nombre?: string })[]>([]);
  materias$ = new BehaviorSubject<Materia[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  // Modal Detalles
  showDetalleModal$ = new BehaviorSubject<boolean>(false);
  selectedActividad$ = new BehaviorSubject<(Actividad & { materia_nombre?: string }) | null>(null);

  // Filtros
  filtroTexto$ = new BehaviorSubject<string>('');
  filtroMateria$ = new BehaviorSubject<string>('');
  filtroEstado$ = new BehaviorSubject<string>('');

  // Configuración de filtros (Materia y Estado)
  filterConfigs: FilterConfig[] = [
    {
      id: 'materia',
      type: 'dropdown',
      label: 'Materia',
      placeholder: 'Todas las materias',
      options: [{ value: '', label: 'Todas las materias' }]
    },
    {
      id: 'estado',
      type: 'dropdown',
      label: 'Estado',
      placeholder: 'Todos los estados',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: 'Activa', label: 'Activa' },
        { value: 'Inactiva', label: 'Inactiva' },
        { value: 'Completada', label: 'Completada' }
      ]
    },
    { id: 'limpiar', type: 'button', label: 'Limpiar Filtros', variant: 'secondary' }
  ];

  // Tabla
  tableColumns: any[] = [
    { key: 'titulo', label: 'Actividad', type: 'text' },
    { key: 'materia_nombre', label: 'Materia', type: 'text' },
    { key: 'tipo', label: 'Tipo', type: 'text' },
    { key: 'fechaLimite', label: 'Fecha Límite', type: 'date' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'puntos', label: 'Puntos', type: 'number' },
    { key: '_actions', label: 'Acciones', type: 'action', align: 'center' }
  ];
  tableActions: any[] = [
    {
      id: 'ver-detalles',
      label: '',
      variant: 'secondary',
      buttonClass: 'btn-icon-only',
      icon: '/icons/bi-eye.svg',
      tooltip: 'Ver detalles de la actividad'
    }
  ];

  // Lista filtrada reactiva
  actividadesFiltradas$ = combineLatest([
    this.actividades$,
    this.filtroMateria$,
    this.filtroEstado$,
    this.filtroTexto$
  ]).pipe(
    map(([acts, materia, estado, texto]) => {
      const txt = (texto || '').toLowerCase();
      return (acts || []).filter(a => {
        const okMateria = materia === '' || String(a.materia_id) === String(materia);
        const okEstado = estado === '' || (a.estado || '') === estado;
        const okTexto = txt === '' ||
          (a.titulo || '').toLowerCase().includes(txt) ||
          (a.materia_nombre || '').toLowerCase().includes(txt) ||
          (a.tipo || '').toLowerCase().includes(txt);
        return okMateria && okEstado && okTexto;
      });
    })
  );

  constructor(
    private actividadService: ActividadService,
    private materiaService: MateriaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  aplicarFiltroTexto(texto: string): void { this.filtroTexto$.next(texto); }

  onFilterChange(event: { filterId: string, value: any }): void {
    switch (event.filterId) {
      case 'materia': this.filtroMateria$.next(event.value); break;
      case 'estado': this.filtroEstado$.next(event.value); break;
      case 'limpiar':
        this.filtroMateria$.next('');
        this.filtroEstado$.next('');
        this.filtroTexto$.next('');
        break;
    }
  }
  onFilterButtonClick(event: any): void {
    if (event.filterId === 'limpiar') {
      this.filtroMateria$.next('');
      this.filtroEstado$.next('');
      this.filtroTexto$.next('');
    }
  }
  onTableSort(_: any): void {}
  onTableRowClick(row: any): void { this.abrirDetalleActividad(row); }
  onTableAction(event: { action: string; row: any }): void {
    if (!event) return;
    if (event.action === 'ver-detalles') {
      this.abrirDetalleActividad(event.row);
    }
  }

  abrirDetalleActividad(act: (Actividad & { materia_nombre?: string })) {
    if (!act) return;
    this.selectedActividad$.next(act);
    this.showDetalleModal$.next(true);
  }

  cerrarDetalleModal() {
    this.showDetalleModal$.next(false);
    this.selectedActividad$.next(null);
  }

  private cargarDatos(): void {
    const user = this.authService.getLoggedInUser();
    if (!user || user.role !== 'alumno') {
      this.actividades$.next([]);
      return;
    }
    this.loading$.next(true);
    this.materiaService.getMaterias(user.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: materias => {
        this.materias$.next(materias);
        // Actualizar filtro materias
        this.filterConfigs = this.filterConfigs.map(cfg => cfg.id === 'materia'
          ? { ...cfg, options: [{ value: '', label: 'Todas las materias' }, ...materias.map(m => ({ value: m.id, label: m.nombre }))] }
          : cfg
        );
        const materiaIds = materias.map(m => m.id);
        if (!materiaIds.length) {
          this.actividades$.next([]);
          this.loading$.next(false);
          return;
        }
        // Para cada materia del alumno, traer sus actividades (todas, no sólo Activas, el filtro está en UI)
        const reqs = materiaIds.map(id => this.actividadService.obtenerActividadesPorMateria(id));
        combineLatest(reqs).pipe(takeUntil(this.destroy$), map(arr => arr.flat())).subscribe({
          next: (acts: Actividad[]) => {
            // Asegurar que sólo sean de las materias del alumno y sin duplicados por id
            const materiaIdSet = new Set(materiaIds.map(m => String(m)));
            const filtradas = (acts || []).filter(a => materiaIdSet.has(String(a.materia_id)));
            const unicas = this.uniqueById(filtradas);
            // Enriquecer con nombre de materia y ordenar por fecha límite ascendente
            const mapMateria = new Map(materias.map(m => [String(m.id), m.nombre] as [string, string]));
            const enriquecidas = unicas.map(a => ({
              ...a,
              materia_nombre: mapMateria.get(String(a.materia_id)) || ''
            }));
            const ordenadas = [...enriquecidas].sort((a, b) => {
              const da = a.fechaLimite ? new Date(a.fechaLimite).getTime() : 0;
              const db = b.fechaLimite ? new Date(b.fechaLimite).getTime() : 0;
              return da - db;
            });
            this.actividades$.next(ordenadas);
            this.loading$.next(false);
          },
          error: () => {
            this.actividades$.next([]);
            this.loading$.next(false);
          }
        });
      },
      error: () => {
        this.materias$.next([]);
        this.actividades$.next([]);
        this.loading$.next(false);
      }
    });
  }
  private uniqueById<T extends { id?: any }>(items: T[]): T[] {
    const seen = new Set<string>();
    const result: T[] = [];
    for (const item of items || []) {
      const key = typeof item?.id !== 'undefined' ? String(item.id) : '';
      if (key !== '' && !seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
    return result;
  }
}
