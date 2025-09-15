// ...existing code...
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest, takeUntil, map, of } from 'rxjs';
import { GenericTableComponent } from '../../../docente/components/generic-table/generic-table.component';
import { AuthService } from '../../../../services/auth/auth-service';
import { FilterConfig, FiltersComponent } from '../../../docente/components/filters/filters.component';
import { EntregasService } from '../../../../services/entregas.service';
import { ActividadService } from '../../../../services/actividad.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { Entrega } from '../../../../models/entregas-models/entregas.interface';
import { Actividad } from '../../../../models/actividad-models/actividad.interface';
import { Materia } from '../../../../models/materias-models/materias-models';

@Component({
  selector: 'app-entregas-alumno',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, FiltersComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './entregas.html',
  styleUrls: ['./entregas.css']
})
export class EntregasAlumnoComponent implements OnInit, OnDestroy {
  // Filtro de texto global (búsqueda)
  filtroTexto$ = new BehaviorSubject<string>('');
  // Para drag-and-drop en el modal de entrega
  isDragOver = false;

  // Drag-and-drop para área de archivos (igual que docente)
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
      // Solo se permite un archivo
      this.onArchivoSeleccionado({ target: { files: [files[0]] } });
    }
  }
  private destroy$ = new Subject<void>();

  entregas$ = new BehaviorSubject<Entrega[]>([]);
  actividadesDisponibles$ = new BehaviorSubject<Actividad[]>([]);
  materias$ = new BehaviorSubject<Materia[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);

  showEntregaModal$ = new BehaviorSubject<boolean>(false);
  showViewModal$ = new BehaviorSubject<boolean>(false);

  selectedEntregaForView: Entrega | null = null;
  archivoPreview: File | null = null;

  // Formulario reactivo para nueva entrega
  entregaForm!: FormGroup;

  // Filtros
  filtroActividad$ = new BehaviorSubject<string>('');
  filtroMateria$ = new BehaviorSubject<string>('');
  filtroEstado$ = new BehaviorSubject<string>('');

  entregasFiltradas$ = combineLatest([
    this.entregas$,
    this.filtroActividad$,
    this.filtroMateria$,
    this.filtroEstado$,
    this.filtroTexto$
  ]).pipe(
    map(([entregas, actividad, materia, estado, texto]) => {
      if (!entregas || !Array.isArray(entregas)) return [];
      const textoLower = (texto || '').toLowerCase();
      return entregas.filter(entrega => {
        const coincideActividad = actividad === '' || String(entrega.actividad_id) === String(actividad);
        const coincideMateria = materia === '' || String(entrega.materia_id) === String(materia);
        const coincideEstado = estado === '' || entrega.estado === estado;
        // Búsqueda por texto en actividad_titulo y materia_nombre
        const actividadTitulo = (entrega.actividad_titulo || '').toLowerCase();
        const materiaNombre = (entrega.materia_nombre || '').toLowerCase();
        const coincideTexto = textoLower === '' || actividadTitulo.includes(textoLower) || materiaNombre.includes(textoLower);
        return coincideActividad && coincideMateria && coincideEstado && coincideTexto;
      });
    })
  );

  tableColumns: any[] = [
    { key: 'actividad_titulo', label: 'Actividad', type: 'text' },
    { key: 'materia_nombre', label: 'Materia', type: 'text' },
    { key: 'fechaEntrega', label: 'Fecha Entrega', type: 'date' },
    { key: 'estado', label: 'Estado', type: 'status' },
    { key: 'calificacion', label: 'Nota', type: 'grade' },
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
      id: 'feedback',
      label: '',
      type: 'button',
      buttonClass: 'btn-icon-only',
      icon: '/icons/clipboard-check-fill.svg',
      tooltip: 'Ver retroalimentación'
    },
    {
      id: 'edit',
      label: '',
      type: 'button',
      buttonClass: 'btn-icon-only',
      icon: '/icons/bi-pencil.svg',
      tooltip: 'Editar entrega'
    }
  ];

  estadosEntrega = ['Pendiente', 'Entregada', 'Calificada', 'Atrasada'];

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
      options: [{ value: '', label: 'Todos los estados' }, ...['Pendiente', 'Entregada', 'Calificada', 'Atrasada'].map(e => ({ value: e, label: e }))]
    },
    {
      id: 'limpiar',
      type: 'button',
      label: 'Limpiar Filtros',
      variant: 'secondary'
    }
  ];

  aplicarFiltroTexto(texto: string): void {
    this.filtroTexto$.next(texto);
  }

  // --- Retroalimentación ---
  showFeedbackModal$ = new BehaviorSubject<boolean>(false);
  selectedEntregaForFeedback: Entrega | null = null;

  verRetroalimentacion(entrega: Entrega): void {
    this.selectedEntregaForFeedback = entrega;
    this.showFeedbackModal$.next(true);
  }
  cerrarModalFeedback(): void {
    this.showFeedbackModal$.next(false);
    this.selectedEntregaForFeedback = null;
  }

  // --- Edición ---
  showEditModal$ = new BehaviorSubject<boolean>(false);
  selectedEntregaForEdit: Entrega | null = null;
  isEditMode = false;

  editarEntrega(entrega: Entrega): void {
    this.selectedEntregaForEdit = entrega;
    this.isEditMode = true;
    // Prefijar valores necesarios para que el form sea válido en modo edición
    this.entregaForm.patchValue({
      materia_id: entrega.materia_id,
      actividad_id: entrega.actividad_id,
      comentarios: entrega.comentarios_estudiante || ''
    });
    // En edición el archivo NO es obligatorio
    const archivoCtrl = this.entregaForm.get('archivo');
    archivoCtrl?.clearValidators();
    archivoCtrl?.updateValueAndValidity();
    this.archivoPreview = null;
    this.showEditModal$.next(true);
  }
  cerrarModalEdit(): void {
    this.showEditModal$.next(false);
    this.selectedEntregaForEdit = null;
    this.isEditMode = false;
    // Restaurar validación de archivo requerida para creación
    const archivoCtrl = this.entregaForm.get('archivo');
    archivoCtrl?.setValidators([Validators.required]);
    archivoCtrl?.updateValueAndValidity();
    this.entregaForm.reset();
    this.archivoPreview = null;
  }

  constructor(
    private entregasService: EntregasService,
    private actividadService: ActividadService,
    private materiaService: MateriaService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initializeForm();
    this.setupObservables();
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupObservables(): void {
    this.entregasService.entregas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entregas: Entrega[]) => {
        this.entregas$.next(entregas);
      });
    this.entregasService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading$.next(loading));
  }

  private initializeForm(): void {
    this.entregaForm = this.fb.group({
      materia_id: ['', Validators.required],
      actividad_id: ['', Validators.required],
      archivo: [null, Validators.required],
      comentarios: ['', Validators.maxLength(500)]
    });
  }

  private cargarDatosIniciales(): void {
    const user = this.authService.getLoggedInUser();
    if (!user || user.role !== 'alumno') {
      this.entregas$.next([]);
      return;
    }
    // Cargar materias inscritas
    this.materiaService.getMaterias(user.id).subscribe({
      next: (materias: Materia[]) => {
        this.materias$.next(materias);
        // Actualizar filtro de materias
        this.filterConfigs = this.filterConfigs.map(config => {
          if (config.id === 'materia') {
            return {
              ...config,
              options: [{ value: '', label: 'Todas las materias' }, ...materias.map(m => ({ value: m.id, label: m.nombre }))]
            };
          }
          return config;
        });
        // Para el flujo del modal, no cargamos actividades hasta que se seleccione una materia
        this.actividadesDisponibles$.next([]);
      },
      error: () => this.materias$.next([])
    });
    // Cargar entregas propias
    const alumnoId = user.id;
    this.entregasService.obtenerEntregasDeMateriasDelAlumno(alumnoId).subscribe((entregas) => {
      this.entregas$.next(entregas);
    });
  }

  private cargarActividadesDeMaterias(materiaIds: number[]): void {
    if (!materiaIds.length) {
      this.actividadesDisponibles$.next([]);
      return;
    }
    // Obtener todas las actividades de las materias inscritas
    const actividadesRequests = materiaIds.map(materiaId => this.actividadService.obtenerActividadesPorMateria(materiaId));
    combineLatest(actividadesRequests).pipe(
      map(arrays => arrays.flat())
    ).subscribe(actividades => {
      this.actividadesDisponibles$.next(actividades);
      // Actualizar filtro de actividades
      this.filterConfigs = this.filterConfigs.map(config => {
        if (config.id === 'actividad') {
          return {
            ...config,
            options: [{ value: '', label: 'Todas las actividades' }, ...actividades.map(a => ({ value: a.id, label: a.titulo }))]
          };
        }
        return config;
      });
    });
  }

  // Métodos de UI y filtros
  onFilterChange(filterEvent: { filterId: string, value: any }): void {
    switch (filterEvent.filterId) {
      case 'texto':
        this.filtroTexto$.next(filterEvent.value);
        break;
      case 'actividad':
        this.filtroActividad$.next(filterEvent.value);
        break;
      case 'materia':
        this.filtroMateria$.next(filterEvent.value);
        break;
      case 'estado':
        this.filtroEstado$.next(filterEvent.value);
        break;
      case 'limpiar':
        this.filtroActividad$.next('');
        this.filtroMateria$.next('');
        this.filtroEstado$.next('');
        this.filtroTexto$.next('');
        break;
    }
  }
  onFilterButtonClick(event: any): void {
    if (event.filterId === 'limpiar') {
      this.filtroActividad$.next('');
      this.filtroMateria$.next('');
      this.filtroEstado$.next('');
    }
  }

  onTableSort(event: any): void { /* Implementar si se requiere */ }
  onTableRowClick(event: any): void { this.verEntrega(event); }
  onTableAction(event: { action: string, row: any }): void {
    if (!event || !event.action || !event.row) {
      console.error('Evento de tabla inválido:', event);
      return;
    }
    switch (event.action) {
      case 'feedback':
        this.verRetroalimentacion(event.row);
        break;
      case 'edit':
        this.editarEntrega(event.row);
        break;
      case 'view':
        this.verEntrega(event.row);
        break;
      default:
        console.warn('Acción de tabla no reconocida:', event.action);
    }
  }

  abrirModalEntrega(): void {
    this.entregaForm.reset();
    this.archivoPreview = null;
    // Reiniciar selects dependientes
    this.entregaForm.patchValue({ materia_id: '', actividad_id: '', comentarios: '' });
    this.actividadesDisponibles$.next([]);
    this.showEntregaModal$.next(true);
  }
  cerrarModalEntrega(): void {
    this.showEntregaModal$.next(false);
    this.entregaForm.reset();
    this.archivoPreview = null;
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar formato y tamaño (simulado)
      const formatosPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!formatosPermitidos.includes(file.type)) {
        this.entregaForm.get('archivo')?.setErrors({ formato: true });
        this.archivoPreview = null;
        return;
      }
      this.archivoPreview = file;
      this.entregaForm.get('archivo')?.setValue(file);
    }
  }

  // Cambio de materia en el modal: cargar actividades asociadas
  onMateriaChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const materiaId = target.value ? Number(target.value) : 0;
    // Limpiar selección de actividad
    this.entregaForm.get('actividad_id')?.setValue('');
    if (!materiaId) {
      this.actividadesDisponibles$.next([]);
      return;
    }
    // Cargar actividades solo de la materia seleccionada para el modal
    const alumnoId = this.getAlumnoId() || undefined;
    this.actividadService.obtenerActividadesPorMateria(materiaId, alumnoId).subscribe({
      next: (acts) => this.actividadesDisponibles$.next(acts || []),
      error: () => this.actividadesDisponibles$.next([])
    });
  }

  enviarEntrega(): void {
    const user = this.authService.getLoggedInUser();
    if (!user) return;

    if (this.isEditMode) {
      if (!this.selectedEntregaForEdit) return;
      if (this.entregaForm.invalid) {
        this.marcarCamposComoTocados();
        return;
      }

      // Construir payload de actualización (solo campos editables por estudiante)
      const payload: any = {
        id: this.selectedEntregaForEdit.id,
        estado: 'Entregada' as const
      };
      if (this.archivoPreview) {
        payload.archivo_url = this.archivoPreview.name;
      }
      if (typeof this.entregaForm.value.comentarios === 'string') {
        payload.comentarios_estudiante = this.entregaForm.value.comentarios;
      }

      this.loading$.next(true);
      this.entregasService.actualizarEntregaPorEstudiante(payload).subscribe({
        next: () => {
          this.loading$.next(false);
          this.cerrarModalEdit();
          this.entregasService.refrescarEntregas();
          alert('Entrega actualizada correctamente.');
        },
        error: () => {
          this.loading$.next(false);
          alert('Error al actualizar la entrega.');
        }
      });
      return;
    }

    // Flujo de creación
    if (this.entregaForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }
    const actividadId = this.entregaForm.value.actividad_id; // puede ser string o number
    // Validar fecha límite (simulado)
    const actividad = this.actividadesDisponibles$.value.find(a => String(a.id) === String(actividadId));
    if (actividad && new Date(actividad.fechaLimite) < new Date()) {
      this.entregaForm.get('actividad_id')?.setErrors({ fueraDeFecha: true });
      return;
    }
    // Simular upload de archivo y obtener URL (mock)
    const archivoUrl = this.archivoPreview ? this.archivoPreview.name : '';
    const nuevaEntrega = {
      actividad_id: actividadId, // preservar tipo original (string|number)
      alumno_id: user.id,
      archivo_url: archivoUrl,
      comentarios_estudiante: this.entregaForm.value.comentarios || '',
      estado: 'Entregada' as const,
      fecha_entrega: new Date().toISOString(),
      materia_id: actividad ? actividad.materia_id : this.entregaForm.value.materia_id,
      calificacion: null,
      comentarios_docente: null
    };
    this.loading$.next(true);
    this.entregasService.crearEntrega(nuevaEntrega).subscribe({
      next: () => {
        this.loading$.next(false);
        this.cerrarModalEntrega();
        this.entregasService.refrescarEntregas();
        alert('Entrega enviada correctamente.');
      },
      error: () => {
        this.loading$.next(false);
        alert('Error al enviar la entrega.');
      }
    });
  }

  private verEntrega(entrega: Entrega): void {
    this.selectedEntregaForView = entrega;
    this.showViewModal$.next(true);
  }
  cerrarModalVer(): void {
    this.showViewModal$.next(false);
    this.selectedEntregaForView = null;
  }

  // Helpers para validaciones
  isFieldInvalid(fieldName: string): boolean {
    const field = this.entregaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  getFieldError(fieldName: string): string {
    const field = this.entregaForm.get(fieldName);
    if (field && field.errors) {
      if (fieldName === 'materia_id' && field.errors['required']) {
        return 'La materia es requerida';
      }
      if (fieldName === 'actividad_id' && field.errors['required']) {
        return 'La actividad es requerida';
      }
      if (fieldName === 'actividad_id' && field.errors['fueraDeFecha']) {
        return 'La fecha límite de la actividad ha pasado';
      }
      if (fieldName === 'archivo' && field.errors['required']) {
        return 'El archivo es obligatorio';
      }
      if (fieldName === 'archivo' && field.errors['formato']) {
        return 'Formato de archivo no permitido';
      }
      if (fieldName === 'comentarios' && field.errors['maxlength']) {
        return 'Los comentarios no pueden exceder 500 caracteres';
      }
    }
    return '';
  }
  private marcarCamposComoTocados(): void {
    Object.keys(this.entregaForm.controls).forEach(key => {
      const control = this.entregaForm.get(key);
      if (control) control.markAsTouched();
    });
  }
  private getAlumnoId(): number | null {
    const user = this.authService.getLoggedInUser();
    return user && user.role === 'alumno' ? user.id : null;
  }
}
