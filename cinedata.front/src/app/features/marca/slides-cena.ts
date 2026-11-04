import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/ui/logo';
import dados from './cenas.json';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/**
 * CineData | Cena: o post coringa, para dias sem pauta. Uma fala marcante de filme em duas cenas de divulgação, com a
 * legenda em português (slide 1), e o número do filme nos cinemas do Brasil (slide 2). Os dados de cada cena estão em
 * cenas.json, que o vídeo (scripts/gerar-video-cena.mjs) também lê. Rota: /marca/cena/<slug>.
 */
@Component({
  selector: 'cd-slides-cena',
  imports: [Slide, Logo, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Cena: {{ cena()?.titulo ?? 'não encontrada' }}</h1>
        <p class="secundario">
          2 slides 1080×1350. PNGs em docs/posts/cena-{{ slug() }}. Outras cenas:
          @for (c of cenas; track c.slug) { <a [routerLink]="['/marca/cena', c.slug]">{{ c.titulo }}</a>{{ $last ? '' : ' · ' }} }
        </p>
      </header>
    }
    @if (cena(); as c) {
      <div class="slides">
        <!-- 1. A cena: duas imagens com a fala em legenda -->
        <cd-slide [numero]="1" [total]="2" [cheio]="true">
          <div class="cena">
            @for (f of c.falas; track f.imagem) {
              <figure class="quadro">
                <img [src]="imagem(f.imagem)" [style.object-position]="f.posicao" alt="" />
                <figcaption class="legenda">{{ f.texto }}</figcaption>
              </figure>
            }
            <div class="faixa">
              <cd-logo [tamanho]="null" />
              <span class="credito"><span><em>{{ c.titulo }}</em> ({{ c.ano }})</span><small>Imagens: divulgação · <b>&#64;cinedata.br</b></small></span>
            </div>
          </div>
        </cd-slide>

        <!-- 2. O número -->
        <cd-slide [numero]="2" [total]="2" [fundo]="imagem(c.falas[0].imagem)" [posicaoFundo]="c.falas[0].posicao" [escurecer]="true" credito="Imagem: divulgação">
          <div class="base">
            <!-- Filme em outra língua: a tradução já está na legenda do slide 1; aqui vai a fala original. -->
            <p class="fala" [class.longa]="falaDestaque().length > 90">“{{ falaDestaque() }}”</p>
            <p class="quem">{{ c.quem }}, em <em>{{ c.titulo }}</em> ({{ c.ano }})</p>
            <p class="texto claro">{{ c.contexto }}</p>
            <p class="numero medio">{{ c.numero }}</p>
            <p class="texto claro forte">{{ c.numeroTexto }}</p>
            <p class="texto claro">{{ c.fato }}</p>
            <p class="pergunta">{{ c.pergunta }}</p>
          </div>
        </cd-slide>
      </div>
    }
  `,
  styles: `
    .cena { height: 100%; display: flex; flex-direction: column; background: #000; }
    .quadro { flex: 1 1 0; min-height: 0; margin: 0; position: relative; overflow: hidden; }
    .quadro + .quadro { border-top: .5cqw solid #000; }
    .quadro img { width: 100%; height: 100%; object-fit: cover; display: block; }
    /* Legenda de cinema: branca, centralizada, com contorno escuro para ler em qualquer imagem. */
    .legenda {
      position: absolute; left: 6cqw; right: 6cqw; bottom: 4cqw; text-align: center; text-wrap: balance;
      font-family: var(--cd-fonte-texto); font-weight: 500; font-size: 4.6cqw; line-height: 1.25; color: #fff;
      text-shadow: 0 0 .5cqw #000, 0 0 .5cqw #000, .2cqw .2cqw .4cqw #000, -.2cqw -.2cqw .4cqw #000;
    }
    .faixa {
      flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 3cqw;
      padding: 2.6cqw 5cqw; background: var(--cd-sala); font-size: 2.6cqw; color: var(--cd-tela-3);
    }
    .faixa cd-logo { font-size: 4cqw; flex: none; }
    .faixa .credito { display: flex; flex-direction: column; align-items: flex-end; gap: .6cqw; font-size: 3cqw; }
    .faixa small { font-size: 2.6cqw; }
    .faixa em { color: var(--cd-tela-2); }
    .faixa b { color: var(--cd-tela-2); font-weight: 600; }

    .base { margin-top: auto; display: flex; flex-direction: column; }
    .claro { color: var(--cd-tela); }
    .fala { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.6cqw; line-height: 1.1; letter-spacing: -0.03em; text-wrap: balance; }
    .fala.longa { font-size: 4.6cqw; line-height: 1.15; }
    .quem { font-size: 3.4cqw; font-weight: 600; color: var(--cd-projetor); margin-top: 2cqw; }
    .quem + .texto { margin-top: 2cqw; font-size: 3.4cqw; }
    .numero.medio { margin-top: 3.6cqw; }
    .forte { font-weight: 600; margin-top: .6cqw; }
    .forte + .texto { margin-top: 2cqw; font-size: 3.4cqw; }
    .pergunta { margin-top: 3cqw; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.4cqw; line-height: 1.2; letter-spacing: -0.02em; }
  `,
})
export class SlidesCena {
  /** Parâmetro de rota :slug (vinculado pelo router). */
  readonly slug = input<string>();
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly cenas = dados.cenas;
  protected readonly cena = computed(() => dados.cenas.find(c => c.slug === this.slug()));
  protected readonly falaDestaque = computed(() => {
    const c = this.cena();
    return c?.original ?? (c?.falas ?? []).map(f => f.texto).join(' ');
  });
  protected readonly imagem = tmdb;
}
