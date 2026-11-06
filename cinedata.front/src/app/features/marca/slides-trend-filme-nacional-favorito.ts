import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Logo } from '../../shared/ui/logo';
import dados from './trend-filme-nacional-favorito.json';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;
const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);

/** Do 10º ao 1º: a contagem regressiva segura o leitor até o fim. */
const regressiva = [...dados.filmes].sort((a, b) => b.posicao - a.posicao);
/** Cenas das faixas da capa: filmes conhecidos, fora os do caso das salas vazias. */
const capa = [3, 4, 9, 6, 8].map(p => dados.filmes.find(f => f.posicao === p)!);

/**
 * CineData | Trend "Esse é o meu filme nacional favorito" (Dia do Cinema Brasileiro, 05/11/2026). O molde do trend
 * (duas cenas do filme e a frase no meio) com o dado do CineData: os 10 brasileiros mais vistos nos cinemas desde 2009,
 * do 10º ao 1º. 12 slides 1080×1350. Dados em trend-filme-nacional-favorito.json.
 */
@Component({
  selector: 'cd-slides-trend-filme-nacional-favorito',
  imports: [Slide, Logo, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Esse é o meu filme nacional favorito</h1>
        <p class="secundario">12 slides 1080×1350. PNGs em docs/posts/trend-filme-nacional-favorito.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa: faixas verticais com cenas, como no trend -->
      <cd-slide [numero]="1" [total]="total" [cheio]="true">
        <div class="capa">
          <div class="faixas">
            @for (f of capa; track f.obra) {
              <img [src]="imagem(f.cenas[0])" alt="" />
            }
          </div>
          <div class="capa-texto">
            <div class="linha-topo">
              <span class="selo">Dia do Cinema Brasileiro</span>
              <span class="contador">1/{{ total }}</span>
            </div>
            <p class="frase grande">Esse é o filme <span>nacional</span> favorito do Brasil?</p>
            <p class="texto claro">Os 10 brasileiros mais vistos nos cinemas desde 2009, do 10º ao 1º. O 1º lugar tem uma história.</p>
            <div class="linha-base">
              <cd-logo [tamanho]="null" />
              <span class="arraste">Arraste →</span>
            </div>
          </div>
        </div>
      </cd-slide>

      <!-- 2 a 11. Um filme por slide: duas cenas e a frase do trend no meio -->
      @for (f of filmes; track f.obra; let i = $index) {
        <cd-slide [numero]="i + 2" [total]="total" [cheio]="true">
          <div class="filme">
            <img class="cena" [src]="imagem(f.cenas[0])" alt="" />
            <img class="cena" [src]="imagem(f.cenas[1])" alt="" />
            <div class="topo">
              <span class="posicao">{{ f.posicao }}º</span>
              <span class="contador">{{ i + 2 }}/{{ total }}</span>
            </div>
            <div class="faixa">
              <p class="frase">Esse é o meu filme <span>nacional</span> favorito</p>
              <p class="nome">{{ f.titulo }}</p>
            </div>
            <div class="base">
              @if (f.nota; as nota) {
                <p class="nota-filme">{{ nota }}</p>
              }
              <p class="publico"><strong>{{ milhoes(f.publico) }} milhões</strong><span>de ingressos · {{ f.ano }}</span></p>
              <div class="linha-base">
                <cd-logo [tamanho]="null" />
                <small><span>Fonte: ANCINE · Imagens: TMDB/divulgação</span><b>&#64;cinedata.br</b></small>
              </div>
            </div>
          </div>
        </cd-slide>
      }

      <!-- 12. E o seu? -->
      <cd-slide [numero]="total" [total]="total">
        <span class="rotulo">E o seu?</span>
        <p class="manchete compacta">Ingresso vendido não é o mesmo que filme favorito</p>
        <p class="texto">
          Os 10 primeiros somam {{ milhoes(somaTop10) }} milhões de ingressos, {{ fatiaTop10 }}% de tudo o que os
          {{ formatar.inteiro(dados.brasileiros.filmes) }} filmes brasileiros venderam desde 2009. E nos dois primeiros, parte dos ingressos passou pela Igreja Universal.
        </p>
        <p class="texto">
          E <em>Cidade de Deus</em>, <em>Central do Brasil</em> e o primeiro <em>Auto da Compadecida</em> nem entram: são de antes
          de 2009, quando começa a série aberta da ANCINE.
        </p>
        <p class="pergunta">Qual é o seu filme nacional favorito? Conta aqui. 👇</p>
      </cd-slide>
    </div>
  `,
  styles: `
    .claro { color: var(--cd-tela); }
    .selo {
      align-self: flex-start; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.4cqw;
      letter-spacing: .02em; padding: 1.2cqw 2.8cqw; border-radius: 99cqw;
      color: var(--cd-sala); background: var(--cd-projetor);
    }
    .contador { font-size: 3cqw; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .linha-topo, .linha-base { display: flex; justify-content: space-between; align-items: center; gap: 3cqw; }
    .linha-base cd-logo { font-size: 4cqw; flex: none; }
    .linha-base small { font-size: 2.5cqw; color: var(--cd-tela-3); display: flex; flex-direction: column; align-items: flex-end; gap: .4cqw; }
    .linha-base b { color: var(--cd-tela-2); font-weight: 600; }

    /* A frase do trend: caixa alta, bem grande, com "nacional" no âmbar da marca. */
    .frase {
      font-family: var(--cd-fonte-display); font-weight: 800; text-transform: uppercase; text-align: center;
      font-size: 7cqw; line-height: 1.02; letter-spacing: -0.01em; color: #fff; text-wrap: balance;
      text-shadow: 0 .4cqw 2cqw rgb(0 0 0 / .6);
    }
    .frase span { color: var(--cd-projetor); }

    .capa { height: 100%; display: flex; flex-direction: column; background: #000; }
    .faixas { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: .5cqw; }
    .faixas img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(.85); }
    .capa-texto { flex: none; display: flex; flex-direction: column; gap: 2.6cqw; padding: 5cqw 7.4cqw 5.4cqw; background: var(--cd-sala); }
    .capa-texto .frase.grande { font-size: 8.4cqw; text-align: left; text-shadow: none; }
    .capa-texto .texto { font-size: 3.8cqw; }
    .capa-texto .arraste { font-size: 3.4cqw; }

    .filme { position: relative; height: 100%; display: grid; grid-template-rows: 1fr 1fr; gap: .5cqw; background: #000; }
    .cena { width: 100%; height: 100%; min-height: 0; object-fit: cover; display: block; }
    /* Véu: escurece o meio (onde fica a frase) e a base (o número). */
    .filme::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background:
        linear-gradient(to bottom, rgb(13 14 18 / .7), transparent 14%),
        radial-gradient(90% 22% at 50% 50%, rgb(13 14 18 / .78), transparent),
        linear-gradient(to top, var(--cd-sala) 4%, rgb(13 14 18 / .9) 22%, transparent 42%);
    }
    .filme > .topo, .filme > .faixa, .filme > .base { position: absolute; z-index: 1; left: 6.4cqw; right: 6.4cqw; }
    .filme > .topo { top: 5cqw; display: flex; justify-content: space-between; align-items: center; }
    .posicao {
      font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6cqw; line-height: 1;
      padding: 1cqw 2.6cqw; border-radius: 1.4cqw; color: var(--cd-sala); background: var(--cd-projetor);
      font-variant-numeric: tabular-nums;
    }
    .filme > .topo .contador { color: #fff; padding: .8cqw 2cqw; border-radius: 99cqw; background: rgb(13 14 18 / .7); }
    .filme > .faixa { top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 1.6cqw; }
    .nome {
      font-family: var(--cd-fonte-texto); font-weight: 600; font-size: 4.4cqw; letter-spacing: .08em; text-transform: uppercase;
      text-align: center; color: #fff; text-shadow: 0 .3cqw 1.4cqw rgb(0 0 0 / .8);
    }
    .filme > .base { bottom: 4.6cqw; display: flex; flex-direction: column; gap: 2cqw; }
    .nota-filme {
      font-size: 2.9cqw; line-height: 1.35; color: var(--cd-tela); text-wrap: pretty;
      padding: 1.8cqw 2.4cqw; border-left: .6cqw solid var(--cd-projetor); background: rgb(13 14 18 / .82);
    }
    .publico { display: flex; align-items: baseline; gap: 2.4cqw; }
    .publico strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; letter-spacing: -0.04em; color: var(--cd-projetor); white-space: nowrap; }
    .publico span { font-size: 3.3cqw; line-height: 1.3; color: var(--cd-tela); }

    .manchete.compacta { font-size: 6cqw; text-wrap: balance; }
    .texto { font-size: 3.5cqw; line-height: 1.45; color: var(--cd-tela-2); margin-top: 3cqw; text-wrap: pretty; }
    .texto em { color: var(--cd-tela); }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 6cqw; line-height: 1.15; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesTrendFilmeNacionalFavorito {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly dados = dados;
  protected readonly filmes = regressiva;
  protected readonly capa = capa;
  protected readonly total = dados.filmes.length + 2;
  protected readonly somaTop10 = dados.filmes.reduce((s, f) => s + f.publico, 0);
  protected readonly fatiaTop10 = Math.round((this.somaTop10 / dados.brasileiros.publico) * 100);
  protected readonly imagem = tmdb;
  protected readonly milhoes = milhoes;
  protected readonly formatar = formatar;
}
