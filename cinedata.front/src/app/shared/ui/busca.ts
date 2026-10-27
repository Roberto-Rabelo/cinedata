import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ObraResumo } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { formatar, rotuloOrigem } from '../formatar';
import { valorDe } from '../recurso';
import { Cartaz } from './cartaz';

const normalizar = (texto: string) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Título no Brasil ou original contém o termo, sem diferenciar acento nem caixa; mantém a ordem (por público). */
export function filtrarObras(obras: ObraResumo[], termo: string, limite = 20): ObraResumo[] {
  const procurado = normalizar(termo.trim());
  if (procurado.length < 2) return [];
  return obras
    .filter(o => normalizar(o.titulo).includes(procurado) || (o.tituloOriginal && normalizar(o.tituloOriginal).includes(procurado)))
    .slice(0, limite);
}

@Component({
  selector: 'cd-busca',
  imports: [RouterLink, Cartaz],
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
            @for (obra of encontradas(); track obra.codigo) {
              <li>
                <a [routerLink]="['/obras', obra.codigo]" (click)="limpar()" data-umami-event="busca"
                   [attr.data-umami-event-termo]="termo().trim().toLowerCase()" [attr.data-umami-event-filme]="obra.codigo">
                  <cd-cartaz [poster]="obra.poster" [titulo]="formatar.titulo(obra.titulo)" [origem]="obra.origem" />
                  <span class="nome">
                    <span class="titulo">{{ formatar.titulo(obra.titulo) }}</span>
                    <span class="secundario num">{{ rotuloOrigem[obra.origem] }} · {{ formatar.compacto(obra.publico) }}</span>
                  </span>
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
    a { display: flex; align-items: center; gap: 12px; }
    .nome { display: flex; flex-direction: column; min-width: 0; font-size: 13.5px; }
    cd-cartaz { width: 32px; }
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
  /** Na API a busca já vem filtrada; no site estático vem o índice inteiro (busca.json) e o filtro é aqui. */
  protected readonly encontradas = computed(() => {
    const obras = valorDe(this.resultados) ?? [];
    return rotasApi.buscaLocal ? filtrarObras(obras, this.termo()) : obras;
  });
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
