import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-alumno-header',
  imports: [],
  templateUrl: './dashboard-alumno-header.html',
  styleUrl: './dashboard-alumno-header.css'
})
export class DashboardAlumnoHeader {
  menuOpen = false;
  
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
}
