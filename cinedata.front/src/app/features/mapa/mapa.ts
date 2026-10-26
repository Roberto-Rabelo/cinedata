import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Granularidade, IndiceSite, PainelPeriodo, SerieUf, Uf } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import {
  chavePeriodo,
  doPeriodo,
  inicioDaChave,
  inicioDoPeriodo,
  lerGranularidade,
  linkPeriodo,
  periodoAnterior,
  periodoVizinho,
  tituloPeriodo,
} from '../../shared/periodo';
import { valorDe } from '../../shared/recurso';
import { MANTER_ROLAGEM } from '../../shared/rolagem';
import { FONTE, Seo } from '../../shared/seo';
import { GRADE, NOME_REGIAO, NOME_UF, NO_ESTADO, REGIOES } from '../../shared/ufs';
import { NavegacaoPeriodo } from '../../shared/ui/navegacao-periodo';
import { ListaEstados } from './lista-estados';
import { MapaBrasil } from './mapa-brasil';
import { METRICAS, Metrica, lerMetrica, origemDoCodigo, rotuloCurto } from './metricas';

/** Quantos períodos a série do estado mostra até o período em tela. */
const JANELA: Record<Granularidade, number> = { semana: 12, mes: 12, trimestre: 8, semestre: 8, ano: 10 };

export interface UfNoRanking extends Uf {
  posicao: number;
  participacaoPct: number;
}

/**
 * Mapa do cinema: o Brasil por estado num período. Escolher um estado abre o detalhe (posição, parcela do Brasil,
 * comparação com a média nacional, filme líder e a série do estado), e dali dá para andar por estados vizinhos no
 * ranking e por períodos anteriores sem perder o estado escolhido (?uf=SP fica na URL).
 */
@Component({
  selector: 'cd-mapa',
  imports: [RouterLink, NavegacaoPeriodo, MapaBrasil, ListaEstados],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mapa.html',
  styleUrl: './mapa.scss',
})
export class Mapa {
  private readonly router = inject(Router);
  private readonly seo = inject(Seo);
  private readonly noNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly detalheEl = viewChild<ElementRef<HTMLElement>>('areaDetalhe');

  /** Granularidade (dado da rota), chave do período (caminho), estado e métrica (query: ?uf=SP&ver=dublado). */
  readonly periodo = input<string>();
  readonly chave = input<string>();
  readonly uf = input<string>();
  readonly ver = input<string>();

  protected readonly granularidade = computed(() => lerGranularidade(this.periodo()));
  protected readonly dataPedida = computed(() => {
    const chave = this.chave();
    return chave ? inicioDaChave(this.granularidade(), chave) : undefined;
  });
  protected readonly metrica = computed(() => lerMetrica(this.ver()));
  protected readonly selecionada = computed(() => {
    const uf = this.uf()?.trim().toUpperCase();
    return uf && GRADE[uf] ? uf : null;
  });

  private readonly painel = httpResource<PainelPeriodo>(() => {
    const data = this.dataPedida();
    return data === null ? undefined : rotasApi.painel(this.granularidade(), data);
  });
  private readonly indice = httpResource<IndiceSite>(() => rotasApi.indice());
  private readonly serie = httpResource<SerieUf>(() => {
    const uf = this.selecionada();
    return uf && this.noNavegador ? rotasApi.serieUf(uf, this.granularidade()) : undefined;
  });

  protected readonly dados = computed(() => valorDe(this.painel));
  protected readonly indiceSite = computed(() => valorDe(this.indice));
  protected readonly naoEncontrado = computed(() => {
    const erro = this.painel.error();
    return this.dataPedida() === null || (erro instanceof HttpErrorResponse && erro.status === 404);
  });
  protected readonly falhou = computed(() => this.painel.error() !== undefined && !this.naoEncontrado());

  /** Estado sob o mouse ou o foco do teclado. */
  protected readonly previa = signal<string | null>(null);
  /** Grupo em destaque no mapa: uma região (lista de regiões) ou um filme (legenda de quem venceu). */
  protected readonly realce = signal<{ regiao?: string; filme?: string } | null>(null);

  protected readonly ranking = computed<UfNoRanking[]>(() => {
    const ufs = this.dados()?.ufs ?? [];
    const total = ufs.reduce((s, u) => s + u.publico, 0) || 1;
    return [...ufs]
      .sort((a, b) => b.publico - a.publico)
      .map((u, i) => ({ ...u, posicao: i + 1, participacaoPct: (100 * u.publico) / total }));
  });

  protected readonly regioes = computed(() => {
    const total = this.ranking().reduce((s, u) => s + u.publico, 0) || 1;
    return REGIOES.map(regiao => {
      const ufs = this.ranking().filter(u => u.regiao === regiao);
      const publico = ufs.reduce((s, u) => s + u.publico, 0);
      return { regiao, nome: NOME_REGIAO[regiao], publico, pct: (100 * publico) / total, lider: ufs[0] ?? null };
    }).sort((a, b) => b.publico - a.publico);
  });

  /** Placar de "quem venceu": cada filme que liderou ao menos um estado, com quantos estados levou. */
  protected readonly vencedores = computed(() => {
    const porFilme = new Map<string, { codigo: string; titulo: string; estados: number }>();
    for (const u of this.ranking()) {
      if (!u.liderCodigo) continue;
      const filme = porFilme.get(u.liderCodigo) ?? { codigo: u.liderCodigo, titulo: u.liderTitulo ?? u.liderCodigo, estados: 0 };
      filme.estados++;
      porFilme.set(u.liderCodigo, filme);
    }
    return [...porFilme.values()]
      .sort((a, b) => b.estados - a.estados)
      .map(f => ({ ...f, origem: origemDoCodigo(f.codigo) ?? 'Generica' }));
  });

  protected readonly grupo = computed(() => {
    const r = this.realce();
    if (!r) return null;
    return this.ranking()
      .filter(u => (r.regiao ? u.regiao === r.regiao : u.liderCodigo === r.filme))
      .map(u => u.uf);
  });

  protected readonly detalhe = computed(() => {
    const uf = this.selecionada();
    const ranking = this.ranking();
    const atual = ranking.find(u => u.uf === uf);
    if (!uf || !atual) return null;
    const i = atual.posicao - 1;
    return { ...atual, nome: NOME_UF[uf], acima: ranking[i - 1] ?? null, abaixo: ranking[i + 1] ?? null };
  });

  /** Série do estado até o período em tela, com o anterior para a variação. */
  protected readonly tendencia = computed(() => {
    const serie = valorDe(this.serie);
    const p = this.dados()?.periodo;
    if (!serie || !p || serie.uf !== this.selecionada() || serie.granularidade !== p.granularidade) return null;
    const ate = serie.pontos.filter(pt => pt.inicio <= p.inicio);
    const pontos = ate.slice(-JANELA[p.granularidade]);
    const anterior = serie.pontos.find(pt => pt.inicio === periodoVizinho(p.granularidade, p.inicio, -1));
    const atual = serie.pontos.find(pt => pt.inicio === p.inicio);
    const maximo = Math.max(1, ...pontos.map(pt => pt.publico));
    const melhor = serie.pontos.reduce((a, b) => (b.publico > a.publico ? b : a), serie.pontos[0]);
    return {
      pontos: pontos.map(pt => ({ ...pt, altura: (100 * pt.publico) / maximo, atual: pt.inicio === p.inicio })),
      variacaoPct: atual && anterior?.publico ? (100 * (atual.publico - anterior.publico)) / anterior.publico : null,
      melhor,
    };
  });

  protected readonly tituloPagina = computed(() => {
    const p = this.dados()?.periodo;
    return p ? tituloPeriodo(p) : '';
  });

  protected readonly selecionadoNav = computed(() => {
    const data = this.dataPedida();
    return data ? inicioDoPeriodo(this.granularidade(), data) : '';
  });

  /** Frase para leitores de tela quando o estado escolhido muda. */
  protected readonly anuncio = computed(() => {
    const d = this.detalhe();
    return d ? `${d.nome}: ${formatar.inteiro(d.publico)} espectadores, ${d.posicao}º de ${this.ranking().length} estados.` : '';
  });

  protected readonly metricas = METRICAS;
  protected readonly formatar = formatar;
  protected readonly doPeriodo = doPeriodo;
  protected readonly periodoAnterior = periodoAnterior;
  protected readonly nomeUf = NOME_UF;
  protected readonly noEstado = NO_ESTADO;
  protected readonly nomeRegiao = NOME_REGIAO;
  protected readonly corOrigem = corOrigem;
  protected readonly rotuloOrigem = rotuloOrigem;
  protected readonly origemDoCodigo = origemDoCodigo;
  protected readonly rotuloCurto = rotuloCurto;
  protected readonly linkPeriodo = linkPeriodo;
  protected readonly fonte = FONTE;
  protected readonly manterRolagem = MANTER_ROLAGEM;

  constructor() {
    effect(() => {
      const p = this.dados();
      if (!p) return;
      const g = p.periodo.granularidade;
      const lider = this.ranking()[0];
      const titulo = tituloPeriodo(p.periodo);
      this.seo.definir({
        titulo: `Mapa do cinema no Brasil: ${titulo}`,
        descricao:
          `Público de cinema por estado ${doPeriodo[g]} (${titulo}). ` +
          (lider ? `${NOME_UF[lider.uf]} lidera com ${formatar.inteiro(lider.publico)} espectadores (${formatar.pct(lider.participacaoPct)} do Brasil). ` : '') +
          `Filme mais visto, público por sessão e dublagem em cada estado. ${FONTE}.`,
        caminho: this.chave() ? `/mapa/${g}/${chavePeriodo(g, p.periodo.inicio)}` : g === 'semana' ? '/mapa' : `/mapa/${g}`,
      });
    });
  }

  /** Escolher o mesmo estado de novo fecha o detalhe. No celular, rola até o detalhe. */
  protected escolher(uf: string | null) {
    const novo = uf && uf !== this.selecionada() ? uf : null;
    void this.router.navigate([], { queryParams: { uf: novo }, queryParamsHandling: 'merge', replaceUrl: true }).then(() => {
      const el = this.detalheEl()?.nativeElement;
      if (novo && el && matchMedia('(max-width: 900px)').matches) {
        const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
      }
    });
  }

  protected escolherMetrica(metrica: Metrica) {
    void this.router.navigate([], {
      queryParams: { ver: metrica === 'publico' ? null : metrica },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
