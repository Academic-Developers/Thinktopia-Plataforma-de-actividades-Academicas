import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { MateriasDocente } from './pages/materias/materias';
// import { ActividadesComponent } from './pages/actividades/actividades';
// import { EntregasComponent } from './pages/entregas/entregas';
import { MaterialEstudioDocente } from './pages/material-estudio-docente/material-estudio-docente';
import { DocenteLayout } from './components/docente-layout/docente-layout';

export const routes: Routes = [
  {
    path: '', component: DocenteLayout, children: [
      { path: 'materias', component: MateriasDocente },
      // { path: 'actividades', component:ActividadesComponent},
      // { path: 'entregas', component:EntregasComponent },
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
