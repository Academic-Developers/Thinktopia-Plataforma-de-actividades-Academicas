import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-alumno-header',
  imports: [RouterModule],
  templateUrl: './dashboard-alumno-header.html',
  styleUrl: './dashboard-alumno-header.css'
})  
export class DashboardAlumnoHeader {
  menuOpen = false;
  
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
}
