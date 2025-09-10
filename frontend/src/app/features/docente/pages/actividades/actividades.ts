import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest, takeUntil, map } from 'rxjs';
import { GenericTableComponent } from '../../components/generic-table/generic-table.component';
import { ActividadService } from '../../../../services/actividad.service';
import { FilterConfig, FiltersComponent } from '../../components/filters/filters.component';
import { Actividad, CreateActividadRequest } from '../../../../models/actividad.interface';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, FormsModule, ReactiveFormsModule, FiltersComponent],
  templateUrl: './actividades.html',
  styleUrls: ['./actividades.css']
})
export class ActividadesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Observables reactivos
  actividades$ = new BehaviorSubject<Actividad[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  // Filtros reactivos
  filtroTexto$ = new BehaviorSubject<string>('');
  filtroEstado$ = new BehaviorSubject<string>('');
  filtroTipo$ = new BehaviorSubject<string>('');
  filtroMateria$ = new BehaviorSubject<string>('');

  // Actividades filtradas reactivamente
  actividadesFiltradas$ = combineLatest([
    this.actividades$,
    this.filtroTexto$,
    this.filtroEstado$,
    this.filtroTipo$,
    this.filtroMateria$
  ]).pipe(
    map(([actividades, texto, estado, tipo, materia]) => {
      // Validar que actividades existe y es array
      if (!actividades || !Array.isArray(actividades)) {
        return [];
      }

      return actividades.filter(actividad => {
        // Validar propiedades antes de usar toLowerCase()
        const tituloSafe = actividad?.titulo || '';
        const descripcionSafe = actividad?.descripcion || '';

        const coincideTexto = texto === '' ||
          tituloSafe.toLowerCase().includes(texto.toLowerCase()) ||
          descripcionSafe.toLowerCase().includes(texto.toLowerCase());

        const coincideEstado = estado === '' || actividad?.estado === estado;
        const coincideTipo = tipo === '' || actividad?.tipo === tipo;
        const coincideMateria = materia === '' || actividad?.materia_id?.toString() === materia;

        return coincideTexto && coincideEstado && coincideTipo && coincideMateria;
      });
    })
  );

  // Estados de UI reactivos
  showCreateModal$ = new BehaviorSubject<boolean>(false);

  // Formulario reactivo para crear actividades
  actividadForm!: FormGroup;

  // Manejo de archivos
  archivosSeleccionados: File[] = [];
  isDragOver = false;
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  // Configuración de tabla
  tableColumns: any[] = [
    { key: 'titulo', label: 'Título', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'tipo', label: 'Tipo', type: 'text' },
    { key: 'fechaLimite', label: 'Fecha Límite', type: 'date' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'puntos', label: 'Puntos', type: 'text' }
  ];

  tableActions: any[] = [
    {
      id: 'view',
      label: 'Ver',
      action: 'view',
      icon: 'eye',
      class: 'btn-primary'
    },
    {
      id: 'edit',
      label: 'Editar',
      action: 'edit',
      icon: 'edit',
      class: 'btn-secondary'
    },
    {
      id: 'delete',
      label: 'Eliminar',
      action: 'delete',
      icon: 'trash',
      class: 'btn-danger'
    }
  ];


  // Opciones para filtros
  tiposActividad = ['Proyecto', 'Quiz', 'Tarea', 'Examen'];
  estadosActividad = ['Activa', 'Inactiva', 'Completada'];
  
  // Lista de materias (en una implementación real, esto vendría del servicio)
  materias = [
    { id: 1, nombre: 'Programación II', codigo: 'PROG-II-2025' },
    { id: 2, nombre: 'Estructuras de Datos', codigo: 'EST-DAT-2025' },
    { id: 3, nombre: 'Cálculo II', codigo: 'CALC-II-2025' }
  ];

  // Configuración de filtros para el componente app-filters
  filterConfigs: FilterConfig[] = [
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
        ...this.estadosActividad.map(estado => ({ value: estado, label: estado }))
      ]
    },
    {
      id: 'tipo',
      type: 'dropdown',
      label: 'Tipo',
      placeholder: 'Todos los tipos',
      options: [
        { value: '', label: 'Todos los tipos' },
        ...this.tiposActividad.map(tipo => ({ value: tipo, label: tipo }))
      ],
    },
    {
      id: 'limpiar',
      type: 'button',
      label: 'Limpiar Filtros',
      variant: 'secondary',
    }
  ];

  // Datos de tabla (por compatibilidad con el HTML actual)
  tableData: any[] = [];

  constructor(
    private actividadService: ActividadService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
    this.setupObservables();
  }

  ngOnInit(): void {
    this.cargarActividades();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para configurar observables después de la inicialización
  private setupObservables(): void {
    // Conectar con los observables del servicio
    this.actividadService.actividades$
      .pipe(takeUntil(this.destroy$))
      .subscribe((actividades: Actividad[]) => {
        console.log('Actividades recibidas en componente:', actividades);
        this.actividades$.next(actividades);
        this.tableData = actividades; // Para compatibilidad con HTML actual
      });

    this.actividadService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading$.next(loading);
      });
  }

  private initializeForm(): void {
    this.actividadForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      materia_id: ['', Validators.required], // Campo obligatorio para seleccionar materia
      fechaLimite: ['', Validators.required],
      puntos: [100, [Validators.required, Validators.min(1), Validators.max(100)]],
      docente_id: [1]  // Por ahora fijo
    });
  }

  private cargarActividades(): void {
    console.log('🎬 Iniciando carga de actividades...');
    // El servicio maneja el loading state
    this.actividadService.obtenerActividades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error: Error) => {
          console.error('❌ Error al cargar actividades:', error);
        }
      });
  }

  // Método para manejar cambios de filtros desde app-filters
  onFilterChange(filterEvent: { filterId: string, value: any }): void {
    switch (filterEvent.filterId) {
      case 'texto':
        this.aplicarFiltroTexto(filterEvent.value);
        break;
      case 'estado':
        this.aplicarFiltroEstado(filterEvent.value);
        break;
      case 'tipo':
        this.aplicarFiltroTipo(filterEvent.value);
        break;
      case 'materia':
        this.aplicarFiltroMateria(filterEvent.value);
        break;
    }
  }
  // Método para formatear puntos en la visualización
  formatearPuntos(puntos: number): string {
    return `${puntos} pts`;
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

  // Método para el botón duplicado de crear actividad
  onCreateActivityClick(): void {
    this.abrirModalCrear();
  }

  // Métodos de filtrado
  aplicarFiltroTexto(texto: string): void {
    this.filtroTexto$.next(texto || ''); // Validar null/undefined
  }

  aplicarFiltroEstado(estado: string): void {
    this.filtroEstado$.next(estado || '');
  }

  aplicarFiltroTipo(tipo: string): void {
    this.filtroTipo$.next(tipo || '');
  }

  aplicarFiltroMateria(materia: string): void {
    this.filtroMateria$.next(materia || '');
  }

  limpiarFiltros(): void {
    this.filtroTexto$.next('');
    this.filtroEstado$.next('');
    this.filtroTipo$.next('');
    this.filtroMateria$.next('');
    this.filtroTipo$.next('');
  }

  // Métodos del modal
  abrirModalCrear(): void {
    this.showCreateModal$.next(true);
    this.actividadForm.reset();
    // Restaurar valores por defecto después del reset
    this.actividadForm.patchValue({
      puntos: 100,
      materia_id: 1,
      docente_id: 1
    });
  }

  cerrarModal(): void {
    this.showCreateModal$.next(false);
    this.actividadForm.reset();
    this.resetFileSelection(); // Limpiar archivos seleccionados
  }

  // Crear nueva actividad
  crearActividad(): void {
    if (this.actividadForm.valid) {
      const nuevaActividad = {
        ...this.actividadForm.value,
        fechaCreacion: new Date().toISOString(),
        estado: 'Activa',
        // Información de archivos adjuntos
        archivos_adjuntos: this.archivosSeleccionados.map(file => ({
          nombre: file.name,
          tamaño: file.size,
          tipo: file.type,
          // En una implementación real, aquí tendrías la URL del archivo subido
          url: `uploads/${file.name}` 
        }))
      };

      console.log('Creando actividad con archivos:', nuevaActividad);

      this.actividadService.crearActividad(nuevaActividad)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (actividad: Actividad) => {
            console.log('Actividad creada:', actividad);
            this.cerrarModal();
          },
          error: (error: Error) => {
            console.error('Error al crear actividad:', error);
          }
        });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  // Método helper separado para mejor legibilidad
  private marcarCamposComoTocados(): void {
    Object.keys(this.actividadForm.controls).forEach(key => {
      const control = this.actividadForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos para manejar eventos de tabla
  onTableSort(sortEvent: any): void {
    console.log('Sort event:', sortEvent);
    // Implementar lógica de ordenamiento si es necesario
  }

  onTableRowClick(rowEvent: any): void {
    console.log('Row clicked:', rowEvent);
    // Implementar lógica de click en fila si es necesario
  }

  // Manejar acciones de tabla
  onTableAction(event: { action: string, row: any }): void {
    if (!event || !event.action || !event.row) {
      console.error('Evento de tabla inválido:', event);
      return;
    }

    switch (event.action) {
      case 'view':
        this.verActividad(event.row);
        break;
      case 'edit':
        this.editarActividad(event.row);
        break;
      case 'delete':
        this.eliminarActividad(event.row);
        break;
      default:
        console.warn('Acción no reconocida:', event.action);
    }
  }

  private verActividad(actividad: any): void {
    console.log('Ver actividad:', actividad);
    // Implementar vista detallada si es necesario
  }

  private editarActividad(actividad: any): void {
    if (!actividad || !actividad.id) {
      console.error('Actividad inválida para editar:', actividad);
      return;
    }

    console.log('Editar actividad:', actividad);
    this.actividadForm.patchValue(actividad);
    this.showCreateModal$.next(true);
  }

  private eliminarActividad(actividad: any): void {
    if (!actividad || !actividad.id || !actividad.titulo) {
      console.error('Actividad inválida para eliminar:', actividad);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la actividad "${actividad.titulo}"?`)) {
      this.actividadService.eliminarActividad(actividad.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Actividad eliminada exitosamente');
          },
          error: (error: Error) => {
            console.error('Error al eliminar:', error);
          }
        });
    }
  }

  // Getters para validaciones en template
  get titulo() { return this.actividadForm.get('titulo'); }
  get descripcion() { return this.actividadForm.get('descripcion'); }
  get tipo() { return this.actividadForm.get('tipo'); }
  get fechaLimite() { return this.actividadForm.get('fechaLimite'); }
  get puntos() { return this.actividadForm.get('puntos'); }

  // Helper methods para el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.actividadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // ===== MÉTODOS PARA MANEJO DE ARCHIVOS =====
  
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.processFiles(Array.from(files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(Array.from(files));
    }
  }

  private processFiles(files: File[]): void {
    files.forEach(file => {
      // Validar tipo de archivo
      if (!this.allowedFileTypes.includes(file.type)) {
        console.warn(`Archivo ${file.name} no es de un tipo permitido`);
        return;
      }

      // Validar tamaño
      if (file.size > this.maxFileSize) {
        console.warn(`Archivo ${file.name} excede el tamaño máximo permitido (10MB)`);
        return;
      }

      // Verificar si el archivo ya está seleccionado
      const exists = this.archivosSeleccionados.some(f => 
        f.name === file.name && f.size === file.size
      );

      if (!exists) {
        this.archivosSeleccionados.push(file);
      }
    });
  }

  removeFile(index: number): void {
    this.archivosSeleccionados.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private resetFileSelection(): void {
    this.archivosSeleccionados = [];
    this.isDragOver = false;
  }

  getFieldError(fieldName: string): string {
    const field = this.actividadForm.get(fieldName);
    if (field && field.errors) {
      // Mensajes personalizados para campos específicos
      if (fieldName === 'materia_id' && field.errors['required']) {
        return 'Debe seleccionar una materia';
      }
      if (fieldName === 'titulo' && field.errors['required']) {
        return 'El título es requerido';
      }
      if (fieldName === 'descripcion' && field.errors['required']) {
        return 'La descripción es requerida';
      }
      if (fieldName === 'tipo' && field.errors['required']) {
        return 'Debe seleccionar un tipo de actividad';
      }
      if (fieldName === 'fechaLimite' && field.errors['required']) {
        return 'La fecha límite es requerida';
      }
      if (fieldName === 'puntos' && field.errors['required']) {
        return 'Los puntos son requeridos';
      }
      
      // Mensajes genéricos
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} debe ser menor a ${field.errors['max'].max}`;
    }
    return '';
  }
}