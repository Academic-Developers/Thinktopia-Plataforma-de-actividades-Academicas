import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadService } from '../../../../services/actividad.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Actividad } from '../../../../models/actividad-models/actividad.interface';
import { Materia } from '../../../../models/materias-models/materia.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-actividades-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class ActividadesDocente implements OnInit, OnDestroy {
  // Lista de actividades y estados
  actividades: Actividad[] = [];
  loading = false;
  error = '';
  successMessage = '';

  // Materia seleccionada actualmente
  materiaSeleccionada: Materia | null = null;

  // Control del modal de formulario
  mostrarModal = false;
  modoEdicion = false;

  // Modelo del formulario para crear/editar
  formulario: {
    id?: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    fecha_limite: string;
    materia: number;
    docente: number;
  } = {
    titulo: '',
    descripcion: '',
    tipo: '',
    fecha_limite: '',
    materia: 0,
    docente: 0
  };

  // Archivo seleccionado para subir
  archivoSeleccionado: File | null = null;
  nombreArchivoActual: string = ''; // Para mostrar el nombre cuando se edita

  // Opciones de tipo de actividad
  tiposActividad = [
    'Practico',
    'Teorico',
    'Evaluacion',
    'Proyecto',
    'Investigacion',
    'Taller'
  ];

  // Suscripciones para limpiar en OnDestroy
  private subscriptions = new Subscription();

  constructor(
    private actividadService: ActividadService,
    private materiaService: MateriaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtiene la materia seleccionada del servicio
    const sub = this.materiaService.selectedMateria$.subscribe(materia => {
      this.materiaSeleccionada = materia;
      
      if (materia) {
        this.cargarActividades(materia.id);
      }
    });
    
    this.subscriptions.add(sub);

    // Suscribirse al estado de actividades del servicio
    const actividadSub = this.actividadService.actividades$.subscribe(actividades => {
      this.actividades = actividades;
    });
    
    this.subscriptions.add(actividadSub);

    // Suscribirse al estado de loading
    const loadingSub = this.actividadService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
    
    this.subscriptions.add(loadingSub);
  }

  ngOnDestroy(): void {
    // Limpia todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  // Carga actividades de la materia seleccionada
  cargarActividades(materiaId: number): void {
    this.error = '';
    this.actividadService.getActividadesPorMateria(materiaId).subscribe({
      next: () => {
        console.log('Actividades cargadas correctamente');
      },
      error: (err) => {
        this.error = 'Error al cargar las actividades';
        console.error(err);
      }
    });
  }

  // Abre el modal para crear una nueva actividad
  abrirModalCrear(): void {
    if (!this.materiaSeleccionada) {
      this.error = 'Debe seleccionar una materia primero';
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'Usuario no autenticado';
      return;
    }

    this.modoEdicion = false;
    this.formulario = {
      titulo: '',
      descripcion: '',
      tipo: this.tiposActividad[0], // Selecciona el primer tipo por defecto
      fecha_limite: '',
      materia: this.materiaSeleccionada.id,
      docente: userId
    };
    this.archivoSeleccionado = null;
    this.nombreArchivoActual = '';
    this.mostrarModal = true;
    this.limpiarMensajes();
  }

  // Abre el modal para editar una actividad existente
  abrirModalEditar(actividad: Actividad): void {
    this.modoEdicion = true;
    
    // Formatea la fecha para el input datetime-local
    // Django envia fecha en formato ISO: "2025-10-15T23:59:00Z"
    // El input datetime-local necesita: "2025-10-15T23:59"
    let fechaFormateada = '';
    if (actividad.fecha_limite) {
      const fecha = new Date(actividad.fecha_limite);
      fechaFormateada = this.formatearFechaParaInput(fecha);
    }

    this.formulario = {
      id: actividad.id,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      tipo: actividad.tipo,
      fecha_limite: fechaFormateada,
      materia: actividad.materia,
      docente: actividad.docente
    };
    this.archivoSeleccionado = null;
    // Extrae solo el nombre del archivo de la ruta completa
    this.nombreArchivoActual = actividad.archivo.split('/').pop() || 'archivo';
    this.mostrarModal = true;
    this.limpiarMensajes();
  }

  // Cierra el modal y resetea el formulario
  cerrarModal(): void {
    this.mostrarModal = false;
    this.formulario = {
      titulo: '',
      descripcion: '',
      tipo: '',
      fecha_limite: '',
      materia: 0,
      docente: 0
    };
    this.archivoSeleccionado = null;
    this.nombreArchivoActual = '';
  }

  // Maneja la seleccion de archivo desde el input
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      console.log('Archivo seleccionado:', this.archivoSeleccionado.name);
    }
  }

  // Guarda la actividad (crea o actualiza segun el modo)
  guardarActividad(): void {
    // Validacion basica
    if (!this.formulario.titulo || !this.formulario.descripcion || !this.formulario.tipo || !this.formulario.fecha_limite) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    // Al crear, el archivo es obligatorio
    if (!this.modoEdicion && !this.archivoSeleccionado) {
      this.error = 'Debe seleccionar un archivo';
      return;
    }

    this.limpiarMensajes();

    // Crea FormData para enviar archivo y datos
    // IMPORTANTE: Los nombres deben coincidir con lo que espera Django
    const formData = new FormData();
    formData.append('titulo', this.formulario.titulo);
    formData.append('descripcion', this.formulario.descripcion);
    formData.append('tipo', this.formulario.tipo);
    formData.append('fecha_limite', this.convertirFechaParaBackend(this.formulario.fecha_limite));
    formData.append('materia', this.formulario.materia.toString());
    formData.append('docente', this.formulario.docente.toString());
    
    // Solo agrega el archivo si hay uno seleccionado
    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    if (this.modoEdicion && this.formulario.id) {
      // Actualizar actividad existente
      this.actividadService.actualizarActividad(this.formulario.id, formData).subscribe({
        next: (actividadActualizada) => {
          if (actividadActualizada) {
            this.successMessage = 'Actividad actualizada exitosamente';
            this.cerrarModal();
            this.ocultarMensajeExito();
          } else {
            this.error = 'No se pudo actualizar la actividad';
          }
        },
        error: () => {
          this.error = 'Error al actualizar la actividad';
        }
      });
    } else {
      // Crear nueva actividad
      this.actividadService.crearActividad(formData).subscribe({
        next: (actividadCreada) => {
          if (actividadCreada) {
            this.successMessage = 'Actividad creada exitosamente';
            this.cerrarModal();
            this.ocultarMensajeExito();
          } else {
            this.error = 'No se pudo crear la actividad';
          }
        },
        error: () => {
          this.error = 'Error al crear la actividad';
        }
      });
    }
  }

  // Elimina una actividad con confirmacion
  eliminarActividad(actividad: Actividad): void {
    const confirmar = confirm(`¿Esta seguro de eliminar "${actividad.titulo}"?`);
    
    if (!confirmar) return;

    this.limpiarMensajes();

    this.actividadService.eliminarActividad(actividad.id).subscribe({
      next: (exito) => {
        if (exito) {
          this.successMessage = 'Actividad eliminada exitosamente';
          this.ocultarMensajeExito();
        } else {
          this.error = 'No se pudo eliminar la actividad';
        }
      },
      error: () => {
        this.error = 'Error al eliminar la actividad';
      }
    });
  }

  // Limpia mensajes de error y exito
  limpiarMensajes(): void {
    this.error = '';
    this.successMessage = '';
  }

  // Oculta mensaje de exito despues de 3 segundos
  private ocultarMensajeExito(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // Construye la URL completa del archivo
  // Django devuelve una ruta relativa como: /media/actividades/archivo.pdf
  // Necesitamos construir: http://localhost:8000/media/actividades/archivo.pdf
  obtenerUrlArchivo(rutaArchivo: string): string {
    if (!rutaArchivo) return '';
    
    // Si la ruta ya es una URL completa (comienza con http), devolverla tal cual
    if (rutaArchivo.startsWith('http')) {
      return rutaArchivo;
    }
    
    // Construir URL completa: http://localhost:8000 + /media/actividades/archivo.pdf
    const baseUrl = 'http://localhost:8000';
    
    // Asegurarse de que la ruta comience con /
    const ruta = rutaArchivo.startsWith('/') ? rutaArchivo : `/${rutaArchivo}`;
    
    return `${baseUrl}${ruta}`;
  }

  // Formatea una fecha para el input datetime-local
  // Input datetime-local requiere formato: YYYY-MM-DDTHH:mm
  private formatearFechaParaInput(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Convierte la fecha del input a formato ISO para el backend
  // Input envia: "2025-10-15T23:59"
  // Backend espera: "2025-10-15T23:59:00Z" (ISO 8601)
  private convertirFechaParaBackend(fechaInput: string): string {
    if (!fechaInput) return '';
    
    // Crea objeto Date desde el input y lo convierte a ISO
    const fecha = new Date(fechaInput);
    return fecha.toISOString();
  }

  // Formatea la fecha para mostrarla en la tabla de forma legible
  // De: "2025-10-15T23:59:00Z" a: "15/10/2025 23:59"
  formatearFechaParaMostrar(fechaISO: string): string {
    if (!fechaISO) return 'Sin fecha';
    
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}
