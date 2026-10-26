import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output } from '@angular/core';
import { Uf } from '../../core/api/modelos';
import { GRADE, NOME_UF, ufNaDirecao } from '../../shared/ufs';
import { Metrica, descricaoMetrica, pintar, textoMetrica } from './metricas';

interface Quadrado {
  uf: string;
  coluna: number;
  linha: number;
  dado: Uf | null;
  cor: string;
  clara: boolean;
  texto: string;
  /** Valor por extenso: na dica e, com o nome, no rótulo para leitores de tela. */
  detalhe: string;
}

const SETAS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

/**
 * O Brasil em quadrados: cada estado na posição aproximada do mapa, pintado pela métrica escolhida. Clique, toque ou
 * Enter escolhem o estado; setas andam pelo mapa (um só quadrado entra no Tab, os outros pelas setas).
 */
@Component({
  selector: 'cd-mapa-brasil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grade" role="group" [attr.aria-label]="rotulo()" [class.com-foco]="selecionada() || grupo() || destacada()">
      @for (q of quadrados(); track q.uf) {
        <button
          type="button"
          class="quadrado"
          [attr.data-uf]="q.uf"
          [class.clara]="q.clara"
          [class.ativa]="q.uf === selecionada()"
          [class.realce]="q.uf === destacada()"
          [class.vazia]="!q.dado"
          [class.no-grupo]="grupo()?.includes(q.uf)"
          [style.grid-column]="q.coluna"
          [style.grid-row]="q.linha"
          [style.--cor]="q.cor"
          [style.--atraso.ms]="(q.coluna + q.linha) * 18"
          [attr.tabindex]="q.uf === focavel() ? 0 : -1"
          [attr.aria-pressed]="q.uf === selecionada()"
          [attr.aria-label]="nome[q.uf] + ': ' + q.detalhe"
          (click)="escolher.emit(q.uf)"
          (mouseenter)="previa.emit(q.uf)"
          (mouseleave)="previa.emit(null)"
          (focus)="previa.emit(q.uf)"
          (blur)="previa.emit(null)"
          (keydown)="tecla($event, q.uf)"
        >
          <span class="sigla">{{ q.uf }}</span>
          <span class="valor num">{{ q.texto }}</span>
          <span class="dica" aria-hidden="true"><strong>{{ nome[q.uf] }}</strong>{{ q.detalhe }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .grade { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; max-width: 520px; margin: 0 auto; }
    .quadrado {
      position: relative; aspect-ratio: 1; padding: 2px; border: 0; border-radius: 10px; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
      font: inherit; color: var(--cd-tela); background: var(--cor);
      transition: background-color .45s ease var(--atraso), transform .18s ease, opacity .25s ease, box-shadow .18s ease;
    }
    .sigla { font-family: var(--cd-fonte-display); font-weight: 700; font-size: clamp(13px, 2.6vw, 18px); letter-spacing: -0.01em; }
    .valor { font-size: clamp(9.5px, 1.9vw, 12.5px); opacity: .9; white-space: nowrap; }
    .clara { color: var(--cd-sala); }
    .vazia { background: transparent; border: 1px dashed var(--cd-linha); color: var(--cd-tela-3); cursor: default; }
    .quadrado:hover, .quadrado:focus-visible, .realce { transform: translateY(-2px) scale(1.04); z-index: 2; box-shadow: 0 8px 24px rgb(0 0 0 / .45); }
    .quadrado:focus-visible { outline: 2px solid var(--cd-projetor); outline-offset: 2px; }
    .ativa { z-index: 1; transform: scale(1.06); box-shadow: 0 0 0 2px var(--cd-sala), 0 0 0 4px var(--cd-tela), 0 10px 28px rgb(0 0 0 / .5); }
    .com-foco .quadrado:not(.ativa):not(.realce):not(.no-grupo):not(:hover):not(:focus-visible) { opacity: .55; }
    .dica {
      position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translate(-50%, 4px); opacity: 0; pointer-events: none;
      display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; white-space: nowrap; text-align: left;
      background: var(--cd-sala); color: var(--cd-tela-2); border: 1px solid var(--cd-linha); border-radius: var(--cd-raio-p);
      font-size: 12.5px; box-shadow: 0 8px 24px rgb(0 0 0 / .5); transition: opacity .15s ease, transform .15s ease;
    }
    .dica strong { color: var(--cd-tela); font-size: 13.5px; }
    .quadrado:hover .dica { opacity: 1; transform: translate(-50%, 0); }
    @media (hover: none) { .dica { display: none; } }
    @media (prefers-reduced-motion: reduce) { .quadrado, .dica { transition: none; } }
  `,
})
export class MapaBrasil {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly ufs = input.required<Uf[]>();
  readonly metrica = input<Metrica>('publico');
  readonly selecionada = input<string | null>(null);
  /** Estados em destaque (os outros apagam): uma região ou os estados onde um filme venceu. */
  readonly grupo = input<string[] | null>(null);
  /** Estado em realce vindo de fora (linha da lista sob o mouse). */
  readonly destacada = input<string | null>(null);
  readonly escolher = output<string>();
  /** Estado sob o mouse ou o foco, para o painel antecipar o detalhe. */
  readonly previa = output<string | null>();

  protected readonly nome = NOME_UF;

  protected readonly quadrados = computed<Quadrado[]>(() => {
    const ufs = this.ufs();
    const metrica = this.metrica();
    const cor = pintar(metrica, ufs);
    const porSigla = new Map(ufs.map(u => [u.uf, u]));
    return Object.entries(GRADE).map(([uf, [coluna, linha]]) => {
      const dado = porSigla.get(uf) ?? null;
      const pintura = dado ? cor(dado) : { cor: 'transparent', clara: false };
      return {
        uf, coluna, linha, dado, ...pintura,
        texto: dado ? textoMetrica(metrica, dado) : '—',
        detalhe: dado ? descricaoMetrica(metrica, dado) : 'sem sessões no período',
      };
    });
  });

  protected readonly focavel = computed(() => this.selecionada() ?? 'SP');
  protected readonly rotulo = computed(() => 'Mapa do Brasil por estado. Use as setas para andar e Enter para ver os detalhes.');

  protected tecla(evento: KeyboardEvent, uf: string) {
    const seta = SETAS[evento.key];
    if (!seta) return;
    evento.preventDefault();
    const destino = ufNaDirecao(uf, ...seta);
    if (destino) this.elemento.nativeElement.querySelector<HTMLButtonElement>(`[data-uf="${destino}"]`)?.focus();
  }
}
