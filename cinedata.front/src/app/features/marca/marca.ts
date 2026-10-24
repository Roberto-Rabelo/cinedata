import { ChangeDetectionStrategy, Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { PainelSemana } from '../../core/api/modelos';
import { rotasApi } from '../../core/api/rotas-api';
import { Logo } from '../../shared/ui/logo';
import { PostRanking } from './post-ranking';

interface Cor {
  nome: string;
  token: string;
  hex: string;
  uso: string;
}

@Component({
  selector: 'cd-marca',
  imports: [Logo, PostRanking],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="conteudo marca">
      <header>
        <span class="rotulo">Identidade visual · v0.1</span>
        <h1>A sala escura e a luz do projetor</h1>
        <p class="secundario intro">
          O CineData fala de cinema com dados. O fundo é a sala escura, o texto tem a cor da tela
          e o único acento de marca é o âmbar do feixe do projetor, que ilumina o número que importa.
        </p>
      </header>

      <div class="grade-2">
        <article class="cartao logo-area">
          <span class="rotulo">Logo</span>
          <cd-logo [tamanho]="48" />
          <div class="variantes">
            <cd-logo [tamanho]="28" [comNome]="false" />
            <span class="secundario">Símbolo: o feixe âmbar do projetor ilumina três barras crescentes. A maior é âmbar.</span>
          </div>
        </article>

        <article class="cartao">
          <span class="rotulo">Tipografia</span>
          <p class="display">Bricolage Grotesque</p>
          <p class="secundario">Títulos, manchetes e números grandes. Personalidade de cartaz de cinema.</p>
          <p class="texto">Inter — textos, tabelas e interface. Números tabulares para alinhar colunas: 1.234.567</p>
        </article>
      </div>

      <article class="cartao">
        <span class="rotulo">Cores</span>
        <div class="paleta">
          @for (cor of cores; track cor.token) {
            <div class="cor">
              <span class="bloco" [style.background]="'var(' + cor.token + ')'"></span>
              <strong>{{ cor.nome }}</strong>
              <code class="secundario">{{ cor.hex }}</code>
              <span class="secundario uso">{{ cor.uso }}</span>
            </div>
          }
        </div>
        <p class="secundario nota">
          As três cores de dados foram validadas para daltonismo, contraste e luminosidade sobre o fundo escuro.
          Cor nunca é a única pista: todo gráfico tem legenda ou rótulo direto.
        </p>
      </article>

      <div class="grade-2">
        <article class="cartao">
          <span class="rotulo">Voz</span>
          <ul class="voz">
            <li><strong>O número primeiro.</strong> A manchete é o dado: "Filme X levou 1,2 milhão de pessoas ao cinema".</li>
            <li><strong>Contexto, não opinião.</strong> Comparar com a semana anterior, com outros estados, com o histórico.</li>
            <li><strong>Sempre com fonte.</strong> Todo post termina com "Fonte: ANCINE/OCA".</li>
            <li><strong>Brasileiro e regional.</strong> O leitor quer se ver no mapa: estado, cidade, sala.</li>
          </ul>
        </article>

        <article class="cartao">
          <span class="rotulo">Prévia de post · carrossel 1080×1350</span>
          @if (painel.value(); as p) {
            <cd-post-ranking [painel]="p" />
          } @else if (painel.error()) {
            <p class="secundario">Rode a API e a ingestão para ver o post com dados reais.</p>
          } @else {
            <div class="esqueleto" style="aspect-ratio: 4 / 5"></div>
          }
        </article>
      </div>
    </section>
  `,
  styles: `
    .marca { display: flex; flex-direction: column; gap: var(--cd-gap); padding-top: 32px; padding-bottom: 48px; }
    h1 { margin-top: 6px; }
    .intro { max-width: 720px; font-size: 17px; }
    .grade-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--cd-gap); align-items: start; }
    .cartao { display: flex; flex-direction: column; gap: 12px; }
    .variantes { display: flex; align-items: center; gap: 12px; font-size: 13px; }
    .display { font-family: var(--cd-fonte-display); font-size: 34px; font-weight: 800; letter-spacing: -0.03em; margin: 0; }
    .texto { margin: 0; font-variant-numeric: tabular-nums; }
    .paleta { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
    .cor { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    .bloco { height: 56px; border-radius: var(--cd-raio-p); border: 1px solid var(--cd-linha); }
    .uso { font-size: 12px; }
    .nota { font-size: 13px; margin: 0; }
    .voz { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 10px; }
  `,
})
export class Marca {
  protected readonly painel = httpResource<PainelSemana>(() => rotasApi.painel());

  protected readonly cores: Cor[] = [
    { nome: 'Sala', token: '--cd-sala', hex: '#0D0E12', uso: 'fundo' },
    { nome: 'Poltrona', token: '--cd-poltrona', hex: '#16181F', uso: 'cartões' },
    { nome: 'Tela', token: '--cd-tela', hex: '#F3EFE6', uso: 'texto' },
    { nome: 'Projetor', token: '--cd-projetor', hex: '#FFB547', uso: 'acento de marca' },
    { nome: 'Âmbar (dado)', token: '--cd-dado-ambar', hex: '#CF7A25', uso: 'série única, dublado' },
    { nome: 'Azul (dado)', token: '--cd-dado-azul', hex: '#5A78EC', uso: 'estrangeiro, legendado' },
    { nome: 'Verde (dado)', token: '--cd-dado-verde', hex: '#2EAE6C', uso: 'nacional' },
  ];
}
