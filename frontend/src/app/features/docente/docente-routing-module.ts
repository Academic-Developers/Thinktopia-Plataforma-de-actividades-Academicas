import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { ActividadesComponent } from './pages/actividades/actividades';
import { Asistencias } from './pages/asistencias/asistencias';
import { EntregasComponent } from './pages/entregas/entregas';
import { Reportes } from './pages/reportes/reportes';
import { Estadisticas } from './pages/estadisticas/estadisticas';
import { GestionContenido } from './pages/gestion-contenido/gestion-contenido';
import { DocenteLayout } from './components/docente-layout/docente-layout';
 
export const routes: Routes = [
  {path: '', component:DocenteLayout, children: [
  { path: 'dashboard', component:Dashboard },
  { path: 'actividades', component:ActividadesComponent},
  { path: 'entregas', component:EntregasComponent },
  { path: 'asistencias', component:Asistencias },
  { path: 'estadisticas', component:Estadisticas },
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
