import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CurvaObra, IndiceSite, PontoCurva } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { CurvaLinha } from '../../shared/charts/curva-linha';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import { inicioDoPeriodo, linkPeriodo } from '../../shared/periodo';
import { valorDe } from '../../shared/recurso';
import { FONTE, Seo } from '../../shared/seo';
import { Kpi } from '../../shared/ui/kpi';

/** Semana cinematográfica de um filme: a curva de vida em cartaz resumida, como nos boletins de bilheteria. */
export interface SemanaEmCartaz {
  inicio: string;
  /** Semana da temporada a partir da estreia (1ª, 2ª…); 0 ou menos nas semanas de pré-estreia. */
  numero: number;
  publico: number;
  /** Maior número de salas num dia da semana. */
  salas: number;
  variacaoPct: number | null;
  parcial: boolean;
}

/** Abaixo disso, a semana anterior é pré-estreia: a variação seria absurda (+122.000%). A mesma regra da API. */
const LIMITE_PRE_ESTREIA = 0.05;

/**
 * Agrupa a curva diária em semanas de quinta a quarta. Com a estreia (do back, sem pré-estreias), mostra só a
 * temporada atual (e até 3 semanas de pré-estreia antes dela) numerada a partir da estreia; sem ela, numera da
 * primeira semana com sessão.
 */
export function semanasEmCartaz(dias: PontoCurva[], estreia?: string | null): SemanaEmCartaz[] {
  const semanas = new Map<string, SemanaEmCartaz>();
  for (const d of dias) {
    const inicio = inicioDoPeriodo('semana', d.data);
    const s = semanas.get(inicio) ?? { inicio, numero: 0, publico: 0, salas: 0, variacaoPct: null, parcial: false };
    s.publico += d.publico;
    s.salas = Math.max(s.salas, d.salas);
    s.parcial ||= d.parcial;
    semanas.set(inicio, s);
  }
  const semana = 7 * 24 * 3600 * 1000;
  const desde = estreia ? new Date(`${estreia}T00:00:00Z`).getTime() : null;
  const lista = [...semanas.values()]
    .filter(s => desde === null || new Date(`${s.inicio}T00:00:00Z`).getTime() >= desde - 3 * semana)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  lista.forEach((s, i) => {
    s.numero = desde === null ? i + 1 : Math.round((new Date(`${s.inicio}T00:00:00Z`).getTime() - desde) / semana) + 1;
    const anterior = lista[i - 1];
    const comparavel = anterior && anterior.publico >= s.publico * LIMITE_PRE_ESTREIA && !s.parcial;
    s.variacaoPct = comparavel ? Math.round((1000 * (s.publico - anterior.publico)) / anterior.publico) / 10 : null;
  });
  return lista;
}

@Component({
  selector: 'cd-obra',
  imports: [RouterLink, Kpi, CurvaLinha],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (curva.error()) {
      <section class="conteudo obra">
        <div class="cartao aviso" role="alert">
          <h1>Filme não encontrado</h1>
          <p class="secundario">Código {{ codigo() }}. O site traz os filmes que entraram num Top 10 ou lideraram um estado.</p>
          <a class="mais" routerLink="/">Ver esta semana no cinema →</a>
        </div>
      </section>
    } @else if (dados(); as c) {
      <section class="abertura">
        <div class="conteudo">
          <a routerLink="/" class="voltar secundario">← Esta semana no cinema</a>
          <div class="chips">
            <span class="chip"><span class="amostra" [style.background]="corOrigem[c.obra.origem]"></span>{{ rotuloOrigem[c.obra.origem] }}</span>
            @if (c.obra.pais) { <span class="chip">{{ formatar.titulo(c.obra.pais) }}</span> }
            @if (c.emCartaz) { <span class="chip chip--estreia">Em cartaz</span> }
          </div>
          <h1>{{ formatar.titulo(c.obra.titulo) }}</h1>
          @if (c.obra.tituloOriginal !== c.obra.titulo) {
            <p class="original secundario">{{ formatar.titulo(c.obra.tituloOriginal) }}</p>
          }
        </div>
      </section>

      <div class="conteudo obra">
        <div class="kpis">
          <cd-kpi rotulo="Público nos cinemas" [valor]="formatar.inteiro(c.publicoNoPeriodo)" [detalhe]="periodo()" />
          @if (c.semanasEmCartaz) {
            <cd-kpi rotulo="Tempo em cartaz" [valor]="c.semanasEmCartaz + (c.semanasEmCartaz === 1 ? ' semana' : ' semanas')"
                    [detalhe]="(c.emCartaz ? 'em cartaz desde ' : 'estreou em ') + formatar.diaMesAno(c.emCartazDesde!) + (c.emCartaz ? '' : ' · saiu de cartaz')" />
          }
          @if (c.obra.lancamento; as l) {
            <cd-kpi rotulo="Renda total (lançamento)" [valor]="formatar.moedaCompacta(l.rendaTotal)" [detalhe]="formatar.titulo(l.distribuidora)" />
            @if (l.ticketMedio !== null) {
              <cd-kpi rotulo="Ingresso médio" [valor]="formatar.moeda(l.ticketMedio)" [detalhe]="'estreia em ' + formatar.diaMesAno(l.data)" />
            }
          }
        </div>

        <article class="cartao">
          <header class="titulo-cartao">
            <h2>Curva de público</h2>
            <span class="secundario">espectadores por dia · as estreias são às quintas</span>
          </header>
          @if (c.dias.length > 1) {
            <cd-curva-linha [pontos]="c.dias" />
          } @else {
            <p class="secundario">Poucos dias de exibição para desenhar a curva.</p>
          }
        </article>

        @if (semanas().length > 1) {
          <article class="cartao">
            <header class="titulo-cartao">
              <h2>Semana a semana</h2>
              <span class="secundario">semana cinematográfica, de quinta a quarta, a partir da estreia{{ semanas().length > 12 ? ' · as 12 primeiras' : '' }}</span>
            </header>
            <div class="tabela-rolagem">
              <table>
                <thead>
                  <tr><th scope="col">Semana</th><th scope="col">Início</th><th scope="col" class="n">Público</th><th scope="col" class="n">Variação</th><th scope="col" class="n">Salas</th></tr>
                </thead>
                <tbody>
                  @for (s of semanas().slice(0, 12); track s.inicio) {
                    <tr>
                      <td>{{ s.numero > 0 ? s.numero + 'ª' : 'pré' }}</td>
                      <td>
                        @if (temPagina(s.inicio)) {
                          <a [routerLink]="linkPeriodo('semana', s.inicio)">{{ formatar.dataCurta(s.inicio) }}</a>
                        } @else {
                          {{ formatar.dataCurta(s.inicio) }}
                        }
                        @if (s.parcial) { <span class="chip">parcial</span> }
                      </td>
                      <td class="n num">{{ formatar.inteiro(s.publico) }}</td>
                      <td class="n num">
                        @if (s.variacaoPct !== null) {
                          <span [class.variacao--alta]="s.variacaoPct > 0" [class.variacao--queda]="s.variacaoPct < 0">
                            {{ s.variacaoPct > 0 ? '▲' : '▼' }} {{ formatar.variacao(s.variacaoPct) }}
                          </span>
                        } @else { <span class="secundario">—</span> }
                      </td>
                      <td class="n num">{{ formatar.inteiro(s.salas) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </article>
        }

        <p class="fonte secundario">{{ fonte }}. Código ANCINE {{ c.obra.codigo }}.</p>
      </div>
    } @else {
      <div class="conteudo obra">
        <div class="esqueleto" style="height: 160px"></div>
        <div class="esqueleto" style="height: 420px"></div>
      </div>
    }
  `,
  styles: `
    .abertura { border-bottom: 1px solid var(--cd-linha); padding: 28px 0 28px; }
    .voltar { font-size: 14px; display: inline-block; margin-bottom: 18px; }
    .voltar:hover { color: var(--cd-tela); }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    h1 { margin-top: 12px; font-size: clamp(34px, 6vw, 60px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.02; }
    .original { margin: 8px 0 0; font-size: 17px; }
    .obra { display: flex; flex-direction: column; gap: var(--cd-gap); padding-top: 24px; padding-bottom: 56px; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: var(--cd-gap); }
    @media (max-width: 640px) { .kpis { grid-template-columns: 1fr 1fr; gap: 10px; --cd-kpi-valor: 26px; } }
    .titulo-cartao { display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px; }
    .titulo-cartao .secundario { font-size: 13px; }
    .tabela-rolagem { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { text-align: left; font-weight: 600; color: var(--cd-tela-3); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; padding: 0 12px 8px 0; }
    td { padding: 9px 12px 9px 0; border-top: 1px solid var(--cd-linha); white-space: nowrap; }
    td a { text-decoration: underline; text-decoration-color: var(--cd-linha); text-underline-offset: 3px; }
    td a:hover { text-decoration-color: var(--cd-tela); }
    td .chip { margin-left: 6px; }
    .n { text-align: right; }
    @media (max-width: 640px) {
      table { font-size: 13px; }
      th { font-size: 11px; letter-spacing: .03em; padding-right: 8px; }
      td { padding: 8px 8px 8px 0; white-space: normal; }
      td .chip { margin: 2px 0 0; }
    }
    .fonte { font-size: 13px; margin: 0; }
    .aviso { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
    .aviso h1 { font-size: 28px; margin: 0; }
    .mais { font-weight: 600; text-decoration: underline; text-decoration-color: var(--cd-projetor); text-underline-offset: 4px; }
  `,
})
export class Obra {
  private readonly seo = inject(Seo);

  /** Vem do parâmetro de rota :codigo (withComponentInputBinding). */
  readonly codigo = input.required<string>();
  protected readonly curva = httpResource<CurvaObra>(() => rotasApi.curvaObra(this.codigo()));
  protected readonly indice = httpResource<IndiceSite>(() => rotasApi.indice());
  protected readonly formatar = formatar;
  protected readonly rotuloOrigem = rotuloOrigem;
  protected readonly corOrigem = corOrigem;
  protected readonly linkPeriodo = linkPeriodo;
  protected readonly fonte = FONTE;

  protected readonly dados = computed(() => valorDe(this.curva));
  protected readonly semanas = computed(() => semanasEmCartaz(this.dados()?.dias ?? [], this.dados()?.emCartazDesde));

  protected readonly periodo = computed(() => {
    const dias = this.dados()?.dias ?? [];
    return dias.length ? `de ${formatar.diaMesAno(dias[0].data)} a ${formatar.diaMesAno(dias[dias.length - 1].data)}` : '';
  });

  constructor() {
    effect(() => {
      const c = this.dados();
      if (!c) return;
      const titulo = formatar.titulo(c.obra.titulo);
      this.seo.definir({
        titulo: `${titulo}: público nos cinemas do Brasil`,
        descricao:
          `${titulo} levou ${formatar.inteiro(c.publicoNoPeriodo)} pessoas aos cinemas do Brasil` +
          (c.semanasEmCartaz ? `, ${c.semanasEmCartaz} semanas em cartaz` : '') +
          ` (${this.periodo()}). Curva de público dia a dia e semana a semana. ${FONTE}.`,
        caminho: `/obras/${c.obra.codigo}`,
      });
    });
  }

  /** No site estático só há páginas de semana a partir do início do export. */
  protected temPagina(inicio: string) {
    const semana = valorDe(this.indice)?.granularidades.semana;
    return !semana || (inicio >= semana.primeiro && inicio <= semana.ultimo);
  }
}
