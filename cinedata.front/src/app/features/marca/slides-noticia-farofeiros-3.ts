import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string, tamanho = 'w1280') => `https://image.tmdb.org/t/p/${tamanho}/${arquivo}`;

/**
 * Os dois primeiros filmes no consolidado de lançamentos da ANCINE (público e renda da carreira) e na bilheteria por
 * sala (1ª semana, quinta a quarta). SQL em docs/posts/noticia-farofeiros-3/legenda.md.
 */
interface Filme {
  titulo: string;
  ano: number;
  publico: number;
  renda: number;
  /** 1ª semana: público, salas, posição no ranking e quem estava logo acima ou abaixo. */
  estreia: { publico: number; salas: number; lugar: number; lider?: string; segundo?: string };
}

const franquia: Filme[] = [
  { titulo: 'Os Farofeiros', ano: 2018, publico: 2_596_209, renda: 36_724_094, estreia: { publico: 785_040, salas: 727, lugar: 2, lider: 'Pantera Negra' } },
  { titulo: 'Os Farofeiros 2', ano: 2024, publico: 1_913_522, renda: 36_468_386, estreia: { publico: 639_239, salas: 1_072, lugar: 1, segundo: 'Duna: Parte 2' } },
];
/** Ingresso médio do país, pelos lançamentos de cada ano (renda ÷ público). */
const medioPais = { 2018: 15.06, 2024: 19.67 };

/** Comédias brasileiras com 3º filme e carreira fechada no consolidado (desde 2009): público de cada filme. */
const terceiros = [
  { franquia: 'Minha Mãe é uma Peça', anos: '2013 · 2016 · 2019', publicos: [4_605_742, 9_235_788, 10_938_240] },
  { franquia: 'De Pernas pro Ar', anos: '2010 · 2012 · 2019', publicos: [3_506_553, 4_846_317, 3_587_914] },
  { franquia: 'Até que a Sorte nos Separe', anos: '2012 · 2013 · 2015', publicos: [3_417_510, 3_978_191, 3_335_670] },
  { franquia: 'Os Farofeiros', anos: '2018 · 2024 · 2026', publicos: [2_596_209, 1_913_522] },
];
/** Se Eu Fosse Você 3, em cartaz desde 08/10/2026: público nas sessões até 22/10 (o 2, de 2009, fez 6,1 mi). */
const seEuFosseVoce3 = { publico: 268_266, dois: 6_143_081 };

/** 1ª semana (primeira com ≥ 50% do pico de salas), bilheteria por sala. */
const estreias = [
  { titulo: 'Minha Mãe é uma Peça 3', ano: 2019, publico: 2_561_415, salas: 1_817, lugar: 1 },
  { titulo: 'Os Farofeiros', ano: 2018, publico: 785_040, salas: 727, lugar: 2, franquia: true },
  { titulo: 'De Pernas pro Ar 3', ano: 2019, publico: 675_082, salas: 1_008, lugar: 2 },
  { titulo: 'Os Farofeiros 2', ano: 2024, publico: 639_239, salas: 1_072, lugar: 1, franquia: true },
  { titulo: 'Se Eu Fosse Você 3', ano: 2026, publico: 185_253, salas: 1_042, lugar: 5 },
];

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const milhoes = (n: number) => umaCasa.format(n / 1e6);
const curto = (n: number) => (n >= 1e6 ? `${milhoes(n)} mi` : `${formatar.inteiro(Math.round(n / 1000))} mil`);
const reais = (n: number) => `R$ ${duasCasas.format(n)}`;
const variacao = (de: number, para: number) => Math.round((para / de - 1) * 1000) / 10;

/**
 * CineData | Notícia: Os Farofeiros 3 estreia (05/11/2026). 7 slides 1080×1350: capa, o filme, a franquia até aqui,
 * público × renda, a régua das comédias com 3º filme, a régua da estreia e o que vamos acompanhar.
 */
@Component({
  selector: 'cd-slides-noticia-farofeiros-3',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Notícia: Os Farofeiros 3</h1>
        <p class="secundario">7 slides 1080×1350. PNGs em docs/posts/noticia-farofeiros-3.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="7" [fundo]="imagens.capa" posicaoFundo="52% 40%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> Notícia</span>
          <p class="manchete grande">Os Farofeiros 3 estreia hoje</p>
          <p class="texto claro">
            A comédia de Roberto Santucci chega aos cinemas nesta quinta (05/11). O 2º filme perdeu
            {{ perdaPublico }}% do público, mas arrecadou quase o mesmo que o 1º.
          </p>
        </div>
        <p class="arraste">A franquia em números →</p>
      </cd-slide>

      <!-- 2. O filme -->
      <cd-slide [numero]="2" [total]="7">
        <span class="rotulo">O filme</span>
        <div class="filme">
          <p class="manchete sinopse">A turma agora viaja para um casamento na ilha fictícia de San Martinez, no Caribe.</p>
          <img class="poster" [src]="imagens.poster" alt="Pôster de Os Farofeiros 3" />
        </div>
        <dl class="ficha">
          <div><dt>Direção</dt><dd>Roberto Santucci</dd></div>
          <div><dt>Roteiro</dt><dd>Paulo Cursino</dd></div>
          <div><dt>Elenco</dt><dd>Maurício Manfrini, Cacau Protásio, Danielle Winits, Aline Campos, Antônio Fragoso, Charles Paraventi e Elisa Pinheiro</dd></div>
          <div><dt>Distribuição</dt><dd>Downtown Filmes</dd></div>
          <div><dt>Coprodução</dt><dd>Globo Filmes, Telecine e Panorama Filmes</dd></div>
          <div><dt>Estreia</dt><dd>05/11/2026, só nos cinemas</dd></div>
        </dl>
      </cd-slide>

      <!-- 3. A franquia até aqui -->
      <cd-slide [numero]="3" [total]="7">
        <span class="rotulo">A franquia até aqui</span>
        <p class="manchete compacta">O 2º estreou em {{ maisSalas }}% mais salas e vendeu {{ -quedaEstreia }}% menos na 1ª semana.</p>
        <div class="filmes">
          @for (f of franquia; track f.titulo; let i = $index) {
            <article>
              <img [src]="i === 0 ? imagens.um : imagens.dois" alt="" />
              <div class="dados">
                <p class="nome">{{ f.titulo }} <small>{{ f.ano }}</small></p>
                <p class="total">{{ milhoes(f.publico) }} mi</p>
                <p class="legenda-dado">de espectadores</p>
                <p class="estreia"><strong>{{ curto(f.estreia.publico) }}</strong> na 1ª semana<br />{{ formatar.inteiro(f.estreia.salas) }} salas · {{ f.estreia.lugar }}º lugar</p>
              </div>
            </article>
          }
        </div>
      </cd-slide>

      <!-- 4. Público × renda -->
      <cd-slide [numero]="4" [total]="7" [fundo]="imagens.dado" posicaoFundo="50% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">A franquia vem caindo?</span>
          <p class="numero">−{{ formatar.decimal(-quedaPublico) }}%</p>
          <p class="manchete pequena">de público do 1º para o 2º: de {{ milhoes(franquia[0].publico) }} para {{ milhoes(franquia[1].publico) }} milhões. Em dinheiro, não caiu.</p>
          <div class="comparacao">
            <div><strong>R$ {{ milhoes(franquia[1].renda) }} mi</strong><span>de bilheteria do 2, contra R$ {{ milhoes(franquia[0].renda) }} mi do 1 (−{{ formatar.decimal(-variacaoRenda) }}%)</span></div>
            <div><strong>{{ reais(medio[1]) }}</strong><span>o ingresso médio do 2, contra {{ reais(medio[0]) }} do 1 (+{{ formatar.decimal(altaMedio) }}%). No país: {{ reais(medioPais[2018]) }} → {{ reais(medioPais[2024]) }}</span></div>
          </div>
          <p class="nota-base">Valores da época, sem correção da inflação.</p>
        </div>
      </cd-slide>

      <!-- 5. A régua: comédias com 3º filme -->
      <cd-slide [numero]="5" [total]="7">
        <span class="rotulo">A régua</span>
        <p class="manchete compacta">Entre as comédias nacionais com 3º filme, só uma cresceu.</p>
        <ul class="regua" aria-label="Público de cada filme das comédias brasileiras com 3º filme">
          <li class="cabeca" aria-hidden="true"><span></span><div class="colunas"><span>1º</span><span>2º</span><span>3º</span></div></li>
          @for (r of terceiros; track r.franquia) {
            <li [class.atual]="r.publicos.length < 3">
              <p class="nome">{{ r.franquia }}<small>{{ r.anos }}</small></p>
              <div class="colunas">
                @for (n of [0, 1, 2]; track n) {
                  <div class="coluna" [class.terceiro]="n === 2">
                    @if (r.publicos[n]; as p) {
                      <span class="valor">{{ milhoes(p) }}</span>
                      <span class="barra" [style.height]="(p / maximoRegua) * 6.4 + 'cqw'"></span>
                    } @else {
                      <span class="valor">hoje</span>
                      <span class="barra vazia"></span>
                    }
                  </div>
                }
              </div>
            </li>
          }
        </ul>
        <p class="nota">
          Público total, em milhões, desde 2009. Se Eu Fosse Você 3, ainda em cartaz, soma {{ curto(seEuFosseVoce3.publico) }}; o 2 fez {{ milhoes(seEuFosseVoce3.dois) }} mi.
        </p>
      </cd-slide>

      <!-- 6. A régua da estreia -->
      <cd-slide [numero]="6" [total]="7">
        <span class="rotulo">A régua da estreia</span>
        <p class="manchete compacta">O número a bater: {{ curto(franquia[1].estreia.publico) }}, a 1ª semana do 2.</p>
        <ol class="estreias" aria-label="Público na 1ª semana de comédias brasileiras">
          @for (e of estreias; track e.titulo) {
            <li [class.forte]="e.franquia">
              <span class="nome">{{ e.titulo }}<small>{{ e.ano }} · {{ formatar.inteiro(e.salas) }} salas · {{ e.lugar }}º</small></span>
              <span class="valor">{{ curto(e.publico) }}</span>
              <span class="trilho"><span class="barra" [style.width.%]="(e.publico / estreias[0].publico) * 100"></span></span>
            </li>
          }
        </ol>
        <p class="nota">1ª semana (quinta a quarta) e posição no ranking. Em âmbar, os Farofeiros.</p>
      </cd-slide>

      <!-- 7. O que vamos acompanhar -->
      <cd-slide [numero]="7" [total]="7">
        <span class="rotulo">O que vamos acompanhar</span>
        <p class="manchete fecho">Quando a ANCINE publicar a semana de 05 a 11/11, a gente mostra como foi a estreia.</p>
        <ul class="agenda">
          <li><strong>Público</strong><span>da 1ª semana, contra os {{ curto(franquia[1].estreia.publico) }} do 2 e os {{ curto(franquia[0].estreia.publico) }} do 1</span></li>
          <li><strong>Salas e lugar</strong><span>em quantas salas estreou e em que posição do ranking</span></li>
          <li><strong>Estados</strong><span>onde a turma mais levou gente ao cinema</span></li>
        </ul>
        <p class="pergunta">Você vai ver o 3? Qual Farofeiros é o seu favorito?</p>
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
    .base .manchete.grande { font-size: 10.4cqw; margin-bottom: 3cqw; text-wrap: balance; }
    .base > .texto { font-size: 4.2cqw; text-wrap: pretty; }
    .base + .arraste { margin-top: 4cqw; }

    .filme { display: grid; grid-template-columns: 1fr 24cqw; gap: 4cqw; align-items: start; }
    .sinopse { margin-top: 0; font-size: 5.2cqw; text-wrap: balance; }
    .poster { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 2cqw; border: .3cqw solid var(--cd-linha); }
    .ficha { margin: auto 0 0; display: flex; flex-direction: column; gap: 1cqw; }
    .ficha div { display: grid; grid-template-columns: 22cqw 1fr; gap: 2cqw; font-size: 3.2cqw; line-height: 1.25; }
    .ficha dt { color: var(--cd-tela-3); }
    .ficha dd { margin: 0; color: var(--cd-tela); font-weight: 600; text-wrap: pretty; }

    .manchete.compacta { font-size: 5.4cqw; margin-top: 0; text-wrap: balance; }
    .filmes { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; }
    .filmes article { border-radius: 3cqw; overflow: hidden; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .filmes img { display: block; width: 100%; aspect-ratio: 2 / 1; object-fit: cover; }
    .filmes .dados { padding: 2.6cqw 3.2cqw 3cqw; display: flex; flex-direction: column; }
    .filmes .nome { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4cqw; letter-spacing: -0.02em; white-space: nowrap; }
    .filmes .nome small { font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 3cqw; color: var(--cd-tela-3); margin-left: 1cqw; }
    .filmes .total { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 9cqw; line-height: 1; letter-spacing: -0.04em; color: var(--cd-projetor); margin-top: 2cqw; }
    .filmes .legenda-dado { font-size: 3cqw; color: var(--cd-tela-2); margin-top: .6cqw; }
    .filmes .estreia { font-size: 3.1cqw; line-height: 1.35; color: var(--cd-tela-2); margin-top: 2.4cqw; padding-top: 2.4cqw; border-top: .2cqw solid var(--cd-linha); text-wrap: pretty; }
    .filmes .estreia strong { color: var(--cd-tela); }

    .base .numero { font-size: 17cqw; }
    .base .manchete.pequena { margin-top: 1.4cqw; text-wrap: balance; }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; margin-top: 5cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: 1cqw; padding: 3cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .88); border: .3cqw solid var(--cd-linha); }
    .comparacao strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; line-height: 1.1; letter-spacing: -0.03em; color: var(--cd-tela); }
    .comparacao span { font-size: 3.2cqw; color: var(--cd-tela-2); line-height: 1.3; text-wrap: pretty; }
    .nota-base { font-size: 3cqw; color: var(--cd-tela-2); margin-top: 3cqw; }

    .regua { list-style: none; margin: 2cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.6cqw; }
    .regua li { display: grid; grid-template-columns: 1fr 44cqw; gap: 3cqw; align-items: end; padding-bottom: 1.6cqw; border-bottom: .2cqw solid var(--cd-linha); }
    .regua .nome { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.6cqw; line-height: 1.15; letter-spacing: -0.02em; align-self: center; }
    .regua .nome small { display: block; font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 2.8cqw; color: var(--cd-tela-3); margin-top: .6cqw; }
    .regua li.atual .nome { color: var(--cd-projetor); }
    .colunas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2cqw; }
    .regua li.cabeca { border: 0; padding: 0; font-size: 2.8cqw; color: var(--cd-tela-3); text-align: center; }
    .coluna { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: .6cqw; min-height: 0; }
    .coluna .valor { font-size: 2.9cqw; font-weight: 600; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .coluna .barra { width: 100%; border-radius: .6cqw .6cqw 0 0; background: var(--cd-dado-neutro); }
        .coluna.terceiro .barra { background: var(--cd-dado-ambar); }
    .coluna.terceiro .valor { color: var(--cd-tela); }
    .coluna .barra.vazia { height: 4cqw; background: none; border: .3cqw dashed var(--cd-dado-ambar); border-bottom: 0; }
    li.atual .coluna.terceiro .valor { color: var(--cd-projetor); }
    .regua + .nota { font-size: 2.9cqw; text-wrap: pretty; margin-top: auto; padding-top: 1cqw; }

    .estreias { list-style: none; margin: 3cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 2cqw; }
    .estreias li { display: grid; grid-template-columns: 1fr auto; row-gap: .8cqw; column-gap: 2cqw; align-items: baseline; font-size: 3.6cqw; color: var(--cd-tela-2); }
    .estreias .nome { color: var(--cd-tela); font-weight: 600; white-space: nowrap; font-size: 3.4cqw; }
    .estreias small { font-weight: 400; font-size: 2.6cqw; color: var(--cd-tela-3); margin-left: 1cqw; }
    .estreias .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4.8cqw; color: var(--cd-tela); font-variant-numeric: tabular-nums; }
    .estreias .trilho { grid-column: 1 / -1; display: block; }
    .estreias .barra { display: block; height: 1.8cqw; border-radius: 0 .8cqw .8cqw 0; background: var(--cd-dado-neutro); }
    .estreias li.forte .barra { background: var(--cd-dado-ambar); }
    .estreias li.forte .valor { color: var(--cd-projetor); }
    .estreias + .nota { font-size: 2.9cqw; }

    .manchete.fecho { margin-top: 0; font-size: 5.6cqw; text-wrap: balance; }
    .agenda { list-style: none; margin: 4cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.8cqw; }
    .agenda li { display: grid; grid-template-columns: 26cqw 1fr; gap: 2.4cqw; align-items: baseline; padding: 2.2cqw 3.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .agenda strong { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; color: var(--cd-projetor); }
    .agenda span { font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesNoticiaFarofeiros3 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('1FwuEcVE9xDlljPncsOHBAIE12m.jpg'),
    poster: tmdb('8VINm6QWFqh2GgNQxIb9scxxe9w.jpg', 'w500'),
    um: tmdb('wNDEEXoA5Wmt707lTzT3UeyHdxj.jpg', 'w780'),
    dois: tmdb('az8N2IEsN4bGeXVjXQRiAbjP4zf.jpg', 'w780'),
    dado: tmdb('mnNFqQMpLjsEhw5ZqIzoxJSu1eV.jpg'),
  };
  protected readonly franquia = franquia;
  protected readonly medioPais = medioPais;
  protected readonly terceiros = terceiros;
  protected readonly seEuFosseVoce3 = seEuFosseVoce3;
  protected readonly estreias = estreias;
  protected readonly formatar = formatar;
  protected readonly milhoes = milhoes;
  protected readonly curto = curto;
  protected readonly reais = reais;

  protected readonly medio = franquia.map(f => Math.round((f.renda / f.publico) * 100) / 100);
  protected readonly quedaPublico = variacao(franquia[0].publico, franquia[1].publico);
  protected readonly variacaoRenda = variacao(franquia[0].renda, franquia[1].renda);
  protected readonly altaMedio = variacao(this.medio[0], this.medio[1]);
  protected readonly maisSalas = Math.round((franquia[1].estreia.salas / franquia[0].estreia.salas - 1) * 100);
  protected readonly quedaEstreia = Math.round((franquia[1].estreia.publico / franquia[0].estreia.publico - 1) * 100);
  protected readonly perdaPublico = Math.round(-this.quedaPublico);
  protected readonly maximoRegua = Math.max(...terceiros.flatMap(t => t.publicos));
}
