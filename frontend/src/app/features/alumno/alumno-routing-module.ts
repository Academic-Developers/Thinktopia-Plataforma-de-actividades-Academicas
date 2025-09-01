import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Actividades } from './pages/actividades/actividades';
import { Entregas } from './pages/entregas/entregas';
import { MaterialEstudio } from './pages/material-estudio/material-estudio';
import { AlumnoLayout } from './components/alumno-layout/alumno-layout'; 

const routes: Routes = [
  { path: '',
    component: AlumnoLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'actividades', component: Actividades },
      { path: 'entregas', component: Entregas },
      { path: 'material-estudio', component: MaterialEstudio },
      { path: '**', redirectTo: 'dashboard' } // En caso de que se ingrese una ruta invalida, quiero que me lleve a la pagina del dashboard.
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
