import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { corOrigem, formatar } from '../../shared/formatar';
import { urlPoster } from '../../shared/ui/cartaz';
import dados from './mes-2026-10.json';
import { Slide } from './slide';

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const variacao = (atual: number, anterior: number) => Math.round(((atual - anterior) / anterior) * 1000) / 10;

const verity = dados.top10[0];
/** Maior público de outubro da série (2019): a escala do gráfico de colunas. */
const maiorOutubro = Math.max(...dados.outubros.map(o => o.publico));

/**
 * Outubro de 2026 em números (7 slides 1080×1350): o público visto no mês civil (soma das sessões de 01 a 31/10),
 * comparado com os outubros desde 2016, o filme do mês, o Top 10, a fatia dos nacionais e os dias que marcaram o mês.
 * Dados em mes-2026-10.json.
 */
@Component({
  selector: 'cd-slides-mes-2026-10',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Outubro de 2026 em números</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/mes-2026-10.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa: o total do mês -->
      <cd-slide [numero]="1" [total]="7" credito="Pôsteres: TMDB">
        <span class="rotulo">Outubro de 2026 em números</span>
        <div class="capa">
          <p class="numero">{{ umaCasa.format(dados.mes.publico / 1e6) }} milhões</p>
          <p class="manchete pequena">de ingressos nos cinemas em outubro.</p>
          <p class="manchete">
            <span class="alta">▲</span> {{ formatar.decimal(sobreOutubroAnterior) }}% sobre outubro de 2025,
            e o cinema brasileiro com <span class="destaque">{{ formatar.decimal(dados.mes.nacionalPct) }}%</span> do público.
          </p>
        </div>
        <div class="fileira">
          @for (f of dados.top10.slice(0, 5); track f.obra) { <img [src]="poster(f.poster)" alt="" /> }
        </div>
        <p class="arraste">Arraste →</p>
      </cd-slide>

      <!-- 2. Os outubros desde 2016 -->
      <cd-slide [numero]="2" [total]="7">
        <span class="rotulo">Os outubros desde 2016</span>
        <p class="manchete compacta">Depois do pior outubro fora da pandemia, a volta</p>
        <ol class="colunas" aria-label="Público de outubro, por ano">
          @for (o of dados.outubros; track o.ano) {
            <li [class.atual]="o.ano === 2026">
              <span class="valor-coluna">{{ umaCasa.format(o.publico / 1e6) }}</span>
              <span class="coluna" [style.height.%]="(o.publico / maiorOutubro) * 100"></span>
              <span class="ano">{{ o.ano.toString().slice(2) }}</span>
            </li>
          }
        </ol>
        <p class="texto legenda-grafico">
          Milhões de ingressos em outubro. Em 2025 foram {{ umaCasa.format(dados.outubroAnterior.publico / 1e6) }}
          milhões; 2026 ficou abaixo de 2023 e 2024.
        </p>
      </cd-slide>

      <!-- 3. O filme do mês -->
      <cd-slide [numero]="3" [total]="7" credito="Pôster: TMDB">
        <span class="rotulo">O filme do mês</span>
        <div class="filme-mes">
          <img class="cartaz-grande" [src]="poster(verity.poster)" alt="" />
          <div>
            <p class="nome-grande">{{ verity.titulo }}</p>
            <p class="numero medio">{{ duasCasas.format(verity.publico / 1e6) }} mi</p>
            <p class="sub">de ingressos em outubro</p>
          </div>
        </div>
        <ul class="fatos">
          <li><strong>{{ arredondado(fatiaVerity) }}%</strong><span>de todo o público do mês foi para Verity</span></li>
          <li><strong>{{ umaCasa.format(verity.publico / dados.outubroAnterior.lider.publico) }}×</strong><span>o líder de outubro de 2025 (<span class="junto">{{ dados.outubroAnterior.lider.titulo }}</span>, {{ arredondado(dados.outubroAnterior.lider.publico / 1000) }}&nbsp;mil)</span></li>
        </ul>
      </cd-slide>

      <!-- 4. Top 10 do mês -->
      <cd-slide [numero]="4" [total]="7">
        <span class="rotulo">Top 10 de outubro</span>
        <ol class="top10">
          @for (f of dados.top10; track f.obra) {
            <li>
              <span class="pos">{{ f.posicao }}</span>
              <span class="titulo" [class.longo]="f.titulo.length > 30">{{ f.titulo }}</span>
              <span class="valor">{{ formatar.inteiro(f.publico) }}</span>
              <span class="barra" [style.width.%]="(f.publico / verity.publico) * 100" [style.background]="cor[f.origem]"></span>
            </li>
          }
        </ol>
        <p class="legenda-cores"><span class="ponto" [style.background]="cor['Nacional']"></span>Nacional <span class="ponto" [style.background]="cor['Estrangeira']"></span>Estrangeiro</p>
      </cd-slide>

      <!-- 5. Cinema brasileiro -->
      <cd-slide [numero]="5" [total]="7" credito="Pôsteres: TMDB">
        <span class="rotulo">Cinema brasileiro</span>
        <p class="numero">{{ formatar.decimal(dados.mes.nacionalPct) }}%</p>
        <p class="manchete pequena">do público de outubro foi para filmes nacionais: {{ duasCasas.format(dados.mes.nacional / 1e6) }} milhões de ingressos.</p>
        <p class="texto contexto">
          Em outubro de 2025 foram {{ formatar.decimal(dados.outubroAnterior.nacionalPct) }}%. É a maior fatia num outubro
          desde 2016 ({{ formatar.decimal(dados.outubros[0].nacionalPct) }}%).
        </p>
        <ul class="nacionais">
          @for (f of nacionais; track f.obra) {
            <li>
              <img [src]="poster(f.poster)" alt="" />
              <div><strong>{{ formatar.inteiro(f.publico) }}</strong><span>{{ f.titulo }} ({{ f.posicao }}º)</span></div>
            </li>
          }
        </ul>
        <p class="texto contexto">Na última semana, com ingresso a R$&nbsp;12 para nacionais, a fatia chegou a {{ formatar.decimal(dados.festival.nacionalPct) }}%.</p>
      </cd-slide>

      <!-- 6. Os dias que marcaram o mês -->
      <cd-slide [numero]="6" [total]="7">
        <span class="rotulo">O mês em quatro números</span>
        <ul class="fatos grandes">
          @for (d of dados.dias; track d.data) {
            <li><strong>{{ arredondado(d.publico / 1000) }} mil</strong><span>no {{ d.rotulo }}, {{ $first ? 'o melhor dia do mês' : 'Dia das Crianças' }}</span></li>
          }
          <li><strong>{{ duasCasas.format(dados.semanaMaisFraca.publico / 1e6) }} mi</strong><span>de {{ dados.semanaMaisFraca.rotulo }}, a semana mais fraca de 2026</span></li>
          <li><strong><span class="queda">▼</span> {{ arredondado(-sobreSetembro) }}%</strong><span>sobre setembro ({{ umaCasa.format(dados.mes.setembro / 1e6) }}&nbsp;milhões)</span></li>
        </ul>
      </cd-slide>

      <!-- 7. Pergunta -->
      <cd-slide [numero]="7" [total]="7" credito="Pôsteres: TMDB">
        <span class="rotulo">Outubro de 2026</span>
        <div class="leque">
          @for (f of dados.top10.slice(0, 5); track f.obra; let i = $index) {
            <img [src]="poster(f.poster)" alt="" [style.--i]="i - 2" />
          }
        </div>
        <p class="pergunta">Qual filme você viu em outubro?</p>
        <p class="texto chamada">Conta aqui nos comentários. O ranking do mês e o filme mais visto em cada estado estão em <strong>cinedatabr.tech</strong>.</p>
      </cd-slide>
    </div>
  `,
  styles: `
    img { display: block; object-fit: cover; aspect-ratio: 2 / 3; border-radius: 1.4cqw; box-shadow: 0 0 0 .2cqw var(--cd-linha), 0 2cqw 5cqw rgb(0 0 0 / .5); }
    .alta { color: var(--cd-alta); }
    .queda { color: var(--cd-queda); }
    .manchete.compacta { font-size: 6cqw; text-wrap: balance; margin-top: 0; }
    .contexto { margin-top: 2.4cqw; }

    /* 1 */
    .capa .numero { font-size: 13cqw; }
    .capa .manchete.pequena { margin-top: 1.6cqw; }
    .capa .manchete:not(.pequena) { font-size: 5.6cqw; margin-top: 4cqw; text-wrap: balance; }
    .fileira { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2.4cqw; margin-bottom: 3cqw; }
    .fileira img { width: 100%; }

    /* 2: colunas na mesma escala (o maior outubro, 2019, é 100%) */
    .colunas { list-style: none; margin: 4cqw 0 0; padding: 0; flex: 1; display: grid; grid-template-columns: repeat(11, 1fr); gap: 1.6cqw; align-items: end; }
    .colunas li { height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 1cqw; }
    .coluna { width: 100%; border-radius: .8cqw .8cqw 0 0; background: var(--cd-dado-neutro); min-height: .6cqw; }
    .atual .coluna { background: var(--cd-dado-ambar); }
    .valor-coluna { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 2.7cqw; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .atual .valor-coluna { color: var(--cd-tela); font-size: 3.2cqw; }
    .ano { font-size: 2.8cqw; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .atual .ano { color: var(--cd-tela); font-weight: 700; }
    .legenda-grafico { font-size: 3.4cqw; margin-top: 3cqw; }

    /* 3 */
    .filme-mes { display: grid; grid-template-columns: 30cqw 1fr; gap: 5cqw; align-items: end; flex: 1; }
    .cartaz-grande { width: 100%; }
    .nome-grande { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 9cqw; line-height: .95; letter-spacing: -0.045em; margin-bottom: 3cqw; }
    .sub { font-size: 3.8cqw; color: var(--cd-tela-2); margin-top: 1.4cqw; }
    .fatos { list-style: none; padding: 0; margin: 4cqw 0 0; display: flex; flex-direction: column; gap: 2cqw; }
    .fatos li { display: grid; grid-template-columns: 22cqw 1fr; align-items: center; gap: 2cqw; padding: 2.2cqw 3.6cqw; line-height: 1.3; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .fatos strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; letter-spacing: -0.03em; line-height: 1; color: var(--cd-projetor); font-variant-numeric: tabular-nums; }
    .fatos span { font-size: 3.6cqw; color: var(--cd-tela-2); }
    .fatos strong .queda { font-size: inherit; color: var(--cd-queda); }
    .fatos .junto { white-space: nowrap; font-size: inherit; }
    .fatos.grandes { flex: 1; justify-content: space-between; margin-top: 1cqw; }
    .fatos.grandes li { grid-template-columns: 30cqw 1fr; padding: 3.4cqw 3.6cqw; }
    .fatos.grandes strong { font-size: 7.4cqw; }

    /* 4 */
    .top10 { list-style: none; margin: 0; padding: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .top10 li { display: grid; grid-template-columns: 6cqw 1fr auto; column-gap: 2.4cqw; row-gap: .6cqw; align-items: baseline; }
    .top10 .pos { grid-row: span 2; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4.6cqw; color: var(--cd-projetor); align-self: center; }
    .top10 .titulo { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.5cqw; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .top10 .titulo.longo { white-space: normal; line-height: 1.1; }
    .top10 .valor { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.5cqw; font-variant-numeric: tabular-nums; }
    .top10 .barra { grid-column: 2 / 4; height: 1.4cqw; border-radius: 0 .8cqw .8cqw 0; }
    .legenda-cores { margin-top: 1.8cqw; font-size: 3cqw; color: var(--cd-tela-2); display: flex; align-items: center; gap: 1.2cqw; }
    .ponto { display: inline-block; width: 2cqw; height: 2cqw; border-radius: 50%; }
    .ponto + .ponto, .legenda-cores .ponto:not(:first-child) { margin-left: 2.4cqw; }

    /* 5 */
    .nacionais { list-style: none; padding: 0; margin: auto 0 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 3cqw; }
    .nacionais li { display: grid; grid-template-columns: 12cqw 1fr; gap: 2.6cqw; align-items: center; padding: 2.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .nacionais img { width: 100%; }
    .nacionais strong { display: block; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 5cqw; letter-spacing: -0.03em; color: var(--cd-projetor); font-variant-numeric: tabular-nums; }
    .nacionais span { display: block; margin-top: .8cqw; font-size: 3.2cqw; line-height: 1.3; color: var(--cd-tela-2); }

    /* 7 */
    .leque { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; margin-bottom: 5cqw; }
    .leque img { position: absolute; width: 24cqw; transform: translateX(calc(var(--i) * 13.5cqw)) translateY(calc(var(--i) * var(--i) * 1.2cqw)) rotate(calc(var(--i) * 6deg)); }
    .leque img:nth-child(1) { z-index: 1; } .leque img:nth-child(2) { z-index: 2; } .leque img:nth-child(3) { z-index: 3; }
    .leque img:nth-child(4) { z-index: 2; } .leque img:nth-child(5) { z-index: 1; }
    .pergunta { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7.4cqw; letter-spacing: -0.035em; line-height: 1.05; text-wrap: balance; }
    .chamada { margin-top: 2.4cqw; }
    .chamada strong { color: var(--cd-tela); }
  `,
})
export class SlidesMes202610 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly dados = dados;
  protected readonly verity = verity;
  protected readonly maiorOutubro = maiorOutubro;
  protected readonly nacionais = dados.top10.filter(f => f.origem === 'Nacional');
  protected readonly sobreOutubroAnterior = variacao(dados.mes.publico, dados.outubroAnterior.publico);
  protected readonly sobreSetembro = variacao(dados.mes.publico, dados.mes.setembro);
  protected readonly fatiaVerity = (verity.publico / dados.mes.publico) * 100;
  protected readonly formatar = formatar;
  protected readonly cor = corOrigem;
  protected readonly umaCasa = umaCasa;
  protected readonly duasCasas = duasCasas;
  protected readonly arredondado = (n: number) => Math.round(n);
  /** Pôster grande o bastante para o PNG de 1080 px (o w342 do site ficaria borrado). */
  protected readonly poster = (caminho: string) => urlPoster(caminho, 'w780');
}
