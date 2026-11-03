import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(
        (m) => m.Login
      )
  },
  {
    path: 'portal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/portal/portal').then(
        (m) => m.Portal
      )
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
