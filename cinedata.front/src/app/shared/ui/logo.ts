import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marca CineData: um fotograma (quadro com perfurações de película) com três barras crescentes;
 * a maior recebe a luz âmbar do projetor. Wordmark "cine" leve + "data" forte.
 */
@Component({
  selector: 'cd-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [style.font-size.px]="tamanho() ?? null">
      <svg class="simbolo" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="4" width="22" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="2" />
        <rect x="1.5" y="8" width="2" height="3" rx=".5" fill="currentColor" opacity=".55" />
        <rect x="1.5" y="14.5" width="2" height="3" rx=".5" fill="currentColor" opacity=".55" />
        <rect x="1.5" y="21" width="2" height="3" rx=".5" fill="currentColor" opacity=".55" />
        <rect x="28.5" y="8" width="2" height="3" rx=".5" fill="currentColor" opacity=".55" />
        <rect x="28.5" y="14.5" width="2" height="3" rx=".5" fill="currentColor" opacity=".55" />
        <rect x="28.5" y="21" width="2" height="3" rx=".5" fill="currentColor" opacity=".55" />
        <rect x="10" y="17" width="3" height="7" rx="1" fill="currentColor" />
        <rect x="15" y="13" width="3" height="11" rx="1" fill="currentColor" />
        <rect x="20" y="8" width="3" height="16" rx="1" fill="var(--cd-projetor)" />
      </svg>
      @if (comNome()) {
        <span class="nome"><span class="cine">cine</span><span class="data">data</span></span>
      }
    </span>
  `,
  styles: `
    .logo { display: inline-flex; align-items: center; gap: .35em; color: var(--cd-tela); line-height: 1; }
    .simbolo { width: 1.35em; height: 1.35em; }
    .nome { font-family: var(--cd-fonte-display); letter-spacing: -0.03em; }
    .cine { font-weight: 400; }
    .data { font-weight: 800; }
  `,
})
export class Logo {
  /** Tamanho da fonte em px; nulo herda do contexto (ex.: templates de post em cqw). */
  readonly tamanho = input<number | null>(22);
  readonly comNome = input(true);
}
