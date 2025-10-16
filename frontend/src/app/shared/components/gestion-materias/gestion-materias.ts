import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MateriaService } from '../../../services/materia/materia.service';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { Materia, MateriaRequest } from '../../../models/materias-models/materia.interface';

@Component({
  selector: 'app-gestion-materias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-materias.html',
  styleUrl: './gestion-materias.css'
})
export class GestionMateriasComponent implements OnInit, OnDestroy {
  // 📋 Listas
  materias: Materia[] = [];
  usuarios: Usuario[] = [];
  
  // 📝 Formularios
  materiaForm: FormGroup;
  
  // 🎨 Estados de UI
  isModalOpen = false;
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  
  // ✏️ Materia en edición
  materiaEnEdicion: Materia | null = null;
  
  // 🗑️ Suscripciones
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
    private usuarioService: UsuarioService
  ) {
    // Inicializar formulario
    this.materiaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(110)]],
      codigo: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: [''],
      usuarios: [[]]  // Array de IDs
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Cargar materias y usuarios
   */
  cargarDatos(): void {
    this.isLoading = true;
    console.log('🔄 Cargando materias desde el backend...');
    
    // Cargar materias
    const subMaterias = this.materiaService.obtenerTodasLasMaterias()
      .subscribe({
        next: (materias) => {
          console.log('📦 Materias recibidas en el componente:', materias);
          console.log(`📊 Total de materias: ${materias.length}`);
          this.materias = materias;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error en componente al cargar materias:', error);
          this.isLoading = false;
          this.mostrarError('Error al cargar materias');
        }
      });
    
    // Cargar usuarios
    const subUsuarios = this.usuarioService.obtenerUsuarios()
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
        },
        error: () => {
          this.mostrarError('Error al cargar usuarios');
        }
      });
    
    this.subscriptions.push(subMaterias, subUsuarios);
  }

  /**
   * Abrir modal para crear materia
   */
  abrirModalCrear(): void {
    this.isEditing = false;
    this.materiaEnEdicion = null;
    this.materiaForm.reset({ usuarios: [] });
    this.isModalOpen = true;
    this.limpiarMensajes();
  }

  /**
   * Abrir modal para editar materia
   */
  abrirModalEditar(materia: Materia): void {
    this.isEditing = true;
    this.materiaEnEdicion = materia;
    
    this.materiaForm.patchValue({
      nombre: materia.nombre,
      codigo: materia.codigo,
      descripcion: materia.descripcion || '',
      usuarios: materia.usuarios || []
    });
    
    this.isModalOpen = true;
    this.limpiarMensajes();
  }

  /**
   * Cerrar modal
   */
  cerrarModal(): void {
    this.isModalOpen = false;
    this.materiaForm.reset({ usuarios: [] });
    this.materiaEnEdicion = null;
    this.isEditing = false;
    this.limpiarMensajes();
  }

  /**
   * Guardar materia (crear o actualizar)
   */
  guardarMateria(): void {
    if (this.materiaForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.isLoading = true;
    this.limpiarMensajes();

    const materiaData: MateriaRequest = {
      nombre: this.materiaForm.value.nombre,
      codigo: this.materiaForm.value.codigo,
      descripcion: this.materiaForm.value.descripcion || '',
      usuarios: this.materiaForm.value.usuarios || []
    };

    if (this.materiaEnEdicion) {
      // Actualizar
      const sub = this.materiaService.actualizarMateria(this.materiaEnEdicion.id!, materiaData)
        .subscribe({
          next: (materia) => {
            if (materia) {
              console.log('✅ Materia actualizada:', materia);
              // Actualizar la materia en la lista local
              const index = this.materias.findIndex(m => m.id === materia.id);
              if (index !== -1) {
                this.materias = [
                  ...this.materias.slice(0, index),
                  materia,
                  ...this.materias.slice(index + 1)
                ];
              }
              this.isLoading = false;
              this.mostrarExito('Materia actualizada exitosamente');
              setTimeout(() => this.cerrarModal(), 1500);
            } else {
              this.isLoading = false;
              this.mostrarError('Error al actualizar materia');
            }
          },
          error: () => {
            this.isLoading = false;
            this.mostrarError('Error al actualizar materia');
          }
        });
      this.subscriptions.push(sub);
    } else {
      // Crear
      const sub = this.materiaService.crearMateria(materiaData)
        .subscribe({
          next: (materia) => {
            if (materia) {
              console.log(' Materia creada, agregando a la lista:', materia);
              // Agregar la materia directamente a la lista local
              this.materias = [...this.materias, materia];
              this.isLoading = false;
              this.mostrarExito('Materia creada exitosamente');
              setTimeout(() => this.cerrarModal(), 1500);
            } else {
              this.isLoading = false;
              this.mostrarError('Error al crear materia');
            }
          },
          error: () => {
            this.isLoading = false;
            this.mostrarError('Error al crear materia');
          }
        });
      this.subscriptions.push(sub);
    }
  }

  /**
   * Eliminar materia
   */
  eliminarMateria(materia: Materia): void {
    if (!confirm(`¿Estás seguro de eliminar la materia "${materia.nombre}"?`)) {
      return;
    }

    this.isLoading = true;
    this.limpiarMensajes();

    const sub = this.materiaService.eliminarMateria(materia.id)
      .subscribe({
        next: (success) => {
          if (success) {
            console.log(' Materia eliminada, removiendo de la lista');
            // Remover de la lista local
            this.materias = this.materias.filter(m => m.id !== materia.id);
            this.isLoading = false;
            this.mostrarExito('Materia eliminada exitosamente');
          } else {
            this.isLoading = false;
            this.mostrarError('Error al eliminar materia');
          }
        },
        error: () => {
          this.isLoading = false;
          this.mostrarError('Error al eliminar materia');
        }
      });
    
    this.subscriptions.push(sub);
  }

  /**
   * Toggle selección de usuario
   */
  toggleUsuario(usuarioId: number): void {
    const usuariosControl = this.materiaForm.get('usuarios');
    const usuariosActuales = usuariosControl?.value || [];
    
    const index = usuariosActuales.indexOf(usuarioId);
    
    if (index > -1) {
      // Quitar
      usuariosActuales.splice(index, 1);
    } else {
      // Agregar
      usuariosActuales.push(usuarioId);
    }
    
    usuariosControl?.setValue([...usuariosActuales]);
  }

  /**
   * Verificar si usuario está seleccionado
   */
  isUsuarioSeleccionado(usuarioId: number): boolean {
    const usuarios = this.materiaForm.get('usuarios')?.value || [];
    return usuarios.includes(usuarioId);
  }

  /**
   * Obtener nombre de usuario por ID
   */
  getNombreUsuario(usuarioId: number): string {
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.email : 'Usuario desconocido';
  }

  /**
   * Marcar campos como tocados para mostrar errores
   */
  private marcarCamposComoTocados(): void {
    Object.keys(this.materiaForm.controls).forEach(key => {
      this.materiaForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Mostrar mensaje de error
   */
  private mostrarError(mensaje: string): void {
    this.errorMessage = mensaje;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  /**
   * Mostrar mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    this.successMessage = mensaje;
    setTimeout(() => this.successMessage = '', 3000);
  }

  /**
   * Limpiar mensajes
   */
  private limpiarMensajes(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Limpiar suscripciones
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
