import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    loadChildren: () => import('./features/main/main-module').then(m => m.MainModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'docente',
    loadChildren: () => import('./features/docente/docente-module').then(m => m.DocenteModule)
  },
  { path: '**', redirectTo: 'main' }
];
