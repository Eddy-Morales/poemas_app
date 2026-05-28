import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  {
    path: 'poemas',
    loadComponent: () => import('./pages/videojuegos/poemas.page').then(m => m.PoemasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'poemas-form',
    loadComponent: () => import('./pages/videojuego-form/poema-form.page').then(m => m.PoemaFormPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'poemas-form/:id',
    loadComponent: () => import('./pages/videojuego-form/poema-form.page').then(m => m.PoemaFormPage),
    canActivate: [AuthGuard]
  }
];