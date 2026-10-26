import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { PontoCurva } from '../../core/api/modelos';
import { formatar } from '../formatar';

const L = 760, A = 260, M = { esq: 52, dir: 16, topo: 16, base: 28 };

/** Público diário de uma obra: linha de 2px, grade discreta, mira + dica ao passar o mouse. */
@Component({
  selector: 'cd-curva-linha',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grafico">
      <svg [attr.viewBox]="'0 0 ' + L + ' ' + A" role="img" [attr.aria-label]="descricao()"
           (mousemove)="mover($event)" (mouseleave)="indice.set(null)">
        @for (t of ticksY(); track t) {
          <line [attr.x1]="M.esq" [attr.x2]="L - M.dir" [attr.y1]="y(t)" [attr.y2]="y(t)" class="grade" />
          <text [attr.x]="M.esq - 8" [attr.y]="y(t) + 4" text-anchor="end" class="eixo">{{ formatar.compacto(t) }}</text>
        }
        @for (p of rotulosX(); track p.data) {
          <text [attr.x]="x(p.i)" [attr.y]="A - 8" text-anchor="middle" class="eixo">{{ formatar.diaMes(p.data) }}</text>
        }
        <path [attr.d]="area()" class="area" />
        <path [attr.d]="linha()" class="linha" />
        @if (linhaParcial()) {
          <path [attr.d]="linhaParcial()" class="linha linha--parcial" />
        }
        @if (pontoAtivo(); as p) {
          <line [attr.x1]="x(p.i)" [attr.x2]="x(p.i)" [attr.y1]="M.topo" [attr.y2]="A - M.base" class="mira" />
          <circle [attr.cx]="x(p.i)" [attr.cy]="y(p.ponto.publico)" r="5" class="marcador" />
        }
      </svg>
      @if (pontoAtivo(); as p) {
        <div class="dica cartao" [style.left.%]="(x(p.i) / L) * 100">
          <strong>{{ formatar.diaSemana(p.ponto.data) }}</strong>
          <span class="num">{{ formatar.inteiro(p.ponto.publico) }} espectadores</span>
          <span class="secundario num">{{ formatar.inteiro(p.ponto.sessoes) }} sessões em {{ formatar.inteiro(p.ponto.salas) }} salas</span>
          @if (p.ponto.parcial) { <span class="aviso-parcial">Dados parciais: exibidores ainda enviando</span> }
        </div>
      }
    </div>
    @if (linhaParcial()) {
      <p class="legenda-parcial secundario"><span class="traco"></span> Tracejado: dias ainda não consolidados pela ANCINE (dados chegando ou salas fechadas)</p>
    }
  `,
  styles: `
    .grafico { position: relative; }
    svg { width: 100%; height: auto; display: block; }
    .grade { stroke: var(--cd-linha); stroke-width: 1; }
    .eixo { fill: var(--cd-tela-3); font-size: 11px; font-family: var(--cd-fonte-texto); }
    .linha { fill: none; stroke: var(--cd-dado-ambar); stroke-width: 2; stroke-linejoin: round; }
    .area { fill: var(--cd-dado-ambar); opacity: .1; }
    .linha--parcial { stroke-dasharray: 5 5; opacity: .7; }
    .aviso-parcial { color: var(--cd-projetor); font-size: 12px; }
    .legenda-parcial { font-size: 12px; margin: 8px 0 0; display: flex; align-items: center; gap: 8px; }
    .traco { width: 24px; border-top: 2px dashed var(--cd-dado-ambar); }
    .mira { stroke: var(--cd-tela-3); stroke-dasharray: 3 3; }
    .marcador { fill: var(--cd-dado-ambar); stroke: var(--cd-poltrona); stroke-width: 2; }
    .dica { position: absolute; top: 0; transform: translateX(-50%); padding: 8px 12px; display: flex; flex-direction: column; font-size: 13px; pointer-events: none; white-space: nowrap; }
  `,
})
export class CurvaLinha {
  readonly pontos = input.required<PontoCurva[]>();
  protected readonly indice = signal<number | null>(null);
  protected readonly formatar = formatar;
  protected readonly L = L;
  protected readonly A = A;
  protected readonly M = M;

  private readonly maximo = computed(() => {
    const bruto = Math.max(1, ...this.pontos().map(p => p.publico));
    const passo = 10 ** Math.floor(Math.log10(bruto));
    return Math.ceil(bruto / passo) * passo;
  });

  protected readonly ticksY = computed(() => [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(this.maximo() * f)));

  protected readonly rotulosX = computed(() => {
    const n = this.pontos().length;
    const passo = Math.max(1, Math.ceil(n / 8));
    return this.pontos().map((p, i) => ({ data: p.data, i })).filter(p => p.i % passo === 0);
  });

  /**
   * Trechos da linha: um segmento é parcial se um dos dois dias ainda não foi consolidado. Dias parciais aparecem na
   * cauda (dados chegando) e também no meio do histórico (fechamentos da pandemia, ADR 0004).
   */
  private readonly trechos = computed(() => {
    const pontos = this.pontos();
    const trechos: { de: number; ate: number; parcial: boolean }[] = [];
    for (let i = 1; i < pontos.length; i++) {
      const parcial = pontos[i - 1].parcial || pontos[i].parcial;
      const ultimo = trechos[trechos.length - 1];
      if (ultimo?.parcial === parcial) ultimo.ate = i;
      else trechos.push({ de: i - 1, ate: i, parcial });
    }
    return trechos;
  });

  private caminho(de: number, ate: number) {
    return this.pontos()
      .slice(de, ate + 1)
      .map((p, k) => `${k ? 'L' : 'M'}${this.x(de + k)},${this.y(p.publico)}`)
      .join('');
  }

  private juntar(parcial: boolean) {
    return this.trechos()
      .filter(t => t.parcial === parcial)
      .map(t => this.caminho(t.de, t.ate))
      .join('');
  }

  protected readonly linha = computed(() => this.juntar(false));
  protected readonly linhaParcial = computed(() => this.juntar(true));

  protected readonly area = computed(() => {
    const n = this.pontos().length;
    if (n < 2) return '';
    return `${this.caminho(0, n - 1)}L${this.x(n - 1)},${this.y(0)}L${this.x(0)},${this.y(0)}Z`;
  });

  protected readonly pontoAtivo = computed(() => {
    const i = this.indice();
    return i === null ? null : { i, ponto: this.pontos()[i] };
  });

  protected x(i: number) {
    const n = Math.max(1, this.pontos().length - 1);
    return M.esq + (i / n) * (L - M.esq - M.dir);
  }

  protected y(v: number) {
    return A - M.base - (v / this.maximo()) * (A - M.topo - M.base);
  }

  protected mover(evento: MouseEvent) {
    const svg = evento.currentTarget as SVGSVGElement;
    const caixa = svg.getBoundingClientRect();
    const xSvg = ((evento.clientX - caixa.left) / caixa.width) * L;
    const n = this.pontos().length;
    if (!n) return;
    const i = Math.round(((xSvg - M.esq) / (L - M.esq - M.dir)) * (n - 1));
    this.indice.set(Math.min(n - 1, Math.max(0, i)));
  }

  protected descricao() {
    const p = this.pontos();
    const pico = p.reduce((a, b) => (b.publico > a.publico ? b : a), p[0]);
    return pico ? `Público diário; pico de ${formatar.inteiro(pico.publico)} em ${formatar.diaMes(pico.data)}` : 'Sem dados';
  }
}
