import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { ambiente } from '../../../environments/ambiente';
import { Origem } from '../../core/api/modelos';
import { corOrigem } from '../formatar';

/** Larguras do TMDB por tamanho de exibição (2× a largura em CSS, para telas densas). */
const LARGURA_TMDB = { mini: 'w92', medio: 'w185', grande: 'w342' } as const;

const TMDB = 'https://image.tmdb.org/t/p/';

/**
 * Endereço do pôster. Os tamanhos da tela vêm da base do ambiente (no site estático, a cópia local); o w780 é só para o
 * og:image, que precisa de endereço absoluto e não é copiado, então vem sempre do TMDB.
 */
export const urlPoster = (caminho: string, tamanho: keyof typeof LARGURA_TMDB | 'w780' = 'grande') =>
  tamanho === 'w780' ? `${TMDB}w780${caminho}` : `${ambiente.posteres}${LARGURA_TMDB[tamanho]}${caminho}`;

/**
 * Pôster do filme (TMDB) em proporção 2:3. Sem pôster, um cartaz tipográfico: as iniciais do título sobre a sala escura,
 * com a faixa da cor da origem; o mesmo vale quando a imagem não carrega. A imagem é decorativa (alt vazio): o título
 * sempre aparece ao lado.
 */
@Component({
  selector: 'cd-cartaz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'tamanho()' },
  template: `
    @if (imagem(); as caminho) {
      <img [src]="url(caminho)" alt="" loading="lazy" decoding="async" (error)="imagem.set(null)" />
    } @else {
      <span class="tipografico" [style.--cor]="cor()" aria-hidden="true">{{ iniciais() }}</span>
    }
  `,
  styles: `
    :host { display: block; flex: none; aspect-ratio: 2 / 3; border-radius: 6px; overflow: hidden; background: var(--cd-poltrona-2);
            box-shadow: 0 0 0 1px var(--cd-linha); }
    :host(.mini) { width: 40px; border-radius: 4px; }
    :host(.medio) { width: 96px; }
    :host(.grande) { width: 168px; border-radius: 10px; box-shadow: 0 0 0 1px var(--cd-linha), 0 18px 40px rgb(0 0 0 / .45); }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .tipografico {
      display: grid; place-items: center; height: 100%; border-top: 4px solid var(--cor);
      font-family: var(--cd-fonte-display); font-weight: 800; letter-spacing: -0.03em; color: var(--cd-tela-3);
      background: linear-gradient(160deg, var(--cd-poltrona-2), var(--cd-sala));
    }
    :host(.mini) .tipografico { font-size: 13px; border-top-width: 3px; }
    :host(.medio) .tipografico { font-size: 28px; }
    :host(.grande) .tipografico { font-size: 48px; }
  `,
})
export class Cartaz {
  readonly poster = input<string | null | undefined>();
  readonly titulo = input.required<string>();
  readonly origem = input<Origem | null>();
  readonly tamanho = input<keyof typeof LARGURA_TMDB>('mini');

  /** O pôster a mostrar; vira nulo se a imagem falhar (volta quando o pôster muda). */
  protected readonly imagem = linkedSignal(() => this.poster());

  protected readonly cor = computed(() => corOrigem[this.origem() ?? 'Generica']);
  protected readonly iniciais = computed(() =>
    this.titulo()
      .split(/\s+/)
      .filter(p => /^\p{L}/u.test(p) && p.length > 2)
      .slice(0, 2)
      .map(p => p[0].toLocaleUpperCase('pt-BR'))
      .join('') || this.titulo().slice(0, 1),
  );

  protected url(caminho: string) {
    return urlPoster(caminho, this.tamanho());
  }
}
