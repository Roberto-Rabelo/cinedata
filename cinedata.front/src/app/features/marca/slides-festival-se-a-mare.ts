import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { Slide } from './slide';

const tmdb = (arquivo: string, tamanho = 'w1280') => `https://image.tmdb.org/t/p/${tamanho}/${arquivo}`;

/**
 * Cachoeira e a Bahia nos dados da ANCINE: cadastro de salas (arquivo de 06/11/2026) e bilheteria por sala (sessões de
 * 01/01 a 15/11/2026). SQL em docs/posts/festival-se-a-mare-te-trouxe-fica/legenda.md.
 */
const cachoeira = { sala: 'Cine Theatro Cachoeirano', lugares: 180, desde: 2014 };
const bahia = { salas: 141, municipiosComSala: 24, municipiosComSessao: 21, publico2026: 4_505_991, salvador: 2_531_641 };

/** Sessões no 34º Festival MixBrasil (11 a 22/11/2026, São Paulo). */
const sessoes = [
  { dia: 'qui', data: '12/11', hora: '15h30', passou: true },
  { dia: 'sex', data: '20/11', hora: '15h30', passou: false },
];

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * CineData | No festival: Se a Maré Te Trouxe, Fica no 34º Festival MixBrasil (sessão de 20/11/2026). 4 slides
 * 1080×1350: capa, o filme, Cachoeira e a Bahia nos dados, onde ver.
 */
@Component({
  selector: 'cd-slides-festival-se-a-mare',
  imports: [Slide, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>CineData | No festival: Se a Maré Te Trouxe, Fica</h1>
        <p class="secundario">4 slides 1080×1350. PNGs em docs/posts/festival-se-a-mare-te-trouxe-fica.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa -->
      <cd-slide [numero]="1" [total]="4" [fundo]="imagens.capa" posicaoFundo="50% 60%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="selo">CineData <i>|</i> No festival</span>
          <p class="manchete grande">Se a Maré Te Trouxe, Fica</p>
          <p class="texto claro">
            O curta baiano de Gabriel Fonseca, filmado em Cachoeira, tem sessão no 34º Festival MixBrasil nesta sexta,
            20/11, às 15h30, em São Paulo.
          </p>
        </div>
        <p class="arraste">O filme e a cidade →</p>
      </cd-slide>

      <!-- 2. O filme -->
      <cd-slide [numero]="2" [total]="4">
        <span class="rotulo">O filme</span>
        <div class="filme">
          <p class="manchete sinopse">No último Carnaval como Careta antes de deixar a cidade, Samuel se apaixona por Beto, um estranho de beleza sobrenatural. A festa termina no rio.</p>
          <img class="poster" [src]="imagens.poster" alt="Pôster de Se a Maré Te Trouxe, Fica" />
        </div>
        <dl class="ficha">
          <div><dt>Direção e roteiro</dt><dd>Gabriel Fonseca</dd></div>
          <div><dt>Elenco</dt><dd>Lucas Leto, Rafa Martins, Bruna Seli e Luciana Souza</dd></div>
          <div><dt>Filmado em</dt><dd>Cachoeira (BA), 19 minutos</dd></div>
          <div><dt>Recursos</dt><dd>Lei Paulo Gustavo</dd></div>
        </dl>
        <p class="nota">Caretas: personagens mascarados do Carnaval de cidades do interior da Bahia.</p>
      </cd-slide>

      <!-- 3. O lugar nos dados -->
      <cd-slide [numero]="3" [total]="4" [fundo]="imagens.capa" posicaoFundo="20% 50%" [escurecer]="true" credito="Imagem: divulgação">
        <div class="base">
          <span class="rotulo">Cachoeira nos dados</span>
          <p class="numero">1 sala</p>
          <p class="manchete pequena">
            de cinema no cadastro da ANCINE: o {{ cachoeira.sala }}, da prefeitura, com {{ cachoeira.lugares }} lugares.
            Sala não comercial, sem nenhuma sessão nos dados de bilheteria da ANCINE.
          </p>
          <div class="comparacao">
            <div><strong>{{ bahia.salas }} salas</strong><span>em funcionamento na Bahia, em {{ bahia.municipiosComSala }} municípios</span></div>
            <div><strong>{{ fatiaSalvador }}%</strong><span>dos {{ umaCasa.format(bahia.publico2026 / 1e6) }} milhões de ingressos da Bahia em 2026 foram em Salvador</span></div>
          </div>
        </div>
      </cd-slide>

      <!-- 4. Onde ver -->
      <cd-slide [numero]="4" [total]="4">
        <span class="rotulo">Onde ver</span>
        <p class="manchete fecho">34º Festival MixBrasil, mostra Curtas MixBrasil, São Paulo.</p>
        <ul class="agenda">
          @for (s of sessoes; track s.data) {
            <li [class.passou]="s.passou">
              <strong>{{ s.dia }}, {{ s.data }}</strong>
              <span>{{ s.passou ? 'já passou' : s.hora + ' · Sala Paulo Emílio, Centro Cultural São Paulo' }}</span>
            </li>
          }
          <li><strong>Grátis</strong><span>ingressos na bilheteria uma hora antes, sujeitos à lotação</span></li>
        </ul>
        <p class="pergunta">Que curta brasileiro você queria ver na sala de cinema da sua cidade?</p>
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
    .sinopse { margin-top: 0; font-size: 4.6cqw; text-wrap: pretty; }
    .poster { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 2cqw; border: .3cqw solid var(--cd-linha); }
    .ficha { margin: auto 0 0; display: flex; flex-direction: column; gap: 1.4cqw; }
    .ficha div { display: grid; grid-template-columns: 26cqw 1fr; gap: 2cqw; font-size: 3.4cqw; line-height: 1.25; }
    .ficha dt { color: var(--cd-tela-3); }
    .ficha dd { margin: 0; color: var(--cd-tela); font-weight: 600; text-wrap: pretty; }
    .ficha + .nota { font-size: 3cqw; margin-top: 3cqw; }

    .base .numero { font-size: 17cqw; }
    .base .manchete.pequena { margin-top: 1.4cqw; text-wrap: pretty; }
    .comparacao { display: grid; grid-template-columns: 1fr 1fr; gap: 3cqw; margin-top: 4cqw; }
    .comparacao div { display: flex; flex-direction: column; gap: 1cqw; padding: 3cqw 3.4cqw; border-radius: 3cqw; background: rgb(22 24 31 / .88); border: .3cqw solid var(--cd-linha); }
    .comparacao strong { font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; line-height: 1.1; letter-spacing: -0.03em; color: var(--cd-tela); }
    .comparacao span { font-size: 3.2cqw; color: var(--cd-tela-2); line-height: 1.3; text-wrap: pretty; }

    .manchete.fecho { margin-top: 0; font-size: 5.6cqw; text-wrap: balance; }
    .agenda { list-style: none; margin: 4cqw 0 0; padding: 0; display: flex; flex-direction: column; gap: 1.8cqw; }
    .agenda li { display: grid; grid-template-columns: 24cqw 1fr; gap: 2.4cqw; align-items: baseline; padding: 2cqw 3.2cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .agenda strong { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.4cqw; color: var(--cd-projetor); }
    .agenda span { font-size: 3.4cqw; line-height: 1.3; color: var(--cd-tela-2); text-wrap: pretty; }
    .agenda li.passou { opacity: .55; }
    .agenda li.passou strong { color: var(--cd-tela-2); }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.8cqw; line-height: 1.2; letter-spacing: -0.02em; text-wrap: balance; }
  `,
})
export class SlidesFestivalSeAMare {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly imagens = {
    capa: tmdb('j3v6X31G84DPKjeMBbPjddcRUar.jpg'),
    poster: tmdb('dnboj8XkMsGZzGOBjOskYGkU6D8.jpg', 'w500'),
  };
  protected readonly cachoeira = cachoeira;
  protected readonly bahia = bahia;
  protected readonly sessoes = sessoes;
  protected readonly formatar = formatar;
  protected readonly umaCasa = umaCasa;
  protected readonly fatiaSalvador = Math.round((bahia.salvador / bahia.publico2026) * 100);
}
