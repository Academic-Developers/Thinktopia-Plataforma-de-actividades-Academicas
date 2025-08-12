import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Actividades } from './pages/actividades/actividades';
import { Asistencias } from './pages/asistencias/asistencias';
import { Reportes } from './pages/reportes/reportes';
import { GestionContenido } from './pages/gestion-contenido/gestion-contenido';
import { DocenteLayout } from './components/docente-layout/docente-layout';

export const routes: Routes = [
  {path: '', component:DocenteLayout, children: [
  { path: 'dashboard', component:Dashboard },
  { path: 'actividades', component:Actividades},
  { path: 'asistencias', component:Asistencias },
  { path: 'reportes', component:Reportes },
  { path: 'gestion-contenido', component:GestionContenido },
  {path: '**', redirectTo: 'dashboard'} // En caso de que se ingrese una ruta invalida, quiero que me lleve a la pagina del dashboard.
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
