import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-docente-header',
  imports: [RouterModule],
  templateUrl: './dashboard-docente-header.html',
  styleUrl: './dashboard-docente-header.css'
})
export class DashboardDocenteHeader {
  menuOpen = false; 
    toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
