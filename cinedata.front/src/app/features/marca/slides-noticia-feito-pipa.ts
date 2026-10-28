import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;

/**
 * Os representantes do Brasil no Oscar de Filme Internacional desde 2016, pelo ano da cerimônia, com o público total
 * do consolidado de lançamentos comerciais da ANCINE (soma das distribuidoras). Antes de 2016 a bilheteria por sala
 * ainda não cobre todo o país; Que Horas Ela Volta? (Oscar 2016) fica de fora pelo mesmo critério do resto do site.
 * SQL e conferência em docs/posts/noticia-feito-pipa/legenda.md.
 */
const representantes = [
  { oscar: 2017, titulo: 'Pequeno Segredo', publico: 187_055 },
  { oscar: 2018, titulo: 'Bingo: O Rei das Manhãs', publico: 249_309 },
  { oscar: 2019, titulo: 'O Grande Circo Místico', publico: 51_480 },
  { oscar: 2020, titulo: 'A Vida Invisível', publico: 136_419 },
  { oscar: 2021, titulo: 'Babenco', publico: 4_798 },
  { oscar: 2022, titulo: 'Deserto Particular', publico: 9_141 },
  { oscar: 2023, titulo: 'Marte Um', publico: 104_113 },
  { oscar: 2024, titulo: 'Retratos Fantasmas', publico: 72_251 },
  { oscar: 2025, titulo: 'Ainda Estou Aqui', publico: 5_857_612 },
  { oscar: 2026, titulo: 'O Agente Secreto', publico: 2_476_469 },
];

/** Sessões de Feito Pipa já na base da ANCINE (dados até 23/10/2026): Quixadá e Juazeiro do Norte (CE) em setembro,
 * Festival do Rio em 08/10. Ocupação = público ÷ assentos das salas; média nacional de setembro/2026 = 18,0%. */
const antes = { publico: 1_430, sessoes: 14, ocupacao: 86.5, ocupacaoNacional: 18.0 };

/** Semanas cinematográficas (quinta a quarta) de bilheteria por sala. */
const agenteSecreto = { pre: 54_940, preSalas: 299, estreia: 381_089, estreiaSalas: 1_436 };
const aindaEstouAqui = { estreia: 579_064, estreiaSalas: 767 };

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n: number) => `${umaCasa.format(n / 1e6)} mi`;
const curto = (n: number) => (n >= 1e6 ? milhoes(n) : `${formatar.decimal(Math.round(n / 100) / 10)} mil`);

/**
 * CineData | Notícia: Feito Pipa, representante do Brasil no Oscar 2027, chega aos cinemas (pré-estreias de 29/10
 * a 04/11, estreia em 05/11). 7 slides 1080×1350: capa, o filme, os prêmios, o que os dados já mostram, o histórico
 * dos representantes, a régua da estreia e o que vamos acompanhar.
 */
@Component({
  selector: 'cd-slides-noticia-feito-pipa',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Notícia: Feito Pipa</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/noticia-feito-pipa.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="7" [fundo]="imagens.capa" posicaoFundo="50% 30%" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> Notícia</span>
          <p class="manchete grande">Feito Pipa chega aos cinemas</p>
          <p class="texto claro">
            O representante do Brasil no Oscar 2027 tem pré-estreias a partir de quinta (29/10)
            e estreia em <strong>5 de novembro</strong>.
          </p>
        </div>
        <p class="arraste">O que esperar →</p>
      </cd-slide>

      <!-- 2. O filme -->
      <cd-slide [numero]="2" [total]="7" [fundo]="imagens.avo" posicaoFundo="34% 50%" credito="Imagem: divulgação" [escurecer]="true">
        <div class="base">
          <span class="rotulo">O filme</span>
          <p class="manchete sinopse">Gugu, 12 anos, esconde que a saúde da avó piorou para não ser separado dela.</p>
          <p class="texto claro local">Rodado no sertão do Ceará.</p>
          <dl class="ficha">
            <div><dt>Direção</dt><dd>Allan Deberton</dd></div>
            <div><dt>Elenco</dt><dd>Yuri Gomes, Teca Pereira, Lázaro Ramos</dd></div>
            <div><dt>Distribuição</dt><dd>Paris Filmes</dd></div>
          </dl>
        </div>
      </cd-slide>

      <!-- 3. Os prêmios -->
      <cd-slide [numero]="3" [total]="7">
        <span class="rotulo">Antes do Oscar</span>
        <p class="manchete">Premiado em Berlim e o mais premiado de Gramado</p>
        <div class="festivais">
          <section>
            <h3>Festival de Berlim 2026 · mostra Generation Kplus</h3>
            <ul>
              <li>Urso de Cristal de Melhor Filme <span>Júri Jovem</span></li>
              <li>Grande Prêmio <span>Júri Internacional</span></li>
            </ul>
          </section>
          <section>
            <h3>Festival de Gramado 2026</h3>
            <ul>
              <li>Melhor Direção <span>Allan Deberton</span></li>
              <li>Melhor Atriz <span>Teca Pereira</span></li>
              <li>Melhor Ator Coadjuvante <span>Lázaro Ramos</span></li>
              <li>Júri Popular</li>
              <li>Menção Honrosa <span>Yuri Gomes</span></li>
            </ul>
          </section>
        </div>
      </cd-slide>

      <!-- 4. O que os dados já mostram -->
      <cd-slide [numero]="4" [total]="7" [fundo]="imagens.sertao" posicaoFundo="50% 50%" credito="Imagem: divulgação" [escurecer]="true">
        <div class="base">
          <span class="rotulo">Já está nos dados da ANCINE</span>
          <p class="numero">{{ formatar.inteiro(antes.publico) }}</p>
          <p class="manchete pequena">pessoas já viram Feito Pipa no cinema, em {{ antes.sessoes }} sessões especiais</p>
          <p class="texto claro">
            Quixadá e Juazeiro do Norte (CE), em setembro, e o Festival do Rio, em 8/10.
          </p>
          <div class="comparacao">
            <div><strong class="destaque">{{ formatar.decimal(antes.ocupacao) }}%</strong><span>dos lugares ocupados</span></div>
            <div><strong>{{ formatar.decimal(antes.ocupacaoNacional) }}%</strong><span>média das salas do país em setembro</span></div>
          </div>
        </div>
      </cd-slide>

      <!-- 5. O histórico dos representantes -->
      <cd-slide [numero]="5" [total]="7">
        <span class="rotulo">O que esperar</span>
        <p class="manchete compacta">Os 2 últimos viraram fenômeno. Os 8 anteriores somaram {{ curto(somaOito) }}.</p>
        <ol class="historico" aria-label="Público total nos cinemas dos representantes do Brasil no Oscar">
          @for (r of representantes; track r.oscar) {
            <li [class.forte]="r.publico > 1e6">
              <span class="ano">{{ r.oscar }}</span>
              <span class="nome">{{ r.titulo }}</span>
              <span class="trilho"><span class="barra" [style.width.%]="(r.publico / maximo) * 100"></span></span>
              <span class="valor">{{ curto(r.publico) }}</span>
            </li>
          }
        </ol>
        <p class="nota">Público total nos cinemas, por ano do Oscar.</p>
      </cd-slide>

      <!-- 6. A régua da estreia -->
      <cd-slide [numero]="6" [total]="7" [fundo]="imagens.pai" posicaoFundo="30% 40%" credito="Imagem: divulgação" [escurecer]="true">
        <div class="base">
          <span class="rotulo">A régua</span>
          <p class="manchete compacta">Feito Pipa repete a estratégia de O Agente Secreto: pré‑estreias antes da estreia.</p>
          <ul class="regua">
            <li>
              <span class="quem">O Agente Secreto</span>
              <span><strong>{{ curto(agenteSecreto.pre) }}</strong> em 2 semanas de pré‑estreias</span>
              <span><strong>{{ curto(agenteSecreto.estreia) }}</strong> na semana de estreia, em {{ formatar.inteiro(agenteSecreto.estreiaSalas) }} salas</span>
            </li>
            <li>
              <span class="quem">Ainda Estou Aqui</span>
              <span><strong>{{ curto(aindaEstouAqui.estreia) }}</strong> na semana de estreia, em {{ formatar.inteiro(aindaEstouAqui.estreiaSalas) }} salas</span>
            </li>
          </ul>
        </div>
      </cd-slide>

      <!-- 7. O que vamos acompanhar -->
      <cd-slide [numero]="7" [total]="7">
        <span class="rotulo">Vamos acompanhar tudo por aqui</span>
        <p class="manchete compacta">Toda semana, os números de Feito Pipa no CineData:</p>
        <ul class="acompanhar">
          <li>público da semana e acumulado</li>
          <li>salas, sessões e ocupação</li>
                    <li>mapa por estado: o Ceará vai liderar?</li>
          <li>a curva ao lado de Ainda Estou Aqui e O Agente Secreto</li>
        </ul>
        <ol class="agenda">
          <li><strong>29/10</strong><span>pré‑estreias</span></li>
          <li><strong>5/11</strong><span>estreia</span></li>
          <li><strong>dez</strong><span>pré-lista do Oscar</span></li>
          <li><strong>21/1</strong><span>indicados</span></li>
          <li><strong>14/3</strong><span>cerimônia</span></li>
        </ol>
        <p class="pergunta">Vai ver na pré‑estreia? Siga <span class="destaque">&#64;cinedata.br</span></p>
      </cd-slide>
    </div>
  `,
  styles: `
    .base { margin-top: auto; display: flex; flex-direction: column; }
    .claro { color: var(--cd-tela); }
    .texto strong { color: var(--cd-tela); }

    .selo {
      align-self: flex-start; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.4cqw;
      letter-spacing: .02em; padding: 1.2cqw 2.8cqw; border-radius: 99cqw; margin-bottom: 4cqw;
      color: var(--cd-sala); background: var(--cd-projetor);
    }
    .selo i { font-style: normal; opacity: .55; margin: 0 .6cqw; }
    .base .manchete.grande { font-size: 11cqw; margin-bottom: 3cqw; }
    .base > .texto { font-size: 4.2cqw; }
    .base + .arraste { margin-top: 4cqw; }

    .sinopse { text-wrap: balance; }
    .local { margin-top: 2.4cqw; }
    .ficha { margin: 5cqw 0 0; display: flex; flex-direction: column; gap: 2cqw; }
    .ficha div { display: grid; grid-template-columns: 26cqw 1fr; gap: 2cqw; font-size: 3.6cqw; }
    .ficha dt { color: var(--cd-tela-3); }
    .ficha dd { margin: 0; color: var(--cd-tela); font-weight: 600; }

    .festivais { display: flex; flex-direction: column; gap: 2.4cqw; margin-top: auto; }
    .festivais section { padding: 2.6cqw 3.4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .festivais h3 { font-family: var(--cd-fonte-texto); font-size: 3cqw; font-weight: 600; color: var(--cd-projetor); margin: 0 0 1.8cqw; letter-spacing: 0; }
    .festivais ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1cqw; }
    .festivais li { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.9cqw; line-height: 1.2; display: flex; justify-content: space-between; gap: 2cqw; }
    .festivais li span { font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3.4cqw; color: var(--cd-tela-2); white-space: nowrap; }

    .base .numero { font-size: 22cqw; }
    .base .manchete.pequena { margin-top: 1cqw; }
    .base .manchete.pequena + .texto { margin-top: 2cqw; }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; margin-top: 5cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: .8cqw; padding: 3cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .85); border: .3cqw solid var(--cd-linha); }
    .comparacao strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 9cqw; line-height: 1; letter-spacing: -0.03em; }
    .comparacao span { font-size: 3.2cqw; color: var(--cd-tela-2); line-height: 1.3; }

    .manchete.compacta { font-size: 5.4cqw; text-wrap: balance; }
    .historico { list-style: none; margin: 4cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.6cqw; }
    .historico li { display: grid; grid-template-columns: 8cqw 40cqw 1fr 15cqw; align-items: center; gap: 2cqw; font-size: 3.2cqw; line-height: 1.25; color: var(--cd-tela-2); }
    .historico .ano { font-variant-numeric: tabular-nums; color: var(--cd-tela-3); }
    .historico .nome { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .historico .trilho { display: block; }
    .historico .barra { display: block; height: 2.4cqw; min-width: .6cqw; border-radius: 0 .8cqw .8cqw 0; background: color-mix(in oklab, var(--cd-dado-ambar) 55%, var(--cd-poltrona-2)); }
    .historico .valor { white-space: nowrap; text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; color: var(--cd-tela); }
    .historico li.forte { color: var(--cd-tela); font-weight: 600; }
    .historico li.forte .barra { background: var(--cd-dado-ambar); }
    .historico li.forte .valor { color: var(--cd-projetor); font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4cqw; }

    .regua { list-style: none; margin: 3.6cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 2.4cqw; }
    .regua li { display: flex; flex-direction: column; gap: 1cqw; padding: 2.8cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .88); border: .3cqw solid var(--cd-linha); font-size: 3.5cqw; color: var(--cd-tela-2); }
    .regua .quem { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.4cqw; color: var(--cd-tela); }
    .regua span { text-wrap: pretty; }
    .regua strong { font-family: var(--cd-fonte-display); font-weight: 800; color: var(--cd-projetor); font-size: 4.4cqw; }

    .acompanhar { margin: 3cqw 0 0; padding-left: 5cqw; display: flex; flex-direction: column; gap: 1cqw; font-size: 3.7cqw; line-height: 1.25; }
    .acompanhar li { text-wrap: pretty; }
    .acompanhar li::marker { color: var(--cd-projetor); }
    .agenda { list-style: none; margin: 4cqw 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.6cqw; }
    .agenda li { display: flex; flex-direction: column; gap: .4cqw; padding: 2cqw 1.4cqw; border-radius: 2.4cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); text-align: center; }
    .agenda li:nth-child(-n + 2) { border-color: var(--cd-projetor); }
    .agenda strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4.6cqw; letter-spacing: -0.02em; }
    .agenda span { font-size: 2.5cqw; color: var(--cd-tela-2); line-height: 1.2; }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; }
  `,
})
export class SlidesNoticiaFeitoPipa {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('q3U4EThxyLPSN3YV6IBEXNVcKTD.jpg'),
    avo: tmdb('4Tq2sFqpUI3QG07kbmZrwl1Cx7h.jpg'),
    sertao: tmdb('63AoM6fGNhXr4byWtV9PHA1P0l6.jpg'),
    pai: tmdb('eI6g8XhPPWNXnkZtBSfEBuZ5lV0.jpg'),
  };
  protected readonly representantes = representantes;
  protected readonly maximo = Math.max(...representantes.map(r => r.publico));
  protected readonly somaOito = representantes.slice(0, 8).reduce((t, r) => t + r.publico, 0);
  protected readonly antes = antes;
  protected readonly agenteSecreto = agenteSecreto;
  protected readonly aindaEstouAqui = aindaEstouAqui;
  protected readonly formatar = formatar;
  protected readonly curto = curto;
}
