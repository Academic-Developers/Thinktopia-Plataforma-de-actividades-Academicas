import { Component } from '@angular/core';
import { RouterModule} from '@angular/router';
import {Router} from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';



@Component({
  selector: 'app-dashboard-docente-header',
  imports: [RouterModule],
  templateUrl: './dashboard-docente-header.html',
  styleUrl: './dashboard-docente-header.css'
})
export class DashboardDocenteHeader {
  // Inyecto la clase del servicio AuthService para poder usar su metodo para deslogearme, y Router para redirigir al usuario
  constructor(public authService: AuthService, private router: Router) {
    
  }

  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
    // Redirigir al usuario a la página de home después de cerrar sesión
    this.router.navigate(['/'])

  }

}

