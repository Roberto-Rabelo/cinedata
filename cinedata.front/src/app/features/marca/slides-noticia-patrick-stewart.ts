import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/**
 * Os filmes com Patrick Stewart lançados nos cinemas do Brasil desde 2009 (início do consolidado de lançamentos
 * comerciais da ANCINE), com o público total da carreira de cada um. Papéis conferidos na filmografia (Wikipedia) e no
 * TMDB; nas animações ele fez só a voz original, e a maior parte do público viu a versão dublada. SQL em
 * docs/posts/noticia-patrick-stewart/legenda.md.
 */
const filmes = [
  { ano: 2009, titulo: 'X-Men Origens: Wolverine', papel: 'Xavier, ponta', xavier: true, publico: 3_199_434 },
  { ano: 2011, titulo: 'Gnomeu e Julieta', papel: 'voz', xavier: false, publico: 1_127_519 },
  { ano: 2012, titulo: 'A Era do Gelo 4', papel: 'voz', xavier: false, publico: 8_729_837 },
  { ano: 2012, titulo: 'Ted', papel: 'narrador', xavier: false, publico: 1_784_311 },
  { ano: 2013, titulo: 'Wolverine: Imortal', papel: 'Xavier, ponta', xavier: true, publico: 3_955_740 },
  { ano: 2014, titulo: 'A Lenda de Oz', papel: 'voz', xavier: false, publico: 540_780 },
  { ano: 2014, titulo: 'X-Men: Dias de um Futuro Esquecido', curto: 'X-Men: Futuro Esquecido', papel: 'Xavier', xavier: true, publico: 4_923_664 },
  { ano: 2015, titulo: 'Ted 2', papel: 'narrador', xavier: false, publico: 743_118 },
  { ano: 2017, titulo: 'Logan', papel: 'Xavier', xavier: true, publico: 6_400_985 },
  { ano: 2017, titulo: 'Emoji: O Filme', papel: 'voz', xavier: false, publico: 1_684_128 },
  { ano: 2019, titulo: 'O Menino que Queria Ser Rei', papel: 'Merlin', xavier: false, publico: 230_528 },
  { ano: 2019, titulo: 'As Panteras', papel: 'Bosley', xavier: false, publico: 453_406 },
  { ano: 2022, titulo: 'Doutor Estranho no Multiverso da Loucura', curto: 'Doutor Estranho 2', papel: 'Xavier', xavier: true, publico: 8_489_568 },
  { ano: 2026, titulo: 'As Ovelhas Detetives', papel: 'voz', xavier: false, publico: 52_300 },
];
const porPublico = [...filmes].sort((a, b) => b.publico - a.publico);
/** No gráfico, os que passaram de 3 milhões (os 5 como Xavier e A Era do Gelo 4); o resto vai na nota. */
const grandes = porPublico.filter(f => f.publico >= 3e6);
const outros = porPublico.filter(f => f.publico < 3e6);

/** Logan nas sessões da ANCINE (bilheteria por sala, 2017): público em sessões legendadas, com a voz original. */
const loganLegendado = { publico: 2_187_676, total: 6_172_791 };

/** Semanas de estreia (quinta a quarta), bilheteria por sala. */
const estreias = [
  { titulo: 'Doutor Estranho 2', ano: 2022, publico: 4_001_017 },
  { titulo: 'Logan', ano: 2017, publico: 2_474_657 },
];

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);
const curto = (n: number) => (n >= 1e6 ? `${milhoes(n)} mi` : `${formatar.inteiro(Math.round(n / 1000))} mil`);
const soma = (lista: { publico: number }[]) => lista.reduce((t, f) => t + f.publico, 0);

/**
 * CineData | Notícia: morre Patrick Stewart (28/10/2026), o Professor X. 7 slides 1080×1350: capa, o que se sabe, a
 * trajetória, uma frase de Logan, o Professor X nos dados da ANCINE, os filmes dele no Brasil e o que vamos acompanhar
 * (Vingadores: Doutor Destino, 17/12, o último papel).
 */
@Component({
  selector: 'cd-slides-noticia-patrick-stewart',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Notícia: Patrick Stewart</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/noticia-patrick-stewart.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="7" [fundo]="imagens.capa" posicaoFundo="64% 30%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> Notícia</span>
          <p class="manchete grande">Morre Patrick Stewart,<br />o Professor X</p>
          <p class="texto claro">
            O ator britânico morreu na quarta (28/10), aos 86 anos. Foi Charles Xavier no cinema por mais de duas
            décadas e o capitão Picard, de Star Trek.
          </p>
        </div>
        <p class="arraste">A trajetória e os números no Brasil →</p>
      </cd-slide>

      <!-- 2. O que se sabe -->
      <cd-slide [numero]="2" [total]="7" [fundo]="imagens.doisXavier" posicaoFundo="86% 40%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">O que se sabe</span>
          <p class="manchete sinopse">Morreu em casa, em Los Angeles, ao lado da mulher, Sunny Ozell, segundo a família.</p>
          <dl class="ficha">
            <div><dt>Nascimento</dt><dd>13/7/1940, Mirfield (Inglaterra)</dd></div>
            <div><dt>Morte</dt><dd>28/10/2026, aos 86 anos</dd></div>
            <div><dt>Causa</dt><dd>Alzheimer e demência com corpos de Lewy</dd></div>
          </dl>
        </div>
      </cd-slide>

      <!-- 3. A trajetória -->
      <cd-slide [numero]="3" [total]="7">
        <span class="rotulo">A trajetória</span>
        <p class="manchete">De Shakespeare ao Professor X</p>
        <ol class="linha-do-tempo">
          <li><strong>1966</strong><span>Entra na Royal Shakespeare Company (até 1982).</span></li>
          <li><strong>1987</strong><span>Capitão Picard em <em>Star Trek: A Nova Geração</em> (até 1994).</span></li>
          <li><strong>2000</strong><span>Estreia como Charles Xavier em <em>X-Men</em>.</span></li>
          <li><strong>2010</strong><span>Recebe o título de Sir da rainha Elizabeth II.</span></li>
          <li><strong>2017</strong><span>O Xavier envelhecido de <em>Logan</em>.</span></li>
          <li><strong>2020</strong><span>Volta como Picard em <em>Star Trek: Picard</em> (até 2023).</span></li>
          <li class="fim"><strong>2026</strong><span>Último papel: Xavier em <em>Vingadores: Doutor Destino</em>.</span></li>
        </ol>
      </cd-slide>

      <!-- 4. A frase -->
      <cd-slide [numero]="4" [total]="7" [fundo]="imagens.logan" posicaoFundo="34% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <blockquote class="frase">
            <p>“A vida é isto: um lar, pessoas que se amam, um lugar seguro.”</p>
          </blockquote>
          <p class="original">“This is what life looks like: a home, people who love each other, a safe place.”</p>
          <p class="quem">Charles Xavier, em <em>Logan</em> (2017)</p>
          <p class="texto claro">{{ curto(logan.publico) }} de espectadores no Brasil, o maior público entre os filmes em que ele está no elenco principal.</p>
        </div>
      </cd-slide>

      <!-- 5. O Professor X nos dados -->
      <cd-slide [numero]="5" [total]="7" [fundo]="imagens.cadeira" posicaoFundo="60% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">Nos dados da ANCINE</span>
          <p class="numero">{{ milhoes(somaXavier) }} milhões</p>
          <p class="manchete pequena">de ingressos nos {{ xavier.length }} filmes em que ele foi o Professor X, desde 2009</p>
          <div class="comparacao">
            <div><strong class="destaque">{{ curto(loganLegendado.publico) }}</strong><span>viram Logan legendado, com a voz dele ({{ fatiaLegendado }}% do público)</span></div>
            <div><strong>{{ milhoes(somaTodos) }} mi</strong><span>somando os {{ filmes.length }} filmes com ele, com vozes e participações</span></div>
          </div>
        </div>
      </cd-slide>

      <!-- 6. Os filmes dele no Brasil -->
      <cd-slide [numero]="6" [total]="7">
        <span class="rotulo">Os filmes dele no Brasil</span>
        <p class="manchete compacta">Como Xavier, o maior público foi o mais recente: {{ curto(doutorEstranho.publico) }} em Doutor Estranho 2.</p>
        <ol class="ranking" aria-label="Filmes com Patrick Stewart que passaram de 3 milhões de espectadores no Brasil">
          @for (f of grandes; track f.titulo) {
            <li [class.forte]="f.xavier">
              <span class="nome">{{ 'curto' in f ? f.curto : f.titulo }} <small>{{ f.ano }} · {{ f.papel }}</small></span>
              <span class="valor">{{ curto(f.publico) }}</span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / maximo) * 100"></span></span>
            </li>
          }
        </ol>
        <p class="nota">
          Público total nos cinemas desde 2009; em âmbar, como Professor X. Os outros {{ outros.length }} filmes somam
          {{ curto(somaOutros) }} ({{ nomesOutros }} e mais {{ outros.length - 3 }}).
        </p>
      </cd-slide>

      <!-- 7. O que vamos acompanhar -->
      <cd-slide [numero]="7" [total]="7">
        <span class="rotulo">A despedida</span>
        <p class="manchete compacta">Vingadores: Doutor Destino estreia em 17/12. É o último filme que ele gravou, de novo como Xavier.</p>
        <p class="texto">Vamos comparar com as maiores estreias dele desde 2016 (público da 1ª semana):</p>
        <ul class="regua">
          @for (e of estreias; track e.titulo) {
            <li>
              <strong>{{ curto(e.publico) }}</strong>
              <span class="quem">{{ e.titulo }} <small>{{ e.ano }}</small></span>
            </li>
          }
        </ul>
        <p class="pergunta">Xavier ou Picard: qual papel dele marcou você? Siga <span class="destaque">&#64;cinedata.br</span></p>
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
    .base .manchete.grande { font-size: 9.6cqw; margin-bottom: 3cqw; }
    .base > .texto { font-size: 4.2cqw; text-wrap: pretty; }
    .base + .arraste { margin-top: 4cqw; }

    .sinopse { text-wrap: balance; }
    .ficha { margin: 5cqw 0 0; display: flex; flex-direction: column; gap: 2cqw; }
    .ficha div { display: grid; grid-template-columns: 24cqw 1fr; gap: 2cqw; font-size: 3.6cqw; }
    .ficha dt { color: var(--cd-tela-3); }
    .ficha dd { margin: 0; color: var(--cd-tela); font-weight: 600; }

    .linha-do-tempo { list-style: none; margin: auto 0 0; padding: 0 0 0 3cqw; display: flex; flex-direction: column; gap: 2cqw; border-left: .4cqw solid var(--cd-linha); }
    .linha-do-tempo li { display: grid; grid-template-columns: 12cqw 1fr; gap: 2cqw; align-items: baseline; font-size: 3.4cqw; line-height: 1.25; color: var(--cd-tela-2); position: relative; }
    .linha-do-tempo li::before { content: ''; position: absolute; left: -4.5cqw; top: 1.2cqw; width: 2.2cqw; height: 2.2cqw; border-radius: 50%; background: var(--cd-sala); border: .4cqw solid var(--cd-projetor); }
    .linha-do-tempo strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4.2cqw; letter-spacing: -0.02em; color: var(--cd-tela); font-variant-numeric: tabular-nums; }
    .linha-do-tempo span { text-wrap: pretty; }
    .linha-do-tempo em { font-style: normal; color: var(--cd-tela); font-weight: 600; }
    .linha-do-tempo li.fim::before { background: var(--cd-projetor); }
    .linha-do-tempo li.fim strong { color: var(--cd-projetor); }

    .frase { margin: 0; }
    .frase p { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 8.4cqw; line-height: 1.08; letter-spacing: -0.03em; text-wrap: balance; }
    .original { font-size: 3.3cqw; font-style: italic; color: var(--cd-tela-2); margin-top: 3cqw; text-wrap: pretty; }
    .quem { font-size: 3.8cqw; font-weight: 600; color: var(--cd-projetor); margin-top: 2.4cqw; }
    .quem em { font-style: italic; }
    .quem + .texto { margin-top: 4cqw; font-size: 3.6cqw; }

    .base .numero { font-size: 14cqw; }
    .base .manchete.pequena { margin-top: 1.4cqw; text-wrap: balance; }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; margin-top: 5cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: .8cqw; padding: 3cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .85); border: .3cqw solid var(--cd-linha); }
    .comparacao strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8cqw; line-height: 1; letter-spacing: -0.03em; }
    .comparacao span { font-size: 3.2cqw; color: var(--cd-tela-2); line-height: 1.3; text-wrap: pretty; }

    .manchete.compacta { font-size: 5.4cqw; text-wrap: balance; }
    .ranking { list-style: none; margin: 3cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.4cqw; }
    .ranking li { display: grid; grid-template-columns: 1fr auto; row-gap: .8cqw; column-gap: 2cqw; align-items: baseline; font-size: 3.2cqw; color: var(--cd-tela-2); }
    .ranking .nome { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ranking small { font-size: 2.8cqw; color: var(--cd-tela-3); margin-left: 1cqw; }
    .ranking .valor { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--cd-tela); }
    .ranking .trilho { grid-column: 1 / -1; display: block; }
    .ranking .barra { display: block; height: 1.6cqw; border-radius: 0 .8cqw .8cqw 0; background: color-mix(in oklab, var(--cd-dado-ambar) 40%, var(--cd-poltrona-2)); }
    .ranking li.forte .nome { color: var(--cd-tela); font-weight: 600; }
    .ranking li.forte .barra { background: var(--cd-dado-ambar); }
    .ranking li.forte .valor { color: var(--cd-projetor); font-family: var(--cd-fonte-display); font-weight: 800; }
    .ranking + .nota { font-size: 2.9cqw; text-wrap: pretty; }

    .manchete.compacta + .texto { margin-top: 3cqw; font-size: 3.7cqw; }
    .regua { list-style: none; margin: 3cqw 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; }
    .regua li { display: flex; flex-direction: column; gap: 1cqw; padding: 2.8cqw 3.4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); font-size: 3.5cqw; color: var(--cd-tela-2); }
    .regua .quem { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4cqw; color: var(--cd-tela); white-space: nowrap; }
    .regua .quem small { display: block; font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3cqw; color: var(--cd-tela-3); margin-top: .6cqw; }
    .regua strong { font-family: var(--cd-fonte-display); font-weight: 800; color: var(--cd-projetor); font-size: 7cqw; line-height: 1; letter-spacing: -0.03em; }
    .pergunta { margin-top: auto; padding-top: 3cqw; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesNoticiaPatrickStewart {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('gHzfytt17AAaGuvkIKUC20CZ6gL.jpg'),
    doisXavier: tmdb('mDamDyeFwQiHCmYsWR9YEy0V0Y8.jpg'),
    logan: tmdb('yEv8c6i79vk06sZDC3Z9D8HQLVV.jpg'),
    cadeira: tmdb('aCxTSTb2ujpkkX8xAX2nCzSKNwI.jpg'),
  };
  protected readonly filmes = filmes;
  protected readonly xavier = filmes.filter(f => f.xavier);
  protected readonly somaXavier = soma(this.xavier);
  protected readonly somaTodos = soma(filmes);
  protected readonly logan = filmes.find(f => f.titulo === 'Logan')!;
  protected readonly doutorEstranho = filmes.find(f => f.titulo.startsWith('Doutor Estranho'))!;
  protected readonly grandes = grandes;
  protected readonly outros = outros;
  protected readonly maximo = porPublico[0].publico;
  protected readonly nomesOutros = outros.slice(0, 3).map(f => f.titulo).join(', ');
  protected readonly somaOutros = soma(outros);
  protected readonly loganLegendado = loganLegendado;
  protected readonly fatiaLegendado = Math.round((loganLegendado.publico / loganLegendado.total) * 100);
  protected readonly estreias = estreias;
  protected readonly milhoes = milhoes;
  protected readonly curto = curto;
}
