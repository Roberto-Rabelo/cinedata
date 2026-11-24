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
  /** Texto no lugar de "estreia" (pré-estreia, relançamento). */
  rotulo?: string;
  poster: string;
}

/**
 * Top 5 da semana de 12 a 18/11/2026 (publicação da ANCINE de 23/11, com dados até 22/11), comparado com a de 05 a
 * 11/11. Mesmos números de dados/semana/2026-11-12.json e 2026-11-05.json; o dia da pré-estreia de Jogos Vorazes e a
 * régua da saga no banco. Conferência em docs/posts/top5-2026-11-12/legenda.md.
 */
const semana = {
  inicio: '2026-11-12',
  fim: '2026-11-18',
  publico: 1_162_875,
  publicoAnterior: 1_362_251,
  /** O melhor dia: o sábado, 14/11. */
  sabado: 295_030,
  /** Quarta, 18/11: o dia da pré-estreia de Jogos Vorazes. */
  quarta: 208_380,
  obras: 132,
  nacionalPct: 28.3,
  nacionalAnteriorPct: 39.7,
  farofeirosNoNacional: 77,
  top5: <ItemTop5[]>[
    { posicao: 1, titulo: 'Os Farofeiros 3', origem: 'Nacional', publico: 253_712, salas: 1_142, anterior: 1, variacao: -35.0, poster: '/8VINm6QWFqh2GgNQxIb9scxxe9w.jpg' },
    // Todos os ingressos da semana saíram na quarta, 18/11 (pré-estreia); a estreia em circuito é na semana de 19/11.
    { posicao: 2, titulo: 'Jogos Vorazes: Amanhecer na Colheita', origem: 'Estrangeira', publico: 144_211, salas: 1_416, anterior: null, variacao: null, rotulo: 'pré-estreia (1 dia)', poster: '/ibZ6GSHtCeC7fLDJ2uyXNemgYwr.jpg' },
    { posicao: 3, titulo: 'Ebenezer e os Fantasmas do Natal', origem: 'Estrangeira', publico: 126_750, salas: 827, anterior: null, variacao: null, poster: '/7MBeM27NNcCYUszjTNYJUycPDhV.jpg' },
    { posicao: 4, titulo: 'Godzilla Minus Zero', origem: 'Estrangeira', publico: 86_825, salas: 640, anterior: 2, variacao: -49.0, poster: '/ebVZ8n64rtHsSItTei4EgTKzPVu.jpg' },
    // O filme de 2001, de volta às salas.
    { posicao: 5, titulo: 'Velozes e Furiosos', origem: 'Estrangeira', publico: 86_131, salas: 723, anterior: null, variacao: null, rotulo: 'relançamento', poster: '/rKaaYM4CtuJZFdOA0SZWbaMNHbn.jpg' },
  ],
  /** A régua do slide 2: o dia de Jogos Vorazes contra a semana inteira de estreia do filme anterior da saga. */
  regua: [
    { titulo: 'A Cantiga…', ano: 2023, detalhe: '1ª semana inteira', publico: 250_300 },
    { titulo: 'Amanhecer na Colheita', ano: 2026, detalhe: 'pré-estreia, 1 dia', publico: 144_211 },
    { titulo: 'Os Farofeiros 3', ano: 2026, detalhe: 'o 2º do mesmo dia, 18/11', publico: 15_344 },
  ],
  sairam: [
    { titulo: 'O Gatola', de: 3, para: 6, poster: '/sAUr79TPVXMmZrpsqGh6xTH9jy6.jpg' },
    { titulo: 'O Bosque', de: 4, para: 8, poster: '/mcuUYNWGJHPEaRumOlgSZCzMRPc.jpg' },
    { titulo: 'Cara-de-Barro', de: 5, para: 10, poster: '/dqvHs2YXks989ScXvsngbqAeBHX.jpg' },
  ],
  farofeiros: { acumulado: 644_429 },
};

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (parte: number, todo: number) => Math.round((parte / todo) * 1000) / 10;

/**
 * Post do Top 5 da semana de 12 a 18/11 (6 slides 1080×1350), com os pôsteres como apoio visual: capa do nº 1, o dia
 * de pré-estreia de Jogos Vorazes, ranking com a posição anterior, o que mudou, a semana em números e a pergunta.
 */
@Component({
  selector: 'cd-slides-top5-2026-11-12',
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
            <p class="sub">ingressos em {{ formatar.inteiro(primeiro.salas) }}&nbsp;salas</p>
          </div>
        </div>
        <p class="manchete">Segue no topo na <span class="destaque">2ª semana</span> e já soma {{ formatar.inteiro(Math.round(semana.farofeiros.acumulado / 1000)) }}&nbsp;mil.</p>
        <p class="arraste">Arraste →</p>
      </cd-slide>

      <!-- 2. A troca no topo -->
      <cd-slide [numero]="2" [total]="6" credito="Pôsteres: TMDB">
        <span class="rotulo">Jogos Vorazes</span>
        <p class="manchete duelo-titulo">{{ formatar.inteiro(semana.regua[1].publico) }} ingressos num só dia.</p>
        <ol class="franquia">
          @for (f of semana.regua; track f.titulo; let i = $index) {
            <li [class.atual]="i === 1">
              <span class="nome">{{ f.titulo }}<small>{{ f.ano }} · {{ f.detalhe }}</small></span>
              <span class="valor">{{ formatar.inteiro(f.publico) }}</span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / semana.regua[0].publico) * 100"></span></span>
            </li>
          }
        </ol>
        <p class="texto rodape-texto">
          Na quarta, 18/11, levou {{ fatiaQuarta }}% de todos os ingressos do dia, em 1.416 salas.
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
              <span class="titulo" [class.longo]="item.titulo.length > 22">{{ item.titulo }}</span>
              <span class="valor">{{ formatar.inteiro(item.publico) }}</span>
              <span class="barra" [style.width.%]="(item.publico / primeiro.publico) * 100" [style.background]="cor[item.origem]"></span>
              <span class="detalhe">
                <span class="ponto" [style.background]="cor[item.origem]"></span>{{ origem[item.origem] }} ·
                @if (item.anterior && item.variacao! > 0) {
                  era {{ item.anterior }}º · <span class="alta">▲</span> {{ formatar.decimal(item.variacao!) }}%
                } @else if (item.anterior) {
                  era {{ item.anterior }}º · <span class="queda">▼</span> {{ formatar.decimal(-item.variacao!) }}%
                } @else {
                  <strong>{{ item.rotulo ?? 'estreia' }}</strong>
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
              <strong>Ebenezer estreia em 3º</strong>
              <span>{{ formatar.inteiro(terceiro.publico) }} ingressos.</span>
            </div>
          </li>
          <li>
            <img class="medio" [src]="poster(quinto.poster)" alt="" />
            <div>
              <strong>Velozes de volta</strong>
              <span>O filme de 2001 voltou às salas 25 anos depois e entrou em 5º.</span>
            </div>
          </li>
          <li>
            <span class="dupla">
              @for (f of semana.sairam.slice(0, 2); track f.titulo) { <img class="medio" [src]="poster(f.poster)" alt="" /> }
            </span>
            <div>
              <strong>Saíram do Top 5</strong>
              <span>
                @for (f of semana.sairam; track f.titulo; let ultimo = $last) {
                  {{ f.titulo }} ({{ f.de }}º → {{ f.para }}º){{ ultimo ? '.' : ',' }}
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
          O melhor dia foi o sábado, 14/11 ({{ formatar.inteiro(Math.round(semana.sabado / 1000)) }}&nbsp;mil). A quarta, 18/11,
          teve {{ formatar.inteiro(Math.round(semana.quarta / 1000)) }}&nbsp;mil, mais que a sexta, por causa de Jogos&nbsp;Vorazes.
        </p>
        <ul class="fatos">
          <li><strong>{{ formatar.decimal(fatiaTop5) }}%</strong><span>do público ficou com o Top&nbsp;5, entre {{ semana.obras }} filmes</span></li>
          <li><strong>{{ formatar.decimal(semana.nacionalPct) }}%</strong><span>foram para filmes nacionais ({{ formatar.decimal(semana.nacionalAnteriorPct) }}% antes); Os Farofeiros 3 fez {{ semana.farofeirosNoNacional }}% disso</span></li>
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
    .alta { color: var(--cd-alta); }

    /* 1 */
    .capa-n1 { flex: 1; display: grid; grid-template-columns: 37cqw 1fr; gap: 5cqw; align-items: end; }
    .cartaz-luz { position: relative; }
    .cartaz-luz .borrado { position: absolute; inset: -6%; width: 112%; filter: blur(7cqw) saturate(1.5); opacity: .55; box-shadow: none; }
    .cartaz-luz .nitido { position: relative; width: 100%; }
    .lugar { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6cqw; color: var(--cd-projetor); }
    .filme { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8.4cqw; line-height: .95; letter-spacing: -0.045em; margin: 1cqw 0 4cqw; }
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
    /* Nome em uma ou duas linhas: reserva as duas para as barras ficarem na mesma altura. */
    .lado .nome { min-height: 2.1em; display: flex; align-items: flex-end; }
    .lado .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; line-height: 1.1; letter-spacing: -0.03em; color: var(--cd-projetor); font-variant-numeric: tabular-nums; }
    .lado .barra { display: block; height: 1.6cqw; margin-top: 1.4cqw; border-radius: 0 .8cqw .8cqw 0; }
    .rodape-texto { margin-top: auto; }
    .franquia { list-style: none; margin: 3cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 3cqw; }
    .franquia li { display: grid; grid-template-columns: 1fr auto; row-gap: 1.4cqw; align-items: baseline; }
    .franquia .nome { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 5.4cqw; letter-spacing: -0.03em; }
    .franquia .nome small { display: block; font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3.2cqw; letter-spacing: 0; color: var(--cd-tela-3); margin-top: .6cqw; }
    .franquia .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6.4cqw; font-variant-numeric: tabular-nums; }
    .franquia .trilho { grid-column: 1 / -1; display: block; }
    .franquia .barra { display: block; height: 3cqw; border-radius: 0 1cqw 1cqw 0; background: var(--cd-dado-neutro); }
    .franquia li.atual .barra { background: var(--cd-dado-ambar); }
    .franquia li.atual .valor, .franquia li.atual .nome { color: var(--cd-projetor); }

    /* 3 */
    .ranking { list-style: none; margin: 1cqw 0 0; padding: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .ranking li { display: grid; grid-template-columns: 6cqw 10cqw 1fr auto; column-gap: 2.6cqw; row-gap: .8cqw; align-items: center; line-height: 1.2; }
    .pos { grid-row: span 3; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7.4cqw; color: var(--cd-projetor); }
    .mini { grid-row: span 3; width: 10cqw; border-radius: 1cqw; }
    .titulo { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.6cqw; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* Título comprido (As Dez Vantagens…, BTS) em duas linhas, sem reticências. */
    .titulo.longo { font-size: 3.6cqw; white-space: normal; line-height: 1.1; }
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
export class SlidesTop5Semana1112 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly semana = semana;
  protected readonly primeiro = semana.top5[0];
  protected readonly terceiro = semana.top5[2];
  protected readonly quarto = semana.top5[3];
  protected readonly quinto = semana.top5[4];
  protected readonly segundo = semana.top5[1];
  protected readonly fatiaQuarta = Math.round((semana.regua[1].publico / semana.quarta) * 100);
  protected readonly formatar = formatar;
  protected readonly cor = corOrigem;
  protected readonly origem = rotuloOrigem;
  protected readonly umaCasa = umaCasa;
  protected readonly duasCasas = duasCasas;
  protected readonly Math = Math;
  /** Os dois lados com dia e mês (12/11 a 18/11). */
  protected readonly periodo = `${formatar.diaMes(semana.inicio)} a ${formatar.diaMes(semana.fim)}`;
  protected readonly variacaoSemana = pct(semana.publico - semana.publicoAnterior, semana.publicoAnterior);
  protected readonly fatiaTop5 = pct(semana.top5.reduce((t, i) => t + i.publico, 0), semana.publico);
  protected readonly arredondado = (n: number) => Math.round(n);
  /** Pôster grande o bastante para o PNG de 1080 px (o w342 do site ficaria borrado). */
  protected readonly poster = (caminho: string) => urlPoster(caminho, 'w780');
}
