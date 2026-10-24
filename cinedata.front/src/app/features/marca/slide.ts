import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Logo } from '../../shared/ui/logo';

/**
 * Moldura de um slide de carrossel 1080×1350 (4:5): logo e contador no topo, fonte e perfil no rodapé.
 * O conteúdo projetado usa cqw, medido contra este quadro (1cqw = 10,8 px no PNG final).
 */
@Component({
  selector: 'cd-slide',
  imports: [Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Posição no carrossel, para o script de exportação nomear o PNG (há slides de vídeo entre eles).
  host: { '[attr.data-numero]': 'numero()' },
  template: `
    <section class="slide">
      <header class="topo">
        <cd-logo [tamanho]="null" />
        <span class="contador">{{ numero() }}/{{ total() }}</span>
      </header>
      <div class="corpo"><ng-content /></div>
      <footer class="rodape">
        <span>Fonte: ANCINE (dados abertos)</span>
        <span class="perfil">&#64;cinedata.br</span>
      </footer>
    </section>
  `,
  styles: `
    :host { display: block; container-type: inline-size; }
    .slide {
      aspect-ratio: 4 / 5; background: var(--cd-sala); overflow: hidden;
      /* margem segura de ~80 px nos 1080 px */
      padding: 7.4cqw; display: flex; flex-direction: column; gap: 4cqw;
      background-image: radial-gradient(120% 60% at 100% 0%, color-mix(in oklab, var(--cd-projetor) 16%, transparent), transparent 60%);
    }
    .topo { display: flex; justify-content: space-between; align-items: center; }
    .topo cd-logo { font-size: 4.6cqw; }
    .contador { font-size: 3cqw; color: var(--cd-tela-2); font-variant-numeric: tabular-nums; }
    .corpo { flex: 1; display: flex; flex-direction: column; min-height: 0; }
    .rodape { display: flex; justify-content: space-between; font-size: 2.8cqw; color: var(--cd-tela-3); }
    .perfil { color: var(--cd-tela-2); font-weight: 600; }
  `,
})
export class Slide {
  readonly numero = input.required<number>();
  readonly total = input(7);
}
