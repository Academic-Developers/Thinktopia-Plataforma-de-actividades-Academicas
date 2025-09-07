import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Recomendado importar si uso @ngif en html, etc.
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Ingreso exitoso', response);

        const email = this.loginForm.value.email;
        let role = 'alumno';

        if (email.includes('docente')) {
          role = 'docente';
        }

        if (role === 'docente') {
          this.router.navigate(['docente/dashboard']);
        } else {
          this.router.navigate(['alumno/dashboard']);
        }
      },
      error: (error) => {
        console.error('Ingreso fallido', error);
      },
    });
  }
}
