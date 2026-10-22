import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'CineData · painel da semana', loadComponent: () => import('./features/painel/painel').then(m => m.Painel) },
  { path: 'obras/:codigo', title: 'CineData · obra', loadComponent: () => import('./features/obra/obra').then(m => m.Obra) },
  { path: 'marca', title: 'CineData · identidade visual', loadComponent: () => import('./features/marca/marca').then(m => m.Marca) },
  { path: '**', redirectTo: '' },
];
