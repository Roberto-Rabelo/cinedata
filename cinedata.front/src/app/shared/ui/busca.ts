import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ObraResumo } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { formatar, rotuloOrigem } from '../formatar';

@Component({
  selector: 'cd-busca',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="busca" (focusout)="aoSair($event)">
      <input
        type="search"
        placeholder="Buscar filme…"
        aria-label="Buscar filme"
        [value]="termo()"
        (input)="termo.set($any($event.target).value)"
        (focus)="aberta.set(true)"
        (keydown.escape)="aberta.set(false)"
      />
      @if (aberta() && termoValido()) {
        <ul class="resultados cartao" role="listbox">
          @if (resultados.isLoading()) {
            <li class="secundario">Buscando…</li>
          } @else {
            @for (obra of resultados.value() ?? []; track obra.codigo) {
              <li>
                <a [routerLink]="['/obras', obra.codigo]" (click)="limpar()">
                  <span class="titulo">{{ obra.titulo }}</span>
                  <span class="secundario num">{{ rotuloOrigem[obra.origem] }} · {{ formatar.compacto(obra.publico) }}</span>
                </a>
              </li>
            } @empty {
              <li class="secundario">Nenhum filme encontrado.</li>
            }
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .busca { position: relative; width: min(320px, 100%); }
    input { width: 100%; }
    .resultados { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 10; list-style: none; margin: 0; padding: 6px; max-height: 360px; overflow: auto; }
    li { padding: 6px 8px; border-radius: var(--cd-raio-p); font-size: 14px; }
    a { display: flex; justify-content: space-between; gap: 12px; }
    li:has(a):hover { background: var(--cd-poltrona-2); }
    .titulo { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `,
})
export class Busca {
  protected readonly termo = signal('');
  protected readonly aberta = signal(false);
  protected readonly termoValido = computed(() => this.termo().trim().length >= 2);
  protected readonly resultados = httpResource<ObraResumo[]>(() =>
    this.termoValido() ? rotasApi.buscarObras(this.termo().trim()) : undefined,
  );
  protected readonly formatar = formatar;
  protected readonly rotuloOrigem = rotuloOrigem;

  protected limpar() {
    this.termo.set('');
    this.aberta.set(false);
  }

  protected aoSair(evento: FocusEvent) {
    const destino = evento.relatedTarget as Node | null;
    if (!destino || !(evento.currentTarget as HTMLElement).contains(destino)) this.aberta.set(false);
  }
}
