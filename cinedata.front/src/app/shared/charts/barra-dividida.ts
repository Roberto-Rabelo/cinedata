import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatar } from '../formatar';

export interface Fatia {
  rotulo: string;
  valor: number;
  cor: string;
}

/**
 * Parte de um todo em uma barra 100%: fatias separadas por 2px de fundo e legenda com
 * rótulo direto (cor nunca é a única pista).
 */
@Component({
  selector: 'cd-barra-dividida',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="barra" role="img" [attr.aria-label]="descricao()">
      @for (f of fatias(); track f.rotulo) {
        @if (f.valor > 0) {
          <span class="fatia" [style.flex-grow]="f.valor" [style.background]="f.cor" [attr.title]="f.rotulo + ': ' + pct(f)"></span>
        }
      }
    </div>
    <ul class="legenda">
      @for (f of fatias(); track f.rotulo) {
        <li>
          <span class="amostra" [style.background]="f.cor"></span>
          <span>{{ f.rotulo }}</span>
          <strong class="num">{{ pct(f) }}</strong>
          <span class="secundario num">{{ formatar.compacto(f.valor) }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    .barra { display: flex; gap: 2px; height: 14px; border-radius: 4px; overflow: hidden; background: var(--cd-poltrona-2); }
    .fatia { flex-basis: 0; min-width: 2px; }
    .legenda { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 14px; }
    li { display: flex; align-items: center; gap: 8px; }
  `,
})
export class BarraDividida {
  readonly fatias = input.required<Fatia[]>();
  private readonly total = computed(() => this.fatias().reduce((s, f) => s + f.valor, 0));
  protected readonly formatar = formatar;

  protected pct(f: Fatia) {
    return formatar.pct(this.total() ? (100 * f.valor) / this.total() : 0);
  }

  protected descricao() {
    return this.fatias().map(f => `${f.rotulo} ${this.pct(f)}`).join(', ');
  }
}
