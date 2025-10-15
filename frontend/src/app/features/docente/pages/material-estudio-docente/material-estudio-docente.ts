import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialEstudioService } from '../../../../services/material-estudio/material-estudio.service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { MaterialEstudio } from '../../../../models/materiales-models/materiales-models';
import { Materia } from '../../../../models/materias-models/materia.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-material-estudio-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-estudio-docente.html',
  styleUrl: './material-estudio-docente.css'
})
export class MaterialEstudioDocente implements OnInit, OnDestroy {
  // Lista de materiales y estados
  materiales: MaterialEstudio[] = [];
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
    materia_id: number;
    autor_id: number;
  } = {
    titulo: '',
    descripcion: '',
    materia_id: 0,
    autor_id: 0
  };

  // Archivo seleccionado para subir
  archivoSeleccionado: File | null = null;
  nombreArchivoActual: string = ''; // Para mostrar el nombre cuando se edita

  // Suscripciones para limpiar en OnDestroy
  private subscriptions = new Subscription();

  constructor(
    private materialService: MaterialEstudioService,
    private materiaService: MateriaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtiene la materia seleccionada del servicio
    const sub = this.materiaService.selectedMateria$.subscribe(materia => {
      this.materiaSeleccionada = materia;
      
      if (materia) {
        this.cargarMateriales(materia.id);
      }
    });
    
    this.subscriptions.add(sub);

    // Suscribirse al estado de materiales del servicio
    const materialSub = this.materialService.materiales$.subscribe(materiales => {
      this.materiales = materiales;
    });
    
    this.subscriptions.add(materialSub);

    // Suscribirse al estado de loading
    const loadingSub = this.materialService.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
    
    this.subscriptions.add(loadingSub);
  }

  ngOnDestroy(): void {
    // Limpia todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  // Carga materiales de la materia seleccionada
  cargarMateriales(materiaId: number): void {
    this.error = '';
    this.materialService.getMaterialesPorMateria(materiaId).subscribe({
      next: () => {
        console.log('Materiales cargados correctamente');
      },
      error: (err) => {
        this.error = 'Error al cargar los materiales de estudio';
        console.error(err);
      }
    });
  }

  // Abre el modal para crear un nuevo material
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
      materia_id: this.materiaSeleccionada.id,
      autor_id: userId
    };
    this.archivoSeleccionado = null;
    this.nombreArchivoActual = '';
    this.mostrarModal = true;
    this.limpiarMensajes();
  }

  // Abre el modal para editar un material existente
  abrirModalEditar(material: MaterialEstudio): void {
    this.modoEdicion = true;
    this.formulario = {
      id: material.id,
      titulo: material.titulo,
      descripcion: material.descripcion,
      materia_id: material.materia_id,
      autor_id: material.autor_id
    };
    this.archivoSeleccionado = null;
    // Extrae solo el nombre del archivo de la ruta completa
    this.nombreArchivoActual = material.archivo.split('/').pop() || 'archivo';
    this.mostrarModal = true;
    this.limpiarMensajes();
  }

  // Cierra el modal y resetea el formulario
  cerrarModal(): void {
    this.mostrarModal = false;
    this.formulario = {
      titulo: '',
      descripcion: '',
      materia_id: 0,
      autor_id: 0
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

  // Guarda el material (crea o actualiza segun el modo)
  guardarMaterial(): void {
    // Validacion basica
    if (!this.formulario.titulo || !this.formulario.descripcion) {
      this.error = 'El título y la descripción son obligatorios';
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
    formData.append('materia', this.formulario.materia_id.toString()); // Django espera 'materia' no 'materia_id'
    formData.append('autor', this.formulario.autor_id.toString()); // Django espera 'autor' no 'autor_id'
    
    // Solo agrega el archivo si hay uno seleccionado
    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    if (this.modoEdicion && this.formulario.id) {
      // Actualizar material existente
      this.materialService.actualizarMaterial(this.formulario.id, formData).subscribe({
        next: (materialActualizado) => {
          if (materialActualizado) {
            this.successMessage = 'Material actualizado exitosamente';
            this.cerrarModal();
            this.ocultarMensajeExito();
          } else {
            this.error = 'No se pudo actualizar el material';
          }
        },
        error: () => {
          this.error = 'Error al actualizar el material';
        }
      });
    } else {
      // Crear nuevo material
      this.materialService.crearMaterial(formData).subscribe({
        next: (materialCreado) => {
          if (materialCreado) {
            this.successMessage = 'Material creado exitosamente';
            this.cerrarModal();
            this.ocultarMensajeExito();
          } else {
            this.error = 'No se pudo crear el material';
          }
        },
        error: () => {
          this.error = 'Error al crear el material';
        }
      });
    }
  }

  // Elimina un material con confirmacion
  eliminarMaterial(material: MaterialEstudio): void {
    const confirmar = confirm(`¿Está seguro de eliminar "${material.titulo}"?`);
    
    if (!confirmar) return;

    this.limpiarMensajes();

    this.materialService.eliminarMaterial(material.id).subscribe({
      next: (exito) => {
        if (exito) {
          this.successMessage = 'Material eliminado exitosamente';
          this.ocultarMensajeExito();
        } else {
          this.error = 'No se pudo eliminar el material';
        }
      },
      error: () => {
        this.error = 'Error al eliminar el material';
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
  // Django devuelve una ruta relativa como: /media/materiales_estudio/archivo.pdf
  // Necesitamos construir: http://localhost:8000/media/materiales_estudio/archivo.pdf
  obtenerUrlArchivo(rutaArchivo: string): string {
    if (!rutaArchivo) return '';
    
    // Si la ruta ya es una URL completa (comienza con http), devolverla tal cual
    if (rutaArchivo.startsWith('http')) {
      return rutaArchivo;
    }
    
    // Construir URL completa: http://localhost:8000 + /media/materiales_estudio/archivo.pdf
    const baseUrl = 'http://localhost:8000';
    
    // Asegurarse de que la ruta comience con /
    const ruta = rutaArchivo.startsWith('/') ? rutaArchivo : `/${rutaArchivo}`;
    
    return `${baseUrl}${ruta}`;
  }
}