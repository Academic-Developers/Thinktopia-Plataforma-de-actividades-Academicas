import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout-component/main-layout-component';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';

// Aca las rutas se ponen como hijo (children) del componente MainLayoutComponent, ya que justamente es la plantila que contiene el header y footer de todas estas paginas del modulo "main".. Asi evitamos tener que importar el header y footer en todos los htmls de las paginas del modulo "main". 

export const routes: Routes = [
  {
    path: '',
    component:MainLayoutComponent,
    children: [
  {path: 'inicio', component: Home},
  {path:'quienes-somos', component:About},
  {path: '**', redirectTo: 'inicio'} // En caso de que se ingrese una ruta invalida, quiero que me lleve al home - inicio.
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
