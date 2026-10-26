import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemRanking } from '../../core/api/modelos';
import { formatar, rotuloOrigem } from '../formatar';

/** Ranking do período: barras horizontais (uma série, uma cor), valor rotulado na ponta. */
@Component({
  selector: 'cd-ranking-barras',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="ranking">
      @for (item of itens(); track item.codigoObra) {
        <li>
          <a class="linha" [routerLink]="['/obras', item.codigoObra]" [attr.aria-label]="descricao(item)">
            <span class="pos num">{{ item.posicao }}</span>
            <span class="corpo">
              <span class="topo">
                <span class="titulo">{{ formatar.titulo(item.titulo) }}</span>
                @if (item.estreia) { <span class="chip chip--estreia">Estreia</span> }
                <span class="chip">{{ rotuloOrigem[item.origem] }}</span>
              </span>
              <span class="barra-trilho">
                <span class="barra" [style.width.%]="largura(item)"></span>
                <span class="valor num">{{ formatar.compacto(item.publico) }}</span>
              </span>
              <span class="detalhes secundario num">
                {{ formatar.inteiro(item.sessoes) }} sessões ·
                {{ formatar.decimal(item.publicoMedioPorSessao) }} pessoas/sessão
                @if (item.ocupacaoPct !== null) { · {{ formatar.pct(item.ocupacaoPct) }} de ocupação }
                @if (comVariacao() && item.variacaoPct !== null) {
                  ·
                  <span [class.variacao--alta]="item.variacaoPct > 0" [class.variacao--queda]="item.variacaoPct < 0">
                    {{ item.variacaoPct > 0 ? '▲' : '▼' }} {{ formatar.variacao(item.variacaoPct) }}
                  </span>
                }
              </span>
            </span>
          </a>
        </li>
      }
    </ol>
  `,
  styles: `
    .ranking { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
    .linha { display: grid; grid-template-columns: 28px 1fr; gap: 12px; padding: 10px 8px; border-radius: var(--cd-raio-p); }
    .linha:hover { background: var(--cd-poltrona-2); }
    .pos { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 18px; color: var(--cd-tela-3); text-align: right; }
    .corpo { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .topo { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; min-width: 0; }
    .titulo { font-weight: 600; overflow-wrap: anywhere; }
    .barra-trilho { display: flex; align-items: center; gap: 8px; }
    .barra { height: 10px; min-width: 4px; background: var(--cd-dado-ambar); border-radius: 0 4px 4px 0; }
    .valor { font-weight: 600; font-size: 14px; }
    .detalhes { font-size: 12.5px; }
  `,
})
export class RankingBarras {
  readonly itens = input.required<ItemRanking[]>();
  /** Desligada em período parcial: comparar com um período inteiro daria quedas falsas. */
  readonly comVariacao = input(true);
  private readonly maximo = computed(() => Math.max(1, ...this.itens().map(i => i.publico)));
  protected readonly formatar = formatar;
  protected readonly rotuloOrigem = rotuloOrigem;

  // A barra ocupa até 85% do trilho para o rótulo de valor caber ao lado.
  protected largura(item: ItemRanking) {
    return (item.publico / this.maximo()) * 85;
  }

  protected descricao(item: ItemRanking) {
    return `${item.posicao}º ${formatar.titulo(item.titulo)}: ${formatar.inteiro(item.publico)} espectadores`;
  }
}
