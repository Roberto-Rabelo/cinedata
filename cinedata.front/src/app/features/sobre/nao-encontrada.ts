import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Qualquer endereço sem página. No site estático vira o 404.html. */
@Component({
  selector: 'cd-nao-encontrada',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="conteudo vazio">
      <p class="rotulo">Erro 404</p>
      <h1>Esta sessão não está em cartaz</h1>
      <p class="secundario">O endereço não existe ou o período ainda não foi publicado.</p>
      <a class="mais" routerLink="/">Ver esta semana no cinema →</a>
    </section>
  `,
  styles: `
    .vazio { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; padding-top: 64px; padding-bottom: 96px; }
    h1 { font-size: clamp(30px, 5vw, 48px); font-weight: 800; letter-spacing: -0.03em; }
    p { margin: 0; }
    .mais { font-weight: 600; text-decoration: underline; text-decoration-color: var(--cd-projetor); text-underline-offset: 4px; }
  `,
})
export class NaoEncontrada {}
