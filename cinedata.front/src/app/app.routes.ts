import { Route, Routes } from '@angular/router';
import { ambiente } from '../environments/ambiente';
import { granularidades } from './shared/periodo';

const painel = () => import('./features/painel/painel').then(m => m.Painel);
const mapa = () => import('./features/mapa/mapa').then(m => m.Mapa);

/** /mes (último mês completo) e /mes/2026-09: a granularidade vai para o input `periodo` pelo `data` da rota. */
const paginasDePeriodo: Route[] = granularidades.flatMap(({ valor }) => [
  { path: valor, data: { periodo: valor }, loadComponent: painel },
  { path: `${valor}/:chave`, data: { periodo: valor }, loadComponent: painel },
]);

/** O mesmo para o mapa: /mapa (semana), /mapa/mes, /mapa/mes/2026-09; estado e métrica na query (?uf=SP&ver=dublado). */
const paginasDoMapa: Route[] = [
  { path: 'mapa', title: 'Mapa do cinema · CineData', loadComponent: mapa },
  ...granularidades.flatMap(({ valor }) => [
    { path: `mapa/${valor}`, data: { periodo: valor }, loadComponent: mapa },
    { path: `mapa/${valor}/:chave`, data: { periodo: valor }, loadComponent: mapa },
  ]),
];

/** Ferramentas internas de conteúdo (posts, identidade visual): só no desenvolvimento, fora do site publicado. */
const marca: Routes = [
  { path: 'marca/apresentacao', title: 'CineData · carrossel de apresentação', loadComponent: () => import('./features/marca/slides-apresentacao').then(m => m.SlidesApresentacao) },
  { path: 'marca/top5-2026-10-15', title: 'CineData · Top 5 de 15 a 21/10', loadComponent: () => import('./features/marca/slides-top5-2026-10-15').then(m => m.SlidesTop5Semana1015) },
  { path: 'marca/top5-2026-10-08', title: 'CineData · Top 5 de 08 a 14/10', loadComponent: () => import('./features/marca/slides-top5').then(m => m.SlidesTop5) },
  { path: 'marca/como-medimos', title: 'CineData · como medimos', loadComponent: () => import('./features/marca/slides-como-medimos').then(m => m.SlidesComoMedimos) },
  { path: 'marca/noticia-feito-pipa', title: 'CineData · Notícia: Feito Pipa', loadComponent: () => import('./features/marca/slides-noticia-feito-pipa').then(m => m.SlidesNoticiaFeitoPipa) },
  { path: 'marca/halloween-terror-top10', title: 'CineData · top 10 do terror', loadComponent: () => import('./features/marca/slides-halloween').then(m => m.SlidesHalloween) },
  { path: 'marca', title: 'CineData · identidade visual', loadComponent: () => import('./features/marca/marca').then(m => m.Marca) },
];

export const routes: Routes = [
  { path: '', title: 'CineData · o cinema brasileiro em números', loadComponent: painel },
  ...paginasDePeriodo,
  ...paginasDoMapa,
  { path: 'obras/:codigo', title: 'CineData · obra', loadComponent: () => import('./features/obra/obra').then(m => m.Obra) },
  { path: 'sobre', title: 'Como medimos · CineData', loadComponent: () => import('./features/sobre/sobre').then(m => m.Sobre) },
  ...(ambiente.fonte === 'api' ? marca : []),
  { path: '**', title: 'Página não encontrada · CineData', loadComponent: () => import('./features/sobre/nao-encontrada').then(m => m.NaoEncontrada) },
];
