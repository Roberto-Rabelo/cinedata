import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Sufixo único por instância: o id do degradê não pode se repetir quando há vários logos na página. */
let proximoId = 0;

/**
 * Marca CineData: o feixe âmbar do projetor (a luz do exibidor) ilumina três barras crescentes,
 * formando um gráfico; a maior barra é âmbar. Wordmark "cine" leve + "data" forte.
 */
@Component({
  selector: 'cd-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [style.font-size.px]="tamanho() ?? null">
      <svg class="simbolo" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient [attr.id]="idFeixe" x1="9.5" y1="0" x2="29" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="var(--cd-projetor)" stop-opacity=".55" />
            <stop offset="1" stop-color="var(--cd-projetor)" stop-opacity=".07" />
          </linearGradient>
        </defs>
        <polygon points="9.5,14.6 29,6.5 29,25.5 9.5,17.4" [attr.fill]="'url(#' + idFeixe + ')'" />
        <rect x="3" y="12.5" width="6.5" height="7" rx="1.4" fill="currentColor" />
        <rect x="15.5" y="18" width="2.6" height="5" rx=".8" fill="currentColor" />
        <rect x="20" y="14.5" width="2.6" height="8.5" rx=".8" fill="currentColor" />
        <rect x="24.5" y="10" width="2.6" height="13" rx=".8" fill="var(--cd-projetor)" />
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

  protected readonly idFeixe = `cd-feixe-${proximoId++}`;
}
