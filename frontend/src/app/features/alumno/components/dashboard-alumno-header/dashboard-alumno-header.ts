import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard-alumno-header',
  imports: [RouterModule],
  templateUrl: './dashboard-alumno-header.html',
  styleUrl: './dashboard-alumno-header.css'
})  
export class DashboardAlumnoHeader {
  constructor(private authService: AuthService, private router: Router) {}
  menuOpen = false;
  
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  
  logout() {
    this.authService.logout();
    // Redirigir al usuario a la página de materias después de cerrar sesión
    this.router.navigate(['materias'])

  }
} 
