import { Component,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register implements OnDestroy {
    registerForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    private  authSubscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

onSubmit(): void {
  console.log('Formulario enviado', this.registerForm.value); 

  this.errorMessage = '';
  this.successMessage = '';

     if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;

      this.authSubscription = this.authService.register({ email, password }).subscribe({
        next: (user:any) => {
          if (user) {
            this.successMessage = '¡Registro exitoso! Serás redirigido a la página de login.';
          } else {
            this.errorMessage = 'El registro falló. Es posible que el email ya esté en uso.';
          }
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
          console.error('Ocurrió un error inesperado durante el registro:', err);
        }
      });
    }
  }

  ngOnDestroy(): void  {
      this.authSubscription.unsubscribe();
  }
}