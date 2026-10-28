import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import dados from './semestre-2026-top10.json';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/**
 * Os 10 filmes mais vistos entre os lançados nos cinemas do Brasil de janeiro a junho de 2026, pelo consolidado de
 * lançamentos comerciais da ANCINE (público e renda de toda a carreira, até a última publicação). Critério e SQL em
 * docs/posts/semestre-2026-top10/legenda.md. Os dados ficam em semestre-2026-top10.json, que o vídeo também lê. A renda é
 * nominal; a imagem é uma cena de divulgação no TMDB, com o object-position do recorte 4:5.
 */
const top10 = dados.filmes.map(f => ({ ...f, imagem: tmdb(f.imagem), escurecer: 'escurecer' in f && f.escurecer === true }));

const total = 12;
/** Milhões com uma casa fixa ("55,0", não "55"), para os valores alinharem entre os slides. */
const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);
const somaPublico = top10.reduce((t, f) => t + f.publico, 0);

/** Especial do 1º semestre de 2026 (12 slides 1080×1350): capa, um slide por filme e o que a lista revela. */
@Component({
  selector: 'cd-slides-semestre-2026',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>1º semestre de 2026: top 10</h1>
        <p class="secundario">12 slides 1080×1350. PNGs em docs/posts/semestre-2026-top10.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="total" [fundo]="capa" posicaoFundo="50% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="capa base">
          <span class="rotulo">Especial · 1º semestre de 2026</span>
          <p class="manchete grande">Os 10 filmes que bombaram nos cinemas do Brasil</p>
          <p class="numero medio">{{ milhoes(somaPublico) }} milhões</p>
          <p class="texto claro">de espectadores e R$ {{ milhoes(somaRenda) }} milhões em bilheteria, entre os lançados de janeiro a junho.</p>
        </div>
        <p class="arraste">Arraste e veja o ranking →</p>
      </cd-slide>

      <!-- 2 a 11. Um filme por slide, do 1º ao 10º -->
      @for (f of top10; track f.posicao) {
        <cd-slide [numero]="f.posicao + 1" [total]="total" [fundo]="f.imagem" [posicaoFundo]="f.posicao4x5"
                  [escurecer]="f.escurecer" credito="Imagem: divulgação">
          <div class="filme base">
            <p class="lugar">{{ f.posicao }}º</p>
            <p class="titulo">{{ f.titulo }}</p>
            <p class="ano">Estreou em {{ formatar.diaMes(f.estreia) }}</p>
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
          <li><strong>{{ fatiaTop10 }}%</strong><span>do público dos {{ dados.lancamentosSemestre.obras }} filmes lançados no semestre ficou com estes 10.</span></li>
          <li><strong>{{ formatar.variacao(variacao2025) }}</strong><span>sobre o top 10 do 1º semestre de 2025 ({{ milhoes(dados.top10Semestre2025.publico) }} milhões, com {{ dados.top10Semestre2025.primeiro }} na frente).</span></li>
          <li><strong>{{ nacionalMil }} mil</strong><span>no nacional mais visto do semestre: {{ dados.nacional.titulo }}.</span></li>
        </ul>
        <p class="pergunta">Qual desses você viu no cinema?</p>
      </cd-slide>
    </div>
  `,
  styles: `
    .base { margin-top: auto; }
    .claro { color: var(--cd-tela); }
    .capa .manchete.grande { font-size: 10cqw; margin: 0 0 4cqw; }
    .capa .numero.medio { font-size: 11cqw; }
    .capa .texto { font-size: 4.2cqw; margin-top: 1.4cqw; text-wrap: pretty; }
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
    .fatos span { font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 6cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesSemestre2026 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly top10 = top10;
  protected readonly dados = dados;
  protected readonly capa = tmdb(dados.capa);
  protected readonly total = total;
  protected readonly formatar = formatar;
  protected readonly milhoes = milhoes;
  protected readonly somaPublico = somaPublico;
  protected readonly somaRenda = top10.reduce((t, f) => t + f.renda, 0);
  protected readonly fatiaTop10 = Math.round((somaPublico / dados.lancamentosSemestre.publico) * 100);
  /** Variação inteira ("+8%"): a casa decimal não muda a leitura. */
  protected readonly variacao2025 = Math.round((somaPublico / dados.top10Semestre2025.publico - 1) * 100);
  protected readonly nacionalMil = formatar.inteiro(Math.round(dados.nacional.publico / 1000));
}
