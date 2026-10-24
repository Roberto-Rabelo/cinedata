import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import { Slide } from './slide';

interface ItemTop5 {
  posicao: number;
  titulo: string;
  origem: 'Nacional' | 'Estrangeira';
  publico: number;
  salas: number;
  /** Variação sobre a semana anterior; nulo quando estreia. */
  variacao: number | null;
  /** Rótulo no lugar da variação: estreia ou relançamento. */
  novidade?: string;
}

/**
 * Top 5 da semana de 08 a 14/10/2026, congelado na publicação de 22/10/2026 (a semana de 15/10 ainda
 * está parcial). Mesmos números do /api/v1/painel?data=2026-10-08; SQL em docs/posts/top5-2026-10-08/legenda.md.
 */
const semana = {
  inicio: '2026-10-08',
  fim: '2026-10-14',
  publico: 2_331_061,
  publicoAnterior: 2_174_028,
  obras: 155,
  salas: 3_425,
  top5: <ItemTop5[]>[
    { posicao: 1, titulo: 'Verity', origem: 'Estrangeira', publico: 622_946, salas: 1_228, variacao: -16.7 },
    { posicao: 2, titulo: 'Minha Melhor Amiga', origem: 'Nacional', publico: 299_571, salas: 843, variacao: -28.0 },
    { posicao: 3, titulo: 'Outra Mamãe', origem: 'Estrangeira', publico: 277_657, salas: 778, variacao: null, novidade: 'estreia' },
    { posicao: 4, titulo: 'Carros', origem: 'Estrangeira', publico: 225_814, salas: 787, variacao: null, novidade: 'relançamento' },
    // 51 ingressos de pré-estreia na semana anterior (< 5% do público atual): conta como estreia.
    { posicao: 5, titulo: 'Se Eu Fosse Você 3', origem: 'Nacional', publico: 185_253, salas: 1_042, variacao: null, novidade: 'estreia' },
  ],
};

const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (parte: number, todo: number) => Math.round((parte / todo) * 1000) / 10;

/** Post do Top 5 da semana (3 slides 1080×1350): capa com o nº 1, ranking e contexto. */
@Component({
  selector: 'cd-slides-top5',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Top 5 da semana · {{ periodo }}</h1>
        <p class="secundario">3 slides 1080×1350. PNGs em docs/posts/top5-2026-10-08.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa: o nº 1 -->
      <cd-slide [numero]="1" [total]="3">
        <span class="rotulo">Top 5 da semana · {{ periodo }}</span>
        <div class="capa">
          <p class="lugar">nº 1</p>
          <p class="filme">{{ primeiro.titulo }}</p>
          <p class="numero">{{ formatar.inteiro(primeiro.publico) }}</p>
          <p class="manchete">ingressos em {{ formatar.inteiro(primeiro.salas) }} salas: mais de 1 em cada 4 da semana.</p>
        </div>
        <p class="arraste">Arraste para o Top 5 →</p>
      </cd-slide>

      <!-- 2. Ranking -->
      <cd-slide [numero]="2" [total]="3">
        <span class="rotulo">Top 5 da semana · {{ periodo }}</span>
        <p class="manchete titulo-ranking">Os 5 filmes mais vistos</p>
        <ol class="ranking">
          @for (item of semana.top5; track item.posicao) {
            <li>
              <span class="pos">{{ item.posicao }}</span>
              <span class="titulo">{{ item.titulo }}</span>
              <span class="valor">{{ formatar.inteiro(item.publico) }}</span>
              <span class="barra" [style.width.%]="(item.publico / primeiro.publico) * 100" [style.background]="cor[item.origem]"></span>
              <span class="detalhe">
                <span class="ponto" [style.background]="cor[item.origem]"></span>{{ origem[item.origem] }}
                ·
                @if (item.variacao !== null) {
                  <span class="queda">▼</span> {{ formatar.decimal(-item.variacao) }}% sobre a semana anterior
                } @else {
                  <strong>{{ item.novidade }}</strong>
                }
              </span>
            </li>
          }
        </ol>
      </cd-slide>

      <!-- 3. Contexto -->
      <cd-slide [numero]="3" [total]="3">
        <span class="rotulo">A semana em números</span>
        <p class="numero total">{{ milhoes(semana.publico) }} mi</p>
        <p class="manchete pequena">de ingressos de 08 a 14/10, <span class="alta">▲</span> {{ formatar.decimal(altaSemana) }}% sobre a semana anterior.</p>
        <ul class="fatos">
          <li><strong>{{ formatar.decimal(fatiaTop5) }}%</strong><span>do público ficou com o Top&nbsp;5, entre {{ semana.obras }} filmes</span></li>
          <li><strong>2</strong><span>filmes nacionais no Top 5</span></li>
          <li><strong>3</strong><span>novidades: 2 estreias e a volta de Carros</span></li>
        </ul>
        <p class="pergunta">Qual desses você viu? Conta aqui.</p>
      </cd-slide>
    </div>
  `,
  styles: `
    /* 1 */
    .lugar { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6cqw; color: var(--cd-projetor); }
    .filme { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 17cqw; line-height: .95; letter-spacing: -0.045em; margin: 1cqw 0 5cqw; }
    .capa .numero { font-size: 13cqw; }
    .capa .manchete { font-size: 6cqw; font-weight: 600; color: var(--cd-tela-2); }

    /* 2 */
    .titulo-ranking { font-size: 7cqw; margin-top: 0; }
    .ranking { list-style: none; margin: 3cqw 0 0; padding: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-around; }
    .ranking li { display: grid; grid-template-columns: 7cqw 1fr auto; column-gap: 3cqw; row-gap: .8cqw; align-items: baseline; line-height: 1.2; }
    .pos { grid-row: span 3; align-self: center; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8cqw; color: var(--cd-projetor); }
    .titulo { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .valor { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; font-variant-numeric: tabular-nums; }
    .barra { grid-column: 2 / 4; height: 2.2cqw; border-radius: 0 .8cqw .8cqw 0; }
    .detalhe { grid-column: 2 / 4; font-size: 3cqw; color: var(--cd-tela-2); }
    .detalhe strong { color: var(--cd-tela); font-weight: 600; }
    .ponto { display: inline-block; width: 2cqw; height: 2cqw; border-radius: 50%; margin-right: 1.2cqw; vertical-align: -.1cqw; }
    .queda { color: var(--cd-queda); }
    .alta { color: var(--cd-alta); }

    /* 3 */
    .numero.total { font-size: 12cqw; }
    .fatos { list-style: none; padding: 0; margin: 4cqw 0 0; display: flex; flex-direction: column; gap: 2cqw; }
    .fatos li { display: grid; grid-template-columns: 22cqw 1fr; align-items: center; gap: 2cqw; padding: 2cqw 3.6cqw; line-height: 1.3; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .fatos strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; letter-spacing: -0.03em; line-height: 1; color: var(--cd-projetor); font-variant-numeric: tabular-nums; }
    .fatos span { font-size: 3.6cqw; color: var(--cd-tela-2); }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.4cqw; letter-spacing: -0.02em; }
  `,
})
export class SlidesTop5 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly semana = semana;
  protected readonly primeiro = semana.top5[0];
  protected readonly formatar = formatar;
  protected readonly cor = corOrigem;
  protected readonly origem = rotuloOrigem;
  protected readonly periodo = `${formatar.diaMes(semana.inicio).slice(0, 2)} a ${formatar.diaMes(semana.fim)}`;
  protected readonly milhoes = (n: number) => duasCasas.format(n / 1e6);
  protected readonly altaSemana = pct(semana.publico - semana.publicoAnterior, semana.publicoAnterior);
  protected readonly fatiaTop5 = pct(semana.top5.reduce((t, i) => t + i.publico, 0), semana.publico);
}
