import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Logo } from '../../shared/ui/logo';
import dados from './dia-cinema-brasileiro-2026.json';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;
const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);

const [aindaEstouAqui, agenteSecreto] = dados.filmes;

/**
 * CineData | Dia do Cinema Brasileiro (05/11/2026): três falas de filmes brasileiros, cada uma com o Brasil que o filme
 * retrata, o paralelo com a vida real e o público nos cinemas. 6 slides 1080×1350: capa, por que 5 de novembro, os três
 * filmes e o paralelo entre eles. Dados em dia-cinema-brasileiro-2026.json.
 */
@Component({
  selector: 'cd-slides-dia-cinema-brasileiro',
  imports: [Slide, Logo, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Dia do Cinema Brasileiro</h1>
        <p class="secundario">6 slides 1080×1350. PNGs em docs/posts/dia-cinema-brasileiro-2026.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa: as três cenas empilhadas -->
      <cd-slide [numero]="1" [total]="total" [cheio]="true">
        <div class="capa-cenas">
          @for (f of filmes; track f.slug) {
            <figure class="faixa-cena">
              <img [src]="imagem(f.imagem)" [style.object-position]="f.posicao" alt="" />
              <figcaption class="legenda pequena">{{ f.fala }}</figcaption>
            </figure>
          }
          <div class="capa-texto">
            <div class="linha-topo">
              <span class="selo">5 de novembro</span>
              <span class="contador">1/{{ total }}</span>
            </div>
            <p class="manchete grande">Dia do Cinema Brasileiro: 3 falas, 3 Brasis</p>
            <p class="texto claro">Do Rio de 1971 ao sertão de Taperoá. {{ milhoes(somaPublico) }} milhões de pessoas foram ver estes filmes.</p>
            <div class="linha-base">
              <cd-logo [tamanho]="null" />
              <span class="arraste">Arraste →</span>
            </div>
          </div>
        </div>
      </cd-slide>

      <!-- 2. Por que 5 de novembro -->
      <cd-slide [numero]="2" [total]="total">
        <span class="rotulo">Por que hoje</span>
        <p class="manchete">O cinema brasileiro tem dois dias</p>
        <ol class="linha-do-tempo">
          <li><strong>19/06/1898</strong><span>Afonso Segreto filma a Baía de Guanabara de um navio: as primeiras imagens em movimento feitas no Brasil.</span></li>
          <li><strong>05/11/1983</strong><span>Morre Humberto Mauro, de <em>Ganga Bruta</em>, um dos pioneiros. Hoje, 5 de novembro, é o Dia Nacional do Cinema Brasileiro.</span></li>
        </ol>
        <div class="dado">
          <p class="numero medio">{{ milhoes(dados.brasileiros.publico) }} milhões</p>
          <p class="texto claro">de ingressos para os {{ formatar.inteiro(dados.brasileiros.filmes) }} filmes brasileiros lançados nos cinemas desde 2009.</p>
        </div>
      </cd-slide>

      <!-- 3 a 5. Os filmes: a cena com a fala, o Brasil do filme e o da vida real -->
      @for (f of filmes; track f.slug; let i = $index) {
        <cd-slide [numero]="i + 3" [total]="total" [cheio]="true">
          <div class="filme">
            <figure class="quadro">
              <img [src]="imagem(f.imagem)" [style.object-position]="f.posicao" alt="" />
              <figcaption class="legenda">{{ f.fala }}</figcaption>
            </figure>
            <div class="painel">
              <div class="linha-topo">
                <span class="lugar">{{ f.lugar }}</span>
                <span class="contador">{{ i + 3 }}/{{ total }}</span>
              </div>
              <p class="titulo"><em>{{ f.titulo }}</em> ({{ f.ano }}) <small>{{ f.quem }}</small></p>
              <p class="bloco"><b>No filme</b>{{ f.noFilme }}</p>
              <p class="bloco"><b>Na vida real</b>{{ f.naVida }}</p>
              <p class="publico"><strong>{{ f.numero }}</strong><span>{{ f.numeroTexto }}</span></p>
              <div class="linha-base">
                <cd-logo [tamanho]="null" />
                <small><span>Fonte: ANCINE · Imagem: divulgação</span><b>&#64;cinedata.br</b></small>
              </div>
            </div>
          </div>
        </cd-slide>
      }

      <!-- 6. O paralelo -->
      <cd-slide [numero]="total" [total]="total">
        <span class="rotulo">O paralelo</span>
        <p class="manchete compacta">Em dois anos, {{ milhoes(ditadura) }} milhões de ingressos para dois filmes sobre a ditadura</p>
        <ol class="ranking" aria-label="Público nos cinemas de Ainda Estou Aqui e O Agente Secreto">
          @for (f of ditaduraFilmes; track f.slug) {
            <li>
              <span class="nome">{{ f.titulo }} <small>{{ f.lugar }}</small></span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / aindaEstouAqui.publico) * 100"></span></span>
              <span class="valor">{{ milhoes(f.publico) }} mi</span>
            </li>
          }
        </ol>
                <p class="pergunta">Qual fala do cinema brasileiro você mais repete?</p>
        <p class="nota">Conta nos comentários. O público foi ver o próprio país, e saiu repetindo as falas.</p>
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

    /* Legenda de cinema: branca, centralizada, com contorno escuro para ler em qualquer imagem. */
    .legenda {
      position: absolute; left: 6cqw; right: 6cqw; bottom: 3.4cqw; text-align: center; text-wrap: balance;
      font-family: var(--cd-fonte-texto); font-weight: 500; font-size: 4.8cqw; line-height: 1.25; color: #fff;
      text-shadow: 0 0 .5cqw #000, 0 0 .5cqw #000, .2cqw .2cqw .4cqw #000, -.2cqw -.2cqw .4cqw #000;
    }
    .legenda.pequena { font-size: 3.6cqw; bottom: 2cqw; }
    figure { margin: 0; position: relative; overflow: hidden; }
    figure img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .capa-cenas { height: 100%; display: flex; flex-direction: column; background: #000; }
    .faixa-cena { flex: 1 1 0; min-height: 0; }
    .faixa-cena + .faixa-cena { border-top: .5cqw solid #000; }
    .capa-texto { flex: none; display: flex; flex-direction: column; gap: 2.4cqw; padding: 5cqw 7.4cqw 5.4cqw; background: var(--cd-sala); }
    .capa-texto .manchete.grande { font-size: 8cqw; text-wrap: balance; }
    .capa-texto .texto { font-size: 3.8cqw; }
    .capa-texto .arraste { font-size: 3.4cqw; }

    .linha-do-tempo { list-style: none; padding: 0; margin: 4cqw 0 0; display: flex; flex-direction: column; gap: 3.4cqw; }
    .linha-do-tempo li { display: grid; grid-template-columns: 24cqw 1fr; gap: 3cqw; padding-left: 3cqw; border-left: .6cqw solid var(--cd-projetor); }
    .linha-do-tempo strong { font-family: var(--cd-fonte-display); font-size: 4cqw; font-variant-numeric: tabular-nums; }
    .linha-do-tempo span { font-size: 3.4cqw; line-height: 1.4; color: var(--cd-tela-2); }
    .dado { margin-top: auto; }
    .dado .texto { font-size: 3.8cqw; margin-top: 1cqw; }

    .filme { height: 100%; display: flex; flex-direction: column; background: var(--cd-sala); }
    .quadro { flex: 1 1 0; min-height: 0; }
    .painel { flex: none; display: flex; flex-direction: column; gap: 2cqw; padding: 4cqw 7.4cqw 4.6cqw; }
    .lugar { font-size: 3cqw; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--cd-projetor); }
    .titulo { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.2cqw; line-height: 1.1; letter-spacing: -0.02em; }
    .titulo small { display: block; margin-top: 1cqw; font-family: var(--cd-fonte-texto); font-weight: 500; font-size: 3.2cqw; letter-spacing: 0; color: var(--cd-tela-2); }
    .bloco { font-size: 3.3cqw; line-height: 1.4; color: var(--cd-tela-2); text-wrap: pretty; }
    .bloco b { display: block; font-size: 2.6cqw; letter-spacing: .1em; text-transform: uppercase; color: var(--cd-tela); margin-bottom: .4cqw; }
    .publico { display: flex; align-items: baseline; gap: 2.4cqw; margin-top: 1cqw; }
    .publico strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; letter-spacing: -0.04em; color: var(--cd-projetor); white-space: nowrap; }
    .publico span { font-size: 3.2cqw; line-height: 1.3; color: var(--cd-tela); }

    .ranking { list-style: none; padding: 0; margin: 4cqw 0 3cqw; display: flex; flex-direction: column; gap: 2cqw; }
    .manchete.compacta { font-size: 5.2cqw; text-wrap: balance; }
    .ranking li { display: grid; grid-template-columns: 1fr auto; gap: 1.2cqw 3cqw; align-items: center; }
    .ranking .nome { grid-column: 1 / -1; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; }
    .ranking .nome small { font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3cqw; color: var(--cd-tela-3); margin-left: 1cqw; }
    .ranking .trilho { height: 3.2cqw; background: var(--cd-poltrona); border-radius: .8cqw; overflow: hidden; }
    .ranking .barra { display: block; height: 100%; background: var(--cd-dado-ambar); border-radius: 0 .8cqw .8cqw 0; }
    .ranking .valor { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; font-variant-numeric: tabular-nums; }
    .pergunta { margin-top: 3cqw; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.4cqw; line-height: 1.15; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesDiaCinemaBrasileiro {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly dados = dados;
  protected readonly filmes = dados.filmes;
  protected readonly aindaEstouAqui = aindaEstouAqui;
  protected readonly ditaduraFilmes = [aindaEstouAqui, agenteSecreto];
  protected readonly total = 6;
  protected readonly somaPublico = dados.filmes.reduce((s, f) => s + f.publico, 0);
  protected readonly ditadura = aindaEstouAqui.publico + agenteSecreto.publico;
  protected readonly imagem = tmdb;
  protected readonly milhoes = milhoes;
  protected readonly formatar = formatar;
}
