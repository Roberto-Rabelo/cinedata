import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

interface FilmeTerror {
  posicao: number;
  titulo: string;
  ano: number;
  publico: number;
  /** Renda total em R$, nominal (sem correção pela inflação). */
  renda: number;
  /** Cena de divulgação no TMDB e o object-position do recorte 4:5. */
  imagem: string;
  posicao4x5: string;
}

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/**
 * Os 10 filmes de terror mais vistos nos cinemas do Brasil entre os lançados desde 2016, pelo consolidado de
 * lançamentos comerciais da ANCINE (público e renda de toda a carreira do filme). Terror como gênero principal;
 * critério, exclusões e SQL em docs/posts/halloween-terror-top10/legenda.md.
 */
const top10: FilmeTerror[] = [
  { posicao: 1, titulo: 'A Freira', ano: 2018, publico: 5_288_640, renda: 76_346_873, imagem: tmdb('cMnVmutb5mVgIBeiMOncAbwNjvG.jpg'), posicao4x5: '56% 50%' },
  { posicao: 2, titulo: 'Invocação do Mal 4: O Último Ritual', ano: 2025, publico: 4_677_895, renda: 96_662_489, imagem: tmdb('i8MupUe4xgmYXoRNAQMYvuoexSU.jpg'), posicao4x5: '55% 50%' },
  { posicao: 3, titulo: 'It: A Coisa', ano: 2017, publico: 4_424_375, renda: 62_062_142, imagem: tmdb('qVGpxnjrGlHaSTCqTQI6viBDSfp.jpg'), posicao4x5: '32% 50%' },
  { posicao: 4, titulo: 'Invocação do Mal 2', ano: 2016, publico: 3_613_365, renda: 47_172_846, imagem: tmdb('mFCS5OuhPYT79KXu5jl7RqznPR1.jpg'), posicao4x5: '50% 50%' },
  { posicao: 5, titulo: 'It: Capítulo Dois', ano: 2019, publico: 3_157_825, renda: 47_757_632, imagem: tmdb('6LVSrgm83UYWlrLTCVGmWhFKYO0.jpg'), posicao4x5: '68% 50%' },
  { posicao: 6, titulo: 'A Freira 2', ano: 2023, publico: 3_016_574, renda: 55_012_523, imagem: tmdb('27jtaS1oCiLK5Y7P6iOXG2yj1Nc.jpg'), posicao4x5: '60% 50%' },
  { posicao: 7, titulo: "Five Nights at Freddy's", ano: 2023, publico: 2_960_417, renda: 53_664_726, imagem: tmdb('7NRGAtu8E4343NSKwhkgmVRDINw.jpg'), posicao4x5: '58% 50%' },
  { posicao: 8, titulo: 'Annabelle 2: A\u00a0Criação do Mal', ano: 2017, publico: 2_957_303, renda: 40_538_041, imagem: tmdb('o8u0NyEigCEaZHBdCYTRfXR8U4i.jpg'), posicao4x5: '52% 50%' },
  { posicao: 9, titulo: 'Órfã 2: A Origem', ano: 2022, publico: 2_151_675, renda: 27_753_514, imagem: tmdb('e77LAFvZq5KteWsKxuc5nP9B6OD.jpg'), posicao4x5: '46% 50%' },
  { posicao: 10, titulo: "Five Nights at Freddy's 2", ano: 2025, publico: 1_955_358, renda: 38_512_639, imagem: tmdb('uuvN5g4hnl1DDVJH2gJz8euSTYP.jpg'), posicao4x5: '72% 50%' },
];

/** Universo Invocação do Mal: A Freira, Invocação 4, Invocação 2, A Freira 2 e Annabelle 2. */
const universoInvocacao = [1, 2, 4, 6, 8];
/** O terror brasileiro mais visto lançado desde 2016 (terror-comédia). */
const terrorNacional = { titulo: 'Os Exterminadores do Além contra a Loira do Banheiro', ano: 2018, publico: 181_695 };

const total = 12;
/** Milhões com uma casa fixa ("55,0", não "55"), para os valores alinharem entre os slides. */
const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);

/** Especial de Halloween (12 slides 1080×1350): capa, um slide por filme e o que a lista revela. */
@Component({
  selector: 'cd-slides-halloween',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Halloween: top 10 do terror</h1>
        <p class="secundario">12 slides 1080×1350. PNGs em docs/posts/halloween-terror-top10.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="total" fundo="https://image.tmdb.org/t/p/w1280/tfKxFPq4lel0bL80H0C6kGYKGEq.jpg"
                posicaoFundo="42% 50%" credito="Imagem: divulgação">
        <div class="capa base">
          <span class="rotulo">Especial de Halloween</span>
          <p class="manchete grande">Os 10 filmes de terror mais vistos nos cinemas do Brasil</p>
          <p class="numero medio">{{ milhoes(somaPublico) }} milhões</p>
          <p class="texto claro">de espectadores e R$ {{ milhoes(somaRenda) }} milhões em bilheteria, desde 2016.</p>
        </div>
        <p class="arraste">Arraste se tiver coragem →</p>
      </cd-slide>

      <!-- 2 a 11. Um filme por slide, do 1º ao 10º -->
      @for (f of top10; track f.posicao) {
        <cd-slide [numero]="f.posicao + 1" [total]="total" [fundo]="f.imagem" [posicaoFundo]="f.posicao4x5" credito="Imagem: divulgação">
          <div class="filme base">
            <p class="lugar">{{ f.posicao }}º</p>
            <p class="titulo">{{ f.titulo }}</p>
            <p class="ano">{{ f.ano }}</p>
            <div class="dados">
              <div><strong>{{ formatar.inteiro(f.publico) }}</strong><span>espectadores</span></div>
              <div><strong>R$ {{ milhoes(f.renda) }} mi</strong><span>de bilheteria</span></div>
            </div>
            <span class="barra" [style.width.%]="(f.publico / top10[0].publico) * 100"></span>
          </div>
        </cd-slide>
      }

      <!-- 12. O que a lista revela -->
      <cd-slide [numero]="12" [total]="total">
        <span class="rotulo">O que a lista revela</span>
        <ul class="fatos">
          <li><strong>5 de 10</strong><span>são do universo Invocação do Mal ({{ milhoes(somaInvocacao) }} milhões de espectadores).</span></li>
          <li><strong>R$ {{ milhoes(top10[1].renda) }} mi</strong><span>Invocação do Mal 4 arrecadou mais que A Freira, com menos público (valores sem correção).</span></li>
          <li><strong>{{ nacionalMil }} mil</strong><span>no maior terror nacional desde 2016: Os Exterminadores do Além contra a Loira do Banheiro.</span></li>
        </ul>
        <p class="pergunta">Qual desses te deu mais medo?</p>
      </cd-slide>
    </div>
  `,
  styles: `
    .base { margin-top: auto; }
    .claro { color: var(--cd-tela); }
    .capa .manchete.grande { font-size: 10cqw; margin: 0 0 4cqw; }
    .capa .numero.medio { font-size: 11cqw; }
    .capa .texto { font-size: 4.2cqw; margin-top: 1.4cqw; }
    .capa + .arraste { margin-top: 4cqw; }

    .filme { display: flex; flex-direction: column; }
    .lugar { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 16cqw; line-height: .9; letter-spacing: -0.04em; color: var(--cd-projetor); }
    .titulo { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8.4cqw; line-height: 1.02; letter-spacing: -0.03em; margin-top: 2cqw; text-wrap: balance; }
    .ano { font-size: 3.6cqw; color: var(--cd-tela-2); margin-top: 1.2cqw; }
    .dados { display: grid; grid-template-columns: 1fr 1fr; gap: 4cqw; margin-top: 5cqw; }
    .dados div { display: flex; flex-direction: column; gap: .6cqw; }
    .dados strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 8cqw; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
    .dados span { font-size: 3.4cqw; color: var(--cd-tela-2); }
    .barra { display: block; height: 1.6cqw; margin-top: 4cqw; border-radius: 0 .8cqw .8cqw 0; background: var(--cd-dado-ambar); }

    .fatos { list-style: none; padding: 0; margin: 2cqw 0 0; display: flex; flex-direction: column; gap: 3cqw; }
    .fatos li { display: grid; grid-template-columns: 29cqw 1fr; align-items: center; gap: 2.4cqw; padding: 2.6cqw 3.4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .fatos strong { white-space: nowrap; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6cqw; line-height: 1; letter-spacing: -0.03em; color: var(--cd-projetor); }
    .fatos span { font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 6cqw; line-height: 1.2; letter-spacing: -0.02em; }
  `,
})
export class SlidesHalloween {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly top10 = top10;
  protected readonly total = total;
  protected readonly terrorNacional = terrorNacional;
  protected readonly formatar = formatar;
  protected readonly milhoes = milhoes;
  protected readonly somaPublico = top10.reduce((t, f) => t + f.publico, 0);
  protected readonly somaRenda = top10.reduce((t, f) => t + f.renda, 0);
  protected readonly somaInvocacao = top10.filter(f => universoInvocacao.includes(f.posicao)).reduce((t, f) => t + f.publico, 0);
  protected readonly nacionalMil = formatar.decimal(Math.round(terrorNacional.publico / 100) / 10);
}
