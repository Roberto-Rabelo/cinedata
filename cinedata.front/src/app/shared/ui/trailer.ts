import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Trailer do YouTube sem pesar a página: até o clique só aparece a miniatura (uma imagem); o player
 * (youtube-nocookie, sem cookies de rastreamento até tocar) carrega só quando a pessoa pede.
 */
@Component({
  selector: 'cd-trailer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="trailer">
      @if (tocando()) {
        <iframe [src]="enderecoPlayer()" [title]="titulo()" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
      } @else {
        <button type="button" (click)="tocando.set(true)" [attr.aria-label]="'Assistir: ' + titulo()" data-umami-event="trailer">
          <img [src]="miniatura()" [alt]="titulo()" loading="lazy" width="1280" height="720" />
          <span class="play" aria-hidden="true"></span>
        </button>
      }
      <figcaption class="secundario">{{ titulo() }} · YouTube</figcaption>
    </figure>
  `,
  styles: `
    .trailer { margin: 0; display: flex; flex-direction: column; gap: 8px; }
    button, iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: var(--cd-raio); overflow: hidden; background: #000; }
    button { position: relative; padding: 0; cursor: pointer; }
    img { width: 100%; height: 100%; object-fit: cover; opacity: .85; transition: opacity .2s; }
    button:hover img { opacity: 1; }
    .play { position: absolute; inset: 0; margin: auto; width: 72px; height: 72px; border-radius: 50%; background: var(--cd-projetor); }
    .play::after { content: ''; position: absolute; left: 29px; top: 22px; border-style: solid; border-width: 14px 0 14px 22px; border-color: transparent transparent transparent var(--cd-sala); }
    figcaption { font-size: 13px; }
  `,
})
export class Trailer {
  readonly youtube = input.required<string>();
  readonly titulo = input('Trailer');
  protected readonly tocando = signal(false);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly miniatura = computed(() => `https://i.ytimg.com/vi/${encodeURIComponent(this.youtube())}/hqdefault.jpg`);
  // A chave vem do nosso conteúdo (frontmatter), validada aqui: só letras, números, - e _.
  protected readonly enderecoPlayer = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      /^[\w-]{6,20}$/.test(this.youtube()) ? `https://www.youtube-nocookie.com/embed/${this.youtube()}?autoplay=1&rel=0` : 'about:blank',
    ),
  );
}
