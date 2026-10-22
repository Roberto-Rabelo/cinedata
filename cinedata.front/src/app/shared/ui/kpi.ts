import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formatar } from '../formatar';

/** Número de destaque: quando o dado é uma manchete, não precisa de gráfico. */
@Component({
  selector: 'cd-kpi',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cartao kpi">
      <span class="rotulo">{{ rotulo() }}</span>
      <strong class="valor num">{{ valor() }}</strong>
      @if (variacao() !== null && variacao() !== undefined) {
        <span class="num" [class.variacao--alta]="variacao()! > 0" [class.variacao--queda]="variacao()! < 0">
          {{ variacao()! > 0 ? '▲' : variacao()! < 0 ? '▼' : '■' }} {{ formatar.variacao(variacao()!) }}
          <span class="secundario">vs. semana anterior</span>
        </span>
      } @else if (detalhe()) {
        <span class="secundario">{{ detalhe() }}</span>
      }
    </div>
  `,
  styles: `
    .kpi { display: flex; flex-direction: column; gap: 6px; min-height: 124px; }
    .valor { font-family: var(--cd-fonte-display); font-size: 34px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
    span { font-size: 13px; }
  `,
})
export class Kpi {
  readonly rotulo = input.required<string>();
  readonly valor = input.required<string>();
  readonly variacao = input<number | null>();
  readonly detalhe = input<string>();
  protected readonly formatar = formatar;
}
