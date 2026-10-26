import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, effect, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CurvaObra, Granularidade, IndiceSite, PainelPeriodo, Periodo } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { BarraDividida, Fatia } from '../../shared/charts/barra-dividida';
import { BarrasDia } from '../../shared/charts/barras-dia';
import { MapaUfs } from '../../shared/charts/mapa-ufs';
import { RankingBarras } from '../../shared/charts/ranking-barras';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import {
  chavePeriodo,
  doPeriodo,
  granularidades,
  inicioDaChave,
  inicioDoPeriodo,
  legendaGranularidade,
  lerGranularidade,
  oPeriodo,
  linkGranularidade,
  linkPeriodo,
  periodoAnterior,
  periodoVizinho,
  rotuloOpcao,
  tituloPeriodo,
  ultimoCompleto,
  vizinhoPorExtenso,
} from '../../shared/periodo';
import { valorDe } from '../../shared/recurso';
import { FONTE, Seo } from '../../shared/seo';
import { Kpi } from '../../shared/ui/kpi';

const preposicao: Record<Granularidade, string> = { semana: 'de', mes: 'em', trimestre: 'no', semestre: 'no', ano: 'em' };

/**
 * Página de um período (semana, mês, trimestre, semestre ou ano). Sem período na URL é a página inicial:
 * "esta semana no cinema", a última semana completa.
 */
@Component({
  selector: 'cd-painel',
  imports: [RouterLink, Kpi, RankingBarras, BarraDividida, MapaUfs, BarrasDia],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel {
  private readonly router = inject(Router);
  private readonly seo = inject(Seo);
  private readonly noNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  /** Granularidade: dado da rota (/mes/2026-09) ou query param das URLs antigas (?periodo=mes). */
  readonly periodo = input<string>();
  /** Chave do período no caminho: /semana/2026-10-08, /mes/2026-09, /trimestre/2025-t3, /ano/2025. */
  readonly chave = input<string>();
  /** Query param das URLs antigas (?data=2025-07-01): qualquer dia do período. */
  readonly data = input<string>();

  protected readonly granularidade = computed(() => lerGranularidade(this.periodo()));

  /** Início pedido; `undefined` = período padrão (último completo); `null` = chave que não existe. */
  protected readonly dataPedida = computed(() => {
    const chave = this.chave();
    if (chave) return inicioDaChave(this.granularidade(), chave);
    return this.data() || undefined;
  });

  /** Página inicial: a semana padrão, sem filtro. */
  protected readonly ehInicio = computed(() => this.granularidade() === 'semana' && this.dataPedida() === undefined);

  protected readonly indice = httpResource<IndiceSite>(() => rotasApi.indice());
  protected readonly painel = httpResource<PainelPeriodo>(() => {
    const data = this.dataPedida();
    return data === null ? undefined : rotasApi.painel(this.granularidade(), data);
  });
  // A lista inteira (530 semanas) só serve ao seletor: fica fora do HTML pré-renderizado e chega depois.
  protected readonly periodos = httpResource<Periodo[]>(
    () => (this.noNavegador ? rotasApi.periodos(this.granularidade()) : undefined),
    { defaultValue: [] },
  );

  protected readonly lider = computed(() => this.dados()?.ranking[0] ?? null);
  protected readonly curvaLider = httpResource<CurvaObra>(() => {
    const lider = this.lider();
    return lider ? rotasApi.curvaObra(lider.codigoObra) : undefined;
  });
  protected readonly diasLider = computed(() => {
    const curva = valorDe(this.curvaLider);
    const p = this.dados()?.periodo;
    if (!curva || !p || curva.obra.codigo !== this.lider()?.codigoObra) return null;
    return curva.dias.filter(d => d.data >= p.inicio && d.data <= p.fim);
  });

  /** Na página inicial, o mês mais recente completo logo abaixo da semana. */
  protected readonly mes = httpResource<PainelPeriodo>(() => (this.ehInicio() ? rotasApi.painel('mes') : undefined));

  // Leituras seguras: um resource com erro lança exceção em value().
  protected readonly dados = computed(() => valorDe(this.painel));
  protected readonly indiceSite = computed(() => valorDe(this.indice));
  protected readonly listaPeriodos = computed(() => valorDe(this.periodos) ?? []);
  protected readonly mesDestaque = computed(() => valorDe(this.mes));

  protected readonly naoEncontrado = computed(() => this.dataPedida() === null || this.painel.error() !== undefined);
  /** Período que não existe (chave inválida ou, no site estático, sem JSON exportado); o resto é falha de carga. */
  protected readonly periodoInexistente = computed(() => {
    const erro = this.painel.error();
    return this.dataPedida() === null || (erro instanceof HttpErrorResponse && erro.status === 404);
  });
  protected readonly comApi = rotasApi.indice() === undefined;

  /** Início no seletor: qualquer data da URL vira o período que a contém. */
  protected readonly selecionado = computed(() => {
    const data = this.dataPedida();
    return data ? inicioDoPeriodo(this.granularidade(), data) : '';
  });

  /** Primeiro e último período com página: no site estático vêm do índice do export; na API, da lista de períodos. */
  private readonly limites = computed(() => {
    const doIndice = this.indiceSite()?.granularidades[this.granularidade()];
    if (doIndice) return doIndice;
    const lista = this.listaPeriodos();
    return lista.length ? { primeiro: lista[lista.length - 1].inicio, ultimo: lista[0].inicio } : null;
  });

  protected readonly vizinhos = computed(() => {
    const p = this.dados()?.periodo;
    if (!p) return [null, null];
    const g = p.granularidade;
    const limites = this.limites();
    return ([-1, 1] as const).map((passo, i) => {
      const inicio = periodoVizinho(g, p.inicio, passo);
      if (limites && (inicio < limites.primeiro || inicio > limites.ultimo)) return null;
      return { link: linkPeriodo(g, inicio), rotulo: vizinhoPorExtenso[g][i] };
    });
  });

  protected readonly formatar = formatar;
  protected readonly granularidades = granularidades;
  protected readonly doPeriodo = doPeriodo;
  protected readonly periodoAnterior = periodoAnterior;
  protected readonly ultimoCompleto = ultimoCompleto;
  protected readonly legendaGranularidade = legendaGranularidade;
  protected readonly tituloPeriodo = tituloPeriodo;
  protected readonly rotuloOpcao = rotuloOpcao;
  protected readonly rotuloOrigem = rotuloOrigem;
  protected readonly corOrigem = corOrigem;
  protected readonly linkGranularidade = linkGranularidade;
  protected readonly linkPeriodo = linkPeriodo;
  protected readonly fonte = FONTE;

  protected readonly fatiasOrigem = computed<Fatia[]>(() =>
    (this.dados()?.origem ?? []).map(o => ({
      rotulo: rotuloOrigem[o.origem],
      valor: o.publico,
      cor: corOrigem[o.origem],
    })),
  );

  protected readonly fatiasAudio = computed<Fatia[]>(() => {
    const audio = this.dados()?.audio;
    return audio
      ? [
          { rotulo: 'Dublado', valor: audio.publicoDublado, cor: 'var(--cd-dado-ambar)' },
          { rotulo: 'Legendado', valor: audio.publicoLegendado, cor: 'var(--cd-dado-azul)' },
        ]
      : [];
  });

  protected readonly nacionalPct = computed(() => this.dados()?.origem.find(o => o.origem === 'Nacional')?.participacaoPct ?? 0);

  /** Frase-manchete do período: o formato que vira post. */
  protected readonly manchete = computed(() => {
    const p = this.dados();
    const lider = p?.ranking[0];
    if (!p || !lider) return null;
    return `${formatar.titulo(lider.titulo)} levou ${formatar.inteiro(lider.publico)} pessoas aos cinemas — ${formatar.pct(lider.participacaoPct)} do público ${doPeriodo[p.periodo.granularidade]}.`;
  });

  constructor() {
    effect(() => {
      const p = this.dados();
      if (p) this.seo.definir(this.descreverPagina(p));
    });
  }

  protected escolherPeriodo(inicio: string) {
    const g = this.granularidade();
    void this.router.navigate(inicio ? linkPeriodo(g, inicio) : linkGranularidade(g));
  }

  private descreverPagina(p: PainelPeriodo) {
    const g = p.periodo.granularidade;
    const titulo = tituloPeriodo(p.periodo);
    const lider = p.ranking[0];
    const partes = [
      lider
        ? `${formatar.titulo(lider.titulo)} liderou ${oPeriodo[g]} com ${formatar.inteiro(lider.publico)} espectadores (${formatar.pct(lider.participacaoPct)} do público).`
        : '',
      `Público total: ${formatar.inteiro(p.resumo.publico)} em ${formatar.inteiro(p.resumo.sessoes)} sessões;`,
      `filmes nacionais: ${formatar.pct(this.nacionalPct())}; dublados: ${formatar.pct(p.audio.dubladoPct)} dos estrangeiros.`,
      `Top 10, mapa por estado e mais. ${FONTE}.`,
    ];
    return {
      titulo: this.ehInicio()
        ? `Esta semana no cinema: ${titulo}`
        : `Cinema no Brasil ${preposicao[g]} ${titulo}: Top 10 e público`,
      descricao: partes.filter(Boolean).join(' '),
      caminho: this.ehInicio() ? '/' : `/${g}/${chavePeriodo(g, p.periodo.inicio)}`,
    };
  }
}
