import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { User } from '../../../../models/auth-models/auth-models';
import { Materia } from '../../../../models/materias-models/materias-models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard  implements OnInit {
  loggedInUser: User | null = null;
  materias: Materia[] = [];

  constructor(
    private authService: AuthService,
    private materiaService: MateriaService, private router: Router
  ) {}

    ngOnInit(): void {
    // 1. Obtiene el usuario logueado del servicio de autenticación
    this.loggedInUser = this.authService.getLoggedInUser();
    console.log(' Alumno logueado en Materias:', this.loggedInUser);

    if (this.loggedInUser) {
      // 2. Llama al servicio de materias con el ID del usuario
      this.materiaService.getMaterias(Number(this.loggedInUser.id)).subscribe({
        next: (materias) => {
          this.materias = materias;
          console.log(' Materias del alumno cargadas en el componente:', this.materias);
        },
        error: (err) => {
          console.error(' Error al cargar las materias del alumno:', err);
        },
      });
    } else {
      console.warn(' No hay usuario logueado, no se pueden cargar materias del alumno');
    }
  }
}
