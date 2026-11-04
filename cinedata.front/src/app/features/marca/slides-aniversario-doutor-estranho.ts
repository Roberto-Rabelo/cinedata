import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/** Doutor Estranho no consolidado de lançamentos da ANCINE (lançado em 03/11/2016, Disney). */
const doutorEstranho = { publico: 4_797_907, renda: 74_736_774 };

/** O dia de abertura: quarta, 02/11/2016, feriado de Finados, um dia antes da data oficial (sessoes). */
const finados = { publico: 458_673, salas: 1_143 };

/**
 * Público por semana cinematográfica (quinta a quarta) em 2016, da bilheteria por sala (agregado_semana_obra), com a
 * posição no ranking da semana. A de 27/10 só tem o feriado de 02/11. SQL em docs/posts/aniversario-doutor-estranho/legenda.md.
 */
const semanas = [
  { inicio: '27/10', publico: 461_810, posicao: 2, marco: 'Finados' },
  { inicio: '03/11', publico: 1_383_175, posicao: 1, marco: '1ª' },
  { inicio: '10/11', publico: 1_466_206, posicao: 1, marco: '15/11' },
  { inicio: '17/11', publico: 561_388, posicao: 2 },
  { inicio: '24/11', publico: 311_398, posicao: 2 },
  { inicio: '01/12', publico: 191_489, posicao: 4 },
  { inicio: '08/12', publico: 93_840, posicao: 9 },
  { inicio: '15/12', publico: 32_423, posicao: 12 },
];

/** Sessões da ANCINE (2016 a 2022): público em sessões dubladas e nas duas maiores cidades. */
const sessoes = { total: 4_568_724, dublado: 3_009_711, saoPaulo: 654_144, rio: 396_113 };

/** Os filmes de super-herói lançados no Brasil em 2016, com o público total (consolidado de lançamentos). */
const herois = [
  { titulo: 'Capitão América: Guerra Civil', publico: 9_617_668 },
  { titulo: 'Batman vs Superman', publico: 8_565_462 },
  { titulo: 'Esquadrão Suicida', publico: 7_828_026 },
  { titulo: 'Deadpool', publico: 6_044_324 },
  { titulo: 'Doutor Estranho', publico: 4_797_907, destaque: true },
  { titulo: 'X-Men: Apocalipse', publico: 4_374_189 },
];

/** A sequência (lançada em 05/05/2022) e a volta do filme de 2016 às salas nas semanas dela. */
const sequencia = { publico: 8_489_568, renda: 169_430_379, semana: 4_001_017, salas: 2_540, volta: 55_768, voltaSalas: 63 };

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);
const duasCasas = (n: number) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n / 1e6);
const mil = (n: number) => `${formatar.inteiro(Math.round(n / 1000))} mil`;

/**
 * CineData | 10 anos: Doutor Estranho (pré-estreia mundial em Hong Kong, 13/10/2016; no Brasil, 02/11/2016, um dia antes
 * da data oficial de 03/11). 7 slides 1080×1350: capa, a linha do tempo, a frase, as semanas em cartaz, quem viu, os
 * filmes de herói de 2016 e a sequência.
 */
@Component({
  selector: 'cd-slides-aniversario-doutor-estranho',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | 10 anos: Doutor Estranho</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/aniversario-doutor-estranho.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="7" [fundo]="imagens.capa" posicaoFundo="50% 40%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> 10 anos</span>
          <p class="manchete grande">Doutor Estranho<br />faz 10 anos</p>
          <p class="texto claro">
            {{ milhoes(doutorEstranho.publico) }} milhões de pessoas viram o filme nos cinemas do Brasil. Só no feriado
            de Finados de 2016, o dia em que chegou às salas, foram {{ mil(finados.publico) }}.
          </p>
        </div>
        <p class="arraste">Os números da década →</p>
      </cd-slide>

      <!-- 2. A linha do tempo -->
      <cd-slide [numero]="2" [total]="7">
        <span class="rotulo">Dez anos atrás</span>
        <p class="manchete">De Hong Kong ao multiverso</p>
        <ol class="linha-do-tempo">
          <li><strong>13/10/16</strong><span>Pré-estreia mundial em Hong Kong.</span></li>
          <li><strong>02/11/16</strong><span>Chega aos cinemas do Brasil no feriado de Finados, um dia antes da data oficial.</span></li>
          <li><strong>04/11/16</strong><span>Estreia nos Estados Unidos.</span></li>
          <li><strong>24/01/17</strong><span>Indicado ao Oscar de efeitos visuais. Perde para <em>Mogli: O Menino Lobo</em>.</span></li>
          <li><strong>05/05/22</strong><span>Estreia <em>Doutor Estranho no Multiverso da Loucura</em>.</span></li>
          <li class="fim"><strong>03/11/26</strong><span>Dez anos do lançamento no Brasil.</span></li>
        </ol>
      </cd-slide>

      <!-- 3. A frase -->
      <cd-slide [numero]="3" [total]="7" [fundo]="imagens.tempo" posicaoFundo="62% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <blockquote class="frase">
            <p>“Dormammu, vim negociar.”</p>
          </blockquote>
          <p class="original">“Dormammu, I've come to bargain.”</p>
          <p class="quem">Stephen Strange (Benedict Cumberbatch), em <em>Doutor Estranho</em></p>
          <p class="texto claro">Preso num laço de tempo, ele repete a frase cada vez que o vilão o mata, até Dormammu desistir da Terra.</p>
        </div>
      </cd-slide>

      <!-- 4. As semanas em cartaz -->
      <cd-slide [numero]="4" [total]="7">
        <span class="rotulo">Nos cinemas do Brasil, 2016</span>
        <p class="manchete compacta">A 2ª semana foi maior que a 1ª: {{ duasCasas(semanas[2].publico) }} milhão contra {{ duasCasas(semanas[1].publico) }} milhão, as duas em 1º lugar.</p>
        <div class="colunas" role="img" [attr.aria-label]="descricaoSemanas">
          @for (s of semanas; track s.inicio) {
            <div class="coluna" [class.forte]="s.marco">
              <span class="valor">@if (s.marco) { @if (s.publico >= 1e6) { {{ duasCasas(s.publico) }}<small>mi</small> } @else { {{ formatar.inteiro(Math.round(s.publico / 1000)) }}<small>mil</small> } }</span>
              <span class="pilar" [style.height]="(s.publico / maximoSemana) * 33 + 'cqw'"></span>
              <span class="data">{{ s.inicio }}</span>
              <span class="marco">{{ s.marco ?? '' }}</span>
            </div>
          }
        </div>
        <p class="nota">
          Público por semana (quinta a quarta). A de 27/10 tem um dia só, o feriado de Finados; a de 10/11 teve o de 15/11.
        </p>
      </cd-slide>

      <!-- 5. Quem viu -->
      <cd-slide [numero]="5" [total]="7" [fundo]="imagens.cidade" posicaoFundo="55% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">Quem viu</span>
          <p class="numero">{{ fatiaDublado }}%</p>
          <p class="manchete pequena">viram Doutor Estranho dublado, com a voz brasileira de Stephen Strange</p>
          <div class="comparacao">
            <div><strong class="destaque">{{ mil(sessoes.saoPaulo) }}</strong><span>só na cidade de São Paulo</span></div>
            <div><strong>{{ mil(sessoes.rio) }}</strong><span>no Rio de Janeiro. As duas somam {{ fatiaCapitais }}% do público</span></div>
          </div>
        </div>
      </cd-slide>

      <!-- 6. Os heróis de 2016 -->
      <cd-slide [numero]="6" [total]="7">
        <span class="rotulo">Os filmes de super-herói de 2016</span>
        <p class="manchete compacta">2016 teve seis filmes de herói nos cinemas, que somaram {{ milhoes(somaHerois) }} milhões de ingressos. Doutor Estranho foi o 5º.</p>
        <ol class="ranking" aria-label="Público no Brasil dos filmes de super-herói lançados em 2016">
          @for (f of herois; track f.titulo) {
            <li [class.forte]="f.destaque">
              <span class="nome">{{ f.titulo }}</span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / herois[0].publico) * 100"></span></span>
              <span class="valor">{{ milhoes(f.publico) }} mi</span>
            </li>
          }
        </ol>
        <p class="nota">Público total nos cinemas do Brasil. Entre todos os lançamentos de 2016, Doutor Estranho foi o 9º mais visto.</p>
      </cd-slide>

      <!-- 7. A sequência -->
      <cd-slide [numero]="7" [total]="7">
        <span class="rotulo">Seis anos depois</span>
        <p class="manchete compacta">A sequência quase dobrou: Multiverso da Loucura levou {{ milhoes(sequencia.publico) }} milhões aos cinemas em 2022.</p>
        <ul class="regua">
          <li><strong>{{ milhoes(sequencia.semana) }} mi</strong><span class="quem">na 1ª semana <small>em {{ formatar.inteiro(sequencia.salas) }} salas: quase o filme de 2016 inteiro</small></span></li>
          <li><strong>{{ mil(sequencia.volta) }}</strong><span class="quem">viram o 1º de novo <small>na volta a {{ sequencia.voltaSalas }} salas, junto com a sequência</small></span></li>
        </ul>
        <p class="pergunta">Qual dos dois você viu no cinema? Siga <span class="destaque">&#64;cinedata.br</span></p>
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
    .base .manchete.grande { font-size: 11cqw; margin-bottom: 3cqw; }
    .base > .texto { font-size: 4.2cqw; text-wrap: pretty; }
    .base + .arraste { margin-top: 4cqw; }

    .linha-do-tempo { list-style: none; margin: auto 0 0; padding: 0 0 0 3cqw; display: flex; flex-direction: column; gap: 2.2cqw; border-left: .4cqw solid var(--cd-linha); }
    .linha-do-tempo li { display: grid; grid-template-columns: 17cqw 1fr; gap: 2cqw; align-items: baseline; font-size: 3.6cqw; line-height: 1.25; color: var(--cd-tela-2); position: relative; }
    .linha-do-tempo li::before { content: ''; position: absolute; left: -4.5cqw; top: 1.2cqw; width: 2.2cqw; height: 2.2cqw; border-radius: 50%; background: var(--cd-sala); border: .4cqw solid var(--cd-projetor); }
    .linha-do-tempo strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 3.8cqw; letter-spacing: -0.02em; color: var(--cd-tela); font-variant-numeric: tabular-nums; }
    .linha-do-tempo span { text-wrap: pretty; }
    .linha-do-tempo em { font-style: normal; color: var(--cd-tela); font-weight: 600; }
    .linha-do-tempo li.fim::before { background: var(--cd-projetor); }
    .linha-do-tempo li.fim strong { color: var(--cd-projetor); }

    .frase { margin: 0; }
    .frase p { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 10cqw; line-height: 1.04; letter-spacing: -0.03em; text-wrap: balance; }
    .original { font-size: 3.4cqw; font-style: italic; color: var(--cd-tela-2); margin-top: 3cqw; }
    .quem { font-size: 3.8cqw; font-weight: 600; color: var(--cd-projetor); margin-top: 2.4cqw; }
    .quem em { font-style: italic; }
    .quem + .texto { margin-top: 4cqw; font-size: 3.6cqw; }

    .manchete.compacta { font-size: 5.4cqw; text-wrap: balance; }
    .colunas { margin-top: auto; display: flex; gap: 1.8cqw; align-items: flex-end; }
    .coluna { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 1cqw; }
    .coluna .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 3.6cqw; line-height: 1; color: var(--cd-tela); text-align: center; }
    .coluna .valor small { display: block; font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 2.6cqw; color: var(--cd-tela-2); margin-top: .4cqw; }
    .coluna .pilar { width: 100%; border-radius: .8cqw .8cqw 0 0; background: color-mix(in oklab, var(--cd-dado-ambar) 40%, var(--cd-poltrona-2)); }
    .coluna.forte .pilar { background: var(--cd-dado-ambar); }
    .coluna .data { font-size: 2.5cqw; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .coluna .marco { font-size: 2.6cqw; font-weight: 600; color: var(--cd-projetor); white-space: nowrap; min-height: 1.3em; }
    .colunas + .nota { margin-top: 3cqw; font-size: 3cqw; text-wrap: pretty; }

    .base .numero { font-size: 22cqw; }
    .base .manchete.pequena { margin-top: 1cqw; text-wrap: balance; }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; margin-top: 5cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: .8cqw; padding: 3cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .85); border: .3cqw solid var(--cd-linha); }
    .comparacao strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8cqw; line-height: 1; letter-spacing: -0.03em; }
    .comparacao span { font-size: 3.2cqw; color: var(--cd-tela-2); line-height: 1.3; text-wrap: pretty; }

    .ranking { list-style: none; margin: auto 0 0; padding: 0; display: flex; flex-direction: column; gap: 2.2cqw; }
    .ranking li { display: grid; grid-template-columns: 52cqw 1fr 12cqw; column-gap: 2.4cqw; align-items: center; font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); }
    .ranking .nome { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ranking .trilho { display: block; }
    .ranking .barra { display: block; height: 2.6cqw; border-radius: 0 .8cqw .8cqw 0; background: color-mix(in oklab, var(--cd-dado-ambar) 40%, var(--cd-poltrona-2)); }
    .ranking .valor { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; color: var(--cd-tela); }
    .ranking li.forte .nome { color: var(--cd-tela); font-weight: 700; }
    .ranking li.forte .barra { background: var(--cd-dado-ambar); }
    .ranking li.forte .valor { color: var(--cd-projetor); font-family: var(--cd-fonte-display); font-weight: 800; }
    .ranking + .nota { margin-top: 4cqw; font-size: 3cqw; text-wrap: pretty; }

    .regua { list-style: none; margin: auto 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; }
    .regua li { display: flex; flex-direction: column; gap: 1.4cqw; padding: 3.2cqw 3.4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .regua strong { font-family: var(--cd-fonte-display); font-weight: 800; color: var(--cd-projetor); font-size: 8.4cqw; line-height: 1; letter-spacing: -0.03em; }
    .regua .quem { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4cqw; color: var(--cd-tela); margin: 0; }
    .regua .quem small { display: block; font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3cqw; color: var(--cd-tela-3); margin-top: .8cqw; }
    .pergunta { margin-top: 5cqw; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesAniversarioDoutorEstranho {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('kkoiH8ZWxJ9WSAjOadGtuHUQxbm.jpg'),
    tempo: tmdb('ruS48KVDDf24aXKuFJiB6XqgQHQ.jpg'),
    cidade: tmdb('aL53oMdZKZRJRH8txH07DLuleF9.jpg'),
  };
  protected readonly doutorEstranho = doutorEstranho;
  protected readonly finados = finados;
  protected readonly semanas = semanas;
  protected readonly maximoSemana = Math.max(...semanas.map(s => s.publico));
  protected readonly descricaoSemanas =
    'Público por semana em 2016: ' + semanas.map(s => `${s.inicio}, ${formatar.inteiro(s.publico)}`).join('; ');
  protected readonly sessoes = sessoes;
  protected readonly fatiaDublado = Math.round((sessoes.dublado / sessoes.total) * 100);
  protected readonly fatiaCapitais = Math.round(((sessoes.saoPaulo + sessoes.rio) / sessoes.total) * 100);
  protected readonly herois = herois;
  protected readonly somaHerois = herois.reduce((t, f) => t + f.publico, 0);
  protected readonly sequencia = sequencia;
  protected readonly milhoes = milhoes;
  protected readonly duasCasas = duasCasas;
  protected readonly mil = mil;
  protected readonly formatar = formatar;
  protected readonly Math = Math;
}
