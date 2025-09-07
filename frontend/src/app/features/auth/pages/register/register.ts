import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
      registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

onSubmit():void {
  console.log('Formulario enviado', this.registerForm.value); 

  if (this.registerForm.invalid) {
    console.log('Formulario inválido');
    return; 
  }

  const { email, password } = this.registerForm.value;

  this.authService.register({email,password }).subscribe({
    next: (response) => {
      console.log('Registracion exitosa', response);
      this.router.navigate(['auth/login']);
    },
    error: (error) => {
      console.error('Registracion fallida', error);
    },
  });
}}