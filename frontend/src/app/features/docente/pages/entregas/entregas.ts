import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest, takeUntil, map } from 'rxjs';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { FilterConfig, FiltersComponent } from '../../components/filters/filters.component';
import { EntregasService } from '../../../../services/entregas.service';
import { ActividadService } from '../../../../services/actividad.service';
import { Entrega } from '../../../../models/entregas.interface';
import { Actividad } from '../../../../models/actividad.interface';
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
  entregasFiltradas$ = combineLatest([
    this.entregas$,
    this.filtroActividad$,
    this.filtroEstado$,
    this.filtroMateria$
  ]).pipe(
    map(([entregas, actividad, estado, materia]) => {
      if (!entregas || !Array.isArray(entregas)) {
        return [];
      }

      return entregas.filter(entrega => {
        const coincideActividad = actividad === '' || entrega.actividad_id?.toString() === actividad;
        const coincideEstado = estado === '' || entrega.estado === estado;
        const coincideMateria = materia === '' || entrega.materia_id?.toString() === materia;

        return coincideActividad && coincideEstado && coincideMateria;
      });
    })
  );

  // Estados de entrega posibles
  estadosEntrega = ['Pendiente', 'Entregada', 'Calificada', 'Atrasada'];

  // Lista de materias (igual que en actividades TAMBIÉN DEBE VENIR DEL SERVICIO MATERIAS CUANDO SE IMPLEMENTE)
  materias = [
    { id: 1, nombre: 'Programación II', codigo: 'PROG-II-2025' },
    { id: 2, nombre: 'Estructuras de Datos', codigo: 'EST-DAT-2025' },
    { id: 3, nombre: 'Cálculo II', codigo: 'CALC-II-2025' }
  ];

  // Lista de estudiantes (basada en db.json)
  estudiantes = [
    { id: "3", nombre: "María Rodríguez" },
    { id: "4", nombre: "Carlos López" }
  ];

  // Configuración de filtros (se llenarán dinámicamente)
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
        { value: '', label: 'Todas las materias' },
        ...this.materias.map(materia => ({
          value: materia.id.toString(),
          label: `${materia.codigo} - ${materia.nombre}`
        }))
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
      buttonClass: 'btn-primary',
      icon: '/icons/bi-eye.svg',
      tooltip: 'Ver entrega'
    },
    {
      id: 'grade',
      label: '',
      type: 'button',
      buttonClass: 'btn-success',
      icon: '/icons/check.svg',
      tooltip: 'Calificar entrega'
    }
  ];

  // Constuctor
  constructor(
    private entregasService: EntregasService,
    private actividadService: ActividadService,
    private fb: FormBuilder
  ) {
    // Inicializar formulario reactivo
    this.initializeForm()
    this.setupObservables()
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
    // Configurar loading state
    this.entregasService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading$.next(loading);
      });

    // Combinar actividades y entregas para transformar los datos
    combineLatest([
      this.actividadService.actividades$,
      this.entregasService.entregas$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([actividades, entregas]) => {
        console.log('Actividades y entregas recibidas:', { actividades, entregas });

        // Transformar entregas agregando nombres de actividad, materia y estudiante
        const entregasConNombres = entregas.map(entrega => {
          // Buscar actividad por ID (convertir a string para comparación)
          const actividad = actividades.find(act => act.id.toString() === entrega.actividad_id?.toString());
          
          console.log(`🔍 Buscando actividad ${entrega.actividad_id}:`, actividad);

          // Buscar estudiante por ID
          const estudiante = this.estudiantes.find(est => est.id === entrega.alumno_id?.toString());

          // Obtener nombre de materia basado en materia_id
          let materiaNombre = 'Materia desconocida';
          switch (entrega.materia_id) {
            case 1:
              materiaNombre = 'Programación II';
              break;
            case 2:
              materiaNombre = 'Estructuras de Datos';
              break;
            case 3:
              materiaNombre = 'Cálculo II';
              break;
          }

          return {
            ...entrega,
            actividad_titulo: actividad?.titulo || `Actividad ${entrega.actividad_id}`,
            materia_nombre: materiaNombre,
            estudiante_nombre: estudiante?.nombre || `Estudiante ${entrega.alumno_id}`
          };
        });

        console.log('Entregas transformadas:', entregasConNombres);
        this.entregas$.next(entregasConNombres);
        this.tableData = entregasConNombres;
      });
  }

  private initializeForm(): void {
    this.gradeForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      comentarios: ['', Validators.maxLength(500)]
    });
  }

  private cargarDatos(): void {
    console.log('Iniciando carga de entregas...');

    // Cargar actividades para los filtros
    this.actividadService.obtenerActividades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (actividades: Actividad[]) => {
          this.actividades$.next(actividades);
          this.actualizarOpcionesActividades(actividades);
        },
        error: (error: Error) => {
          console.error('❌ Error al cargar actividades:', error);
        }
      });

    // Cargar entregas
    this.entregasService.obtenerEntregas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error: Error) => {
          console.error('❌ Error al cargar entregas:', error);
        }
      });
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
              value: actividad.id.toString(),
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
      case 'actividad':
        this.aplicarFiltroActividad(filterEvent.value);
        break;
      case 'estado':
        this.aplicarFiltroEstado(filterEvent.value);
        break;
      case 'materia':
        this.aplicarFiltroMateria(filterEvent.value);
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
  aplicarFiltroActividad(actividad: string): void {
    this.filtroActividad$.next(actividad || '');
  }

  aplicarFiltroEstado(estado: string): void {
    this.filtroEstado$.next(estado || '');
  }

  aplicarFiltroMateria(materia: string): void {
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