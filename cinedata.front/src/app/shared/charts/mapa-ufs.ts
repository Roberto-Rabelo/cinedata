import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Uf } from '../../core/api/modelos';
import { formatar } from '../formatar';

// Cartograma em grade: cada UF ocupa um quadrado na posição aproximada do mapa (coluna, linha).
const GRADE: Record<string, [number, number]> = {
  RR: [2, 1], AP: [4, 1],
  AM: [2, 2], PA: [3, 2], MA: [4, 2], CE: [5, 2], RN: [6, 2],
  AC: [1, 3], RO: [2, 3], TO: [3, 3], PI: [4, 3], PE: [5, 3], PB: [6, 3],
  MT: [2, 4], GO: [3, 4], BA: [4, 4], SE: [5, 4], AL: [6, 4],
  MS: [2, 5], DF: [3, 5], MG: [4, 5], ES: [5, 5],
  PR: [2, 6], SP: [3, 6], RJ: [4, 6],
  SC: [2, 7],
  RS: [2, 8],
};

/** Público por UF em escala sequencial de um só tom (âmbar), com detalhe da UF em foco. */
@Component({
  selector: 'cd-mapa-ufs',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mapa">
      <div class="grade" role="list" aria-label="Público por estado">
        @for (uf of ufsOrdenadas(); track uf.uf) {
          <button
            type="button"
            role="listitem"
            class="tile"
            [class.ativa]="foco()?.uf === uf.uf"
            [class.intensa]="+intensidade(uf) > 0.6"
            [style.grid-column]="posicao(uf.uf)[0]"
            [style.grid-row]="posicao(uf.uf)[1]"
            [style.--intensidade]="intensidade(uf)"
            [attr.aria-label]="uf.uf + ': ' + formatar.inteiro(uf.publico) + ' espectadores'"
            (mouseenter)="selecionada.set(uf.uf)"
            (focus)="selecionada.set(uf.uf)"
            (click)="selecionada.set(uf.uf)"
          >
            <span class="sigla">{{ uf.uf }}</span>
            <span class="num">{{ formatar.compacto(uf.publico) }}</span>
          </button>
        }
      </div>
      <div class="lado">
        @if (foco(); as uf) {
          <span class="rotulo">{{ uf.uf }} · {{ uf.regiao }}</span>
          <strong class="grande num">{{ formatar.inteiro(uf.publico) }}</strong>
          <span class="secundario">espectadores em {{ formatar.inteiro(uf.sessoes) }} sessões</span>
          @if (uf.liderTitulo) {
            <span class="rotulo topo">Filme mais visto</span>
            <a class="lider" [routerLink]="['/obras', uf.liderCodigo]">{{ uf.liderTitulo }}</a>
            <span class="secundario num">{{ formatar.inteiro(uf.liderPublico) }} espectadores</span>
          }
          @if (uf.dubladoPctEstrangeiros !== null) {
            <span class="rotulo topo">Estrangeiros assistidos dublados</span>
            <strong class="num">{{ formatar.pct(uf.dubladoPctEstrangeiros) }}</strong>
          }
        }
        <div class="escala" aria-hidden="true">
          <span class="secundario">menos público</span>
          <span class="gradiente"></span>
          <span class="secundario">mais</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .mapa { display: grid; grid-template-columns: minmax(0, 360px) 1fr; gap: 24px; align-items: start; }
    .grade { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 1fr; gap: 4px; }
    .tile {
      aspect-ratio: 1; border: 0; border-radius: 6px; cursor: pointer; padding: 2px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0;
      color: var(--cd-tela); font: inherit; font-size: 10.5px;
      background: color-mix(in oklab, var(--cd-projetor) calc(var(--intensidade) * 100%), var(--cd-poltrona-2));
    }
    .tile .sigla { font-weight: 700; font-size: 12.5px; }
    .tile.intensa { color: var(--cd-sala); }
    .tile.ativa { outline: 2px solid var(--cd-tela); outline-offset: 1px; }
    .lado { display: flex; flex-direction: column; gap: 4px; }
    .grande { font-family: var(--cd-fonte-display); font-size: 30px; font-weight: 700; }
    .topo { margin-top: 14px; }
    .lider { font-weight: 600; text-decoration: underline; text-decoration-color: var(--cd-linha); text-underline-offset: 3px; }
    .escala { display: flex; align-items: center; gap: 8px; margin-top: 20px; font-size: 12px; }
    .gradiente { flex: 0 0 120px; height: 8px; border-radius: 4px; background: linear-gradient(90deg, color-mix(in oklab, var(--cd-projetor) 8%, var(--cd-poltrona-2)), var(--cd-projetor)); }
    @media (max-width: 720px) { .mapa { grid-template-columns: 1fr; } }
  `,
})
export class MapaUfs {
  readonly ufs = input.required<Uf[]>();
  protected readonly selecionada = signal<string | null>(null);
  protected readonly formatar = formatar;

  protected readonly ufsOrdenadas = computed(() => this.ufs().filter(u => GRADE[u.uf]));
  private readonly maximo = computed(() => Math.max(1, ...this.ufs().map(u => u.publico)));
  protected readonly foco = computed(() =>
    this.ufs().find(u => u.uf === this.selecionada()) ?? this.ufs()[0] ?? null,
  );

  protected posicao(uf: string) {
    const [coluna, linha] = GRADE[uf];
    return [coluna, linha] as const;
  }

  // Raiz quadrada: SP concentra muito público; a escala linear apagaria o Norte e o Nordeste.
  protected intensidade(uf: Uf) {
    return (0.08 + 0.92 * Math.sqrt(uf.publico / this.maximo())).toFixed(3);
  }
}
