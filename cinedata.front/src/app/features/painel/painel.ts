import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { PainelSemana, Semana } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { BarraDividida, Fatia } from '../../shared/charts/barra-dividida';
import { MapaUfs } from '../../shared/charts/mapa-ufs';
import { RankingBarras } from '../../shared/charts/ranking-barras';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import { Kpi } from '../../shared/ui/kpi';

@Component({
  selector: 'cd-painel',
  imports: [Kpi, RankingBarras, BarraDividida, MapaUfs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './painel.html',
  styleUrl: './painel.scss',
})
export class Painel {
  /** Início da semana escolhida; vazio = a API escolhe a última semana completa. */
  protected readonly semanaEscolhida = signal<string | undefined>(undefined);

  protected readonly semanas = httpResource<Semana[]>(() => rotasApi.semanas(), { defaultValue: [] });
  protected readonly painel = httpResource<PainelSemana>(() => rotasApi.painel(this.semanaEscolhida()));
  protected readonly formatar = formatar;

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

  /** Frase-manchete da semana: o formato que vira post. */
  protected readonly manchete = computed(() => {
    const p = this.painel.value();
    const lider = p?.ranking[0];
    if (!p || !lider) return null;
    return `${lider.titulo} levou ${formatar.inteiro(lider.publico)} pessoas aos cinemas — ${formatar.pct(lider.participacaoPct)} do público da semana.`;
  });

  protected rotuloSemana(s: Semana) {
    return `${formatar.periodo(s.inicio, s.fim)}${s.completa ? '' : ` (parcial, ${s.diasComDados} dias)`}`;
  }

  protected escolherSemana(valor: string) {
    this.semanaEscolhida.set(valor || undefined);
  }
}
