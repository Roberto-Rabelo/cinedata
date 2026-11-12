import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string, tamanho = 'w1280') => `https://image.tmdb.org/t/p/${tamanho}/${arquivo}`;

/**
 * Minha Melhor Amiga (B2600181900000) na bilheteria por sala da ANCINE, publicação com dados até 08/11/2026:
 * soma das sessões, porque o filme de 2026 ainda não está no consolidado de lançamentos. SQL em
 * docs/posts/noticia-minha-melhor-amiga/legenda.md.
 */
const amiga = {
  publico: 6_049_185,
  /** Dia em que a soma passou os 5.857.612 de Ainda Estou Aqui (52º dia desde a estreia, 03/09). */
  passou: '24/10',
  dia: 52,
};
const aindaEstouAqui = { publico: 5_857_612, sessoes: 5_731_852 };

/** Público acumulado semana a semana (quinta a quarta), a partir da estreia em circuito. */
const curvaAmiga = [932_529, 3_107_568, 4_249_706, 4_923_094, 5_339_630, 5_639_408, 5_818_937, 5_914_541, 6_046_368];
/** Ainda Estou Aqui: da estreia em circuito (07/11/2024) até a 21ª semana (27/03/2025); inclui as 2 sessões de festival. */
const curvaAinda = [
  582_163, 1_379_976, 1_953_695, 2_319_717, 2_590_545, 2_794_961, 2_904_534, 2_983_377, 3_107_444, 3_381_536, 3_562_235,
  3_907_588, 4_163_245, 4_878_260, 5_039_357, 5_152_783, 5_438_182, 5_604_065, 5_688_667, 5_717_555, 5_728_833,
];

/** Os 10 maiores públicos de filmes brasileiros desde 2009 (consolidado de lançamentos; Minha Melhor Amiga pelas sessões). */
const regua = [
  { titulo: 'Nada a Perder', ano: 2018, publico: 12_173_228 },
  { titulo: 'Os Dez Mandamentos', ano: 2016, publico: 11_305_479 },
  { titulo: 'Tropa de Elite 2', ano: 2010, publico: 11_147_238 },
  { titulo: 'Minha Mãe é uma Peça 3', ano: 2019, publico: 10_938_240 },
  { titulo: 'Minha Mãe é uma Peça 2', ano: 2016, publico: 9_235_788 },
  { titulo: 'Chico Xavier', ano: 2010, publico: 6_540_455 },
  { titulo: 'Nada a Perder 2', ano: 2019, publico: 6_189_465 },
  { titulo: 'Se Eu Fosse Você 2', ano: 2009, publico: 6_143_081 },
  { titulo: 'Minha Melhor Amiga', ano: 2026, publico: amiga.publico, atual: true },
  { titulo: 'Ainda Estou Aqui', ano: 2024, publico: aindaEstouAqui.publico },
];

/** 2ª semana (10 a 16/09/2026, Semana do Cinema): a maior semana de um filme brasileiro desde Minha Mãe é uma Peça 3. */
const pico = { publico: 2_175_039, total: 5_675_781 };
/** Quinta a sábado antes e depois da chegada à Netflix (02/11); salas com sessão no dia. */
const saida = { antes: 47_959, depois: 2_759, salasQuarta: 552, salasSabado: 65 };

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);
const milhoes2 = (n: number) => duasCasas.format(n / 1e6);
const curto = (n: number) => (n >= 1e6 ? `${milhoes(n)} mi` : `${formatar.inteiro(Math.round(n / 1000))} mil`);

/** Gráfico das curvas: 21 semanas no eixo x, 0 a 6,5 milhões no y (viewBox 1000 × 380). */
const LARGURA = 1000;
const ALTURA = 380;
const TETO = 6_500_000;
const x = (semana: number) => ((semana - 1) / 20) * LARGURA;
const y = (publico: number) => ALTURA - (publico / TETO) * ALTURA;
const linha = (curva: number[]) => curva.map((p, i) => `${x(i + 1).toFixed(1)},${y(p).toFixed(1)}`).join(' ');

/**
 * CineData | Notícia: Minha Melhor Amiga passou Ainda Estou Aqui (11/11/2026). 7 slides 1080×1350: capa, o filme,
 * o número, a corrida das duas curvas, a régua dos maiores brasileiros, o pico e a saída, o que vamos acompanhar.
 */
@Component({
  selector: 'cd-slides-noticia-minha-melhor-amiga',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Notícia: Minha Melhor Amiga</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/noticia-minha-melhor-amiga.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="7" [fundo]="imagens.capa" posicaoFundo="50% 30%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> Notícia</span>
          <p class="manchete grande">Passou Ainda Estou Aqui</p>
          <p class="texto claro">
            {{ milhoes2(amiga.publico) }} milhões de pessoas viram Minha Melhor Amiga nos cinemas, o maior público de um
            filme brasileiro desde 2019. Agora ele está na Netflix.
          </p>
        </div>
        <p class="arraste">O que diz a ANCINE →</p>
      </cd-slide>

      <!-- 2. O filme -->
      <cd-slide [numero]="2" [total]="7">
        <span class="rotulo">O filme</span>
        <div class="filme">
          <p class="manchete sinopse">Duas amigas na casa dos 50 viajam para a Europa quando as filhas partem para um intercâmbio em Portugal.</p>
          <img class="poster" [src]="imagens.poster" alt="Pôster de Minha Melhor Amiga" />
        </div>
        <dl class="ficha">
          <div><dt>Direção</dt><dd>Susana Garcia</dd></div>
          <div><dt>Elenco</dt><dd>Mônica Martelli, Ingrid Guimarães, Giulia Benite e Gabi Amaral</dd></div>
          <div><dt>Distribuição</dt><dd>Paris Filmes</dd></div>
          <div><dt>Nos cinemas</dt><dd>desde 03/09/2026</dd></div>
          <div><dt>Na Netflix</dt><dd>desde 02/11/2026</dd></div>
        </dl>
      </cd-slide>

      <!-- 3. O número -->
      <cd-slide [numero]="3" [total]="7" [fundo]="imagens.dado" posicaoFundo="50% 40%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">O que os dados mostram</span>
          <p class="numero">{{ milhoes2(amiga.publico) }} mi</p>
          <p class="manchete pequena">de pessoas nas sessões informadas à ANCINE, de 03/09 a 08/11.</p>
          <div class="comparacao">
            <div><strong>{{ amiga.passou }}</strong><span>o dia em que passou os {{ milhoes2(aindaEstouAqui.publico) }} mi de Ainda Estou Aqui, o {{ amiga.dia }}º em cartaz</span></div>
            <div><strong>5º</strong><span>filme mais visto de 2026 no Brasil e o maior brasileiro do ano</span></div>
          </div>
        </div>
      </cd-slide>

      <!-- 4. A corrida -->
      <cd-slide [numero]="4" [total]="7">
        <span class="rotulo">A corrida</span>
        <p class="manchete compacta">Em 2 semanas, Minha Melhor Amiga fez o público que Ainda Estou Aqui levou 9 semanas para fazer.</p>
        <figure class="grafico">
          <svg [attr.viewBox]="'-10 -20 1080 430'" role="img" aria-label="Público acumulado por semana: Minha Melhor Amiga chega a 3,1 milhões na 2ª semana; Ainda Estou Aqui, na 9ª">
            @for (m of [2, 4, 6]; track m) {
              <line class="grade" x1="0" [attr.x2]="largura" [attr.y1]="y(m * 1e6)" [attr.y2]="y(m * 1e6)" />
              <text class="eixo" [attr.x]="largura + 12" [attr.y]="y(m * 1e6) + 8">{{ m }} mi</text>
            }
            <line class="base-eixo" x1="0" [attr.x2]="largura" [attr.y1]="altura" [attr.y2]="altura" />
            <polyline class="ainda" [attr.points]="linhaAinda" />
            <polyline class="amiga" [attr.points]="linhaAmiga" />
            <circle class="ponto-ainda" [attr.cx]="x(9)" [attr.cy]="y(curvaAinda[8])" r="9" />
            <circle class="ponto-amiga" [attr.cx]="x(2)" [attr.cy]="y(curvaAmiga[1])" r="9" />
            <text class="marca-amiga" [attr.x]="x(2) + 40" [attr.y]="y(curvaAmiga[1]) - 4">2ª semana</text>
            <text class="marca-ainda" [attr.x]="x(9)" [attr.y]="y(curvaAinda[8]) - 24" text-anchor="middle">9ª semana</text>
          </svg>
          <figcaption class="rotulos">
            <span class="r-amiga">Minha Melhor Amiga <b>{{ milhoes2(amiga.publico) }} mi</b></span>
            <span class="r-ainda">Ainda Estou Aqui <b>{{ milhoes2(aindaEstouAqui.sessoes) }} mi</b></span>
          </figcaption>
        </figure>
        <p class="nota">Público acumulado nas sessões, semana a semana desde a estreia em circuito (Ainda Estou Aqui: 07/11/2024). No consolidado, Ainda Estou Aqui tem 5,86 mi.</p>
      </cd-slide>

      <!-- 5. A régua -->
      <cd-slide [numero]="5" [total]="7">
        <span class="rotulo">A régua</span>
        <p class="manchete compacta">Desde 2009, só 8 filmes brasileiros levaram mais gente ao cinema.</p>
        <ol class="ranking" aria-label="Os 10 maiores públicos de filmes brasileiros desde 2009">
          @for (f of regua; track f.titulo; let i = $index) {
            <li [class.forte]="f.atual">
              <span class="pos">{{ i + 1 }}</span>
              <span class="nome">{{ f.titulo }}<small>{{ f.ano }}</small></span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / regua[0].publico) * 100"></span></span>
              <span class="valor">{{ milhoes2(f.publico) }}</span>
            </li>
          }
        </ol>
        <p class="nota">
          Público em milhões. Minha Melhor Amiga pela soma das sessões até 08/11 (o consolidado da ANCINE ainda não saiu);
          os outros, pelo consolidado.
        </p>
      </cd-slide>

      <!-- 6. O pico e a saída -->
      <cd-slide [numero]="6" [total]="7">
        <span class="rotulo">O pico e a saída</span>
        <div class="blocos">
          <article>
            <p class="titulo-bloco">Semana do Cinema, 10 a 16/09</p>
            <p class="numero medio">{{ milhoes2(pico.publico) }} mi</p>
            <p class="texto">na 2ª semana, com ingresso a R$ 10 e R$ 12: {{ fatiaPico }}% do público do país. A maior semana de um brasileiro desde Minha Mãe é uma Peça 3 (jan/2020).</p>
          </article>
          <article>
            <p class="titulo-bloco">Depois da Netflix, 02/11</p>
            <p class="numero medio">−{{ quedaSaida }}%</p>
            <p class="texto">de quinta a sábado: {{ formatar.inteiro(saida.antes) }} pessoas (29 a 31/10), {{ formatar.inteiro(saida.depois) }} (05 a 07/11). Eram {{ saida.salasQuarta }} salas na quarta (04/11); no sábado, {{ saida.salasSabado }}.</p>
          </article>
        </div>
        <p class="nota">Semana de 05/11 ainda com dados parciais na ANCINE.</p>
      </cd-slide>

      <!-- 7. O que vamos acompanhar -->
      <cd-slide [numero]="7" [total]="7">
        <span class="rotulo">O que vamos acompanhar</span>
        <p class="manchete fecho">Quando a ANCINE fechar a carreira no consolidado, a gente mostra o número final.</p>
        <ul class="agenda">
          <li><strong>8º ou 9º?</strong><span>faltam {{ curto(regua[7].publico - amiga.publico) }} para Se Eu Fosse Você 2</span></li>
          <li><strong>Netflix</strong><span>quanto ainda vende nos cinemas</span></li>
          <li><strong>2026</strong><span>se outro brasileiro passa dele no ano</span></li>
        </ul>
        <p class="pergunta">Você viu no cinema ou vai ver na Netflix? Conta aqui.</p>
      </cd-slide>
    </div>
  `,
  styles: `
    .base { margin-top: auto; display: flex; flex-direction: column; }
    .claro { color: var(--cd-tela); }

    .selo {
      align-self: flex-start; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.4cqw;
      letter-spacing: .02em; padding: 1.2cqw 2.8cqw; border-radius: 99cqw; margin-bottom: 4cqw;
      color: var(--cd-sala); background: var(--cd-projetor);
    }
    .selo i { font-style: normal; opacity: .55; margin: 0 .6cqw; }
    .base .manchete.grande { font-size: 10.4cqw; margin-bottom: 3cqw; text-wrap: balance; }
    .base > .texto { font-size: 4.2cqw; text-wrap: pretty; }
    .base + .arraste { margin-top: 4cqw; }

    .filme { display: grid; grid-template-columns: 1fr 26cqw; gap: 4cqw; align-items: start; }
    .sinopse { margin-top: 0; font-size: 5.4cqw; text-wrap: balance; }
    .poster { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 2cqw; border: .3cqw solid var(--cd-linha); }
    .ficha { margin: auto 0 0; display: flex; flex-direction: column; gap: 1.4cqw; }
    .ficha div { display: grid; grid-template-columns: 24cqw 1fr; gap: 2cqw; font-size: 3.6cqw; line-height: 1.25; }
    .ficha dt { color: var(--cd-tela-3); }
    .ficha dd { margin: 0; color: var(--cd-tela); font-weight: 600; text-wrap: pretty; }

    .base .numero { font-size: 17cqw; }
    .base .manchete.pequena { margin-top: 1.4cqw; text-wrap: balance; }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; margin-top: 5cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: 1cqw; padding: 3cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .88); border: .3cqw solid var(--cd-linha); }
    .comparacao strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; line-height: 1.1; letter-spacing: -0.03em; color: var(--cd-tela); }
    .comparacao span { font-size: 3.2cqw; color: var(--cd-tela-2); line-height: 1.3; text-wrap: pretty; }

    .manchete.compacta { font-size: 5.4cqw; margin-top: 0; text-wrap: balance; }

    .grafico { margin: 4cqw 0 0; display: flex; flex-direction: column; gap: 2cqw; }
    .grafico svg { width: 100%; height: auto; overflow: visible; }
    .grade { stroke: var(--cd-linha); stroke-width: 2; }
    .base-eixo { stroke: var(--cd-tela-3); stroke-width: 2; }
    .eixo { fill: var(--cd-tela-3); font-size: 26px; font-family: var(--cd-fonte-texto); }
    polyline { fill: none; stroke-width: 9; stroke-linejoin: round; stroke-linecap: round; }
    .amiga { stroke: var(--cd-dado-ambar); }
    .ainda { stroke: var(--cd-dado-neutro); }
    .ponto-amiga { fill: var(--cd-dado-ambar); stroke: var(--cd-sala); stroke-width: 4; }
    .marca-amiga, .marca-ainda { font-size: 28px; font-weight: 600; font-family: var(--cd-fonte-texto); }
    .marca-amiga { fill: var(--cd-projetor); }
    .marca-ainda { fill: var(--cd-tela-2); }
    .ponto-ainda { fill: var(--cd-dado-neutro); stroke: var(--cd-sala); stroke-width: 4; }
    .rotulos { display: flex; flex-direction: column; gap: 1cqw; font-size: 3.6cqw; }
    .rotulos span { display: flex; align-items: center; gap: 2cqw; color: var(--cd-tela-2); }
    .rotulos span::before { content: ''; width: 5cqw; height: 1cqw; border-radius: 1cqw; }
    .r-amiga::before { background: var(--cd-dado-ambar); }
    .r-ainda::before { background: var(--cd-dado-neutro); }
    .rotulos b { color: var(--cd-tela); font-weight: 700; }
    .grafico + .nota { font-size: 2.9cqw; text-wrap: pretty; }

    .ranking { list-style: none; margin: 1cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.4cqw; }
    .ranking li { display: grid; grid-template-columns: 4cqw 46cqw 1fr 11cqw; column-gap: 2cqw; align-items: center; line-height: 1.1; }
    .ranking .pos { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.2cqw; color: var(--cd-tela-3); text-align: right; }
    .ranking .nome { color: var(--cd-tela); font-weight: 600; font-size: 3.2cqw; line-height: 1.2; white-space: nowrap; }
    .ranking small { font-weight: 400; font-size: 2.5cqw; color: var(--cd-tela-3); margin-left: 1cqw; }
    .ranking .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 3.8cqw; color: var(--cd-tela); font-variant-numeric: tabular-nums; text-align: right; }
    .ranking .trilho { display: block; }
    .ranking .barra { display: block; height: 2.6cqw; border-radius: 0 .8cqw .8cqw 0; background: var(--cd-dado-neutro); }
    .ranking li.forte .barra { background: var(--cd-dado-ambar); }
    .ranking li.forte .nome, .ranking li.forte .valor, .ranking li.forte .pos { color: var(--cd-projetor); }
    .ranking + .nota { font-size: 2.9cqw; text-wrap: pretty; padding-top: 2cqw; }

    .blocos { display: flex; flex-direction: column; gap: 2.4cqw; }
    .blocos article { padding: 3cqw 3.6cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); display: flex; flex-direction: column; gap: .6cqw; }
    .titulo-bloco { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; line-height: 1.1; color: var(--cd-tela); }
    .blocos .numero.medio { font-size: 9.6cqw; line-height: 1; }
    .blocos .texto { font-size: 3.4cqw; line-height: 1.35; text-wrap: pretty; }
    .blocos + .nota { font-size: 2.9cqw; }

    .manchete.fecho { margin-top: 0; font-size: 5.6cqw; text-wrap: balance; }
    .agenda { list-style: none; margin: 4cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.8cqw; }
    .agenda li { display: grid; grid-template-columns: 26cqw 1fr; gap: 2.4cqw; align-items: baseline; padding: 2.2cqw 3.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .agenda strong { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; color: var(--cd-projetor); }
    .agenda span { font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesNoticiaMinhaMelhorAmiga {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('7y0tWfGwsGnlNAJTza3RkEwETPC.jpg'),
    poster: tmdb('wGfTFVeguXDXYrwPQ8QMFsaSK2M.jpg', 'w500'),
    dado: tmdb('1TWjcJmcmhCntrcjwiWbM6jQcni.jpg'),
  };
  protected readonly amiga = amiga;
  protected readonly aindaEstouAqui = aindaEstouAqui;
  protected readonly curvaAmiga = curvaAmiga;
  protected readonly curvaAinda = curvaAinda;
  protected readonly regua = regua;
  protected readonly pico = pico;
  protected readonly saida = saida;
  protected readonly formatar = formatar;
  protected readonly milhoes = milhoes;
  protected readonly milhoes2 = milhoes2;
  protected readonly curto = curto;
  protected readonly x = x;
  protected readonly y = y;
  protected readonly largura = LARGURA;
  protected readonly altura = ALTURA;
  protected readonly linhaAmiga = linha(curvaAmiga);
  protected readonly linhaAinda = linha(curvaAinda);
  protected readonly fatiaPico = Math.round((pico.publico / pico.total) * 100);
  protected readonly quedaSaida = Math.round((1 - saida.depois / saida.antes) * 100);
}
