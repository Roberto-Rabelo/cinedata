import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Logo } from '../../shared/ui/logo';
import { Slide } from './slide';

/**
 * Números do carrossel de apresentação, congelados na publicação de 22/10/2026 (o post é um retrato,
 * não lê a API). Cada valor foi conferido com SQL no banco; as consultas estão em
 * docs/posts/apresentacao/legenda.md.
 */
const dados = {
  publicoDesde2016: 1_233_698_421,
  sessoes: 38_458_225,
  salas: 6_387,
  obras: 6_265,
  publicoPorAno: [
    { ano: 2017, publico: 177_746_991 },
    { ano: 2018, publico: 161_657_771 },
    { ano: 2019, publico: 174_499_298 },
    { ano: 2020, publico: 39_248_445 },
    { ano: 2021, publico: 50_946_204 },
    { ano: 2022, publico: 96_415_843 },
    { ano: 2023, publico: 116_073_663 },
    { ano: 2024, publico: 127_189_680 },
    { ano: 2025, publico: 114_261_351 },
  ],
  publico2026: 114_706_089,
  publico2025MesmoPeriodo: 95_560_265,
  /** Dia do ano em que o acumulado de 2026 passou o total de 2025 (18/10). */
  diaUltrapassagem: 291,
  /** Público acumulado (milhões) a cada 7 dias do ano, e no último dia com dados. */
  acumulado2025: '7:3.7 14:7.5 21:10.2 28:12.3 35:13.9 42:17.7 49:20.0 56:21.3 63:23.0 70:24.4 77:25.6 84:27.0 91:28.1 98:30.7 105:32.9 112:35.2 119:36.7 126:39.0 133:40.5 140:42.4 147:47.0 154:50.6 161:53.7 168:56.4 175:58.8 182:60.7 189:63.5 196:67.1 203:70.3 210:73.6 217:75.8 224:77.6 231:79.1 238:80.2 245:83.3 252:86.7 259:89.6 266:91.0 273:92.1 280:93.0 287:94.3 294:95.5 301:96.6 308:97.7 315:98.9 322:100.5 329:102.3 336:104.1 343:106.8 350:108.8 357:111.7 364:114.2 365:114.3',
  acumulado2026: '7:3.0 14:5.8 21:8.5 28:10.9 35:12.4 42:16.3 49:18.2 56:19.4 63:20.7 70:22.2 77:23.2 84:24.8 91:26.2 98:28.3 105:30.2 112:32.8 119:35.6 126:40.8 133:44.2 140:46.7 147:48.6 154:50.7 161:54.7 168:57.0 175:59.5 182:61.7 189:64.0 196:67.4 203:71.3 210:75.6 217:83.2 224:88.4 231:91.7 238:93.9 245:95.8 252:98.2 259:103.9 266:106.4 273:108.7 280:110.9 287:113.2 294:114.7 295:114.7',
};

const pontos = (serie: string) => [[0, 0], ...serie.split(' ').map(p => p.split(':').map(Number))] as [number, number][];

/** Geometria do gráfico acumulado (unidades do viewBox = px do slide final). */
const graf = { largura: 920, altura: 330, topo: 56, base: 280, esquerda: 0, direita: 830, maximo: 120 };
const x = (dia: number) => graf.esquerda + (dia / 365) * (graf.direita - graf.esquerda);
const y = (mi: number) => graf.base - (mi / graf.maximo) * (graf.base - graf.topo);
const caminho = (serie: [number, number][]) => serie.map(([d, v], i) => `${i ? 'L' : 'M'}${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

const milhoes = (n: number) => formatar.decimal(Math.round(n / 1e5) / 10);
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Carrossel de apresentação do Instagram (7 slides 1080×1350). Em /marca/apresentacao mostra a
 * galeria; com ?exportar cada slide fica com 1080 px de largura para o script
 * scripts/exportar-slides.mjs fotografar em PNG.
 */
@Component({
  selector: 'cd-slides-apresentacao',
  imports: [Slide, Logo, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Carrossel de apresentação</h1>
        <p class="secundario">7 slides 1080×1350 para o primeiro post fixado do &#64;cinedata.br. PNGs em docs/posts/apresentacao.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1">
        <div class="capa">
          <p class="numero">{{ bilhao }}</p>
          <p class="manchete">de ingressos de cinema no Brasil desde 2016.</p>
          <p class="manchete destaque">Agora em números.</p>
        </div>
        <p class="arraste">Arraste para conhecer →</p>
      </cd-slide>

      <!-- 2. O que é -->
      <cd-slide [numero]="2">
        <span class="rotulo">O que é o CineData</span>
        <p class="numero">{{ milhoes(dados.sessoes) }} milhões</p>
        <p class="manchete">de sessões de cinema, cada uma informada pelos exibidores à ANCINE.</p>
        <p class="texto">Filme, sala, dia e público de cada sessão do país. A gente transforma isso em:</p>
        <ul class="chips">
          <li>Rankings</li>
          <li>Mapas</li>
          <li>Curiosidades</li>
        </ul>
        <p class="nota">Na base: {{ formatar.inteiro(dados.salas) }} salas e {{ formatar.inteiro(dados.obras) }} filmes.</p>
      </cd-slide>

      <!-- 3. O que você vai ver -->
      <cd-slide [numero]="3">
        <span class="rotulo">O que você vai ver aqui</span>
        <ul class="itens">
          <li>
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="13" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
            </svg>
            <div><strong>Top 5 da semana</strong><span>Os mais vistos, de quinta a quarta.</span></div>
          </li>
          <li>
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <div><strong>Mapa por estado</strong><span>Onde cada filme lota as salas.</span></div>
          </li>
          <li>
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="2" />
              <rect x="5" y="13" width="7" height="2.2" rx="1.1" /><rect x="13.5" y="13" width="5.5" height="2.2" rx="1.1" />
              <rect x="7" y="16.4" width="10" height="2.2" rx="1.1" />
            </svg>
            <div><strong>Dublado × legendado</strong><span>Como o Brasil prefere assistir.</span></div>
          </li>
          <li>
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="2" />
              <rect x="3" y="5" width="18" height="5" rx="2" /><rect x="7" y="2" width="2.4" height="5" rx="1" /><rect x="14.6" y="2" width="2.4" height="5" rx="1" />
              <rect x="10" y="13" width="4.5" height="4.5" rx="1" />
            </svg>
            <div><strong>Recordes e “neste dia”</strong><span>Os maiores públicos e o que estava em cartaz anos atrás.</span></div>
          </li>
        </ul>
      </cd-slide>

      <!-- 4. 2020 -->
      <cd-slide [numero]="4">
        <span class="rotulo">O ano em que o cinema parou</span>
        <p class="numero">−{{ formatar.decimal(quedaPandemia) }}%</p>
        <p class="manchete pequena">de ingressos de 2019 ({{ milhoes(publico(2019)) }} mi) para 2020 ({{ milhoes(publico(2020)) }} mi).</p>
        <div class="barras" role="img" aria-label="Ingressos por ano, 2017 a 2025, em milhões">
          @for (b of barras; track b.ano) {
            <div class="coluna" [class.foco]="b.ano === 2019 || b.ano === 2020">
              <span class="trilho">
                <span class="valor">{{ milhoes(b.publico) }}</span>
                <span class="barra" [style.--h]="b.altura"></span>
              </span>
              <span class="ano">{{ b.ano }}</span>
            </div>
          }
        </div>
        <p class="nota">Ingressos por ano, em milhões. Em 2025 o público ainda ficou {{ formatar.decimal(distancia2019) }}% abaixo de 2019.</p>
      </cd-slide>

      <!-- 5. 2026 -->
      <cd-slide [numero]="5">
        <span class="rotulo">2026 em números</span>
        <p class="manchete grande">2026 já passou 2025 inteiro</p>
        <div class="comparacao">
          <div><span class="numero medio destaque">{{ milhoes(dados.publico2026) }} mi</span><span class="texto">2026, até 22/10</span></div>
          <div><span class="numero medio apagado">{{ milhoes(publico(2025)) }} mi</span><span class="texto">2025, o ano todo</span></div>
        </div>
        <svg class="acumulado" [attr.viewBox]="'0 0 ' + graf.largura + ' ' + graf.altura" role="img"
             aria-label="Público acumulado no ano, 2025 e 2026, em milhões">
          @for (g of grade; track g) {
            <line [attr.x1]="0" [attr.x2]="graf.direita" [attr.y1]="y(g)" [attr.y2]="y(g)" class="grade" />
            <text [attr.x]="graf.direita + 12" [attr.y]="y(g) + 9" class="eixo">{{ g }}</text>
          }
          @for (m of meses; track m.rotulo) {
            <text [attr.x]="x(m.dia)" [attr.y]="graf.base + 40" class="eixo" text-anchor="middle">{{ m.rotulo }}</text>
          }
          <line [attr.x1]="0" [attr.x2]="graf.direita" [attr.y1]="y(total2025)" [attr.y2]="y(total2025)" class="meta" />
          <path [attr.d]="caminho2025" class="linha l2025" />
          <path [attr.d]="caminho2026" class="linha l2026" />
          <circle [attr.cx]="x(dados.diaUltrapassagem)" [attr.cy]="y(total2025)" r="11" class="marco" />
          <text [attr.x]="x(dados.diaUltrapassagem) - 22" [attr.y]="y(total2025) - 26" class="rotulo-graf" text-anchor="end">passou em 18/10</text>
          <text [attr.x]="x(205)" [attr.y]="y(90)" class="rotulo-graf forte" text-anchor="end">2026</text>
          <text [attr.x]="x(318)" [attr.y]="y(84)" class="rotulo-graf" text-anchor="start">2025</text>
        </svg>
        <p class="nota">Público acumulado no ano, em milhões. Até 22/10, +{{ formatar.decimal(alta2026) }}% sobre o mesmo período de 2025, e ainda faltam 70 dias.</p>
      </cd-slide>

      <!-- 6. Como medimos -->
      <cd-slide [numero]="6">
        <span class="rotulo">Como medimos</span>
        <ol class="regras">
          <li><strong>Dados abertos da ANCINE</strong><span>Bilheteria diária por exibidoras: sessão a sessão, informada pelos cinemas.</span></li>
          <li><strong>Semana de quinta a quarta</strong><span>A semana do cinema: as estreias chegam às quintas.</span></li>
          <li><strong>Últimos dias podem vir parciais</strong><span>Os dados chegam aos poucos. Semana incompleta tem aviso.</span></li>
          <li><strong>Série confiável desde ago/2016</strong><span>Antes disso, a base quase não tem sessões.</span></li>
        </ol>
        <p class="nota">Projeto independente: não somos a ANCINE, usamos os dados que ela publica.</p>
      </cd-slide>

      <!-- 7. CTA -->
      <cd-slide [numero]="7">
        <div class="cta">
          <cd-logo [tamanho]="null" [comNome]="false" class="simbolo-grande" />
          <p class="manchete grande">Siga para o Top 5 toda semana</p>
          <p class="texto">Os 5 filmes mais vistos nos cinemas do Brasil, de quinta a quarta.</p>
          <p class="comentario">
            <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            </svg>
            <span>Comente o filme que você quer ver em números</span>
          </p>
          <p class="numero medio destaque">&#64;cinedata.br</p>
        </div>
      </cd-slide>
    </div>
  `,
  styles: `
    /* 1 */
    .capa .numero { font-size: 17cqw; }
    .capa .manchete { font-size: 8cqw; }

    /* 2 */
    .manchete + .texto { margin-top: 4cqw; }

    /* 3 */
    .itens { list-style: none; padding: 0; margin: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-around; }
    .itens li { display: flex; align-items: center; gap: 4.4cqw; }
    .itens .icone { flex: none; width: 14cqw; height: 14cqw; padding: 3.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); fill: var(--cd-projetor); color: var(--cd-projetor); }
    .itens div, .regras li { display: flex; flex-direction: column; gap: .8cqw; }
    .itens strong, .regras strong { font-family: var(--cd-fonte-display); font-size: 5.4cqw; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
    .itens span, .regras span { font-size: 3.8cqw; line-height: 1.35; color: var(--cd-tela-2); }

    /* 4 */
    .barras { flex: 1; display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 1.4cqw; margin: 5cqw 0 3cqw; min-height: 0; }
    .coluna { display: grid; grid-template-rows: 1fr auto; min-height: 0; }
    .trilho { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 1cqw; min-height: 0; }
    .barra { width: 100%; height: calc((100% - 5cqw) * var(--h)); background: var(--cd-dado-neutro); border-radius: .8cqw .8cqw 0 0; }
    .foco .barra { background: var(--cd-dado-ambar); }
    .valor { font-size: 2.7cqw; font-weight: 600; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .foco .valor { color: var(--cd-tela); }
    .ano { font-size: 2.8cqw; color: var(--cd-tela-2); padding-top: .6cqw; border-top: .2cqw solid var(--cd-linha); width: 100%; text-align: center; }
    .foco .ano { color: var(--cd-tela); font-weight: 600; }

    /* 5 */
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 4cqw; margin: 2cqw 0 1cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: 1cqw; }
    .comparacao .texto { font-size: 3.4cqw; }
    .acumulado { width: 100%; height: auto; margin: 2cqw 0; overflow: visible; }
    .grade { stroke: var(--cd-linha); stroke-width: 2; }
    .eixo { fill: var(--cd-tela-3); font-size: 26px; font-family: var(--cd-fonte-texto); }
    .meta { stroke: var(--cd-tela-3); stroke-width: 2; stroke-dasharray: 8 8; }
    .linha { fill: none; stroke-width: 6; stroke-linejoin: round; stroke-linecap: round; }
    .l2025 { stroke: var(--cd-dado-neutro); }
    .l2026 { stroke: var(--cd-dado-ambar); }
    .marco { fill: var(--cd-dado-ambar); stroke: var(--cd-sala); stroke-width: 4; }
    .rotulo-graf { fill: var(--cd-tela-2); font-size: 30px; font-weight: 600; font-family: var(--cd-fonte-texto); }
    .rotulo-graf.forte { fill: var(--cd-tela); font-size: 34px; }

    /* 6 */
    .regras { list-style: none; counter-reset: regra; padding: 0; margin: 0; flex: 1; display: flex; flex-direction: column; justify-content: space-around; }
    .regras li { counter-increment: regra; position: relative; padding-left: 11cqw; }
    .regras strong { font-size: 5cqw; }
    .regras + .nota { margin-top: 3cqw; }
    .regras li::before {
      content: counter(regra, decimal-leading-zero); position: absolute; left: 0; top: -.4cqw;
      font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6.4cqw; color: var(--cd-projetor);
    }

    /* 7 */
    .cta { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 2.6cqw; }
    .simbolo-grande { font-size: 11cqw; }
    .comentario { display: flex; align-items: center; gap: 3.6cqw; padding: 3.4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.6cqw; line-height: 1.15; letter-spacing: -0.02em; }
    .comentario .icone { flex: none; width: 10cqw; height: 10cqw; fill: var(--cd-projetor); }
  `,
})
export class SlidesApresentacao {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly dados = dados;
  protected readonly formatar = formatar;
  protected readonly milhoes = milhoes;
  protected readonly graf = graf;
  protected readonly x = x;
  protected readonly y = y;

  protected readonly publico = (ano: number) => dados.publicoPorAno.find(a => a.ano === ano)!.publico;

  protected readonly bilhao = `${duasCasas.format(dados.publicoDesde2016 / 1e9)} bilhão`;
  protected readonly quedaPandemia = Math.round((1 - this.publico(2020) / this.publico(2019)) * 1000) / 10;
  protected readonly distancia2019 = Math.round((1 - this.publico(2025) / this.publico(2019)) * 1000) / 10;
  protected readonly alta2026 = Math.round((dados.publico2026 / dados.publico2025MesmoPeriodo - 1) * 1000) / 10;

  private readonly maximoAno = Math.max(...dados.publicoPorAno.map(a => a.publico));
  protected readonly barras = dados.publicoPorAno.map(a => ({ ...a, altura: a.publico / this.maximoAno }));

  protected readonly total2025 = Math.round(this.publico(2025) / 1e5) / 10;
  protected readonly caminho2025 = caminho(pontos(dados.acumulado2025));
  protected readonly caminho2026 = caminho(pontos(dados.acumulado2026));
  protected readonly grade = [0, 50, 100];
  protected readonly meses = ['jan', 'mar', 'mai', 'jul', 'set', 'nov'].map((rotulo, i) => ({ rotulo, dia: [1, 60, 121, 182, 244, 305][i] }));
}
