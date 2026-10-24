import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PainelPeriodo } from '../../core/api/modelos';
import { formatar } from '../../shared/formatar';
import { Logo } from '../../shared/ui/logo';

/**
 * Template de post 1080×1350 (carrossel do Instagram, 4:5), desenhado em unidades do próprio
 * quadro (cqw) para escalar igual em qualquer tamanho. É o protótipo do que o
 * cinedata.conteudo vai renderizar em PNG com Playwright.
 */
@Component({
  selector: 'cd-post-ranking',
  imports: [Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="post">
      <div class="topo">
        <cd-logo [tamanho]="null" />
        <span class="periodo">{{ formatar.periodo(painel().resumo.inicio, painel().resumo.fim) }}</span>
      </div>
      <p class="chamada">Os 5 filmes mais vistos da semana</p>
      <ol>
        @for (item of top5(); track item.codigoObra) {
          <li>
            <span class="pos">{{ item.posicao }}</span>
            <span class="titulo">{{ item.titulo }}</span>
            <span class="valor">{{ formatar.compacto(item.publico) }}</span>
            <span class="barra" [style.width.%]="(item.publico / maximo()) * 100"></span>
          </li>
        }
      </ol>
      <p class="total">{{ formatar.compacto(painel().resumo.publico) }} ingressos no total</p>
      <p class="fonte">Fonte: ANCINE/OCA · dados abertos · &#64;cinedata</p>
    </div>
  `,
  styles: `
    :host { display: block; container-type: inline-size; }
    .post {
      aspect-ratio: 4 / 5; background: var(--cd-sala); border: 1px solid var(--cd-linha); border-radius: 2cqw;
      padding: 6cqw; display: flex; flex-direction: column; gap: 3cqw; overflow: hidden;
      background-image: radial-gradient(120% 60% at 100% 0%, color-mix(in oklab, var(--cd-projetor) 18%, transparent), transparent 60%);
    }
    .topo { display: flex; justify-content: space-between; align-items: center; font-size: 4cqw; }
    .topo cd-logo { font-size: 5cqw; }
    .periodo { color: var(--cd-tela-2); font-size: 3cqw; }
    .chamada { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 8cqw; line-height: 1.05; letter-spacing: -0.03em; margin: 2cqw 0 1cqw; }
    ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3.2cqw; flex: 1; }
    li { display: grid; grid-template-columns: 6cqw 1fr auto; grid-template-rows: auto 2.4cqw; column-gap: 3cqw; row-gap: 1.2cqw; align-items: center; }
    .pos { grid-row: span 2; font-family: var(--cd-fonte-display); font-weight: 800; font-size: 7cqw; color: var(--cd-projetor); }
    .titulo { font-weight: 600; font-size: 3.8cqw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .valor { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.2cqw; font-variant-numeric: tabular-nums; }
    .barra { grid-column: 2 / 4; height: 2.4cqw; border-radius: 0 1cqw 1cqw 0; background: var(--cd-dado-ambar); }
    .total { font-size: 3.6cqw; color: var(--cd-tela-2); margin: 0; }
    .fonte { font-size: 2.6cqw; color: var(--cd-tela-3); margin: 0; }
  `,
})
export class PostRanking {
  readonly painel = input.required<PainelPeriodo>();
  protected readonly top5 = computed(() => this.painel().ranking.slice(0, 5));
  protected readonly maximo = computed(() => Math.max(1, ...this.top5().map(i => i.publico)));
  protected readonly formatar = formatar;
}
