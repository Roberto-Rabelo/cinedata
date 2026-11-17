import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string, tamanho = 'w1280') => `https://image.tmdb.org/t/p/${tamanho}/${arquivo}`;

/**
 * Feito Pipa (B2600253800000) na semana de estreia, 05 a 11/11/2026, e nas pré-estreias (29/10 a 04/11), pela
 * bilheteria por sala da ANCINE (publicação de 16/11/2026, dados até 15/11). SQL em
 * docs/posts/acompanhamento-feito-pipa-estreia/legenda.md.
 */
const estreia = {
  publico: 61_486,
  salas: 409,
  sessoes: 3_971,
  ocupacao: 9.4,
  ocupacaoPais: 8.2,
  /** Posição no ranking da semana sem os códigos genéricos da ANCINE; entre os brasileiros, atrás de Os Farofeiros 3. */
  posicao: 7,
  posicaoBrasileiros: 2,
};
const preEstreias = { publico: 47_284, salas: 235 };
/** Público total até 11/11, com as sessões especiais de setembro e outubro (2.338). */
const ate11 = 111_108;
const dias = [
  { dia: 'qui', data: '05/11', publico: 5_102 },
  { dia: 'sex', data: '06/11', publico: 7_608 },
  { dia: 'sáb', data: '07/11', publico: 13_715 },
  { dia: 'dom', data: '08/11', publico: 14_650, pico: true },
  { dia: 'seg', data: '09/11', publico: 6_120 },
  { dia: 'ter', data: '10/11', publico: 6_771 },
  { dia: 'qua', data: '11/11', publico: 7_520 },
];
/** Semana de estreia (a primeira com pelo menos 50% do pico de salas) dos dois últimos representantes do Brasil. */
const regua = [
  { titulo: 'Feito Pipa', ano: 2026, publico: 61_486, salas: 409, sessoes: 3_971, ocupacao: 9.4, atual: true },
  { titulo: 'O Agente Secreto', ano: 2025, publico: 381_089, salas: 1_436, sessoes: 20_037, ocupacao: 10.0 },
  { titulo: 'Ainda Estou Aqui', ano: 2024, publico: 579_064, salas: 767, sessoes: 11_255, ocupacao: 29.6 },
];
const estados = [
  { uf: 'SP', publico: 18_665, ocupacao: 9.4 },
  { uf: 'RJ', publico: 9_854, ocupacao: 9.4 },
  { uf: 'CE', publico: 7_594, ocupacao: 17.3, destaque: true },
  { uf: 'BA', publico: 4_715, ocupacao: 7.8 },
  { uf: 'DF', publico: 2_626, ocupacao: 14.8 },
  { uf: 'PE', publico: 2_465, ocupacao: 8.0 },
  { uf: 'MG', publico: 2_265, ocupacao: 8.4 },
  { uf: 'RS', publico: 1_855, ocupacao: 8.2 },
];
/** 2ª semana (12 a 18/11), parcial: quinta a domingo, contra quinta a domingo da estreia. */
const segunda = { publico: 23_725, salas: 233, estreiaQuintaDomingo: 41_075 };

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const curto = (n: number) => (n >= 1e6 ? `${umaCasa.format(n / 1e6)} mi` : `${umaCasa.format(n / 1000)} mil`);
const porSessao = (publico: number, sessoes: number) => Math.round(publico / sessoes);

/**
 * CineData | Acompanhamento: Feito Pipa · semana de estreia (05 a 11/11/2026), com as pré-estreias. 5 slides
 * 1080×1350: capa, a semana dia a dia, a régua das estreias, os estados e o que vem.
 */
@Component({
  selector: 'cd-slides-acompanhamento-feito-pipa-2',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Acompanhamento: Feito Pipa · semana de estreia</h1>
        <p class="secundario">5 slides 1080×1350. PNGs em docs/posts/acompanhamento-feito-pipa-estreia.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="5" [fundo]="imagens.capa" posicaoFundo="50% 35%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> Acompanhamento</span>
          <p class="manchete grande">Feito Pipa · a estreia</p>
          <p class="numero">{{ formatar.inteiro(estreia.publico) }}</p>
          <p class="texto claro">
            pessoas na semana de estreia, de 05 a 11/11, em {{ estreia.salas }} salas. Com as pré-estreias,
            {{ curto(ate11) }} em duas semanas.
          </p>
        </div>
        <p class="arraste">Os números da semana →</p>
      </cd-slide>

      <!-- 2. A semana -->
      <cd-slide [numero]="2" [total]="5">
        <span class="rotulo">A semana</span>
        <p class="manchete compacta">Mais gente que nas pré-estreias ({{ curto(preEstreias.publico) }}), mas em salas mais vazias.</p>
        <p class="legenda-grafico">Público por dia, em mil pessoas</p>
        <ol class="dias" aria-label="Público de Feito Pipa por dia, de 05 a 11/11">
          @for (d of dias; track d.data) {
            <li [class.forte]="d.pico">
              <span class="valor">{{ mil(d.publico) }}</span>
              <span class="barra" [style.height]="(d.publico / maximoDia) * 16 + 'cqw'"></span>
              <span class="dia">{{ d.dia }}<small>{{ d.data }}</small></span>
            </li>
          }
        </ol>
        <div class="fatos">
          <div><strong>{{ formatar.inteiro(estreia.sessoes) }}</strong><span>sessões em {{ estreia.salas }} salas</span></div>
          <div><strong>{{ formatar.decimal(estreia.ocupacao) }}%</strong><span>de ocupação; a média do país na semana foi {{ formatar.decimal(estreia.ocupacaoPais) }}%</span></div>
          <div><strong>{{ estreia.posicao }}º</strong><span>na semana; {{ estreia.posicaoBrasileiros }}º brasileiro, atrás de Os Farofeiros 3</span></div>
        </div>
      </cd-slide>

      <!-- 3. A régua -->
      <cd-slide [numero]="3" [total]="5" [fundo]="imagens.regua" posicaoFundo="50% 40%" [escurecer]="true" credito="Imagem: divulgação">
        <span class="rotulo">A régua</span>
        <p class="manchete compacta">Os dois últimos representantes do Brasil estrearam muito maiores.</p>
        <table class="comparativo tres">
          <thead><tr><th></th>@for (r of regua; track r.titulo) {<th [class.forte]="r.atual">{{ r.titulo }}<small>{{ r.ano }}</small></th>}</tr></thead>
          <tbody>
            <tr><th>Público</th>@for (r of regua; track r.titulo) {<td [class.forte]="r.atual">{{ curto(r.publico) }}</td>}</tr>
            <tr><th>Salas</th>@for (r of regua; track r.titulo) {<td [class.forte]="r.atual">{{ formatar.inteiro(r.salas) }}</td>}</tr>
            <tr><th>Por sessão</th>@for (r of regua; track r.titulo) {<td [class.forte]="r.atual">{{ porSessao(r.publico, r.sessoes) }}</td>}</tr>
            <tr><th>Ocupação</th>@for (r of regua; track r.titulo) {<td [class.forte]="r.atual">{{ formatar.decimal(r.ocupacao) }}%</td>}</tr>
          </tbody>
        </table>
        <p class="nota claro">
          Semana de estreia, quinta a quarta. Feito Pipa teve {{ fatiaSalas }}% das salas de O Agente Secreto e fez
          {{ fatiaPublico }}% do público dele.
        </p>
      </cd-slide>

      <!-- 4. Onde -->
      <cd-slide [numero]="4" [total]="5">
        <span class="rotulo">Onde</span>
        <p class="manchete compacta">No Ceará, onde o filme foi rodado, a ocupação ({{ formatar.decimal(estados[2].ocupacao) }}%) foi quase o dobro da média.</p>
        <ol class="estados" aria-label="Público de Feito Pipa por estado na semana de estreia">
          <li class="cabeca" aria-hidden="true"><span></span><span></span><span>público</span><span>ocupação</span></li>
          @for (e of estados; track e.uf) {
            <li [class.forte]="e.destaque">
              <span class="uf">{{ e.uf }}</span>
              <span class="trilho"><span class="barra" [style.width.%]="(e.publico / estados[0].publico) * 100"></span></span>
              <span class="valor">{{ curto(e.publico) }}</span>
              <span class="ocup">{{ formatar.decimal(e.ocupacao) }}%</span>
            </li>
          }
        </ol>
        <p class="nota">
          Em 25 estados. Cidades com mais público: São Paulo (12,9 mil), Rio (7,9 mil), Fortaleza (5,6 mil) e
          Salvador (3,5 mil).
        </p>
      </cd-slide>

      <!-- 5. O que vem -->
      <cd-slide [numero]="5" [total]="5">
        <span class="rotulo">O que vem</span>
        <p class="manchete fecho">A 2ª semana começou com menos salas. A ANCINE fecha a semana perto de 23/11.</p>
        <ul class="agenda">
          <li><strong>{{ segunda.salas }} salas</strong><span>de quinta a domingo (12 a 15/11), contra {{ estreia.salas }} na estreia</span></li>
          <li><strong>−{{ quedaSegunda }}%</strong><span>de público no mesmo trecho: {{ curto(segunda.publico) }}, contra {{ curto(segunda.estreiaQuintaDomingo) }}</span></li>
          <li><strong>Oscar</strong><span>a pré-lista de Filme Internacional sai em dezembro</span></li>
        </ul>
        <p class="pergunta">Você já viu Feito Pipa? Conta aqui o que achou.</p>
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
    .base .manchete.grande { font-size: 9cqw; margin-bottom: 2cqw; text-wrap: balance; }
    .base .numero { font-size: 17cqw; }
    .base > .texto { font-size: 4.2cqw; margin-top: 1.4cqw; text-wrap: pretty; }
    .base + .arraste { margin-top: 4cqw; }

    .manchete.compacta { font-size: 5.4cqw; margin-top: 0; text-wrap: balance; }

    .legenda-grafico { margin-top: 3cqw; font-size: 2.9cqw; color: var(--cd-tela-3); }
    .dias { list-style: none; margin: 1.6cqw 0 0; padding: 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 2cqw; align-items: end; }
    .dias li { display: flex; flex-direction: column; align-items: center; gap: .8cqw; }
    .dias .valor { white-space: nowrap; font-size: 3.2cqw; font-weight: 600; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .dias .barra { width: 100%; border-radius: .8cqw .8cqw 0 0; background: var(--cd-dado-neutro); }
    .dias li.forte .barra { background: var(--cd-dado-ambar); }
    .dias li.forte .valor { color: var(--cd-projetor); }
    .dias .dia { font-size: 3.2cqw; font-weight: 600; color: var(--cd-tela); text-align: center; line-height: 1.1; }
    .dias .dia small { display: block; font-size: 2.5cqw; font-weight: 400; color: var(--cd-tela-3); }
    .fatos { margin-top: auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.4cqw; }
    .fatos div { display: flex; flex-direction: column; gap: .8cqw; padding: 2.6cqw 2.8cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .fatos strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 6cqw; line-height: 1.05; letter-spacing: -0.03em; color: var(--cd-projetor); }
    .fatos span { font-size: 2.9cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }

    .comparativo { margin-top: auto; width: 100%; border-collapse: collapse; background: rgb(22 24 31 / .88); border-radius: 3cqw; overflow: hidden; }
    .comparativo th, .comparativo td { padding: 1.8cqw 3cqw; text-align: right; border-bottom: .2cqw solid var(--cd-linha); line-height: 1.15; white-space: nowrap; }
    .comparativo tbody tr:last-child th, .comparativo tbody tr:last-child td { border-bottom: 0; }
    .comparativo thead th { font-family: var(--cd-fonte-display); font-size: 3.6cqw; font-weight: 700; color: var(--cd-tela); vertical-align: bottom; line-height: 1.1; }
    .comparativo thead small { display: block; font-family: var(--cd-fonte-texto); font-size: 2.5cqw; font-weight: 400; color: var(--cd-tela-3); margin-top: .6cqw; }
    .comparativo tbody th { text-align: left; font-size: 3.4cqw; font-weight: 600; color: var(--cd-tela-2); }
    .comparativo td { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 5cqw; color: var(--cd-tela); font-variant-numeric: tabular-nums; }
    .comparativo td.forte, .comparativo thead th.forte { color: var(--cd-projetor); }
    .comparativo.tres th, .comparativo.tres td { padding: 1.8cqw 2cqw; }
    .comparativo.tres thead th { font-size: 3.2cqw; white-space: normal; }
    .comparativo.tres td { font-size: 4.4cqw; }
    .comparativo + .nota { font-size: 3.2cqw; margin-top: 3cqw; text-wrap: pretty; }

    .estados { list-style: none; margin: 2cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.4cqw; }
    .estados li { display: grid; grid-template-columns: 8cqw 1fr 17cqw 13cqw; column-gap: 2.4cqw; align-items: center; line-height: 1.1; }
    .estados li.cabeca { font-size: 2.6cqw; color: var(--cd-tela-3); text-align: right; }
    .estados .uf { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; color: var(--cd-tela); }
    .estados .trilho { display: flex; align-items: center; height: 3.4cqw; }
    .estados .barra { display: block; height: 3.4cqw; min-height: 3.4cqw; border-radius: 0 .8cqw .8cqw 0; background: var(--cd-dado-neutro); }
    .estados .valor { white-space: nowrap; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4cqw; color: var(--cd-tela); text-align: right; font-variant-numeric: tabular-nums; }
    .estados .ocup { font-size: 3.6cqw; font-weight: 600; color: var(--cd-tela-2); text-align: right; font-variant-numeric: tabular-nums; }
    .estados li.forte .barra { background: var(--cd-dado-ambar); }
    .estados li.forte .uf, .estados li.forte .valor, .estados li.forte .ocup { color: var(--cd-projetor); }
    .estados + .nota { font-size: 3cqw; text-wrap: pretty; }

    .manchete.fecho { margin-top: 0; font-size: 5.6cqw; text-wrap: balance; }
    .agenda { list-style: none; margin: 3cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.8cqw; }
    .agenda li { display: grid; grid-template-columns: 26cqw 1fr; gap: 2.4cqw; align-items: baseline; padding: 2.2cqw 3.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .agenda strong { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.6cqw; color: var(--cd-projetor); }
    .agenda span { font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesAcompanhamentoFeitoPipa2 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('mFLrSOufgG7JcMIRUxcpj6ZtaOt.jpg'),
    regua: tmdb('63AoM6fGNhXr4byWtV9PHA1P0l6.jpg'),
  };
  protected readonly estreia = estreia;
  protected readonly preEstreias = preEstreias;
  protected readonly ate11 = ate11;
  protected readonly dias = dias;
  protected readonly regua = regua;
  protected readonly estados = estados;
  protected readonly segunda = segunda;
  protected readonly formatar = formatar;
  protected readonly curto = curto;
  protected readonly porSessao = porSessao;
  protected readonly mil = (n: number) => umaCasa.format(n / 1000);
  protected readonly maximoDia = Math.max(...dias.map(d => d.publico));
  protected readonly fatiaSalas = Math.round((regua[0].salas / regua[1].salas) * 100);
  protected readonly fatiaPublico = Math.round((regua[0].publico / regua[1].publico) * 100);
  protected readonly quedaSegunda = Math.round((1 - segunda.publico / segunda.estreiaQuintaDomingo) * 100);
}
