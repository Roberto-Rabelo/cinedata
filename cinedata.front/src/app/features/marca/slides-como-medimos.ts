import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../shared/ui/logo';
import { Slide } from './slide';

/**
 * Salas que informaram cada dia, em % da mediana das 8 semanas anteriores (regra de dias consolidados,
 * ADR 0004), na publicação de 22/10/2026. SQL em docs/posts/como-medimos/legenda.md.
 */
const cobertura = [
  ['08', 99.7], ['09', 99.2], ['10', 99.5], ['11', 100.1], ['12', 96.4], ['13', 96.7], ['14', 99.6],
  ['15', 94.3], ['16', 93.2], ['17', 94.5], ['18', 96.3], ['19', 89.1], ['20', 91.8], ['21', 85.8], ['22', 5.8],
] as const;

const limite = 90;
const escala = 105;

/** Carrossel "Como medimos" (6 slides 1080×1350): capa da marca, fonte, semana, atraso dos dados e limites. */
@Component({
  selector: 'cd-slides-como-medimos',
  imports: [Slide, RouterLink, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './slides-comum.css',
  host: { '[class.exportar]': 'exportar() !== undefined' },
  template: `
    @if (exportar() === undefined) {
      <header class="conteudo cabecalho">
        <a routerLink="/marca" class="secundario">← Marca</a>
        <h1>Como medimos</h1>
        <p class="secundario">6 slides 1080×1350. PNGs em docs/posts/como-medimos.</p>
      </header>
    }
    <div class="slides">
      <!-- 1. Capa da marca -->
      <cd-slide [numero]="1" [total]="6" [semLogo]="true" class="slide-marca">
        <div class="marca-capa">
          <div class="logo-grande">
            <span class="feixe-capa" aria-hidden="true"></span>
            <cd-logo [tamanho]="null" />
          </div>
          <p class="lema">O cinema brasileiro em números</p>
        </div>
        <div class="assunto">
          <span class="rotulo">Como medimos</span>
          <p class="manchete grande">De onde vem cada número que a gente posta</p>
        </div>
        <p class="arraste">Arraste →</p>
      </cd-slide>

      <!-- 2. Capa -->
      <cd-slide [numero]="2" [total]="6">
        <span class="rotulo">Como medimos</span>
        <div class="capa">
          <p class="numero">38,5 milhões</p>
          <p class="manchete">de sessões de cinema. É daí que sai cada número que a gente posta.</p>
          <p class="texto">Como a gente mede, em 4 pontos.</p>
        </div>
      </cd-slide>

      <!-- 3. A fonte -->
      <cd-slide [numero]="3" [total]="6">
        <span class="rotulo">1 · A fonte</span>
        <p class="manchete grande">Dados abertos da ANCINE</p>
        <p class="texto">Os cinemas informam cada sessão à ANCINE, que publica tudo como “bilheteria diária por exibidoras”. Cada sessão traz:</p>
        <ul class="chips">
          <li>Filme</li>
          <li>Sala e cidade</li>
          <li>Dia e horário</li>
          <li>Público</li>
          <li>Dublado ou legendado</li>
        </ul>
        <p class="nota">Projeto independente: não somos a ANCINE.</p>
      </cd-slide>

      <!-- 4. A semana -->
      <cd-slide [numero]="4" [total]="6">
        <span class="rotulo">2 · A semana</span>
        <p class="manchete grande">De quinta a quarta</p>
        <ol class="dias">
          @for (d of dias; track d; let i = $index) {
            <li [class.quinta]="i === 0">{{ d }}</li>
          }
        </ol>
        <p class="estreias">↑ estreias</p>
        <p class="texto">É a semana do cinema: os filmes estreiam às quintas. Todo Top 5 e toda comparação com a semana anterior usam essa semana, não a de domingo a sábado.</p>
        <p class="nota">Exemplo: a semana de 08/10/2026 vai da quinta, dia 08, à quarta, dia 14.</p>
      </cd-slide>

      <!-- 5. Os últimos dias -->
      <cd-slide [numero]="5" [total]="6">
        <span class="rotulo">3 · Os últimos dias</span>
        <p class="manchete grande uma-linha">Os dados chegam aos poucos</p>
        <p class="texto">Um dia só entra na conta quando 90% das salas já informaram. Por isso o Top 5 sai só de semana completa.</p>
        <div class="cobertura" role="img" aria-label="Salas que informaram cada dia, de 08 a 22 de outubro, em % do normal">
          <span class="limite" [style.bottom.%]="(limite / escala) * 100"><span>90%</span></span>
          @for (c of cobertura; track c[0]) {
            <div class="dia" [class.parcial]="c[1] < limite">
              <span class="barra" [style.height.%]="(c[1] / escala) * 100"></span>
            </div>
          }
        </div>
        <div class="eixo-dias">
          @for (c of cobertura; track c[0]) {
            <span>{{ c[0] }}</span>
          }
        </div>
        <div class="semanas">
          <span class="completa">08 a 14/10 · completa</span>
          <span class="chegando">15 a 21/10 · parcial</span>
        </div>
        <p class="nota">Salas que informaram cada dia de outubro, em % do normal (situação em 23/10).</p>
      </cd-slide>

      <!-- 6. Os limites -->
      <cd-slide [numero]="6" [total]="6">
        <span class="rotulo">4 · Os limites</span>
        <ul class="limites">
          <li><strong>Confiável desde ago/2016</strong><span>Antes disso a base quase não tem sessões. Nossos históricos começam aí.</span></li>
          <li><strong>Pode diferir do Anuário</strong><span>O Anuário do OCA usa outra base, com correções posteriores. Antes de cravar um recorde, a gente confere lá.</span></li>
        </ul>
        <p class="pergunta">Ficou alguma dúvida? Pergunta nos comentários.</p>
      </cd-slide>
    </div>
  `,
  styles: `
    /* 1: capa da marca. O feixe do projetor do logo cruza o quadro; o logo grande é o centro da capa. */
    .marca-capa { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4cqw; }
    .logo-grande { position: relative; font-size: 15.5cqw; }
    .logo-grande cd-logo { position: relative; z-index: 1; }
    /* Continua o feixe do símbolo: nasce na lente (x = 9,5 de 32 no SVG de 1,35em) com a mesma abertura e se abre até
       a borda do quadro, passando por trás do nome. */
    .feixe-capa {
      position: absolute; left: calc(1.35em * 9.5 / 32); top: 50%; width: 100cqw; height: 72cqw; pointer-events: none;
      transform: translateY(-50%);
      background: linear-gradient(90deg, color-mix(in oklab, var(--cd-projetor) 30%, transparent), transparent 90%);
      clip-path: polygon(0 48.7%, 100% 0, 100% 100%, 0 51.3%);
    }
    .lema { font-family: var(--cd-fonte-display); font-weight: 600; font-size: 5.2cqw; letter-spacing: -0.02em; color: var(--cd-tela-2); }
    .assunto { position: relative; padding-top: 5cqw; border-top: .3cqw solid var(--cd-linha); }
    .assunto .rotulo { display: block; }
    .assunto + .arraste { margin-top: 4cqw; }

    /* 2 */
    .capa .manchete { font-size: 7cqw; }
    .capa .texto { margin-top: 5cqw; font-size: 4.2cqw; }

    /* 3 */
    .manchete.grande + .texto { margin-top: 4cqw; }

    /* 4 */
    .dias { list-style: none; padding: 0; margin: 8cqw 0 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 1.6cqw; }
    .dias li {
      aspect-ratio: 3 / 4; display: grid; place-items: center; border-radius: 2.4cqw;
      background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha);
      font-family: var(--cd-fonte-display); font-weight: 700; font-size: 4.4cqw;
    }
    .dias li.quinta { border-color: var(--cd-projetor); color: var(--cd-projetor); }
    .estreias { font-size: 3.4cqw; font-weight: 600; color: var(--cd-projetor); margin: 1.6cqw 0 0 1.4cqw; }
    .estreias + .texto { margin-top: 6cqw; }

    /* 5 */
    .manchete.uma-linha { font-size: 7.4cqw; }
    .cobertura { position: relative; flex: 1; display: grid; grid-template-columns: repeat(15, minmax(0, 1fr)); gap: .8cqw; margin-top: 5cqw; min-height: 0; border-bottom: .2cqw solid var(--cd-linha); }
    .dia { display: flex; align-items: flex-end; min-height: 0; }
    .dia .barra { width: 100%; background: var(--cd-dado-neutro); border-radius: .6cqw .6cqw 0 0; }
    .dia.parcial .barra { background: var(--cd-dado-ambar); }
    .limite { position: absolute; left: 0; right: 0; border-top: .3cqw dashed var(--cd-tela-2); z-index: 1; }
    .limite span { position: absolute; right: 0; bottom: .8cqw; font-size: 2.8cqw; font-weight: 600; color: var(--cd-tela); background: var(--cd-sala); padding: 0 .8cqw; }
    .eixo-dias { display: grid; grid-template-columns: repeat(15, minmax(0, 1fr)); gap: .8cqw; margin-top: 1cqw; font-size: 2.6cqw; color: var(--cd-tela-2); text-align: center; font-variant-numeric: tabular-nums; }
    .semanas { display: grid; grid-template-columns: 7fr 7fr 1fr; gap: .8cqw; margin-top: 1.6cqw; font-size: 3cqw; font-weight: 600; }
    .semanas span { border-top: .4cqw solid; padding-top: 1cqw; }
    .semanas .completa { border-color: var(--cd-dado-neutro); }
    .semanas .chegando { border-color: var(--cd-dado-ambar); }
    .semanas + .nota { margin-top: 3cqw; }

    /* 6 */
    .limites { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3cqw; }
    .limites li { display: flex; flex-direction: column; gap: 1.4cqw; padding: 3.4cqw 4cqw; border-radius: 3cqw; background: var(--cd-poltrona); border: .3cqw solid var(--cd-linha); }
    .limites strong { font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.6cqw; line-height: 1.1; letter-spacing: -0.02em; }
    .limites span { font-size: 3.8cqw; line-height: 1.4; color: var(--cd-tela-2); }
    .pergunta { margin-top: auto; font-family: var(--cd-fonte-display); font-weight: 700; font-size: 5.6cqw; line-height: 1.2; letter-spacing: -0.02em; color: var(--cd-projetor); }
  `,
})
export class SlidesComoMedimos {
  /** Query param ?exportar (vinculado pelo router): slides em tamanho real para o PNG. */
  readonly exportar = input<string>();

  protected readonly dias = ['qui', 'sex', 'sáb', 'dom', 'seg', 'ter', 'qua'];
  protected readonly cobertura = cobertura;
  protected readonly limite = limite;
  protected readonly escala = escala;
}
