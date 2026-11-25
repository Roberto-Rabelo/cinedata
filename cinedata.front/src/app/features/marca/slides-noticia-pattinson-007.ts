import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string, tamanho = 'w1280') => `https://image.tmdb.org/t/p/${tamanho}/${arquivo}`;

/**
 * Robert Pattinson nos cinemas do Brasil: consolidado de lançamentos da ANCINE (desde 2009) e, para os filmes de 2026,
 * a soma das sessões até 22/11/2026. SQL em docs/posts/noticia-pattinson-007/legenda.md.
 */
const carreira = [
  { titulo: 'Amanhecer – Parte 2', ano: 2012, publico: 9_631_252 },
  { titulo: 'Amanhecer – Parte 1', ano: 2011, publico: 7_205_878 },
  { titulo: 'Eclipse', ano: 2010, publico: 6_218_629 },
  { titulo: 'Lua Nova', ano: 2009, publico: 6_135_360 },
  { titulo: 'Batman', ano: 2022, publico: 5_902_969, destaque: true },
  { titulo: 'A Odisseia', ano: 2026, publico: 5_322_954 },
  { titulo: 'O Drama', ano: 2026, publico: 702_781 },
  { titulo: 'Lembranças', ano: 2010, publico: 428_999 },
  { titulo: 'Mickey 17', ano: 2025, publico: 427_779 },
  { titulo: 'Tenet', ano: 2020, publico: 334_144 },
];
/** Os 007 de Daniel Craig lançados desde 2009 (consolidado). */
const bonds = [
  { titulo: 'Batman (Pattinson)', ano: 2022, publico: 5_902_969, pattinson: true },
  { titulo: 'Skyfall', ano: 2012, publico: 2_553_352 },
  { titulo: '007 Contra Spectre', ano: 2015, publico: 2_101_350 },
  { titulo: 'Sem Tempo para Morrer', ano: 2021, publico: 1_091_342 },
];
/** Filmes de 2026 com Pattinson ou Anne Hathaway: soma das sessões até 22/11/2026. */
const em2026 = [
  { titulo: 'O Diabo Veste Prada 2', quem: 'Hathaway', publico: 6_900_246 },
  { titulo: 'A Odisseia', quem: 'os dois', publico: 5_322_954 },
  { titulo: 'Verity', quem: 'Hathaway', publico: 2_089_770 },
  { titulo: 'O Drama', quem: 'Pattinson', publico: 702_781 },
  { titulo: 'O Fim da Rua', quem: 'Hathaway', publico: 348_373 },
];
const total2026 = 121_280_537;
/** A sátira do slide 5: papéis reais de Pattinson entre 2025 e 2026 (e o 007), escritos como vagas de emprego. */
const vagas = [
  { cargo: 'Agente secreto britânico', filme: '007, o 26º filme' },
  { cargo: 'Vigilante noturno em Gotham', filme: 'Batman' },
  { cargo: 'Vilão em Arrakis', filme: 'Duna: Parte Três' },
  { cargo: 'Pretendente da rainha de Ítaca', filme: 'A Odisseia' },
  { cargo: 'Noivo da Zendaya', filme: 'O Drama' },
  { cargo: 'Funcionário descartável, em série', filme: 'Mickey 17' },
];

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const duasCasas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const milhoes = (n: number) => duasCasas.format(n / 1e6);
const curto = (n: number) => (n >= 1e6 ? `${duasCasas.format(n / 1e6)} mi` : `${umaCasa.format(n / 1000)} mil`);

/**
 * CineData | Notícia: Robert Pattinson é o novo James Bond (anúncio de 16/11/2026). 6 slides 1080×1350: capa, o
 * anúncio, a carreira nos cinemas do Brasil, Batman × os 007 de Daniel Craig, a piada do "ele está em todo filme" com
 * Anne Hathaway e o que vem.
 */
@Component({
  selector: 'cd-slides-noticia-pattinson-007',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | Notícia: Robert Pattinson é o novo 007</h1>
        <p class="secundario">6 slides 1080×1350. PNGs em docs/posts/noticia-pattinson-007.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="6" [fundo]="imagens.capa" posicaoFundo="30% 30%" [escurecer]="true" credito="Imagem: O Drama (divulgação)">
        <div class="base">
          <span class="selo">CineData <i>|</i> Notícia</span>
          <p class="manchete grande">Pattinson é o novo 007</p>
          <p class="texto claro">
            A Amazon MGM anunciou em 16/11: Robert Pattinson vai viver James Bond no próximo filme da série, dirigido por
            Denis Villeneuve. E nos cinemas do Brasil, como ele chega?
          </p>
        </div>
        <p class="arraste">Os números dele →</p>
      </cd-slide>

      <!-- 2. O anúncio -->
      <cd-slide [numero]="2" [total]="6">
        <span class="rotulo">O anúncio</span>
        <p class="manchete compacta">É o 7º ator a viver James Bond na série oficial, depois de Daniel Craig.</p>
        <dl class="ficha">
          <div><dt>O filme</dt><dd>o 26º da série, ainda sem título</dd></div>
          <div><dt>Direção</dt><dd>Denis Villeneuve (Duna)</dd></div>
          <div><dt>Roteiro</dt><dd>Steven Knight (Peaky Blinders)</dd></div>
          <div><dt>Produção</dt><dd>Amy Pascal e David Heyman, para a Amazon MGM Studios</dd></div>
          <div><dt>Estreia</dt><dd>ainda sem data</dd></div>
        </dl>
      </cd-slide>

      <!-- 3. A carreira no Brasil -->
      <cd-slide [numero]="3" [total]="6">
        <span class="rotulo">Pattinson nos cinemas do Brasil</span>
        <p class="manchete compacta">Fora de Crepúsculo, o maior público dele aqui foi como Batman.</p>
        <ol class="ranking" aria-label="Os 10 filmes de Robert Pattinson com mais público no Brasil desde 2009">
          @for (f of carreira; track f.titulo) {
            <li [class.forte]="f.destaque">
              <span class="nome">{{ f.titulo }}<small>{{ f.ano }}</small></span>
              <span class="trilho"><span class="barra" [style.width.%]="(f.publico / carreira[0].publico) * 100"></span></span>
              <span class="valor">{{ curto(f.publico) }}</span>
            </li>
          }
        </ol>
        <p class="nota">Público no Brasil desde 2009 (antes disso a ANCINE não tem a série). Crepúsculo, de 2008, fica de fora. Filmes de 2026: soma das sessões até 22/11.</p>
      </cd-slide>

      <!-- 4. Batman × 007 -->
      <cd-slide [numero]="4" [total]="6" [fundo]="imagens.batman" posicaoFundo="50% 40%" [escurecer]="true" credito="Imagem: Batman (divulgação)">
        <div class="base">
          <span class="rotulo">A régua do 007</span>
          <p class="numero">{{ vezes }}×</p>
          <p class="manchete pequena">Batman levou mais que o dobro do público de qualquer 007 de Daniel Craig desde 2009.</p>
          <ol class="bonds">
            @for (b of bonds; track b.titulo) {
              <li [class.forte]="b.pattinson">
                <span class="nome">{{ b.titulo }}<small>{{ b.ano }}</small></span>
                <span class="valor">{{ curto(b.publico) }}</span>
              </li>
            }
          </ol>
        </div>
      </cd-slide>

      <!-- 5. Sátira: o currículo -->
      <cd-slide [numero]="5" [total]="6" [fundo]="imagens.clones" posicaoFundo="50% 30%" [escurecer]="true" credito="Imagem: Mickey 17 (divulgação)">
        <div class="base">
          <span class="rotulo">Vagas preenchidas</span>
          <p class="manchete pequena claro">Currículo de Robert Pattinson. Disponibilidade: nenhuma.</p>
          <ul class="vagas">
            @for (v of vagas; track v.cargo) {
              <li><span class="ok" aria-hidden="true">✓</span><span class="cargo">{{ v.cargo }}</span><small>{{ v.filme }}</small></li>
            }
          </ul>
          <p class="texto claro sobra">
            O que sobrou, Anne Hathaway pegou: cinco filmes em 2026. Juntos, os dois ficaram com
            <strong>1 em cada 8 ingressos</strong> do ano no Brasil.
          </p>
        </div>
      </cd-slide>

      <!-- 6. O que vem -->
      <cd-slide [numero]="6" [total]="6">
        <span class="rotulo">O que vem</span>
        <p class="manchete fecho">E a agenda dele não para.</p>
        <ul class="agenda">
          <li><strong>17/12</strong><span>Duna: Parte Três, de Villeneuve, com Pattinson como o vilão Scytale</span></li>
          <li><strong>Fev. 2028</strong><span>The Batman Parte II, adiado em julho</span></li>
          <li><strong>007</strong><span>o 26º Bond, ainda sem data</span></li>
        </ul>
        <p class="pergunta">Pattinson é um bom 007? E qual vaga ele pega depois dessa?</p>
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

    .manchete.compacta { font-size: 5.4cqw; margin-top: 0; text-wrap: balance; }
    .ficha { margin: auto 0 0; display: flex; flex-direction: column; gap: 2.4cqw; }
    .ficha div { display: grid; grid-template-columns: 24cqw 1fr; gap: 2cqw; font-size: 4.2cqw; line-height: 1.25; padding-bottom: 2.4cqw; border-bottom: .2cqw solid var(--cd-linha); }
    .ficha dt { color: var(--cd-tela-3); }
    .ficha dd { margin: 0; color: var(--cd-tela); font-weight: 600; text-wrap: pretty; }

    .ranking { list-style: none; margin: 2cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.6cqw; }
    .ranking li { display: grid; grid-template-columns: 40cqw 1fr 15cqw; column-gap: 2.4cqw; align-items: center; line-height: 1.1; }
    .ranking .nome { color: var(--cd-tela); font-weight: 600; font-size: 3.3cqw; white-space: nowrap; }
    .ranking small { font-weight: 400; font-size: 2.6cqw; color: var(--cd-tela-3); margin-left: 1.2cqw; }
    .ranking .trilho { display: block; }
    .ranking .barra { display: block; height: 2.6cqw; border-radius: 0 .8cqw .8cqw 0; background: var(--cd-dado-neutro); }
    .ranking .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 3.6cqw; color: var(--cd-tela); text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .ranking li.forte .barra { background: var(--cd-dado-ambar); }
    .ranking li.forte .nome, .ranking li.forte .valor { color: var(--cd-projetor); }
    .ranking + .nota { font-size: 2.9cqw; text-wrap: pretty; padding-top: 2cqw; }

    .base .numero { font-size: 15cqw; }
    .base .manchete.pequena { margin-top: 1.4cqw; text-wrap: pretty; }
    .bonds, .lista2026 { list-style: none; margin: 3cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.2cqw; }
    .bonds li, .lista2026 li { line-height: 1.15; display: flex; justify-content: space-between; align-items: baseline; padding: 1.4cqw 3cqw; border-radius: 2.4cqw; background: rgb(22 24 31 / .88); border: .3cqw solid var(--cd-linha); }
    .bonds .nome, .lista2026 .nome { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4cqw; color: var(--cd-tela); }
    .bonds small, .lista2026 small { font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 2.8cqw; color: var(--cd-tela-3); margin-left: 1.4cqw; }
    .bonds .valor, .lista2026 .valor { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4.4cqw; color: var(--cd-tela); font-variant-numeric: tabular-nums; }
    .bonds li.forte .nome, .bonds li.forte .valor { color: var(--cd-projetor); }
    .lista2026 { gap: .8cqw; margin-top: 2.4cqw; }
    .base .numero.um-em-oito { font-size: 11cqw; margin-top: 1.4cqw; }
    .lista2026 li { padding: 1cqw 3cqw; line-height: 1.15; }
    .lista2026 .nome { font-size: 3.6cqw; }
    .lista2026 .valor { font-size: 3.8cqw; }

    .vagas { list-style: none; margin: 2cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: .8cqw; }
    .vagas li { display: grid; grid-template-columns: 5cqw 1fr auto; align-items: center; gap: 2cqw; padding: .9cqw 2.6cqw; line-height: 1.15; border-radius: 2.4cqw; background: rgb(22 24 31 / .88); border: .3cqw solid var(--cd-linha); }
    .vagas .ok { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 4cqw; color: var(--cd-projetor); text-align: center; }
    .vagas .cargo { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.5cqw; color: var(--cd-tela); }
    .vagas small { font-family: var(--cd-fonte-texto); font-weight: 400; font-size: 2.7cqw; color: var(--cd-tela-2); text-align: right; white-space: nowrap; }
    .base > .texto.sobra { font-size: 3.6cqw; margin-top: 2.4cqw; text-wrap: pretty; }
    .sobra strong { color: var(--cd-projetor); }

    .manchete.fecho { margin-top: 0; font-size: 6.4cqw; text-wrap: balance; }
    .agenda { list-style: none; margin: 4cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.8cqw; }
    .agenda li { display: grid; grid-template-columns: 26cqw 1fr; gap: 2.4cqw; align-items: baseline; padding: 2.4cqw 3.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .agenda strong { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.6cqw; color: var(--cd-projetor); }
    .agenda span { font-size: 3.6cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.2cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesNoticiaPattinson007 {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('vc7TeZyKhBeVA4YI3z1KAeIXqGV.jpg'),
    batman: tmdb('IYUD7rAIXzBM91TT3Z5fILUS7n.jpg'),
    clones: tmdb('9PRKAdrDvAdCfg3EcApLTfzGsEt.jpg'),
  };
  protected readonly carreira = carreira;
  protected readonly bonds = bonds;
  protected readonly em2026 = em2026;
  protected readonly vagas = vagas;
  protected readonly formatar = formatar;
  protected readonly curto = curto;
  protected readonly milhoes = milhoes;
  protected readonly soma2026 = em2026.reduce((t, f) => t + f.publico, 0);
  protected readonly vezes = umaCasa.format(bonds[0].publico / bonds[1].publico);
  protected readonly fatia2026 = Math.round((this.soma2026 / total2026) * 1000) / 10;
}
