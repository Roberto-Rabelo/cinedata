import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PontoCurva } from '../../core/api/modelos';
import { formatar } from '../formatar';

interface Dia {
  data: string;
  publico: number;
  parcial: boolean;
}

const diaDaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' });
const mesCurto = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' });
const L = 600, A = 120;

/**
 * Público diário de um filme dentro de um período: barras até um mês (cada dia legível), área acima disso.
 * Uma série, uma cor (âmbar de dado); dias sem sessão contam como zero; dias parciais ficam apagados.
 */
@Component({
  selector: 'cd-barras-dia',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dias().length <= 31) {
      <div class="barras" role="img" [attr.aria-label]="descricao()">
        @for (d of dias(); track d.data) {
          <div class="coluna" [class.parcial]="d.parcial" [class.pico]="d === pico()">
            <span class="barra" [style.height.%]="altura(d)" [attr.title]="formatar.diaSemana(d.data) + ': ' + formatar.inteiro(d.publico)"></span>
            <span class="eixo" aria-hidden="true">{{ rotulo(d, $index) }}</span>
          </div>
        }
      </div>
    } @else {
      <svg [attr.viewBox]="'0 0 ' + L + ' ' + A" preserveAspectRatio="none" role="img" [attr.aria-label]="descricao()">
        <path [attr.d]="area()" class="area" />
        <path [attr.d]="linha()" class="linha" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="extremos eixo" aria-hidden="true">
        <span>{{ mes(dias()[0].data) }}</span><span>{{ mes(dias()[dias().length - 1].data) }}</span>
      </div>
    }
    @if (pico(); as p) {
      <p class="nota secundario num">
        Pico: <strong>{{ formatar.inteiro(p.publico) }}</strong> em {{ formatar.diaSemana(p.data) }}
        @if (temParcial()) { · barras apagadas: dias ainda não consolidados }
      </p>
    }
  `,
  styles: `
    :host { display: block; }
    .barras { display: flex; align-items: stretch; gap: 3px; height: 132px; }
    .coluna { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 6px; min-width: 0; }
    .barra { width: 100%; max-width: 44px; min-height: 2px; background: var(--cd-dado-ambar); border-radius: 3px 3px 0 0; opacity: .78; }
    .pico .barra { opacity: 1; }
    .parcial .barra { opacity: .3; }
    .eixo { color: var(--cd-tela-3); font-size: 11px; line-height: 1; height: 11px; white-space: nowrap; }
    svg { width: 100%; height: 120px; display: block; }
    .linha { fill: none; stroke: var(--cd-dado-ambar); stroke-width: 2; }
    .area { fill: var(--cd-dado-ambar); opacity: .16; }
    .extremos { display: flex; justify-content: space-between; margin-top: 6px; }
    .nota { font-size: 12.5px; margin: 10px 0 0; }
    .nota strong { color: var(--cd-tela); font-weight: 600; }
  `,
})
export class BarrasDia {
  readonly pontos = input.required<PontoCurva[]>();
  readonly inicio = input.required<string>();
  readonly fim = input.required<string>();
  protected readonly formatar = formatar;
  protected readonly L = L;
  protected readonly A = A;

  /** Todos os dias do período, com zero onde o filme não teve sessão. */
  protected readonly dias = computed<Dia[]>(() => {
    const porData = new Map(this.pontos().map(p => [p.data, p]));
    const dias: Dia[] = [];
    for (let d = new Date(`${this.inicio()}T00:00:00Z`); d.toISOString().slice(0, 10) <= this.fim(); d.setUTCDate(d.getUTCDate() + 1)) {
      const data = d.toISOString().slice(0, 10);
      const ponto = porData.get(data);
      dias.push({ data, publico: ponto?.publico ?? 0, parcial: ponto?.parcial ?? false });
    }
    // O fim do ano ou do semestre corrente ainda não aconteceu: corta depois do último dia com público.
    let ultimo = dias.length - 1;
    while (ultimo > 0 && dias[ultimo].publico === 0) ultimo--;
    return dias.length > 31 ? dias.slice(0, ultimo + 1) : dias;
  });

  private readonly maximo = computed(() => Math.max(1, ...this.dias().map(d => d.publico)));
  protected readonly pico = computed(() => this.dias().reduce<Dia | null>((a, d) => (!a || d.publico > a.publico ? d : a), null));
  protected readonly temParcial = computed(() => this.dias().some(d => d.parcial && d.publico > 0));

  protected altura(d: Dia) {
    return (100 * d.publico) / this.maximo();
  }

  /** Semana: o dia da semana. Mês: 1, 8, 15, 22, 29. */
  protected rotulo(d: Dia, i: number) {
    if (this.dias().length <= 7) return diaDaSemana.format(new Date(`${d.data}T00:00:00Z`)).replace('.', '');
    const diaDoMes = Number(d.data.slice(8));
    return i === 0 || diaDoMes % 7 === 1 ? String(diaDoMes) : '';
  }

  protected mes(data: string) {
    return `${mesCurto.format(new Date(`${data}T00:00:00Z`)).replace('.', '')}/${data.slice(2, 4)}`;
  }

  private pontoXY(i: number, publico: number) {
    const n = Math.max(1, this.dias().length - 1);
    return `${(i / n) * L},${A - (publico / this.maximo()) * (A - 4)}`;
  }

  protected readonly linha = computed(() => this.dias().map((d, i) => `${i ? 'L' : 'M'}${this.pontoXY(i, d.publico)}`).join(''));
  protected readonly area = computed(() => `${this.linha()}L${L},${A}L0,${A}Z`);

  protected descricao() {
    const p = this.pico();
    return p ? `Público por dia; pico de ${formatar.inteiro(p.publico)} em ${formatar.diaMes(p.data)}` : 'Sem sessões no período';
  }
}
