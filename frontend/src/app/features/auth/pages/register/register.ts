import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { RegisterRequest } from '../../../../models/auth-models/auth-interface';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnDestroy {
  // 📝 Formulario reactivo
  registerForm: FormGroup;
  
  // 🔄 Estados de la UI
  isLoading = false;
  errorMessage = '';
  
  // 🗑️ Gestión de suscripciones
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar formulario con validaciones
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['alumno', Validators.required] // Valor por defecto: alumno
    });
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit(): void {
    // Validar formulario
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    // Preparar datos para enviar
    const registerData: RegisterRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };

    // Mostrar estado de carga
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('📤 Enviando datos de registro:', { email: registerData.email, role: registerData.role });

    // Realizar registro
    this.subscription = this.authService.register(registerData).subscribe({
      next: (user) => {
        this.isLoading = false;
        
        if (user) {
          console.log('Usuario registrado y logueado:', user);
          
          // Redirigir según el rol
          if (user.role === 'docente') {
            this.router.navigate(['/docente/dashboard']);
          } else {
            this.router.navigate(['/alumno/materias']);
          }
        } else {
          this.errorMessage = 'Error al registrar. Por favor, intenta nuevamente.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error(' Error en registro:', error);
        
        // Manejar diferentes tipos de errores
        if (error.status === 400) {
          this.errorMessage = error.error?.mensaje || 'El email ya está registrado o los datos son inválidos.';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.errorMessage = 'Error al registrar. Por favor, intenta nuevamente.';
        }
      }
    });
  }

  /**
   * Marca todos los campos del formulario como "touched" para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Limpia la suscripción al destruir el componente
   */
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
    