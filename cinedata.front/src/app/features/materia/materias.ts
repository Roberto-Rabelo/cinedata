import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { formatar } from '../../shared/formatar';
import { valorDe } from '../../shared/recurso';
import { Seo } from '../../shared/seo';
import { site } from '../../shared/dados-estruturados';
import { MateriaResumo, PASTA_MATERIAS } from './modelos';

@Component({
  selector: 'cd-materias',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="conteudo materias">
      <header>
        <span class="rotulo">Matérias</span>
        <h1>O cinema no Brasil, explicado com dados</h1>
        <p class="secundario intro">As notícias, rankings e especiais do CineData, com os números da ANCINE por trás de cada história.</p>
      </header>
      @if (lista(); as itens) {
        <ul class="grade">
          @for (m of itens; track m.slug) {
            <li>
              <a class="cartao item" [routerLink]="['/materias', m.slug]">
                <img [src]="m.imagem" [alt]="m.titulo" loading="lazy" />
                <span class="meta"><span class="chip">{{ m.formato }}</span><span class="secundario">{{ formatar.diaMesAno(m.data) }}</span></span>
                <h2>{{ m.titulo }}</h2>
                <p class="secundario">{{ m.resumo }}</p>
              </a>
            </li>
          }
        </ul>
      } @else {
        <div class="esqueleto" style="height: 360px"></div>
      }
    </section>
  `,
  styles: `
    .materias { display: flex; flex-direction: column; gap: 24px; padding-top: 32px; padding-bottom: 56px; }
    h1 { margin-top: 6px; }
    .intro { max-width: 680px; font-size: 17px; margin: 8px 0 0; }
    .grade { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--cd-gap); }
    .item { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: 0 0 20px; overflow: hidden; }
    .item > :not(img) { padding: 0 20px; }
    .item img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: var(--cd-poltrona-2); }
    .item:hover h2 { text-decoration: underline; text-decoration-color: var(--cd-projetor); text-underline-offset: 4px; }
    .meta { display: flex; gap: 10px; align-items: center; font-size: 13px; }
    h2 { font-size: 20px; }
    p { margin: 0; font-size: 14px; }
  `,
})
export class Materias {
  private readonly recurso = httpResource<MateriaResumo[]>(() => `${PASTA_MATERIAS}/indice.json`);
  protected readonly lista = () => valorDe(this.recurso);
  protected readonly formatar = formatar;

  constructor() {
    inject(Seo).definir({
      titulo: 'Matérias: o cinema no Brasil explicado com dados',
      descricao: 'Notícias, rankings da semana e especiais sobre o cinema no Brasil, com os números de bilheteria da ANCINE por trás de cada história.',
      caminho: '/materias',
      estruturado: [site()],
    });
  }
}
