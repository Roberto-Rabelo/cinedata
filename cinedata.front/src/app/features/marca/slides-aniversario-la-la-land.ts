import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/** La La Land no consolidado de lançamentos da ANCINE (lançado em 19/01/2017, SM Distribuidora). */
const laLaLand = { publico: 1_422_952 };

/**
 * Público por semana cinematográfica (quinta a quarta) em 2017, da bilheteria por sala (agregado_semana_obra), com a
 * posição no ranking da semana. A de 12/01 é a semana das pré-estreias. SQL em docs/posts/aniversario-la-la-land/legenda.md.
 */
const semanas = [
  { inicio: '12/01', publico: 152_270, posicao: 7, marco: 'pré' },
  { inicio: '19/01', publico: 377_084, posicao: 5, marco: 'estreia' },
  { inicio: '26/01', publico: 313_178, posicao: 5 },
  { inicio: '02/02', publico: 189_412, posicao: 5 },
  { inicio: '09/02', publico: 98_456, posicao: 8 },
  { inicio: '16/02', publico: 47_484, posicao: 9 },
  { inicio: '23/02', publico: 99_456, posicao: 10, marco: 'Oscar' },
  { inicio: '02/03', publico: 53_679, posicao: 8 },
  { inicio: '09/03', publico: 13_983, posicao: 15 },
];

/** Sessões da ANCINE (2017 a 2026): público em sessões legendadas e nas duas maiores cidades. */
const sessoes = { total: 1_385_041, legendado: 1_303_070, saoPaulo: 315_012, rio: 218_076 };

/** Os nove indicados ao Oscar de melhor filme de 2017, com o público total no Brasil (consolidado de lançamentos). */
const indicados = [
  { titulo: 'La La Land', publico: 1_422_952, destaque: true },
  { titulo: 'A Chegada', publico: 581_942 },
  { titulo: 'Estrelas Além do Tempo', publico: 398_251 },
  { titulo: 'Moonlight', publico: 340_862, vencedor: true },
  { titulo: 'Até o Último Homem', publico: 271_736 },
  { titulo: 'Lion', publico: 209_164 },
  { titulo: 'Manchester à Beira-Mar', publico: 105_869 },
  { titulo: 'Um Limite Entre Nós', publico: 83_641 },
  { titulo: 'A Qualquer Custo', publico: 52_136 },
];

/** O relançamento dos 10 anos (Paris Filmes, 20/08/2026): a semana de volta e o total de 2026 nas sessões. */
const relancamento = { semana: 21_373, posicao: 9, salas: 127, ano: 30_426 };

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);
const mil = (n: number) => `${formatar.inteiro(Math.round(n / 1000))} mil`;
const milDecimal = (n: number) => `${umaCasa.format(n / 1000)} mil`;

/**
 * CineData | 10 anos: La La Land (estreia mundial em Veneza, 31/08/2016; no Brasil, 19/01/2017; relançado em
 * 20/08/2026). 7 slides 1080×1350: capa, a linha do tempo, a frase, as semanas em cartaz, quem viu, os indicados ao
 * Oscar e os 10 anos depois.
 */
@Component({
  selector: 'cd-slides-aniversario-la-la-land',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | 10 anos: La La Land</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/aniversario-la-la-land.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="7" [fundo]="imagens.capa" posicaoFundo="38% 50%" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> 10 anos</span>
          <p class="manchete grande">La La Land<br />faz 10 anos</p>
          <p class="texto claro">
            {{ milhoes(laLaLand.publico) }} milhão de pessoas viram o musical nos cinemas do Brasil, em 2017. Em agosto,
            ele voltou às salas.
          </p>
        </div>
        <p class="arraste">Os números da década →</p>
      </cd-slide>

      <!-- 2. A linha do tempo -->
      <cd-slide [numero]="2" [total]="7">
        <span class="rotulo">Dez anos atrás</span>
        <p class="manchete">Da abertura de Veneza à volta aos cinemas</p>
        <ol class="linha-do-tempo">
          <li><strong>31/08/16</strong><span>Abre o Festival de Veneza.</span></li>
          <li><strong>09/12/16</strong><span>Estreia nos Estados Unidos.</span></li>
          <li><strong>08/01/17</strong><span>Leva os 7 Globos de Ouro a que concorria, um recorde.</span></li>
          <li><strong>19/01/17</strong><span>Chega aos cinemas do Brasil.</span></li>
          <li><strong>24/01/17</strong><span>14 indicações ao Oscar, empatado com <em>A Malvada</em> e <em>Titanic</em>.</span></li>
          <li><strong>26/02/17</strong><span>Ganha 6 Oscars e é anunciado por engano como melhor filme: o vencedor era <em>Moonlight</em>.</span></li>
          <li class="fim"><strong>20/08/26</strong><span>Volta aos cinemas do Brasil pelos 10 anos.</span></li>
        </ol>
      </cd-slide>

      <!-- 3. A frase -->
      <cd-slide [numero]="3" [total]="7" [fundo]="imagens.mia" posicaoFundo="30% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <blockquote class="frase">
            <p>“As pessoas amam aquilo que apaixona os outros.”</p>
          </blockquote>
          <p class="original">“People love what other people are passionate about.”</p>
          <p class="quem">Mia (Emma Stone), em <em>La La Land</em></p>
          <p class="texto claro">Ela diz isso a Sebastian, que sonha abrir um clube de jazz. Emma Stone ganhou o Oscar de melhor atriz pelo papel.</p>
        </div>
      </cd-slide>

      <!-- 4. As semanas em cartaz -->
      <cd-slide [numero]="4" [total]="7">
        <span class="rotulo">Nos cinemas do Brasil, 2017</span>
        <p class="manchete compacta">Estreou com {{ mil(estreia.publico) }} pessoas na semana e ficou 7 semanas no top 10, sem passar do 5º lugar.</p>
        <div class="colunas" role="img" [attr.aria-label]="descricaoSemanas">
          @for (s of semanas; track s.inicio) {
            <div class="coluna" [class.forte]="s.marco">
              <span class="valor">@if (s.marco) { {{ formatar.inteiro(Math.round(s.publico / 1000)) }}<small>mil</small> }</span>
              <span class="pilar" [style.height]="(s.publico / maximoSemana) * 33 + 'cqw'"></span>
              <span class="data">{{ s.inicio }}</span>
              <span class="marco">{{ s.marco ?? '' }}</span>
            </div>
          }
        </div>
        <p class="nota">
          Público por semana (quinta a quarta). Na semana do Oscar, as salas foram de 156 para 287 e o público dobrou.
        </p>
      </cd-slide>

      <!-- 5. Quem viu -->
      <cd-slide [numero]="5" [total]="7" [fundo]="imagens.cinema" posicaoFundo="50% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">Quem viu</span>
          <p class="numero">{{ fatiaLegendado }}%</p>
          <p class="manchete pequena">viram La La Land legendado, ouvindo Emma Stone e Ryan Gosling cantarem</p>
          <div class="comparacao">
            <div><strong class="destaque">{{ mil(sessoes.saoPaulo) }}</strong><span>só na cidade de São Paulo</span></div>
            <div><strong>{{ mil(sessoes.rio) }}</strong><span>no Rio de Janeiro. As duas somam {{ fatiaCapitais }}% do público</span></div>
          </div>
        </div>
      </cd-slide>

      <!-- 6. Os indicados ao Oscar -->
      <cd-slide [numero]="6" [total]="7">
        <span class="rotulo">Os indicados a melhor filme de 2017</span>
        <p class="manchete compacta">Perdeu o Oscar para Moonlight, mas no Brasil levou {{ vezesMoonlight }} vezes mais gente ao cinema.</p>
        <ol class="ranking" aria-label="Público no Brasil dos nove indicados ao Oscar de melhor filme de 2017">
          @for (f of indicados; track f.titulo) {
            <li [class.forte]="f.destaque">
              <span class="nome">{{ f.titulo }}@if (f.vencedor) { <small>venceu</small> }</span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / indicados[0].publico) * 100"></span></span>
              <span class="valor">{{ f.publico >= 1e6 ? milhoes(f.publico) + ' mi' : mil(f.publico) }}</span>
            </li>
          }
        </ol>
        <p class="nota">Público total nos cinemas do Brasil. Os outros oito indicados somaram {{ milhoes(somaOutros) }} milhões.</p>
      </cd-slide>

      <!-- 7. Dez anos depois -->
      <cd-slide [numero]="7" [total]="7">
        <span class="rotulo">Dez anos depois</span>
        <p class="manchete compacta">Relançado em 20 de agosto, La La Land voltou ao top 10 da semana, à frente de estreias da mesma semana.</p>
        <ul class="regua">
          <li><strong>{{ milDecimal(relancamento.semana) }}</strong><span class="quem">na semana da volta <small>{{ relancamento.posicao }}º lugar, em {{ relancamento.salas }} salas</small></span></li>
          <li><strong>{{ milDecimal(relancamento.ano) }}</strong><span class="quem">em 2026 <small>somando todas as sessões do ano</small></span></li>
        </ul>
        <p class="pergunta">Você viu no cinema em 2017 ou agora, na volta? Siga <span class="destaque">&#64;cinedata.br</span></p>
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

    .linha-do-tempo { list-style: none; margin: auto 0 0; padding: 0 0 0 3cqw; display: flex; flex-direction: column; gap: 1.8cqw; border-left: .4cqw solid var(--cd-linha); }
    .linha-do-tempo li { display: grid; grid-template-columns: 17cqw 1fr; gap: 2cqw; align-items: baseline; font-size: 3.5cqw; line-height: 1.25; color: var(--cd-tela-2); position: relative; }
    .linha-do-tempo li::before { content: ''; position: absolute; left: -4.5cqw; top: 1.2cqw; width: 2.2cqw; height: 2.2cqw; border-radius: 50%; background: var(--cd-sala); border: .4cqw solid var(--cd-projetor); }
    .linha-do-tempo strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 3.8cqw; letter-spacing: -0.02em; color: var(--cd-tela); font-variant-numeric: tabular-nums; }
    .linha-do-tempo span { text-wrap: pretty; }
    .linha-do-tempo em { font-style: normal; color: var(--cd-tela); font-weight: 600; }
    .linha-do-tempo li.fim::before { background: var(--cd-projetor); }
    .linha-do-tempo li.fim strong { color: var(--cd-projetor); }

    .frase { margin: 0; }
    .frase p { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 9cqw; line-height: 1.06; letter-spacing: -0.03em; text-wrap: balance; }
    .original { font-size: 3.4cqw; font-style: italic; color: var(--cd-tela-2); margin-top: 3cqw; }
    .quem { font-size: 3.8cqw; font-weight: 600; color: var(--cd-projetor); margin-top: 2.4cqw; }
    .quem em { font-style: italic; }
    .quem + .texto { margin-top: 4cqw; font-size: 3.6cqw; }

    .manchete.compacta { font-size: 5.4cqw; text-wrap: balance; }
    .colunas { margin-top: auto; display: flex; gap: 1.6cqw; align-items: flex-end; }
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

    .ranking { list-style: none; margin: 3cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.1cqw; }
    .ranking li { display: grid; grid-template-columns: 36cqw 1fr 13cqw; column-gap: 2.4cqw; align-items: center; font-size: 3.2cqw; line-height: 1.3; color: var(--cd-tela-2); }
    .ranking .nome { white-space: nowrap; }
    .ranking small { font-size: 2.6cqw; font-weight: 600; color: var(--cd-tela); margin-left: 1.2cqw; padding: .3cqw 1.2cqw; border-radius: 99cqw; border: .25cqw solid var(--cd-tela-3); }
    .ranking .trilho { display: block; }
    .ranking .barra { display: block; height: 2.2cqw; border-radius: 0 .8cqw .8cqw 0; background: color-mix(in oklab, var(--cd-dado-ambar) 40%, var(--cd-poltrona-2)); }
    .ranking .valor { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; color: var(--cd-tela); }
    .ranking li.forte .nome { color: var(--cd-tela); font-weight: 700; }
    .ranking li.forte .barra { background: var(--cd-dado-ambar); }
    .ranking li.forte .valor { color: var(--cd-projetor); font-family: var(--cd-fonte-display); font-weight: 800; }
    .ranking + .nota { margin-top: 3cqw; font-size: 3cqw; text-wrap: pretty; }

    .regua { list-style: none; margin: auto 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; }
    .regua li { display: flex; flex-direction: column; gap: 1.4cqw; padding: 3.2cqw 3.4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .regua strong { font-family: var(--cd-fonte-display); font-weight: 800; color: var(--cd-projetor); font-size: 8.4cqw; line-height: 1; letter-spacing: -0.03em; }
    .regua .quem { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4cqw; color: var(--cd-tela); margin: 0; }
    .regua .quem small { display: block; font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3cqw; color: var(--cd-tela-3); margin-top: .8cqw; }
    .pergunta { margin-top: 5cqw; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesAniversarioLaLaLand {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('ik2D3KqxFD0O0Bc3Wv1CZm8sOg8.jpg'),
    mia: tmdb('frM7tvt49DjYJx5TW7GSDyRogEw.jpg'),
    cinema: tmdb('nofXR1TN1vgGjdfnwGQwFaAWBaY.jpg'),
  };
  protected readonly laLaLand = laLaLand;
  protected readonly semanas = semanas;
  protected readonly estreia = semanas[1];
  protected readonly maximoSemana = Math.max(...semanas.map(s => s.publico));
  protected readonly descricaoSemanas =
    'Público por semana em 2017: ' + semanas.map(s => `${s.inicio}, ${formatar.inteiro(s.publico)}`).join('; ');
  protected readonly sessoes = sessoes;
  protected readonly fatiaLegendado = Math.round((sessoes.legendado / sessoes.total) * 100);
  protected readonly fatiaCapitais = Math.round(((sessoes.saoPaulo + sessoes.rio) / sessoes.total) * 100);
  protected readonly indicados = indicados;
  protected readonly vezesMoonlight = Math.floor(laLaLand.publico / indicados.find(f => f.vencedor)!.publico);
  protected readonly somaOutros = indicados.slice(1).reduce((t, f) => t + f.publico, 0);
  protected readonly relancamento = relancamento;
  protected readonly milhoes = milhoes;
  protected readonly mil = mil;
  protected readonly formatar = formatar;
  protected readonly Math = Math;
  protected readonly milDecimal = milDecimal;
}
