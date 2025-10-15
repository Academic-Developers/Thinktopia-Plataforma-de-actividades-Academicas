import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../../models/auth-models/auth-interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  
  // Suscripciones para limpieza
  private authSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    //  Configuración del formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    //  Verificar si ya está autenticado y redirigir
    if (this.authService.isLoggedIn()) {
      this.redirectUserByRole();
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    this.authSubscription.unsubscribe();
  }

  /**
   *  Maneja el envío del formulario de login
   */
  onSubmit(): void {
    // Limpiar mensajes previos
    this.errorMessage = null;
    
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      // 🔐 Realizar login a través del AuthService
      this.authSubscription = this.authService.login(this.loginForm.value).subscribe({
        next: (user: User | null) => {
          this.isLoading = false;
          
          if (user) {
            //  Login exitoso - redirigir según el rol
            console.log(' Login exitoso para:', user.email);
            this.redirectUserByRole();
          } else {
            //  Login falló - mostrar error
            this.errorMessage = 'Credenciales inválidas. Verifique su email y contraseña.';
            console.warn(' Login fallido: Credenciales incorrectas');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          
          //  Manejo de errores específicos
          if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Verifique su email y contraseña.';
          } else if (error.status === 0) {
            this.errorMessage = 'Sin conexión al servidor. Verifique su conexión a internet.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Por favor, intente más tarde.';
          }
          
          console.error('Error en login:', error);
        },
      });
    } else if (this.loginForm.invalid) {
      // 📝 Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched();
    }
  }

  /**
   *  Redirige al usuario según su rol
   */
  private redirectUserByRole(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      const route = currentUser.role === 'docente' 
        ? '/docente/dashboard' 
        : '/alumno/dashboard';
      
      console.log(` Redirigiendo a ${currentUser.role}:`, route);
      this.router.navigate([route]);
    }
  }

  /**
   *  Marca todos los campos del formulario como touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   *  Toggle para mostrar/ocultar contraseña
   */
  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const toggleIcon = document.querySelector('.toggle-password i') as HTMLElement;
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.classList.remove('fa-eye-slash');
      toggleIcon.classList.add('fa-eye');
    } else {
      passwordInput.type = 'password';
      toggleIcon.classList.remove('fa-eye');
      toggleIcon.classList.add('fa-eye-slash');
    }
  }

  /**
   *  Getter para facilitar el acceso a los controles del formulario en el template
   */
  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
