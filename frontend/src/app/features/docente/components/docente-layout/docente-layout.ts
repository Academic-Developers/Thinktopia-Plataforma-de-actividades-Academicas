import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardDocenteHeader } from '../dashboard-docente-header/dashboard-docente-header';
import { DashboardDocenteFooter } from '../dashboard-docente-footer/dashboard-docente-footer';

@Component({
  selector: 'app-docente-layout',
  imports: [ RouterOutlet, DashboardDocenteHeader, DashboardDocenteFooter],
  templateUrl: './docente-layout.html',
  styleUrl: './docente-layout.css'
})
export class DocenteLayout {

}
