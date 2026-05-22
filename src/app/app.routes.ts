import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'poemas',
    pathMatch: 'full'
  },
  {
    path: 'poemas',
    loadComponent: () =>
      import('./pages/videojuegos/poemas.page')
        .then(m => m.PoemasPage)
  },
  {
    path: 'poemas-form',
    loadComponent: () =>
      import('./pages/videojuego-form/poema-form.page')
        .then(m => m.PoemaFormPage)
  },
  {
    path: 'poemas-form/:id',
    loadComponent: () =>
      import('./pages/videojuego-form/poema-form.page')
        .then(m => m.PoemaFormPage)
  }
];