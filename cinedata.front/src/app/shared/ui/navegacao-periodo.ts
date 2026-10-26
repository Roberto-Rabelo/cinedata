import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Granularidade, IndiceSite, Periodo } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import {
  granularidades,
  linkGranularidade,
  linkPeriodo,
  periodoVizinho,
  rotuloOpcao,
  ultimoCompleto,
  vizinhoPorExtenso,
} from '../periodo';
import { valorDe } from '../recurso';
import { MANTER_ROLAGEM } from '../rolagem';

/**
 * Abas de granularidade, período anterior/seguinte e seletor de período. Tudo é link (rastreável e pré-renderizável),
 * menos o seletor. Serve ao painel (/mes/2026-09) e ao mapa (/mapa/mes/2026-09), pela `secao`.
 */
@Component({
  selector: 'cd-navegacao-periodo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navegacao" aria-label="Escolha do período">
      <div class="granularidades">
        @for (g of granularidades; track g.valor) {
          <a [routerLink]="linkGranularidade(g.valor, secao())" [queryParamsHandling]="consulta()" [state]="estado()"
             [class.ativa]="g.valor === granularidade()" [attr.aria-current]="g.valor === granularidade() ? 'true' : null">{{ g.rotulo }}</a>
        }
      </div>
      <div class="passos">
        @if (vizinhos()[0]; as v) {
          <a class="passo" [routerLink]="v.link" [queryParamsHandling]="consulta()" [state]="estado()" rel="prev" [attr.aria-label]="v.rotulo">←<span>{{ v.rotulo }}</span></a>
        }
        <label class="seletor">
          <span class="visualmente-oculto">Período</span>
          <select (change)="escolher($any($event.target).value)">
            <option value="" [selected]="selecionado() === ''">{{ ultimoCompleto[granularidade()] }}</option>
            @for (s of lista(); track s.inicio) {
              <option [value]="s.inicio" [selected]="s.inicio === selecionado()">{{ rotuloOpcao(s) }}</option>
            }
          </select>
        </label>
        @if (vizinhos()[1]; as v) {
          <a class="passo" [routerLink]="v.link" [queryParamsHandling]="consulta()" [state]="estado()" rel="next" [attr.aria-label]="v.rotulo"><span>{{ v.rotulo }}</span>→</a>
        }
      </div>
    </nav>
  `,
  styles: `
    .navegacao { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
    .granularidades { display: inline-flex; padding: 3px; gap: 2px; border: 1px solid var(--cd-linha); border-radius: 999px; background: var(--cd-poltrona); }
    .granularidades a { padding: 6px 14px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--cd-tela-2); }
    .granularidades a:hover { color: var(--cd-tela); }
    .granularidades a.ativa { color: var(--cd-sala); background: var(--cd-tela); font-weight: 600; }
    .passos { display: flex; align-items: center; gap: 8px; }
    .passo {
      display: inline-flex; gap: 6px; align-items: center; padding: 8px 12px; font-size: 14px; white-space: nowrap;
      border: 1px solid var(--cd-linha); border-radius: var(--cd-raio-p); color: var(--cd-tela-2);
    }
    .passo:hover { color: var(--cd-tela); border-color: var(--cd-tela-3); }
    .seletor select { max-width: 280px; }
    @media (max-width: 640px) {
      .navegacao, .passos, .granularidades { width: 100%; }
      .granularidades a { flex: 1; text-align: center; padding: 6px 2px; font-size: 13px; }
      .seletor { flex: 1; min-width: 0; }
      .seletor select { width: 100%; max-width: none; }
      .passo span { display: none; }
    }
  `,
})
export class NavegacaoPeriodo {
  private readonly router = inject(Router);
  private readonly noNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  readonly granularidade = input.required<Granularidade>();
  /** Período em tela: base do anterior e do seguinte. */
  readonly periodo = input<Pick<Periodo, 'granularidade' | 'inicio'>>();
  /** Início escolhido na URL; vazio = o padrão (último completo). */
  readonly selecionado = input('');
  /** Prefixo das URLs: [] no painel, ['mapa'] no mapa. */
  readonly secao = input<string[]>([]);
  /** Mantém a query string ao trocar de período (ex.: o estado escolhido no mapa, ?uf=SP). */
  readonly manterQuery = input(false);

  // A lista inteira (530 semanas) só serve ao seletor: fica fora do HTML pré-renderizado e chega depois.
  private readonly periodos = httpResource<Periodo[]>(() =>
    this.noNavegador ? rotasApi.periodos(this.granularidade()) : undefined,
  );
  private readonly indice = httpResource<IndiceSite>(() => rotasApi.indice());

  protected readonly lista = computed(() => valorDe(this.periodos) ?? []);
  protected readonly consulta = computed(() => (this.manterQuery() ? 'preserve' : undefined));
  /** No mapa a pessoa está olhando um estado: trocar de período não volta ao topo. */
  protected readonly estado = computed(() => (this.manterQuery() ? MANTER_ROLAGEM : undefined));

  /** Primeiro e último período com página: no site estático vêm do índice do export; na API, da lista de períodos. */
  private readonly limites = computed(() => {
    const doIndice = valorDe(this.indice)?.granularidades[this.granularidade()];
    if (doIndice) return doIndice;
    const lista = this.lista();
    return lista.length ? { primeiro: lista[lista.length - 1].inicio, ultimo: lista[0].inicio } : null;
  });

  protected readonly vizinhos = computed(() => {
    const p = this.periodo();
    if (!p) return [null, null];
    const g = p.granularidade;
    const limites = this.limites();
    return ([-1, 1] as const).map((passo, i) => {
      const inicio = periodoVizinho(g, p.inicio, passo);
      if (limites && (inicio < limites.primeiro || inicio > limites.ultimo)) return null;
      return { link: linkPeriodo(g, inicio, this.secao()), rotulo: vizinhoPorExtenso[g][i] };
    });
  });

  protected readonly granularidades = granularidades;
  protected readonly ultimoCompleto = ultimoCompleto;
  protected readonly rotuloOpcao = rotuloOpcao;
  protected readonly linkGranularidade = linkGranularidade;

  protected escolher(inicio: string) {
    const g = this.granularidade();
    const destino = inicio ? linkPeriodo(g, inicio, this.secao()) : linkGranularidade(g, this.secao());
    void this.router.navigate(destino, { queryParamsHandling: this.consulta(), state: this.estado() });
  }
}
