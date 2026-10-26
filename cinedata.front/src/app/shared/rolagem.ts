import { DestroyRef, PLATFORM_ID, inject } from '@angular/core';
import { ViewportScroller, isPlatformBrowser } from '@angular/common';
import { Router, Scroll } from '@angular/router';

/** Estado de navegação que pede para não rolar (ex.: barras da série do estado no mapa). */
export const MANTER_ROLAGEM = { manterRolagem: true } as const;

/**
 * Rolagem entre páginas: voltar/avançar restaura a posição; ir para outro caminho começa do topo; trocar só a query
 * (escolher um estado, uma métrica) ou navegar com {@link MANTER_ROLAGEM} mantém onde a pessoa estava.
 */
export function controlarRolagem() {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
  const rolagem = inject(ViewportScroller);
  let caminhoAnterior: string | null = null;
  const inscricao = inject(Router).events.subscribe(evento => {
    if (!(evento instanceof Scroll)) return;
    const destino = evento.routerEvent;
    const caminho = ('urlAfterRedirects' in destino ? destino.urlAfterRedirects : destino.url).split(/[?#]/)[0];
    const manter = (history.state as Record<string, unknown> | null)?.['manterRolagem'] === true;
    if (evento.position) rolagem.scrollToPosition(evento.position);
    else if (caminhoAnterior !== null && caminho !== caminhoAnterior && !manter) rolagem.scrollToPosition([0, 0]);
    caminhoAnterior = caminho;
  });
  inject(DestroyRef).onDestroy(() => inscricao.unsubscribe());
}
