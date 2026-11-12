import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string, tamanho = 'w1280') => `https://image.tmdb.org/t/p/${tamanho}/${arquivo}`;

/**
 * Feito Pipa (B2600253800000) na semana de pré-estreias, 29/10 a 04/11/2026, pela bilheteria por sala da ANCINE
 * (publicação de 09/11/2026). SQL em docs/posts/acompanhamento-feito-pipa-semana-1/legenda.md.
 */
const semana = {
  publico: 47_284,
  salas: 235,
  sessoes: 1_585,
  ocupacao: 17.3,
  ocupacaoPais: 10.9,
  /** Posição no ranking da semana sem os códigos genéricos da ANCINE (Mostras e Festivais, Shows e Musicais). */
  posicao: 11,
  posicaoBrasileiros: 4,
  /** Sessões especiais antes de 29/10 (Quixadá, Juazeiro do Norte, Festival do Rio e 28/10). */
  antes: 2_338,
};
const dias = [
  { dia: 'qui', data: '29/10', publico: 2_707 },
  { dia: 'sex', data: '30/10', publico: 5_749 },
  { dia: 'sáb', data: '31/10', publico: 9_082 },
  { dia: 'dom', data: '01/11', publico: 9_923 },
  { dia: 'seg', data: '02/11', publico: 10_533, feriado: true },
  { dia: 'ter', data: '03/11', publico: 4_020 },
  { dia: 'qua', data: '04/11', publico: 5_270 },
];
/** O Agente Secreto nas duas semanas de pré-estreia (23/10 a 05/11/2025). */
const agente = { publico: 54_940, sessoes: 558, salas: 299, ocupacao: 43.3, ocupacaoPais: 6.6, estreia: 381_089 };
const estados = [
  { uf: 'RJ', publico: 10_876, ocupacao: 27.0 },
  { uf: 'SP', publico: 10_679, ocupacao: 14.9 },
  { uf: 'CE', publico: 5_920, ocupacao: 35.9, destaque: true },
  { uf: 'BA', publico: 5_023, ocupacao: 14.8 },
  { uf: 'DF', publico: 2_154, ocupacao: 42.2 },
  { uf: 'PE', publico: 1_936, ocupacao: 13.5 },
  { uf: 'MG', publico: 1_904, ocupacao: 13.8 },
  { uf: 'PR', publico: 1_164, ocupacao: 5.6 },
];
const aindaEstouAqui = { estreia: 579_064 };

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const curto = (n: number) => (n >= 1e6 ? `${umaCasa.format(n / 1e6)} mi` : `${umaCasa.format(n / 1000)} mil`);
const porSessao = (publico: number, sessoes: number) => Math.round(publico / sessoes);

/**
 * CineData | Acompanhamento: Feito Pipa · semana 1, as pré-estreias (29/10 a 04/11/2026). 5 slides 1080×1350:
 * capa, a semana dia a dia, a régua de O Agente Secreto, os estados e o que vem.
 */
@Component({
  selector: 'cd-slides-acompanhamento-feito-pipa-1',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Acompanhamento: Feito Pipa · semana 1</h1>
        <p class="secundario">5 slides 1080×1350. PNGs em docs/posts/acompanhamento-feito-pipa-semana-1.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="5" [fundo]="imagens.capa" posicaoFundo="50% 35%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> Acompanhamento</span>
          <p class="manchete grande">Feito Pipa · semana 1</p>
          <p class="numero">{{ formatar.inteiro(semana.publico) }}</p>
          <p class="texto claro">
            pessoas nas pré-estreias, de 29/10 a 04/11, em {{ semana.salas }} salas. Mais que cada semana de pré-estreia
            de O Agente Secreto, mas com mais de 5 vezes as sessões.
          </p>
        </div>
        <p class="arraste">Os números da semana →</p>
      </cd-slide>

      <!-- 2. A semana -->
      <cd-slide [numero]="2" [total]="5">
        <span class="rotulo">A semana</span>
        <p class="manchete compacta">O pico foi no feriado de Finados: {{ formatar.inteiro(dias[4].publico) }} pessoas na segunda, 02/11.</p>
        <p class="legenda-grafico">Público por dia, em mil pessoas</p>
        <ol class="dias" aria-label="Público de Feito Pipa por dia, de 29/10 a 04/11">
          @for (d of dias; track d.data) {
            <li [class.forte]="d.feriado">
              <span class="valor">{{ mil(d.publico) }}</span>
              <span class="barra" [style.height]="(d.publico / maximoDia) * 16 + 'cqw'"></span>
              <span class="dia">{{ d.dia }}<small>{{ d.data }}</small></span>
            </li>
          }
        </ol>
        <div class="fatos">
          <div><strong>{{ formatar.inteiro(semana.sessoes) }}</strong><span>sessões em {{ semana.salas }} salas</span></div>
          <div><strong>{{ formatar.decimal(semana.ocupacao) }}%</strong><span>de ocupação; a média do país na semana foi {{ formatar.decimal(semana.ocupacaoPais) }}%</span></div>
          <div><strong>{{ semana.posicao }}º</strong><span>na semana; {{ semana.posicaoBrasileiros }}º entre os brasileiros</span></div>
        </div>
      </cd-slide>

      <!-- 3. A régua -->
      <cd-slide [numero]="3" [total]="5" [fundo]="imagens.regua" posicaoFundo="50% 40%" [escurecer]="true" credito="Imagem: divulgação">
        <span class="rotulo">A régua</span>
        <p class="manchete compacta">Contra O Agente Secreto, o total quase empata. Por sessão, não.</p>
        <table class="comparativo">
          <thead><tr><th></th><th>Feito Pipa<small>1 semana · 2026</small></th><th>O Agente Secreto<small>2 semanas · 2025</small></th></tr></thead>
          <tbody>
            <tr><th>Público</th><td class="forte">{{ curto(semana.publico) }}</td><td>{{ curto(agente.publico) }}</td></tr>
            <tr><th>Sessões</th><td class="forte">{{ formatar.inteiro(semana.sessoes) }}</td><td>{{ formatar.inteiro(agente.sessoes) }}</td></tr>
            <tr><th>Por sessão</th><td class="forte">{{ porSessaoPipa }}</td><td>{{ porSessaoAgente }}</td></tr>
            <tr><th>Ocupação</th><td class="forte">{{ formatar.decimal(semana.ocupacao) }}%</td><td>{{ formatar.decimal(agente.ocupacao) }}%</td></tr>
          </tbody>
        </table>
        <p class="nota claro">
          O Agente Secreto teve cerca de 1 sessão por sala; Feito Pipa, quase 7, perto de um lançamento. E a semana
          caiu no Festival do Cinema Brasileiro, com ingresso a R$ 12.
        </p>
      </cd-slide>

      <!-- 4. Onde -->
      <cd-slide [numero]="4" [total]="5">
        <span class="rotulo">Onde</span>
        <p class="manchete compacta">No Ceará, onde o filme foi rodado, a ocupação chegou a {{ formatar.decimal(estados[2].ocupacao) }}%.</p>
        <ol class="estados" aria-label="Público de Feito Pipa por estado nas pré-estreias">
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
          Em 24 estados. Cidades com mais público: Rio (10,0 mil), São Paulo (6,6 mil), Salvador (4,0 mil), Fortaleza
          (3,8 mil) e Juazeiro do Norte (1,7 mil).
        </p>
      </cd-slide>

      <!-- 5. O que vem -->
      <cd-slide [numero]="5" [total]="5">
        <span class="rotulo">O que vem</span>
        <p class="manchete fecho">A semana de estreia (05 a 11/11) fecha na próxima atualização da ANCINE, perto de 16/11.</p>
        <ul class="agenda">
          <li><strong>{{ curto(agente.estreia) }}</strong><span>O Agente Secreto na semana de estreia, em 1.436 salas</span></li>
          <li><strong>{{ curto(aindaEstouAqui.estreia) }}</strong><span>Ainda Estou Aqui na semana de estreia, em 767 salas</span></li>
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
    .comparativo td.forte { color: var(--cd-projetor); }
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
export class SlidesAcompanhamentoFeitoPipa1 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('4riq7SB76q2I3zyEIK3nTtTJeCX.jpg'),
    regua: tmdb('o3TqdDs8QJ2Jb5iAXOxETWsvp4J.jpg'),
  };
  protected readonly semana = semana;
  protected readonly dias = dias;
  protected readonly agente = agente;
  protected readonly estados = estados;
  protected readonly aindaEstouAqui = aindaEstouAqui;
  protected readonly formatar = formatar;
  protected readonly curto = curto;
  protected readonly mil = (n: number) => umaCasa.format(n / 1000);
  protected readonly maximoDia = Math.max(...dias.map(d => d.publico));
  protected readonly porSessaoPipa = porSessao(semana.publico, semana.sessoes);
  protected readonly porSessaoAgente = porSessao(agente.publico, agente.sessoes);
}
