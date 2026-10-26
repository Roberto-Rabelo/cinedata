import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'CineData · painel', loadComponent: () => import('./features/painel/painel').then(m => m.Painel) },
  { path: 'obras/:codigo', title: 'CineData · obra', loadComponent: () => import('./features/obra/obra').then(m => m.Obra) },
  { path: 'marca/apresentacao', title: 'CineData · carrossel de apresentação', loadComponent: () => import('./features/marca/slides-apresentacao').then(m => m.SlidesApresentacao) },
  { path: 'marca/top5-2026-10-08', title: 'CineData · Top 5 de 08 a 14/10', loadComponent: () => import('./features/marca/slides-top5').then(m => m.SlidesTop5) },
  { path: 'marca/como-medimos', title: 'CineData · como medimos', loadComponent: () => import('./features/marca/slides-como-medimos').then(m => m.SlidesComoMedimos) },
  { path: 'marca/halloween-terror-top10', title: 'CineData · top 10 do terror', loadComponent: () => import('./features/marca/slides-halloween').then(m => m.SlidesHalloween) },
  { path: 'marca', title: 'CineData · identidade visual', loadComponent: () => import('./features/marca/marca').then(m => m.Marca) },
  { path: '**', redirectTo: '' },
];
