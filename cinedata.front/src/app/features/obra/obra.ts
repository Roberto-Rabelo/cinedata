import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CurvaObra } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { CurvaLinha } from '../../shared/charts/curva-linha';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import { Kpi } from '../../shared/ui/kpi';

@Component({
  selector: 'cd-obra',
  imports: [RouterLink, Kpi, CurvaLinha],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="conteudo obra">
      <a routerLink="/" class="voltar secundario">← Painel</a>

      @if (curva.error()) {
        <div class="cartao" role="alert"><h2>Obra não encontrada</h2><p class="secundario">Código {{ codigo() }}.</p></div>
      } @else if (curva.value(); as c) {
        <header>
          <span class="chip"><span class="amostra" [style.background]="corOrigem[c.obra.origem]"></span>{{ rotuloOrigem[c.obra.origem] }}</span>
          @if (c.obra.pais) { <span class="chip">{{ c.obra.pais }}</span> }
          <h1>{{ c.obra.titulo }}</h1>
          @if (c.obra.tituloOriginal !== c.obra.titulo) { <p class="secundario original">{{ c.obra.tituloOriginal }}</p> }
          <p class="rotulo codigo">{{ c.obra.codigo }}</p>
        </header>

        <div class="kpis">
          <cd-kpi rotulo="Público no período importado" [valor]="formatar.inteiro(c.publicoNoPeriodo)"
                  [detalhe]="periodo()" />
          @if (c.obra.lancamento; as l) {
            <cd-kpi rotulo="Público total (lançamento)" [valor]="formatar.inteiro(l.publicoTotal)"
                    [detalhe]="'estreia em ' + formatar.diaMesAno(l.data)" />
            <cd-kpi rotulo="Renda total" [valor]="formatar.moedaCompacta(l.rendaTotal)" [detalhe]="l.distribuidora" />
            @if (l.ticketMedio !== null) {
              <cd-kpi rotulo="Ingresso médio" [valor]="formatar.moeda(l.ticketMedio)" detalhe="renda ÷ público" />
            }
          }
        </div>

        <article class="cartao">
          <header class="titulo-cartao">
            <h2>Curva de público</h2>
            <span class="secundario">espectadores por dia · quintas são dias de estreia</span>
          </header>
          @if (c.dias.length > 1) {
            <cd-curva-linha [pontos]="c.dias" />
          } @else {
            <p class="secundario">Poucos dias de exibição no período importado para desenhar a curva.</p>
          }
        </article>
      } @else {
        <div class="esqueleto" style="height: 420px; margin-top: 24px"></div>
      }
    </section>
  `,
  styles: `
    .obra { display: flex; flex-direction: column; gap: var(--cd-gap); padding-top: 24px; padding-bottom: 48px; }
    .voltar { font-size: 14px; }
    header .chip { margin-right: 6px; }
    h1 { margin-top: 12px; }
    .original { margin: 4px 0 0; }
    .codigo { margin: 8px 0 0; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: var(--cd-gap); }
    .titulo-cartao { display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px; }
    .titulo-cartao .secundario { font-size: 13px; }
  `,
})
export class Obra {
  /** Vem do parâmetro de rota :codigo (withComponentInputBinding). */
  readonly codigo = input.required<string>();
  protected readonly curva = httpResource<CurvaObra>(() => rotasApi.curvaObra(this.codigo()));
  protected readonly formatar = formatar;
  protected readonly rotuloOrigem = rotuloOrigem;
  protected readonly corOrigem = corOrigem;

  protected readonly periodo = computed(() => {
    const dias = this.curva.value()?.dias ?? [];
    return dias.length ? `de ${formatar.diaMes(dias[0].data)} a ${formatar.diaMesAno(dias.at(-1)!.data)}` : '';
  });
}
