import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardAlumnoFooter } from '../dashboard-alumno-footer/dashboard-alumno-footer';
import { DashboardAlumnoHeader } from '../dashboard-alumno-header/dashboard-alumno-header';

@Component({
  selector: 'app-alumno-layout',
  imports: [RouterOutlet,DashboardAlumnoHeader,DashboardAlumnoFooter],
  templateUrl: './alumno-layout.html',
  styleUrl: './alumno-layout.css'
})
export class AlumnoLayout {
}

