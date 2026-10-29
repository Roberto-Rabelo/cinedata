import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { filme, materia as dadoMateria, trilha } from '../../shared/dados-estruturados';
import { corOrigem, formatar, rotuloOrigem } from '../../shared/formatar';
import { valorDe } from '../../shared/recurso';
import { FONTE, Seo } from '../../shared/seo';
import { Cartaz } from '../../shared/ui/cartaz';
import { Trailer } from '../../shared/ui/trailer';
import { Materia as DadosMateria, PASTA_MATERIAS } from './modelos';

@Component({
  selector: 'cd-materia',
  imports: [RouterLink, Cartaz, Trailer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (recurso.error()) {
      <section class="conteudo materia">
        <div class="cartao"><h1>Notícia não encontrada</h1><a routerLink="/materias">Ver todas as notícias →</a></div>
      </section>
    } @else if (dados(); as m) {
      <article class="conteudo materia">
        <a routerLink="/materias" class="voltar secundario">← Notícias</a>
        <header>
          <span class="meta"><span class="chip chip--estreia">{{ m.formato }}</span><time class="secundario" [attr.datetime]="m.data">{{ formatar.diaMesAno(m.data) }}</time></span>
          <h1>{{ m.titulo }}</h1>
          <p class="resumo">{{ m.resumo }}</p>
        </header>
        <figure class="capa">
          <img [src]="m.imagem" [alt]="m.titulo" width="1280" height="720" />
          <figcaption class="secundario">{{ m.creditoImagem }}</figcaption>
        </figure>

        <div class="corpo" [innerHTML]="m.html"></div>

        @if (m.trailer; as t) {
          <section class="bloco">
            <h2>Trailer</h2>
            <cd-trailer [youtube]="t.youtube" [titulo]="t.titulo" />
          </section>
        }

        @if (obrasComPagina().length) {
          <section class="bloco">
            <h2>Os filmes nos dados</h2>
            <ul class="obras">
              @for (o of obrasComPagina(); track o.codigo) {
                <li>
                  <a [routerLink]="['/obras', o.codigo]" data-umami-event="materia-obra">
                    <cd-cartaz [poster]="o.poster" [titulo]="formatar.titulo(o.titulo!)" [origem]="o.origem" tamanho="medio" />
                    <span>
                      <strong>{{ formatar.titulo(o.titulo!) }}</strong>
                      <span class="secundario"><span class="amostra" [style.background]="corOrigem[o.origem!]"></span> {{ rotuloOrigem[o.origem!] }}</span>
                      <span class="num">{{ formatar.inteiro(o.publico!) }} espectadores</span>
                      <span class="mais">curva de público →</span>
                    </span>
                  </a>
                </li>
              }
            </ul>
          </section>
        }

        <footer class="rodape-materia secundario">
          @if (m.instagram) {
            <p>Esta matéria também está no Instagram: <a [href]="m.instagram" target="_blank" rel="noopener">&#64;cinedata.br</a>.</p>
          }
          @if (m.fontes.length) {
            <p>Fontes:
              @for (f of m.fontes; track f.url; let ultima = $last) {
                <a [href]="f.url" target="_blank" rel="noopener">{{ f.titulo }}</a>{{ ultima ? '.' : '; ' }}
              }
            </p>
          }
          <p>{{ fonte }}.</p>
        </footer>
      </article>
    } @else {
      <div class="conteudo materia"><div class="esqueleto" style="height: 480px"></div></div>
    }
  `,
  styles: `
    .materia { display: flex; flex-direction: column; gap: 24px; padding-top: 24px; padding-bottom: 56px; max-width: 760px; }
    .voltar { font-size: 14px; }
    .meta { display: flex; gap: 10px; align-items: center; font-size: 13px; }
    h1 { margin-top: 12px; font-size: clamp(30px, 5vw, 46px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
    .resumo { font-size: 19px; line-height: 1.45; color: var(--cd-tela-2); margin: 14px 0 0; }
    .capa { margin: 0; display: flex; flex-direction: column; gap: 6px; }
    .capa img { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; border-radius: var(--cd-raio); background: var(--cd-poltrona-2); }
    .capa figcaption { font-size: 12px; }
    /* O corpo vem do Markdown via innerHTML: fora do encapsulamento, por isso :host ::ng-deep (escopo na matéria). */
    .corpo { font-size: 17px; line-height: 1.7; }
    :host ::ng-deep .corpo :is(h2, h3) { margin: 32px 0 8px; }
    :host ::ng-deep .corpo p { margin: 0 0 16px; }
    :host ::ng-deep .corpo a { text-decoration: underline; text-decoration-color: var(--cd-projetor); text-underline-offset: 3px; }
    :host ::ng-deep .corpo strong { color: var(--cd-tela); }
    :host ::ng-deep .corpo table { width: 100%; border-collapse: collapse; font-size: 15px; margin: 8px 0 20px; font-variant-numeric: tabular-nums; }
    :host ::ng-deep .corpo th { text-align: left; color: var(--cd-tela-3); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; padding: 0 10px 8px 0; }
    :host ::ng-deep .corpo td { border-top: 1px solid var(--cd-linha); padding: 8px 10px 8px 0; }
    :host ::ng-deep .corpo ul, :host ::ng-deep .corpo ol { padding-left: 22px; margin: 0 0 16px; }
    .bloco { display: flex; flex-direction: column; gap: 12px; }
    .obras { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
    .obras a { display: flex; gap: 14px; align-items: center; padding: 12px; border: 1px solid var(--cd-linha); border-radius: var(--cd-raio); background: var(--cd-poltrona); }
    .obras a:hover { background: var(--cd-poltrona-2); }
    .obras a > span { display: flex; flex-direction: column; gap: 3px; font-size: 14px; }
    .obras strong { font-size: 16px; }
    .mais { color: var(--cd-projetor); font-weight: 600; }
    .rodape-materia { border-top: 1px solid var(--cd-linha); padding-top: 16px; font-size: 14px; }
    .rodape-materia p { margin: 0 0 6px; }
    .rodape-materia a { text-decoration: underline; text-underline-offset: 3px; }
  `,
})
export class Materia {
  private readonly seo = inject(Seo);

  /** Vem do parâmetro de rota :slug (withComponentInputBinding). */
  readonly slug = input.required<string>();
  protected readonly recurso = httpResource<DadosMateria>(() => `${PASTA_MATERIAS}/${encodeURIComponent(this.slug())}.json`);
  protected readonly dados = computed(() => valorDe(this.recurso));
  protected readonly obrasComPagina = computed(() => (this.dados()?.obras ?? []).filter(o => o.temPagina));
  protected readonly formatar = formatar;
  protected readonly rotuloOrigem = rotuloOrigem;
  protected readonly corOrigem = corOrigem;
  protected readonly fonte = FONTE;

  constructor() {
    effect(() => {
      const m = this.dados();
      if (!m) return;
      const caminho = `/materias/${m.slug}`;
      this.seo.definir({
        titulo: m.titulo,
        descricao: m.resumo,
        caminho,
        imagem: m.imagem,
        tipo: 'article',
        estruturado: [
          dadoMateria({
            titulo: m.titulo,
            resumo: m.resumo,
            caminho,
            data: m.data,
            imagem: m.imagem,
            sobre: this.obrasComPagina().map(o => filme({ nome: formatar.titulo(o.titulo!), caminho: `/obras/${o.codigo}` })),
          }),
          trilha([['CineData', '/'], ['Notícias', '/materias'], [m.titulo, caminho]]),
        ],
      });
    });
  }
}
