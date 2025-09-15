import { Component,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Recomendado importar si uso @ngif en html, etc.
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule,Router} from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage:string | null = null;
  private authSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router:Router 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() :void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.authSubscription = this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        if (!user) {
          this.errorMessage = 'Credenciales inválidas o usuario no encontrado.';
          console.log("Ingreso fallido")}
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =  'Ocurrió un error inesperado. Por favor, intente más tarde.';
        console.error('Ingreso fallido', error);
      },
    });
  }
}
}
