import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { site } from '../../shared/dados-estruturados';
import { FONTE, Seo } from '../../shared/seo';

/** Metodologia em linguagem de leitor: de onde vêm os números e o que eles não dizem. */
@Component({
  selector: 'cd-sobre',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="conteudo sobre">
      <header>
        <p class="sobretitulo">Como medimos</p>
        <h1>De onde vêm os números do CineData</h1>
        <p class="lide">
          Todo número deste site sai dos dados abertos da ANCINE: o público que cada cinema do país informa, sessão a
          sessão. Nós organizamos, somamos e comparamos. Não estimamos nem completamos nada.
        </p>
      </header>

      <div class="secoes">
        <section>
          <h2>A fonte</h2>
          <p>
            A bilheteria diária por exibidora, publicada pela ANCINE (Observatório Brasileiro do Cinema e do Audiovisual)
            com licença aberta. Cada linha é uma sessão: filme, sala, data, horário e quantas pessoas assistiram.
            Usamos também o cadastro de salas (estado, município e assentos) e o de lançamentos (renda total).
          </p>
        </section>
        <section>
          <h2>A semana do cinema</h2>
          <p>
            A semana cinematográfica vai de <strong>quinta a quarta</strong>, porque as estreias chegam às quintas.
            Meses, trimestres, semestres e anos seguem o calendário, pela data de cada sessão: uma semana que começa em
            30 de outubro conta metade em outubro e metade em novembro.
          </p>
        </section>
        <section>
          <h2>Dias parciais</h2>
          <p>
            Os cinemas enviam os dados com atraso, então os últimos dias publicados chegam com parte das salas. Um dia
            só conta como consolidado quando tem ao menos 90% das salas que costumam informar (a mediana das oito semanas
            anteriores). Períodos com dias ainda não consolidados aparecem como <strong>parciais</strong> e ficam sem
            comparação com o período anterior, para não mostrar quedas que não aconteceram.
          </p>
        </section>
        <section>
          <h2>Estreias e variação</h2>
          <p>
            A variação compara com o período equivalente anterior (a semana, o mês ou o ano antes). Um filme é
            <strong>estreia</strong> quando não teve sessões no período anterior; sessões de pré-estreia com menos de 5%
            do público atual não contam, para não gerar altas de milhares por cento.
          </p>
        </section>
        <section>
          <h2>Nacional, estrangeiro, dublado</h2>
          <p>
            A origem vem do registro do filme na ANCINE: CPB para obras brasileiras, ROE para estrangeiras. Dublado e
            legendado só se aplica a filmes estrangeiros, a partir do áudio informado em cada sessão.
          </p>
        </section>
        <section>
          <h2>Desde quando</h2>
          <p>
            O arquivo da ANCINE começa em 2014, mas só passa a cobrir o mercado inteiro em agosto de 2016 (antes disso,
            poucas salas informavam). Por isso o site começa ali. A pandemia aparece como um buraco em 2020 e 2021:
            salas fechadas, não dados faltando.
          </p>
        </section>
        <section>
          <h2>O que os dados não dizem</h2>
          <p>
            A bilheteria diária não traz renda em reais, só público. A renda aparece apenas no consolidado de lançamentos,
            que demora semanas a fechar. Também não há preço de ingresso por sessão.
          </p>
        </section>
        <section>
          <h2>Pôsteres</h2>
          <p>
            Os pôsteres dos filmes vêm do <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">The Movie
            Database (TMDB)</a>, ligados a cada filme da ANCINE pelo título original e pelo ano. Este produto usa a API do
            TMDB, mas não é endossado nem certificado pelo TMDB. Os números são todos da ANCINE.
          </p>
        </section>
        <section>
          <h2>Privacidade</h2>
          <p>
            Contamos as visitas para saber o que é mais útil: páginas vistas, de onde a pessoa veio e o que ela clicou
            no mapa e na busca. Usamos o Umami, sem cookies e sem guardar dados pessoais ou endereço IP.
          </p>
        </section>
        <section>
          <h2>Atualização</h2>
          <p>
            Uma vez por semana, depois que a ANCINE publica os dados novos. Arquivos antigos que a agência corrige são
            recarregados, então números do passado podem mudar um pouco.
          </p>
        </section>
      </div>

      <p class="fonte secundario">
        {{ fonte }}. Dados públicos, licença CC-BY.
        <a href="https://www.gov.br/ancine/pt-br/oca/dados-abertos" target="_blank" rel="noopener">Página dos dados abertos</a>.
      </p>
      <a class="mais" routerLink="/">Ver esta semana no cinema →</a>
    </article>
  `,
  styles: `
    .sobre { display: flex; flex-direction: column; gap: 28px; padding-top: 44px; padding-bottom: 64px; max-width: 920px; }
    .sobretitulo { margin: 0 0 10px; color: var(--cd-projetor); font-size: 13px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
    h1 { font-size: clamp(32px, 5vw, 52px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.05; }
    .lide { font-family: var(--cd-fonte-display); font-size: clamp(18px, 2.2vw, 22px); line-height: 1.4; margin: 16px 0 0; }
    .secoes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 40px; }
    section { border-top: 1px solid var(--cd-linha); padding-top: 16px; }
    h2 { font-size: 19px; }
    p { margin: 8px 0 0; color: var(--cd-tela-2); }
    strong { color: var(--cd-tela); font-weight: 600; }
    .fonte a, .mais, section a { color: var(--cd-tela); text-decoration: underline; text-underline-offset: 4px; }
    .mais { font-weight: 600; text-decoration-color: var(--cd-projetor); align-self: flex-start; }
    @media (max-width: 720px) { .secoes { grid-template-columns: 1fr; } }
  `,
})
export class Sobre {
  protected readonly fonte = FONTE;

  constructor() {
    inject(Seo).definir({
      titulo: 'Como medimos',
      descricao: `De onde vêm os números do CineData: bilheteria diária informada pelos cinemas à ANCINE, semana de quinta a quarta, dias parciais e estreias. ${FONTE}.`,
      caminho: '/sobre',
      estruturado: [site()],
    });
  }
}
