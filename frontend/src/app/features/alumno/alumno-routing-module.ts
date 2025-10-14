import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialEstudioAlumno } from './pages/material-estudio-alumno/material-estudio-alumno';
import { AlumnoLayout } from './components/alumno-layout/alumno-layout'; 
import { MateriasAlumno } from './pages/materia/materias';

const routes: Routes = [
  { path: '',
    component: AlumnoLayout,
    children: [
      { path: 'materias', component: MateriasAlumno },
      { path: 'material-estudio', component: MaterialEstudioAlumno },
      // { path: 'actividades', component: ActividadesAlumnoComponent },
      { path: '**', redirectTo: 'materias' }, // En caso de que se ingrese una ruta invalida, quiero que me lleve a la pagina de materias.
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
