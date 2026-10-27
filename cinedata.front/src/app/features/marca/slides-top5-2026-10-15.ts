import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import { urlPoster } from '../../shared/ui/cartaz';
import { Slide } from './slide';

interface ItemTop5 {
  posicao: number;
  titulo: string;
  origem: 'Nacional' | 'Estrangeira';
  publico: number;
  salas: number;
  /** Posição na semana anterior; nula quando o filme estreou. */
  anterior: number | null;
  /** Variação sobre a semana anterior; nula na estreia. */
  variacao: number | null;
  poster: string;
}

/**
 * Top 5 da semana de 15 a 21/10/2026 (publicação da ANCINE com dados até 23/10; a semana tem os 7 dias
 * consolidados), comparado com a de 08 a 14/10. Mesmos números de dados/semana/2026-10-15.json e 2026-10-08.json;
 * conferência em docs/posts/top5-2026-10-15/legenda.md.
 */
const semana = {
  inicio: '2026-10-15',
  fim: '2026-10-21',
  publico: 1_493_026,
  publicoAnterior: 2_331_322,
  /** Público de 12/10/2026 (feriado e Dia das Crianças), o dia mais forte da semana anterior. */
  feriado: 593_139,
  obras: 139,
  nacionalPct: 19.8,
  nacionalAnteriorPct: 25.7,
  top5: <ItemTop5[]>[
    // Estreou em 15/10; os 19.141 ingressos da semana anterior são das pré-estreias de 13 e 14/10.
    { posicao: 1, titulo: 'Street Fighter', origem: 'Estrangeira', publico: 320_927, salas: 1_075, anterior: null, variacao: null, poster: '/6gWmrC2GyDbUM1ET5EBg9lxBi7S.jpg' },
    { posicao: 2, titulo: 'Verity', origem: 'Estrangeira', publico: 307_282, salas: 1_000, anterior: 1, variacao: -50.7, poster: '/6Qf3sylInJeyK0fFTfjprnGIXCF.jpg' },
    { posicao: 3, titulo: 'Minha Melhor Amiga', origem: 'Nacional', publico: 176_273, salas: 741, anterior: 2, variacao: -41.2, poster: '/wGfTFVeguXDXYrwPQ8QMFsaSK2M.jpg' },
    { posicao: 4, titulo: 'Outra Mamãe', origem: 'Estrangeira', publico: 151_749, salas: 665, anterior: 3, variacao: -45.4, poster: '/j6eXMsykSZnXJT20YTdsdS9PXPj.jpg' },
    { posicao: 5, titulo: 'Dentro da Baleia', origem: 'Estrangeira', publico: 87_468, salas: 598, anterior: null, variacao: null, poster: '/66fDoNVCtPrP6jIqMpV1sUEcciw.jpg' },
  ],
  /** Do Top 5 da semana anterior para fora dele. */
  sairam: [
    { titulo: 'Carros', de: 4, para: 7, variacao: -75.4, poster: '/A7nssMRIPauZhEVf2dzwsf4EALO.jpg' },
    { titulo: 'Se Eu Fosse Você 3', de: 5, para: 6, variacao: -56.8, poster: '/blMdOSGF1Q9cfHoWYzSkPtY91ts.jpg' },
  ],
  /** Acumulados até 21/10, desde a primeira sessão. */
  verity: { acumulado: 1_763_002, desde: '24/09', semana: 4 },
  amiga: { acumulado: 5_812_557, semana: 7 },
};

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (parte: number, todo: number) => Math.round((parte / todo) * 1000) / 10;

/**
 * Post do Top 5 da semana de 15 a 21/10 (6 slides 1080×1350), com os pôsteres como apoio visual e paralelos com a
 * semana anterior: capa do nº 1, a troca no topo, ranking com a posição anterior, o que mudou, a semana em números
 * e a pergunta.
 */
@Component({
  selector: 'cd-slides-top5-2026-10-15',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Top 5 da semana · {{ periodo }}</h1>
        <p class="secundario">6 slides 1080×1350, com os pôsteres (TMDB) e a comparação com a semana anterior.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa: o nº 1 -->
      <cd-slide [numero]="1" [total]="6" credito="Pôster: TMDB">
        <span class="rotulo">Top 5 da semana · {{ periodo }}</span>
        <div class="capa-n1">
          <div class="cartaz-luz">
            <img class="borrado" [src]="poster(primeiro.poster)" alt="" />
            <img class="nitido" [src]="poster(primeiro.poster)" alt="" />
          </div>
          <div>
            <p class="lugar">nº 1</p>
            <p class="filme">{{ primeiro.titulo }}</p>
            <p class="numero">{{ formatar.inteiro(primeiro.publico) }}</p>
            <p class="sub">ingressos em {{ formatar.inteiro(primeiro.salas) }} salas</p>
          </div>
        </div>
        <p class="manchete">Estreou e tirou Verity do topo por <span class="destaque">{{ formatar.inteiro(diferenca) }}</span> ingressos.</p>
        <p class="arraste">Arraste →</p>
      </cd-slide>

      <!-- 2. A troca no topo -->
      <cd-slide [numero]="2" [total]="6" credito="Pôsteres: TMDB">
        <span class="rotulo">A troca no topo</span>
        <p class="manchete duelo-titulo">{{ formatar.inteiro(diferenca) }} ingressos separaram o 1º do 2º</p>
        <div class="duelo">
          @for (item of [primeiro, segundo]; track item.posicao) {
            <div class="lado">
              <img class="cartaz" [src]="poster(item.poster)" alt="" />
              <p class="troca">{{ item.anterior ? item.anterior + 'º' : 'estreia' }} → <strong>{{ item.posicao }}º</strong></p>
              <p class="nome">{{ item.titulo }}</p>
              <p class="valor">{{ formatar.inteiro(item.publico) }}</p>
              <span class="barra" [style.width.%]="(item.publico / primeiro.publico) * 100" [style.background]="cor[item.origem]"></span>
            </div>
          }
        </div>
        <p class="texto rodape-texto">
          Verity caiu {{ formatar.decimal(-segundo.variacao!) }}% na {{ semana.verity.semana }}ª semana, mas já soma
          {{ duasCasas.format(semana.verity.acumulado / 1e6) }} milhão desde {{ semana.verity.desde }}.
        </p>
      </cd-slide>

      <!-- 3. Ranking com a posição da semana anterior -->
      <cd-slide [numero]="3" [total]="6" credito="Pôsteres: TMDB">
        <span class="rotulo">Top 5 da semana · {{ periodo }}</span>
        <ol class="ranking">
          @for (item of semana.top5; track item.posicao) {
            <li>
              <span class="pos">{{ item.posicao }}</span>
              <img class="mini" [src]="poster(item.poster)" alt="" />
              <span class="titulo">{{ item.titulo }}</span>
              <span class="valor">{{ formatar.inteiro(item.publico) }}</span>
              <span class="barra" [style.width.%]="(item.publico / primeiro.publico) * 100" [style.background]="cor[item.origem]"></span>
              <span class="detalhe">
                <span class="ponto" [style.background]="cor[item.origem]"></span>{{ origem[item.origem] }} ·
                @if (item.anterior) {
                  era {{ item.anterior }}º · <span class="queda">▼</span> {{ formatar.decimal(-item.variacao!) }}%
                } @else {
                  <strong>estreia</strong>
                }
              </span>
            </li>
          }
        </ol>
      </cd-slide>

      <!-- 4. O que mudou desde a semana passada -->
      <cd-slide [numero]="4" [total]="6" credito="Pôsteres: TMDB">
        <span class="rotulo">Comparando com a semana passada</span>
        <ul class="mudancas">
          <li>
            <img class="medio" [src]="poster(terceiro.poster)" alt="" />
            <div>
              <strong>{{ duasCasas.format(semana.amiga.acumulado / 1e6) }} milhões</strong>
              <span>Minha Melhor Amiga, na {{ semana.amiga.semana }}ª semana, é o único nacional do Top 5: caiu de 2º para 3º e segue somando.</span>
            </div>
          </li>
          <li>
            <img class="medio" [src]="poster(quinto.poster)" alt="" />
            <div>
              <strong>Estreia em 5º</strong>
              <span>Dentro da Baleia entrou com {{ formatar.inteiro(quinto.publico) }} ingressos em {{ quinto.salas }} salas.</span>
            </div>
          </li>
          <li>
            <span class="dupla">
              @for (f of semana.sairam; track f.titulo) { <img class="medio" [src]="poster(f.poster)" alt="" /> }
            </span>
            <div>
              <strong>Saíram do Top 5</strong>
              <span>
                @for (f of semana.sairam; track f.titulo; let ultimo = $last) {
                  {{ f.titulo }} ({{ f.de }}º → {{ f.para }}º, <span class="queda">▼</span> {{ arredondado(-f.variacao) }}%){{ ultimo ? '.' : ' e' }}
                }
              </span>
            </div>
          </li>
        </ul>
      </cd-slide>

      <!-- 5. A semana em números -->
      <cd-slide [numero]="5" [total]="6">
        <span class="rotulo">A semana em números</span>
        <p class="numero total">{{ duasCasas.format(semana.publico / 1e6) }} mi</p>
        <p class="manchete pequena">de ingressos de {{ periodo }}, <span class="queda">▼</span> {{ formatar.decimal(-variacaoSemana) }}% sobre a semana anterior.</p>
        <p class="texto contexto">
          A semana anterior teve o feriado de 12/10, Dia das Crianças: só nesse dia foram
          {{ formatar.inteiro(Math.round(semana.feriado / 1000)) }} mil ingressos.
        </p>
        <ul class="fatos">
          <li><strong>{{ formatar.decimal(fatiaTop5) }}%</strong><span>do público ficou com o Top&nbsp;5, entre {{ semana.obras }} filmes</span></li>
          <li><strong>{{ formatar.decimal(semana.nacionalPct) }}%</strong><span>dos ingressos foram para filmes nacionais ({{ formatar.decimal(semana.nacionalAnteriorPct) }}% na semana anterior)</span></li>
        </ul>
      </cd-slide>

      <!-- 6. Pergunta -->
      <cd-slide [numero]="6" [total]="6" credito="Pôsteres: TMDB">
        <span class="rotulo">Top 5 da semana · {{ periodo }}</span>
        <div class="leque">
          @for (item of semana.top5; track item.posicao; let i = $index) {
            <img [src]="poster(item.poster)" alt="" [style.--i]="i - 2" />
          }
        </div>
        <p class="pergunta">Qual desses você viu?</p>
        <p class="texto chamada">Conta aqui nos comentários. O Top 10 completo e o filme mais visto em cada estado estão em <strong>cinedatabr.tech</strong>.</p>
      </cd-slide>
    </div>
  `,
  styles: `
    img { display: block; object-fit: cover; aspect-ratio: 2 / 3; border-radius: 1.4cqw; box-shadow: 0 0 0 .2cqw var(--cd-linha), 0 2cqw 5cqw rgb(0 0 0 / .5); }
    .queda { color: var(--cd-queda); }

    /* 1 */
    .capa-n1 { flex: 1; display: grid; grid-template-columns: 37cqw 1fr; gap: 5cqw; align-items: end; }
    .cartaz-luz { position: relative; }
    .cartaz-luz .borrado { position: absolute; inset: -6%; width: 112%; filter: blur(7cqw) saturate(1.5); opacity: .55; box-shadow: none; }
    .cartaz-luz .nitido { position: relative; width: 100%; }
    .lugar { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6cqw; color: var(--cd-projetor); }
    .filme { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 9.6cqw; line-height: .95; letter-spacing: -0.045em; margin: 1cqw 0 4cqw; }
    .capa-n1 .numero { font-size: 8.6cqw; }
    .sub { font-size: 3.8cqw; color: var(--cd-tela-2); margin-top: 1.4cqw; }
    .capa-n1 + .manchete { font-size: 6.4cqw; margin-top: 4cqw; }

    /* 2 */
    .duelo-titulo { font-size: 7cqw; margin-top: 0; }
    .duelo { display: grid; grid-template-columns: 1fr 1fr; gap: 6cqw; margin-top: 3cqw; }
    .lado .cartaz { width: 18cqw; }
    .troca { margin-top: 2.6cqw; font-size: 3.4cqw; line-height: 1.2; color: var(--cd-tela-2); }
    .troca strong { color: var(--cd-projetor); font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4.6cqw; }
    .nome { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 5.6cqw; letter-spacing: -0.03em; line-height: 1.05; margin-top: .8cqw; }
    .lado .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; line-height: 1.1; letter-spacing: -0.03em; color: var(--cd-projetor); font-variant-numeric: tabular-nums; }
    .lado .barra { display: block; height: 1.6cqw; margin-top: 1.4cqw; border-radius: 0 .8cqw .8cqw 0; }
    .rodape-texto { margin-top: auto; }

    /* 3 */
    .ranking { list-style: none; margin: 1cqw 0 0; padding: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .ranking li { display: grid; grid-template-columns: 6cqw 10cqw 1fr auto; column-gap: 2.6cqw; row-gap: .8cqw; align-items: center; line-height: 1.2; }
    .pos { grid-row: span 3; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7.4cqw; color: var(--cd-projetor); }
    .mini { grid-row: span 3; width: 10cqw; border-radius: 1cqw; }
    .titulo { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.6cqw; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ranking .valor { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.6cqw; font-variant-numeric: tabular-nums; }
    .ranking .barra { grid-column: 3 / 5; height: 2cqw; border-radius: 0 .8cqw .8cqw 0; }
    .detalhe { grid-column: 3 / 5; font-size: 3cqw; color: var(--cd-tela-2); }
    .detalhe strong { color: var(--cd-tela); font-weight: 600; }
    .ponto { display: inline-block; width: 2cqw; height: 2cqw; border-radius: 50%; margin-right: 1.2cqw; vertical-align: -.1cqw; }

    /* 4 */
    .mudancas { list-style: none; padding: 0; margin: 1cqw 0 0; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 2.4cqw; }
    .mudancas li { display: grid; grid-template-columns: auto 1fr; gap: 4cqw; align-items: center; padding: 2.4cqw; border-radius: 3cqw;
                   background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .medio { width: 13cqw; }
    .dupla { display: flex; }
    .dupla .medio { width: 11cqw; }
    .dupla .medio + .medio { margin-left: -4cqw; transform: rotate(5deg); }
    .dupla .medio:first-child { transform: rotate(-4deg); }
    .mudancas strong { display: block; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6.4cqw; letter-spacing: -0.03em; line-height: 1.05; color: var(--cd-projetor); }
    .mudancas span:not(.queda):not(.dupla) { display: block; margin-top: 1.2cqw; font-size: 3.6cqw; line-height: 1.35; color: var(--cd-tela-2); }
    .mudancas span span { display: inline !important; margin: 0 !important; }

    /* 5 */
    .numero.total { font-size: 13cqw; }
    .contexto { margin-top: 3cqw; }
    .fatos { list-style: none; padding: 0; margin: auto 0 0; display: flex; flex-direction: column; gap: 2cqw; }
    .fatos li { display: grid; grid-template-columns: 22cqw 1fr; align-items: center; gap: 2cqw; padding: 2.2cqw 3.6cqw; line-height: 1.3; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .fatos strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; letter-spacing: -0.03em; line-height: 1; color: var(--cd-projetor); font-variant-numeric: tabular-nums; }
    .fatos span { font-size: 3.6cqw; color: var(--cd-tela-2); }

    /* 6 */
    .leque { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; margin-bottom: 5cqw; }
    .leque img { position: absolute; width: 24cqw; transform: translateX(calc(var(--i) * 13.5cqw)) translateY(calc(var(--i) * var(--i) * 1.2cqw)) rotate(calc(var(--i) * 6deg)); }
    .leque img:nth-child(1) { z-index: 1; } .leque img:nth-child(2) { z-index: 2; } .leque img:nth-child(3) { z-index: 3; }
    .leque img:nth-child(4) { z-index: 2; } .leque img:nth-child(5) { z-index: 1; }
    .pergunta { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8cqw; letter-spacing: -0.035em; line-height: 1; }
    .chamada { margin-top: 2.4cqw; }
    .chamada strong { color: var(--cd-tela); }
  `,
})
export class SlidesTop5Semana1015 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly semana = semana;
  protected readonly primeiro = semana.top5[0];
  protected readonly segundo = semana.top5[1];
  protected readonly terceiro = semana.top5[2];
  protected readonly quinto = semana.top5[4];
  protected readonly diferenca = semana.top5[0].publico - semana.top5[1].publico;
  protected readonly formatar = formatar;
  protected readonly cor = corOrigem;
  protected readonly origem = rotuloOrigem;
  protected readonly umaCasa = umaCasa;
  protected readonly duasCasas = duasCasas;
  protected readonly Math = Math;
  protected readonly periodo = `${formatar.diaMes(semana.inicio).slice(0, 2)} a ${formatar.diaMes(semana.fim)}`;
  protected readonly variacaoSemana = pct(semana.publico - semana.publicoAnterior, semana.publicoAnterior);
  protected readonly fatiaTop5 = pct(semana.top5.reduce((t, i) => t + i.publico, 0), semana.publico);
  protected readonly arredondado = (n: number) => Math.round(n);
  /** Pôster grande o bastante para o PNG de 1080 px (o w342 do site ficaria borrado). */
  protected readonly poster = (caminho: string) => urlPoster(caminho, 'w780');
}
