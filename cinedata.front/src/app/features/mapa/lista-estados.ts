import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Uf } from '../../core/api/modelos';
import { corOrigem, formatar } from '../../shared/formatar';
import { NOME_UF } from '../../shared/ufs';
import { Metrica, origemDoCodigo, valorMetrica } from './metricas';

/** Os 27 estados em lista, pela métrica do mapa: o mesmo dado sem depender de cor, e em sincronia com o mapa. */
@Component({
  selector: 'cd-lista-estados',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="lista">
      @for (u of ordenadas(); track u.uf) {
        <li>
          <button type="button" class="linha" [class.ativa]="u.uf === selecionada()" [class.realce]="u.uf === destacada()"
                  [attr.aria-pressed]="u.uf === selecionada()" (click)="escolher.emit(u.uf)"
                  (mouseenter)="previa.emit(u.uf)" (mouseleave)="previa.emit(null)">
            <span class="pos num">{{ $index + 1 }}</span>
            <strong class="nome">{{ nome[u.uf] }}</strong>
            <span class="trilho"><span class="barra" [style.width.%]="largura(u)" [style.background]="cor(u)"></span></span>
            <span class="num valor">{{ valor(u) }}</span>
            <span class="lider secundario">{{ u.liderTitulo ? formatar.titulo(u.liderTitulo) : '' }}</span>
          </button>
        </li>
      }
    </ol>
  `,
  styles: `
    .lista { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 24px; }
    li { break-inside: avoid; }
    .linha {
      width: 100%; display: grid; grid-template-columns: 22px minmax(0, 150px) minmax(60px, 1fr) 64px;
      column-gap: 10px; align-items: center; padding: 7px 8px; font: inherit; font-size: 14px; text-align: left;
      color: var(--cd-tela); background: transparent; border: 0; border-radius: var(--cd-raio-p); cursor: pointer;
    }
    .linha:hover, .realce { background: var(--cd-poltrona-2); }
    .ativa { background: var(--cd-poltrona-2); box-shadow: inset 3px 0 0 var(--cd-tela); }
    .nome { font-weight: 600; }
    .barra { display: block; height: 100%; border-radius: 4px; background: var(--cd-dado-ambar); transition: width .35s ease; }
    .valor { text-align: right; font-weight: 600; }
    .lider { grid-column: 2 / -1; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    @media (max-width: 900px) { .lista { columns: 1; } }
  `,
})
export class ListaEstados {
  readonly ufs = input.required<Uf[]>();
  readonly metrica = input<Metrica>('publico');
  readonly selecionada = input<string | null>(null);
  readonly destacada = input<string | null>(null);
  readonly escolher = output<string>();
  readonly previa = output<string | null>();

  protected readonly nome = NOME_UF;
  protected readonly formatar = formatar;

  /** Pela métrica em tela; "quem venceu" e público, por público. */
  protected readonly ordenadas = computed(() => {
    const m = this.metrica() === 'lider' ? 'publico' : this.metrica();
    return [...this.ufs()].sort((a, b) => (valorMetrica(m, b) ?? -1) - (valorMetrica(m, a) ?? -1));
  });
  private readonly maximo = computed(() => {
    const m = this.metrica() === 'lider' ? 'publico' : this.metrica();
    return Math.max(1, ...this.ufs().map(u => valorMetrica(m, u) ?? 0));
  });

  protected largura(u: Uf) {
    const m = this.metrica() === 'lider' ? 'publico' : this.metrica();
    return (100 * (valorMetrica(m, u) ?? 0)) / this.maximo();
  }

  protected cor(u: Uf) {
    return this.metrica() === 'lider' ? corOrigem[origemDoCodigo(u.liderCodigo) ?? 'Generica'] : null;
  }

  protected valor(u: Uf) {
    const m = this.metrica();
    if (m === 'publico' || m === 'lider') return formatar.compacto(u.publico);
    const v = valorMetrica(m, u);
    return v === null ? '—' : m === 'sessao' ? formatar.decimal(v) : formatar.pct(v);
  }
}
