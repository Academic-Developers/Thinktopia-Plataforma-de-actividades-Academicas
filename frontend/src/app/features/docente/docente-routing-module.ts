import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Materias } from './pages/materias/materias';
import { ActividadesComponent } from './pages/actividades/actividades';
import { EntregasComponent } from './pages/entregas/entregas';
import { GestionContenido } from './pages/gestion-contenido/gestion-contenido';
import { DocenteLayout } from './components/docente-layout/docente-layout';
 
export const routes: Routes = [
  {path: '', component:DocenteLayout, children: [
  { path: 'dashboard', component:Dashboard },
  { path: 'materias', component:Materias},
  { path: 'actividades', component:ActividadesComponent},
  { path: 'entregas', component:EntregasComponent },
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
