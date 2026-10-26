import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { Granularidade, ObraResumo, Periodo } from './core/api/modelos';
import { chavePeriodo, granularidades } from './shared/periodo';

/**
 * Páginas pré-renderizadas no build `estatico`: uma por período e por obra do export (`cinedata.front/dados`,
 * gerado por `dotnet run --project src/CineData.Ingestion -- exportar`). O build roda em cinedata.front.
 */
const lerDados = <T>(caminho: string): T => JSON.parse(readFileSync(join(process.cwd(), 'dados', caminho), 'utf8')) as T;

const chaves = (granularidade: Granularidade) => async () =>
  lerDados<Periodo[]>(`${granularidade}/periodos.json`).map(p => ({ chave: chavePeriodo(granularidade, p.inicio) }));

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  ...granularidades.flatMap(({ valor }): ServerRoute[] => [
    { path: valor, renderMode: RenderMode.Prerender },
    { path: `${valor}/:chave`, renderMode: RenderMode.Prerender, getPrerenderParams: chaves(valor) },
  ]),
  {
    path: 'obras/:codigo',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => lerDados<ObraResumo[]>('busca.json').map(o => ({ codigo: o.codigo })),
  },
  { path: 'sobre', renderMode: RenderMode.Prerender },
  // Endereço sem página: o host serve o 404.html (cópia do index.csr.html, scripts/pos-build-estatico.mjs).
  { path: '**', renderMode: RenderMode.Client },
];
