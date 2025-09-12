import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth-service';
import { MateriaService } from '../../../../services/materia/materia.service';
import { User } from '../../../../models/auth-models/auth-models';
import { Materia } from '../../../../models/materias-models/materias-models';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './materias.html',
  styleUrls: ['./materias.css'],
})
export class Materias implements OnInit {
  loggedInUser: User | null = null;
  materias: Materia[] = [];

  constructor(
    private authService: AuthService,
    private materiaService: MateriaService, private router: Router
  ) {}

    ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    console.log('👤 Usuario logueado en Materias:', this.loggedInUser);

    if (this.loggedInUser) {
      this.materiaService.getMaterias(Number(this.loggedInUser.id)).subscribe({
        next: (materias) => {
          this.materias = materias;
          console.log('📚 Materias cargadas en el componente:', this.materias);
        },
        error: (err) => {
          console.error('❌ Error al cargar las materias:', err);
        },
      });
    } else {
      console.warn('⚠️ No hay usuario logueado, no se pueden cargar materias');
    }
  }
}