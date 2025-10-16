import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MateriasDocente } from './pages/materias/materias';
import { MaterialEstudioDocente } from './pages/material-estudio-docente/material-estudio-docente';
import { DocenteLayout } from './components/docente-layout/docente-layout';
import { ActividadesDocente } from './pages/actividades/actividades';

export const routes: Routes = [
  {
    path: '', component: DocenteLayout, children: [
      { path: 'materias', component: MateriasDocente },
      { path: 'actividades', component: ActividadesDocente },
      { path: 'material-estudio', component: MaterialEstudioDocente },
      { path: '**', redirectTo: 'materias' } // En caso de que se ingrese una ruta invalida, quiero que me lleve a la pagina de materias.
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
