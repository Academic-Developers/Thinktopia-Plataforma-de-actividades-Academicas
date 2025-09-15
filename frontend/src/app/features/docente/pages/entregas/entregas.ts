import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest, takeUntil, map } from 'rxjs';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { AuthService } from '../../../../services/auth/auth-service';
import { FilterConfig, FiltersComponent } from '../../components/filters/filters.component';
import { EntregasService } from '../../../../services/entregas.service';
import { ActividadService } from '../../../../services/actividad.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { Entrega } from '../../../../models/entregas-models/entregas.interface';
import { Actividad } from '../../../../models/actividad-models/actividad.interface';
import { TableColumn, TableRow, TableAction } from '../../components/generic-table/generic-table.component';

/**
 * Componente para gestión de entregas estudiantiles
 * Permite visualizar, filtrar y calificar entregas de los estudiantes
 */
@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, FiltersComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './entregas.html',
  styleUrls: ['./entregas.css']
})

export class EntregasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Observables reactivos
  entregas$ = new BehaviorSubject<Entrega[]>([]);
  actividades$ = new BehaviorSubject<Actividad[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  // Estados de UI reactivos
  showGradeModal$ = new BehaviorSubject<boolean>(false);
  showViewModal$ = new BehaviorSubject<boolean>(false);

  // Entrega seleccionada para calificar
  selectedEntrega: Entrega | null = null;
  selectedEntregaForView: Entrega | null = null;

  // Formulario reactivo para calificar
  gradeForm!: FormGroup;

  // Filtros reactivos
  filtroActividad$ = new BehaviorSubject<string>('');
  filtroEstado$ = new BehaviorSubject<string>('');
  filtroMateria$ = new BehaviorSubject<string>('');

  // Entregas filtradas reactivamente
  // Filtro por Materia, Actividad, Estado y búsqueda por texto (en título de actividad, materia o estudiante)
  filtroTexto$ = new BehaviorSubject<string>('');

  entregasFiltradas$ = combineLatest([
    this.entregas$,
    this.filtroActividad$,
    this.filtroEstado$,
    this.filtroMateria$,
    this.filtroTexto$
  ]).pipe(
    map(([entregas, actividad, estado, materia, texto]) => {
      if (!entregas || !Array.isArray(entregas)) {
        return [];
      }

      const textoLower = (texto || '').toLowerCase();

      return entregas.filter(entrega => {
        // Filtros por dropdown
        const coincideActividad = actividad === '' || entrega.actividad_id === Number(actividad);
        const coincideEstado = estado === '' || entrega.estado === estado;
        const coincideMateria = materia === '' || entrega.materia_id === Number(materia);

        // Filtro por texto (en actividad_titulo, materia_nombre, estudiante_nombre)
        const actividadTitulo = (entrega.actividad_titulo || '').toLowerCase();
        const materiaNombre = (entrega.materia_nombre || '').toLowerCase();
        const estudianteNombre = (entrega.estudiante_nombre || '').toLowerCase();

        const coincideTexto =
          textoLower === '' ||
          actividadTitulo.includes(textoLower) ||
          materiaNombre.includes(textoLower) ||
          estudianteNombre.includes(textoLower);

        return coincideActividad && coincideEstado && coincideMateria && coincideTexto;
      });
    })
  );

  // Configuración de tabla
  tableColumns: any[] = [
    { key: 'estudiante_nombre', label: 'Estudiante', type: 'text' },
    { key: 'actividad_titulo', label: 'Actividad', type: 'text' },
    { key: 'materia_nombre', label: 'Materia', type: 'text' },
    { key: 'fechaEntrega', label: 'Fecha Entrega', type: 'date' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'acciones', label: 'Acciones', type: 'action', sortable: false, width: '15%', align: 'center' }
  ];

  tableActions: any[] = [
    {
      id: 'view',
      label: '',
      type: 'button',
      buttonClass: 'btn-icon-only',
      icon: '/icons/bi-eye.svg',
      tooltip: 'Ver entrega'
    },
    {
      id: 'grade',
      label: '',
      type: 'button',
      buttonClass: 'btn-icon-only',
      icon: '/icons/check.svg',
      tooltip: 'Calificar entrega'
    }
  ];

  // Estados de entrega posibles (ESTO DEBE MANEJARSE DINÁMICAMENTE, NO HARD-CODED)
  estadosEntrega = ['Pendiente', 'Entregada', 'Calificada', 'Atrasada'];

  // Lista de materias (se cargará dinámicamente desde el servicio)
  materias: any[] = [];

  // Lista de estudiantes (se llenará dinámicamente desde el backend)
  estudiantes: { id: number, nombre: string }[] = [];

  // Configuración de filtros para el componente app-filters
  filterConfigs: FilterConfig[] = [
    {
      id: 'actividad',
      type: 'dropdown',
      label: 'Actividad',
      placeholder: 'Todas las actividades',
      options: [
        { value: '', label: 'Todas las actividades' }
      ]
    },
    {
      id: 'materia',
      type: 'dropdown',
      label: 'Materia',
      placeholder: 'Todas las materias',
      options: [
        { value: '', label: 'Todas las materias' }
      ]
    },
    {
      id: 'estado',
      type: 'dropdown',
      label: 'Estado',
      placeholder: 'Todos los estados',
      options: [
        { value: '', label: 'Todos los estados' },
        ...this.estadosEntrega.map(estado => ({ value: estado, label: estado.charAt(0).toUpperCase() + estado.slice(1) }))
      ]
    },
    {
      id: 'limpiar',
      type: 'button',
      label: 'Limpiar Filtros',
      variant: 'secondary'
    }
  ];

  // Datos de tabla
  tableData: any[] = [];



  // Constuctor
  constructor(
    private entregasService: EntregasService,
    private actividadService: ActividadService,
    private materiaService: MateriaService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initializeForm();
    this.setupObservables();
    // Cargar solo las materias asignadas al docente logueado y poblar el filtro correctamente
    const user = this.authService.getLoggedInUser();
    if (user && user.role === 'docente') {
      this.materiaService.getMaterias(user.id).subscribe({
        next: (materias: any[]) => {
          this.materias = materias;
          // Actualizar opciones del filtro de materias
          // Forzar cambio de referencia para que Angular detecte el cambio
          this.filterConfigs = [...this.filterConfigs.map(config => {
            if (config.id === 'materia') {
              return {
                ...config,
                options: [
                  { value: '', label: 'Todas las materias' },
                  ...materias.map(materia => ({
                    value: materia.id,
                    label: `${materia.codigo ? materia.codigo + ' - ' : ''}${materia.nombre}`
                  }))
                ]
              };
            }
            return config;
          })];
        },
        error: (err: any) => {
          console.error('Error al cargar materias:', err);
        }
      });
    }
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //Método para configurar observables después de la inicialización
  private setupObservables(): void {
    // Conectar con los observables del servicio
    this.entregasService.entregas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entregas: Entrega[]) => {
        console.log('Entregas recibidas en componente:', entregas);
        this.entregas$.next(entregas);
      });

    // Suscribirse a las entregas filtradas para actualizar la tabla
    this.entregasFiltradas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entregasFiltradas: Entrega[]) => {
        // Mapear para compatibilidad con la tabla genérica
        this.tableData = entregasFiltradas.map(e => ({
          ...e,
          estudiante: e.estudiante_nombre,
          actividad: e.actividad_titulo,
          materia: e.materia_nombre
        }));
      });

    // Configurar loading state
    this.entregasService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading$.next(loading);
      });
  }


  private initializeForm(): void {
    this.gradeForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      comentarios: ['', Validators.maxLength(500)]
    });
  }

  private cargarDatos(): void {
    console.log('🎬 Iniciando carga de entregas...');
    const user = this.authService.getLoggedInUser();
    if (!user || user.role !== 'docente') {
      console.error('❌ No hay docente Logueado');
      this.entregas$.next([]);
      return;
    }

    // Cargar actividades para los filtros
    this.actividadService.obtenerActividadesDeMateriasDelDocente(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error: Error) => {
          console.error('❌ Error al cargar actividades:', error);
        }
      });

    // Cargar entregas de las materias del docente
    if (this.entregasService.obtenerEntregasDeMateriasDelDocente) {
      this.entregasService.obtenerEntregasDeMateriasDelDocente(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error: Error) => {
            console.error('❌ Error al cargar entregas:', error);
          }
        });
    } else {
      console.warn('El método obtenerEntregasDeMateriasDelDocente no está implementado en entregasService.');
    }
  }

  private actualizarOpcionesActividades(actividades: Actividad[]): void {
    // Actualizar las opciones del filtro de actividades dinámicamente
    this.filterConfigs = this.filterConfigs.map(config => {
      if (config.id === 'actividad') {
        return {
          ...config,
          options: [
            { value: '', label: 'Todas las actividades' },
            ...actividades.map(actividad => ({
              value: actividad.id,
              label: actividad.titulo
            }))
          ]
        };
      }
      return config;
    });
  }

  // Método para manejar cambios de filtros desde app-filters
  onFilterChange(filterEvent: { filterId: string, value: any }): void {
    switch (filterEvent.filterId) {
      case 'texto':
        this.aplicarFiltroTexto(filterEvent.value);
        break;
      case 'actividad':
        this.aplicarFiltroActividad(filterEvent.value);
        break;
      case 'estado':
        this.aplicarFiltroEstado(filterEvent.value);
        break;
      case 'materia':
        this.filtroMateria(filterEvent.value);
        break;
    }
  }

  // Método para manejar clicks de botones en filtros
  onFilterButtonClick(buttonEvent: { filterId: string }): void {
    if (buttonEvent.filterId === 'limpiar') {
      this.limpiarFiltros();
      // También actualizar los valores en filterConfigs
      this.filterConfigs = this.filterConfigs.map(config => ({
        ...config,
        value: ''
      }));
    }
  }

  // Métodos de filtrado
  aplicarFiltroTexto(texto: string): void {
    this.filtroTexto$.next(texto || ''); // Validar null/undefined
  }

  aplicarFiltroActividad(actividad: string): void {
    this.filtroActividad$.next(actividad || '');
  }

  aplicarFiltroEstado(estado: string): void {
    this.filtroEstado$.next(estado || '');
  }

  filtroMateria(materia: string): void {
    this.filtroMateria$.next(materia || '');
  }

  limpiarFiltros(): void {
    this.filtroActividad$.next('');
    this.filtroEstado$.next('');
    this.filtroMateria$.next('');
  }

  // Métodos para manejar eventos de tabla
  onTableSort(sortEvent: any): void {
    console.log('Sort event:', sortEvent);
    // Implementación de lógica de ordenamiento 
  }

  onTableRowClick(rowEvent: any): void {
    console.log('Row clicked:', rowEvent);
    // Implementación de lógica de click en fila
  }


  // Manejar acciones de tabla
  onTableAction(event: { action: string, row: any }): void {
    if (!event || !event.action || !event.row) {
      console.error('Evento de tabla inválido:', event);
      return;
    }

    switch (event.action) {
      case 'view':
        this.verEntrega(event.row);
        break;
      case 'grade':
        this.calificarEntrega(event.row);
        break;
      default:
        console.warn('Acción no reconocida:', event.action);
    }
    // Log para ver el estado de la tabla tras una acción
    console.log('[LOG] tableData tras acción:', this.tableData);
  }

  private verEntrega(entrega: any): void {
    if (!entrega || !entrega.id) {
      console.error('Entrega inválida para ver:', entrega);
      return;
    }

    console.log('Ver entrega:', entrega);
    this.selectedEntregaForView = entrega;
    this.showViewModal$.next(true);
  }

  private calificarEntrega(entrega: any): void {
    if (!entrega || !entrega.id) {
      console.error('Entrega inválida para calificar:', entrega);
      return;
    }

    console.log('Calificar entrega:', entrega);
    this.selectedEntrega = entrega;
    this.gradeForm.reset();
    this.showGradeModal$.next(true);
  }

  // Métodos del modal de calificación
  abrirModalCalificar(entrega: Entrega): void {
    this.selectedEntrega = entrega;
    this.gradeForm.patchValue({
      calificacion: entrega.calificacion || '',
      comentarios: entrega.comentarios_docente || ''
    });
    this.showGradeModal$.next(true);
  }

  cerrarModalCalificar(): void {
    this.showGradeModal$.next(false);
    this.selectedEntrega = null;
    this.gradeForm.reset();
  }

  cerrarModalVer(): void {
    this.showViewModal$.next(false);
    this.selectedEntregaForView = null;
  }

  irACalificarDesdeVer(): void {
    if (this.selectedEntregaForView) {
      // Cerrar modal de ver
      this.cerrarModalVer();
      // Abrir modal de calificar con la misma entrega
      this.calificarEntrega(this.selectedEntregaForView);
    }
  }

  guardarCalificacion(): void {
    if (this.gradeForm.valid && this.selectedEntrega) {
      const updateData = {
        calificacion: this.gradeForm.value.calificacion,
        comentarios_docente: this.gradeForm.value.comentarios,
        estado: 'Calificada' as const
      };

      console.log('🔄 Datos a enviar:', updateData);
      console.log('🔄 Entrega seleccionada:', this.selectedEntrega);
      console.log('🔄 ID de entrega:', this.selectedEntrega.id);

      this.entregasService.actualizarEntregaPorDocente({ id: this.selectedEntrega.id, ...updateData })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (entregaActualizada: Entrega) => {
            console.log('✅ Entrega calificada exitosamente:', entregaActualizada);
            this.cerrarModalCalificar();
            // Forzar recarga de entregas para ver los cambios
            this.entregasService.refrescarEntregas();
          },
          error: (error: Error) => {
            console.error('❌ Error al calificar entrega:', error);
            alert('Error al guardar la calificación. Revisa la consola para más detalles.');
          }
        });
    } else {
      this.marcarCamposComoTocados();
      console.log('❌ Formulario inválido o entrega no seleccionada');
      console.log('🔄 Estado del formulario:', this.gradeForm.value);
      console.log('🔄 Errores del formulario:', this.gradeForm.errors);
    }
  }

  // Método helper para marcar campos como tocados
  private marcarCamposComoTocados(): void {
    Object.keys(this.gradeForm.controls).forEach(key => {
      const control = this.gradeForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Getters para validaciones en template
  get calificacion() { return this.gradeForm.get('calificacion'); }
  get comentarios() { return this.gradeForm.get('comentarios'); }

  // Helper methods para el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.gradeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.gradeForm.get(fieldName);
    if (field && field.errors) {
      if (fieldName === 'calificacion' && field.errors['required']) {
        return 'La calificación es requerida';
      }
      if (fieldName === 'calificacion' && field.errors['min']) {
        return 'La calificación debe ser mayor o igual a 1';
      }
      if (fieldName === 'calificacion' && field.errors['max']) {
        return 'La calificación debe ser menor o igual a 100';
      }
      if (fieldName === 'comentarios' && field.errors['maxlength']) {
        return 'Los comentarios no pueden exceder 500 caracteres';
      }

      // Mensajes genéricos
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} debe ser menor a ${field.errors['max'].max}`;
    }
    return '';
  }
}