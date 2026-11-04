import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/ui/logo';
import { MateriaResumo, PASTA_MATERIAS } from '../materia/modelos';

const SITE = 'https://cinedatabr.tech';

/** Link da matéria para o adesivo de link do story, com UTM próprio para o Umami separar story de bio e de post. */
export const linkDoStory = (slug: string) =>
  `${SITE}/materias/${slug}?utm_source=instagram&utm_medium=story&utm_campaign=${slug}`;

/** Story é 9:16: a foto do TMDB em w1280 (paisagem) ficaria esticada; o original tem altura para o recorte. */
const fotoGrande = (url: string) => url.replace('/t/p/w1280/', '/t/p/original/');

/** Primeira frase do resumo: no story cabem ~3 linhas, e cortar no meio da frase fica feio. */
const primeiraFrase = (texto: string) => texto.match(/^.+?[.!?](?=\s+[A-ZÀ-Ý]|$)/)?.[0] ?? texto;

/**
 * Story 1080×1920 que leva para a matéria do site: capa da matéria (foto, selo do formato, título e resumo) e uma
 * faixa vazia, com a seta, onde entra o adesivo de link do Instagram. Serve para qualquer matéria de
 * conteudo/materias, sem código novo por post. Sem slug, lista as matérias com o link de cada uma.
 * Spec: docs/conteudo/formatos/story-materia.md.
 */
@Component({
  selector: 'cd-story-materia',
  imports: [Logo, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (!slug()) {
      <section class="conteudo lista">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Story de matéria</h1>
        <p class="secundario">
          Um story 1080×1920 por matéria, com espaço para o adesivo de link. Exporte com
          <code>node scripts/exportar-story.mjs &lt;slug&gt;</code> e cole o link abaixo no adesivo.
        </p>
        <ul>
          @for (m of indice.value() ?? []; track m.slug) {
            <li>
              <a [routerLink]="['/marca/story', m.slug]">{{ m.titulo }}</a>
              <span class="secundario">{{ m.formato }} · {{ m.data }}</span>
              <code>{{ link(m.slug) }}</code>
            </li>
          }
        </ul>
      </section>
    } @else {
      @if (exportar() === undefined) {
        <header class="conteudo cabecalho">
          <a routerLink="/marca/story" class="secundario">← Stories</a>
          <h1>Story: {{ materia()?.titulo }}</h1>
          <p class="secundario">Link para o adesivo: <code>{{ link(slug()!) }}</code></p>
        </header>
      }
      @if (materia(); as m) {
        <div class="palco">
          <div class="moldura">
            <section class="story" [attr.data-slug]="m.slug">
              <img class="foto" [src]="foto()" alt="" />
              <header class="topo">
                <cd-logo [tamanho]="null" />
                <small>{{ m.creditoImagem }}</small>
              </header>
              <div class="capa">
                <span class="selo">CineData <i>|</i> {{ m.formato }}</span>
                <p class="manchete">{{ m.titulo }}</p>
                <p class="texto">{{ chamada() }}</p>
              </div>
              <div class="chamada">
                <p>Leia a matéria completa</p>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m0 0-6-6m6 6 6-6" /></svg>
              </div>
              <!-- Faixa do adesivo de link: fica vazia no PNG; a borda tracejada só aparece na prévia. -->
              <div class="adesivo"><span>adesivo de link aqui</span></div>
              <footer class="rodape">
                <span>Fonte: ANCINE (dados abertos)</span>
                <span class="perfil">cinedatabr.tech</span>
              </footer>
            </section>
          </div>
        </div>
      } @else if (recurso.error()) {
        <p class="conteudo">Matéria "{{ slug() }}" não encontrada em {{ pasta }}. Rode <code>npm run materias</code>.</p>
      }
    }
  `,
  styles: `
    .lista { padding-top: 32px; display: flex; flex-direction: column; gap: 12px; }
    .lista ul { list-style: none; padding: 0; margin: 12px 0 48px; display: flex; flex-direction: column; gap: 16px; }
    .lista li { display: flex; flex-direction: column; gap: 4px; }
    .lista code, .cabecalho code { font-size: 12px; word-break: break-all; }
    .cabecalho { padding-top: 32px; display: flex; flex-direction: column; gap: 6px; }
    .palco { display: flex; justify-content: center; padding: 24px 16px 48px; }
    .moldura { display: block; width: min(420px, 100%); container-type: inline-size; border: 1px solid var(--cd-linha); border-radius: 12px; overflow: hidden; }
    :host(.exportar) .palco { padding: 0; justify-content: flex-start; }
    :host(.exportar) .moldura { width: 1080px; border: 0; border-radius: 0; }

    /* 1cqw = 10,8 px no PNG. O Instagram cobre ~250 px no topo (barra e perfil) e embaixo (resposta): margem de 22cqw. */
    p { margin: 0; }
    .story {
      position: relative; isolation: isolate; aspect-ratio: 9 / 16; overflow: hidden; background: var(--cd-sala);
      padding: 22cqw 7.4cqw 21cqw; display: flex; flex-direction: column;
    }
    .foto { position: absolute; inset: 0 0 auto; z-index: -2; width: 100%; height: 58%; object-fit: cover; object-position: 50% 30%; }
    .story::before {
      content: ''; position: absolute; inset: 0; z-index: -1;
      background: linear-gradient(to bottom, rgb(13 14 18 / .85), rgb(13 14 18 / .45) 16%, rgb(13 14 18 / .1) 24%, rgb(13 14 18 / .78) 34%, rgb(13 14 18 / .94) 44%, var(--cd-sala) 56%);
    }
    .topo { display: flex; justify-content: space-between; align-items: center; }
    .topo cd-logo { font-size: 6cqw; }
    .topo small { font-size: 2.6cqw; color: var(--cd-tela-2); }
    .capa { margin-top: auto; display: flex; flex-direction: column; }
    .selo {
      align-self: flex-start; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 3.8cqw;
      letter-spacing: .02em; padding: 1.3cqw 3cqw; border-radius: 99cqw; margin-bottom: 4cqw;
      color: var(--cd-sala); background: var(--cd-projetor);
    }
    .selo i { font-style: normal; opacity: .55; margin: 0 .6cqw; }
    .manchete {
      font-family: var(--cd-fonte-display); font-weight: 700; font-size: 7.6cqw; line-height: 1.05;
      letter-spacing: -0.03em; color: var(--cd-tela); text-wrap: balance;
    }
    .texto {
      margin-top: 4cqw; font-size: 4.2cqw; line-height: 1.4; color: var(--cd-tela-2); text-wrap: pretty;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .chamada { margin-top: 8cqw; display: flex; flex-direction: column; align-items: center; gap: 1.5cqw; color: var(--cd-projetor); }
    .chamada p { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5cqw; letter-spacing: -0.02em; }
    .chamada svg { width: 9cqw; height: 9cqw; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .adesivo { height: 16cqw; margin: 2cqw 12cqw 0; border-radius: 4cqw; display: grid; place-items: center; }
    .adesivo span { font-size: 3cqw; color: var(--cd-tela-3); }
    :host(:not(.exportar)) .adesivo { border: .4cqw dashed var(--cd-linha); }
    :host(.exportar) .adesivo span { visibility: hidden; }
    .rodape { margin-top: 6cqw; display: flex; justify-content: space-between; font-size: 2.8cqw; color: var(--cd-tela-3); }
    .perfil { color: var(--cd-tela-2); font-weight: 600; }
  `,
})
export class StoryMateria {
  readonly slug = input<string>();
  readonly exportar = input<string>();

  protected readonly pasta = PASTA_MATERIAS;
  protected readonly link = linkDoStory;
  protected readonly indice = httpResource<MateriaResumo[]>(() => (this.slug() ? undefined : `${PASTA_MATERIAS}/indice.json`));
  protected readonly recurso = httpResource<MateriaResumo>(() => {
    const slug = this.slug();
    return slug ? `${PASTA_MATERIAS}/${encodeURIComponent(slug)}.json` : undefined;
  });
  protected readonly materia = computed(() => (this.recurso.hasValue() ? this.recurso.value() : undefined));
  protected readonly foto = computed(() => fotoGrande(this.materia()?.imagem ?? ''));
  protected readonly chamada = computed(() => primeiraFrase(this.materia()?.resumo ?? ''));
}
