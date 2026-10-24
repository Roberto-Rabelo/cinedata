import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { Granularidade, PainelPeriodo, Periodo } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { BarraDividida, Fatia } from '../../shared/charts/barra-dividida';
import { MapaUfs } from '../../shared/charts/mapa-ufs';
import { RankingBarras } from '../../shared/charts/ranking-barras';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import {
  doPeriodo,
  granularidades,
  legendaGranularidade,
  lerGranularidade,
  periodoAnterior,
  rotuloOpcao,
  tituloPeriodo,
  ultimoCompleto,
} from '../../shared/periodo';
import { Kpi } from '../../shared/ui/kpi';

@Component({
  selector: 'cd-painel',
  imports: [Kpi, RankingBarras, BarraDividida, MapaUfs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel {
  private readonly router = inject(Router);

  /** Query params `?periodo=mes&data=2026-09-01` (withComponentInputBinding). Sem `data`, a API usa o último período completo. */
  readonly periodo = input<string>();
  readonly data = input<string>();

  protected readonly granularidade = computed(() => lerGranularidade(this.periodo()));
  protected readonly periodos = httpResource<Periodo[]>(() => rotasApi.periodos(this.granularidade()), { defaultValue: [] });
  protected readonly painel = httpResource<PainelPeriodo>(() => rotasApi.painel(this.granularidade(), this.data() || undefined));

  /** Início do período no seletor: qualquer data da URL vira o período que a contém. */
  protected readonly selecionado = computed(() => {
    const data = this.data();
    if (!data) return '';
    return this.periodos.value().find(p => p.inicio <= data && data <= p.fim)?.inicio ?? data;
  });

  protected readonly formatar = formatar;
  protected readonly granularidades = granularidades;
  protected readonly doPeriodo = doPeriodo;
  protected readonly periodoAnterior = periodoAnterior;
  protected readonly ultimoCompleto = ultimoCompleto;
  protected readonly legendaGranularidade = legendaGranularidade;
  protected readonly tituloPeriodo = tituloPeriodo;
  protected readonly rotuloOpcao = rotuloOpcao;

  protected readonly fatiasOrigem = computed<Fatia[]>(() =>
    (this.painel.value()?.origem ?? []).map(o => ({
      rotulo: rotuloOrigem[o.origem],
      valor: o.publico,
      cor: corOrigem[o.origem],
    })),
  );

  protected readonly fatiasAudio = computed<Fatia[]>(() => {
    const audio = this.painel.value()?.audio;
    return audio
      ? [
          { rotulo: 'Dublado', valor: audio.publicoDublado, cor: 'var(--cd-dado-ambar)' },
          { rotulo: 'Legendado', valor: audio.publicoLegendado, cor: 'var(--cd-dado-azul)' },
        ]
      : [];
  });

  /** Frase-manchete do período: o formato que vira post. */
  protected readonly manchete = computed(() => {
    const p = this.painel.value();
    const lider = p?.ranking[0];
    if (!p || !lider) return null;
    return `${lider.titulo} levou ${formatar.inteiro(lider.publico)} pessoas aos cinemas — ${formatar.pct(lider.participacaoPct)} do público ${doPeriodo[p.periodo.granularidade]}.`;
  });

  /** Trocar a granularidade volta para o último período completo dela. */
  protected escolherGranularidade(granularidade: Granularidade) {
    this.navegar({ periodo: granularidade === 'semana' ? null : granularidade, data: null });
  }

  protected escolherPeriodo(inicio: string) {
    this.navegar({ data: inicio || null });
  }

  private navegar(queryParams: Record<string, string | null>) {
    void this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
