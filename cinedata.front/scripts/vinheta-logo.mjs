// Vinheta do logo (a abertura do Reels de apresentação v2, inspirada na da Pixar): o projetor do logo é um
// personagem. Ele entra pulando (os rolos de filme são as orelhas e a lente é o olho), olha as barras, pula por cima
// delas, vira, olha para a câmera e pisca, e num último pulo para no lugar do logo: os rolos recolhem, o olho vira a
// lente e acende; o feixe atravessa o símbolo, cada barra pula ao ser iluminada e a luz acende o nome. No fim o logo
// encolhe e pousa no símbolo de um cabeçalho da composição (por padrão `#topo svg`), que assume dali em diante.
//
// Usada por gerar-reels-v2.mjs e gerar-video-semestre-2026-v2.mjs, em composições gravadas por quadros.mjs:
// `cssVinheta` no <style>, `htmlVinheta(slogan)` por cima das outras camadas e `jsVinheta({ relogio })` no <script>,
// que define `vinheta.render(t)`. O slogan aparece sob o logo grande, pouco antes do pouso.

/** Fim da animação, no relógio dela (os tempos dentro de abertura() são nesse relógio). */
export const FIM_ABERTURA = 8.5;

/**
 * A animação foi desenhada em 8,5 s; no vídeo ela corre mais rápido, mais nas pausas que nos gestos:
 * [fim do trecho na animação, velocidade].
 */
export const TRECHOS = [[.35, 2.3], [1.42, 1.2], [2.06, 1.8], [3.05, 1.15], [4.15, 1.4], [5.75, 1.15], [6.6, 1.25], [8.5, 1.1]];

/** [instante no vídeo, instante na animação] e o instante do vídeo em que o logo pousa no cabeçalho. */
export function relogioDaVinheta(trechos = TRECHOS) {
  const relogio = trechos.reduce((pontos, [fim, velocidade]) => {
    const [video, animacao] = pontos.at(-1);
    return [...pontos, [video + (fim - animacao) / velocidade, fim]];
  }, [[0, 0]]);
  return { relogio, pouso: relogio.at(-1)[0] };
}

/** Furos de um rolo de filme (girados a cada quadro). */
const furos = (cx, cy, r) => [0, 90, 180, 270].map(a => {
  const rad = (a * Math.PI) / 180;
  return `<circle cx="${(cx + Math.cos(rad) * r * .52).toFixed(3)}" cy="${(cy + Math.sin(rad) * r * .52).toFixed(3)}" r="${(r * .22).toFixed(3)}"/>`;
}).join('') + `<circle cx="${cx}" cy="${cy}" r="${(r * .16).toFixed(3)}"/>`;

/**
 * O símbolo do logo em partes, mesmas medidas do favicon.svg. O projetor é o personagem (#bicho): corpo, dois rolos e
 * o olho, desenhados com a origem no meio da base, para pular, achatar e esticar a partir do chão.
 */
const simboloAnimado = `<svg id="simbolo" viewBox="0 0 32 32" aria-hidden="true" overflow="visible">
  <defs>
    <linearGradient id="g-feixe" x1="9.5" y1="0" x2="29" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFB547" stop-opacity=".55"/><stop offset="1" stop-color="#FFB547" stop-opacity=".07"/>
    </linearGradient>
    <clipPath id="corte-feixe"><rect id="feixe-corte" x="9.5" y="0" width="0" height="32"/></clipPath>
  </defs>
  <ellipse id="sombra" cx="0" cy="23" rx="3.4" ry=".6" fill="#000"/>
  <polygon id="feixe-logo" points="9.5,14.6 29,6.5 29,25.5 9.5,17.4" fill="url(#g-feixe)" clip-path="url(#corte-feixe)"/>
  <rect class="barra-logo" id="b1" x="15.5" y="18" width="2.6" height="5" rx=".8"/>
  <rect class="barra-logo" id="b2" x="20" y="14.5" width="2.6" height="8.5" rx=".8"/>
  <rect class="barra-logo" id="b3" x="24.5" y="10" width="2.6" height="13" rx=".8"/>
  <g id="bicho">
    <g id="rolos">
      <circle class="pele" cx="-1.6" cy="-8.4" r="1.6"/><g class="furos" id="furos1" fill="#0D0E12">${furos(-1.6, -8.4, 1.6)}</g>
      <circle class="pele" cx="1.75" cy="-8.85" r="1.95"/><g class="furos" id="furos2" fill="#0D0E12">${furos(1.75, -8.85, 1.95)}</g>
    </g>
    <rect class="pele" id="corpo" x="-3.25" y="-7" width="6.5" height="7" rx="1.4"/>
    <g id="olho">
      <circle r="1.35" fill="#0D0E12"/>
      <circle id="iris" r=".74" fill="#3A3D48"/>
      <circle id="reflexo" cx="-.42" cy="-.46" r=".34" fill="#FFFFFF"/>
    </g>
  </g>
</svg>`;

/** Estilos da vinheta (a composição precisa ter `.camada { position: absolute }` e `.logo`). */
export const cssVinheta = `
  /* Abertura: palco; o "mundo" é o logo grande e a câmera é a transformação dele. */
  #palco { inset: 0; overflow: hidden; }
  #mundo { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
  #marca { position: relative; font-size: 277px; white-space: nowrap; }
  #marca svg { width: 360px; height: 360px; }
  .barra-logo { transform-box: fill-box; transform-origin: 50% 100%; }
  #nome { position: relative; }
  #nome .escuro { color: transparent; }
  #nome .aceso { position: absolute; left: 0; top: 0; color: #F3EFE6; text-shadow: 0 0 60px #FFB54733; }
  #chao { position: absolute; left: -3000px; width: 9000px; height: 2400px; border-top: 1px solid #2A2D38;
          background: linear-gradient(#191B22, #0D0E12 260px); }
  #spot { position: absolute; width: 200px; height: 44px; margin: -22px 0 0 -100px; border-radius: 50%;
          background: radial-gradient(closest-side, #FFE9C42E, #FFE9C40A 60%, transparent); }
  #cone { position: absolute; width: 150px; height: 420px; margin: -420px 0 0 -75px;
          background: linear-gradient(#FFE9C400, #FFE9C412); clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%); }
  #brilho { position: absolute; width: 520px; height: 520px; margin: -260px 0 0 -260px; border-radius: 50%;
            background: radial-gradient(circle, #FFF3DCEE 0 4%, #FFB54788 12%, #FFB54722 35%, transparent 68%); mix-blend-mode: screen; }
  #risco { position: absolute; width: 2600px; height: 26px; margin: -13px 0 0 -1300px;
           background: radial-gradient(50% 50% at 50% 50%, #FFE3B0CC, #FFB54733 40%, transparent 72%); mix-blend-mode: screen; }
  .poeira { position: absolute; border-radius: 50%; background: #FFE6BD; }
  #bokeh { inset: 0; pointer-events: none; }
  #bokeh i { position: absolute; border-radius: 50%; background: radial-gradient(circle, #FFB54730, transparent 70%); }
  #vinheta { inset: 0; background: radial-gradient(75% 55% at 50% 45%, transparent 40%, #000000B0 100%); pointer-events: none; }
  #slogan { left: 70px; right: 70px; top: 1000px; text-align: center; font-family: 'Bricolage Grotesque', sans-serif;
            font-size: 64px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
  #slogan small { display: block; margin-top: 30px; font-family: Inter, sans-serif; font-size: 38px; font-weight: 500; letter-spacing: 0;
                  line-height: 1.35; color: #C9CCD4; }
  #slogan small b { color: #FFB547; font-weight: 600; }`;

/** Camadas da vinheta, por cima do resto da composição. */
export const htmlVinheta = (slogan) => `
  <div id="palco" class="camada">
    <div id="mundo">
      <div id="chao"></div><div id="cone"></div><div id="spot"></div>
      <span id="marca" class="logo">${simboloAnimado}<span id="nome"><span class="escuro">cine<b>data</b></span><span class="aceso">cine<b>data</b></span></span></span>
      <div id="poeiras"></div>
      <div id="brilho"></div><div id="risco"></div>
    </div>
  </div>
  <div id="bokeh" class="camada"></div>
  <div id="vinheta" class="camada"></div>
  <div id="slogan" class="camada">${slogan}</div>`;

/** Script da vinheta: define `vinheta.render(t)`, com t no relógio do vídeo, com os próprios utilitários. */
export const jsVinheta = ({ relogio, alvo = '#topo svg' }) => `
  const vinheta = (() => {
    const RELOGIO = ${JSON.stringify(relogio)};
    const POUSO = RELOGIO.at(-1)[0];
    const FIM_ABERTURA = ${FIM_ABERTURA};
    const ALVO = '${alvo}';
    const lim = (x) => Math.min(1, Math.max(0, x));
    const suave = (x) => { x = lim(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    const saida = (x) => 1 - Math.pow(1 - lim(x), 3);
    const mix = (a, b, p) => a + (b - a) * p;
    /** 0→1 entre a e b. */
    const entre = (t, a, b) => lim((t - a) / (b - a));
    /** Visível de a a b, com entrada e saída de d segundos. */
    const janela = (t, a, b, d = .35) => Math.min(entre(t, a, a + d), 1 - entre(t, b - d, b));
    const el = (id) => document.getElementById(id);
    const cor = (de, para, p) => {
      const c = (h, i) => parseInt(h.slice(1 + 2 * i, 3 + 2 * i), 16);
      return 'rgb(' + [0, 1, 2].map(i => Math.round(mix(c(de, i), c(para, i), p))).join(',') + ')';
    };
    let semente = 11;
    const aleatorio = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;

    function mostrar(id, o, dy = 0, escala = 1) {
      const e = el(id);
      e.style.opacity = o;
      e.style.transform = 'translateY(' + dy + 'px) scale(' + escala + ')';
    }

    // ---------- Abertura ----------
    // Unidades do viewBox do símbolo (32 × 32); no mundo, o símbolo tem 360 px: 1 unidade = 11,25 px.
    const U = 360 / 32;
    const CHAO = 23;     // base das barras: o chão onde o personagem pula
    const NO_LOGO = { x: 6.25, y: 19.5 }; // meio da base do projetor no logo
    const LENTE_U = { x: 9.5, y: 16 };
    const FIM_FEIXE_U = 29;
    const nome = el('nome');
    // Medidas que dependem das fontes: calculadas no primeiro quadro (depois de document.fonts.ready).
    let INICIO_NOME, LARGURA, Y0, CAMERA;
    const poeiras = [];
    const bokehs = [];
    /** Ponto do viewBox do símbolo → px do mundo. */
    const mundoX = (u) => u * U;
    const mundoY = (u) => Y0 + u * U;

    function iniciar() {
      const marca = el('marca');
      INICIO_NOME = nome.offsetLeft;
      LARGURA = marca.offsetWidth;
      Y0 = (marca.offsetHeight - 360) / 2; // o svg fica centrado na linha do logo
      const centroY = mundoY(16);
      const zFinal = 940 / LARGURA;
      // Onde o logo pousa: o símbolo do cabeçalho (#topo), o mesmo desenho em 38 px.
      const topo = document.querySelector(ALVO).getBoundingClientRect();
      const zTopo = topo.width / 360;
      el('chao').style.top = mundoY(CHAO) + 'px';
      /** Pontos da câmera: [t, cx, cy, z]; cx/cy é o ponto do mundo que fica em (540, 860) na tela. */
      CAMERA = [
        [0, mundoX(21), mundoY(14.5), 2.45],
        [1.5, mundoX(23), mundoY(14.5), 2.5],
        [2.25, mundoX(23), mundoY(14.5), 2.5],
        [3.1, mundoX(14), mundoY(14.5), 2.6],
        [4.8, mundoX(13), mundoY(15), 2.75],
        [6.4, LARGURA / 2, centroY + 30 / zFinal, zFinal],
        [FIM_ABERTURA - .75, LARGURA / 2, centroY + 30 / (zFinal * 1.03), zFinal * 1.03],
        [FIM_ABERTURA, (540 - topo.left) / zTopo, Y0 + (860 - topo.top) / zTopo, zTopo],
      ];

      // Poeira no ar: quase invisível no escuro, brilha dentro do feixe.
      for (let i = 0; i < 90; i++) {
        const d = document.createElement('i');
        d.className = 'poeira';
        const tamanho = 2 + aleatorio() * 5;
        Object.assign(d.style, { width: tamanho + 'px', height: tamanho + 'px' });
        el('poeiras').appendChild(d);
        poeiras.push({ d, x: mix(60, LARGURA + 200, aleatorio()), y: Y0 + mix(-260, 620, aleatorio()), f: aleatorio() * 6.28, tamanho });
      }
      // Bokeh em primeiro plano: anda mais rápido que o mundo (paralaxe).
      for (let i = 0; i < 12; i++) {
        const b = document.createElement('i');
        const tamanho = 60 + aleatorio() * 180;
        Object.assign(b.style, { width: tamanho + 'px', height: tamanho + 'px' });
        el('bokeh').appendChild(b);
        bokehs.push({ b, x: aleatorio() * 2600, y: mix(200, 1000, aleatorio()), tamanho });
      }
    }

    function camera(t) {
      let [, cx, cy, z] = CAMERA[0];
      for (let i = 1; i < CAMERA.length; i++) {
        const a = CAMERA[i - 1], b = CAMERA[i];
        if (t < a[0]) break;
        const p = suave(entre(t, a[0], b[0]));
        // O zoom interpola em escala logarítmica (o movimento parece constante).
        z = Math.exp(mix(Math.log(a[3]), Math.log(b[3]), p));
        cx = mix(a[1], b[1], p); cy = mix(a[2], b[2], p);
      }
      return { cx, cy, z };
    }

    // ----- O personagem -----
    /** Saltos: [início, fim, x de saída, x de chegada, altura], em unidades do símbolo. */
    const SALTOS = [
      [.35, .85, 50, 41.5, 5],
      [.92, 1.42, 41.5, 33, 4],
      [2.3, 3.05, 33, NO_LOGO.x, 17],
    ];
    /** Antecipação (agacha antes de pular): [início, fim]. */
    const AGACHA = [[2.06, 2.3], [3.98, 4.15]];
    const voltaComSobra = (p) => 1 + 2.70158 * Math.pow(p - 1, 3) + 1.70158 * Math.pow(p - 1, 2);

    /** Posição (meio da base), escala e inclinação do personagem no instante t. */
    function bicho(t) {
      let x = SALTOS[0][2], y = CHAO, sx = 1, sy = 1, r = 0, noAr = false;
      for (const [a, b, x0, x1, h] of SALTOS) {
        if (t >= b) { x = x1; continue; }
        if (t >= a) {
          const p = (t - a) / (b - a);
          x = mix(x0, x1, p); // velocidade horizontal constante, como num salto de verdade
          y = CHAO - h * 4 * p * (1 - p);
          const v = Math.abs(1 - 2 * p); // estica na subida e na descida, arredonda no alto
          sy = 1 + .2 * v * v; sx = 1 / Math.sqrt(sy);
          r = -(h > 10 ? 15 : 9) * Math.sin(Math.PI * p); // inclina para a frente (para a esquerda)
          noAr = true;
        }
        break;
      }
      if (!noAr) {
        // Aterrissagem: achata e volta, com mola.
        for (const [, b] of SALTOS) {
          const k = t - b;
          if (k >= 0 && k < .5) { const q = .3 * Math.exp(-k * 10) * Math.cos(k * 18); sy = 1 - q; sx = 1 + .7 * q; }
        }
        for (const [a, b] of AGACHA) {
          if (t >= a && t < b) { const p = suave(entre(t, a, b)); sy = 1 - .2 * p; sx = 1 + .14 * p; }
        }
        // Parado olhando as barras: respira e inclina a cabeça, curioso.
        if (t >= 1.42 && t < 2.06) { r = -7 * suave(entre(t, 1.6, 1.8)); sy *= 1 + .02 * Math.sin((t - 1.42) * 9); }
        // Vira para a direita: um tremidinho.
        if (t >= 3.3 && t < 3.55) { const p = Math.sin(Math.PI * entre(t, 3.3, 3.55)); sy *= 1 - .07 * p; sx *= 1 + .05 * p; }
      }
      // Último pulo: sobe até o lugar do projetor no logo e fica lá, flutuando.
      if (t >= 4.15) {
        const p = entre(t, 4.15, 4.45);
        y = CHAO - (CHAO - NO_LOGO.y) * (p < 1 ? voltaComSobra(p) : 1);
        const k = t - 4.15;
        sy = t < 5 ? 1 + .14 * Math.exp(-k * 7) * Math.cos(k * 14) : 1;
        sx = 1 / Math.sqrt(sy);
        x = NO_LOGO.x; r = 0;
      }
      return { x, y, sx, sy, r };
    }

    /** O projetor acendendo: duas piscadas e liga. */
    function ligado(t) {
      if (t < 4.55) return 0;
      if (t < 4.62) return .9;
      if (t < 4.7) return .1;
      if (t < 4.75) return .7;
      if (t < 4.82) return .15;
      return saida(entre(t, 4.82, 4.95));
    }

    /** O olho: para onde olha, piscada, e no fim vira a lente (vai para a borda direita e acende). */
    function olho(t) {
      let ex = -1.35, ey = -3.6;
      // Olha para o alto das barras.
      ey -= .55 * suave(entre(t, 1.5, 1.7)) * (1 - entre(t, 1.95, 2.1));
      ex = mix(ex, 1.35, suave(entre(t, 3.3, 3.55)));
      const paraCamera = suave(entre(t, 3.62, 3.8));
      ex = mix(ex, 0, paraCamera);
      let es = 1 + .2 * paraCamera;
      const pisca = t >= 3.86 && t < 3.98 ? .1 + .9 * Math.abs(1 - 2 * entre(t, 3.86, 3.98)) : 1;
      const borda = suave(entre(t, 4.45, 4.7));
      ex = mix(ex, LENTE_U.x - NO_LOGO.x, borda);
      ey = mix(ey, LENTE_U.y - NO_LOGO.y, borda);
      es = mix(es, .75, borda);
      return { ex, ey, es, pisca, borda };
    }

    /** Frente da luz (x no mundo): cruza o símbolo devagar (as barras acendem uma a uma) e depois corre pelo nome. */
    const LIGA_FEIXE = 4.95;
    const frente = (t) => t < 5.75
      ? mix(mundoX(LENTE_U.x), mundoX(FIM_FEIXE_U) + 4, suave(entre(t, LIGA_FEIXE, 5.75)))
      : mix(mundoX(FIM_FEIXE_U) + 4, LARGURA + 300, saida(entre(t, 5.75, 6.6)));

    /** Pulo da barra ao ser iluminada: achata, estica e assenta. */
    function pulo(s) {
      if (s <= 0) return [1, 1];
      if (s < .12) { const p = s / .12; return [mix(1, 1.14, p), mix(1, .74, p)]; }
      if (s < .32) { const p = suave((s - .12) / .2); return [mix(1.14, .92, p), mix(.74, 1.18, p)]; }
      const p = (s - .32) / .45;
      const amortecido = Math.exp(-5 * p) * Math.cos(9 * p);
      return [1 - .08 * amortecido, 1 + .18 * amortecido];
    }

    /** Inclinação do feixe do logo, continuada além do símbolo (o cone de luz que acende o nome). */
    const INCLINACAO = (16 - 6.5) / (29 - 9.5);
    const dentroDoFeixe = (x, y) => {
      const lx = mundoX(LENTE_U.x), ly = mundoY(LENTE_U.y);
      if (x < lx) return 0;
      const meia = 1.4 * U + (x - lx) * INCLINACAO;
      return lim(1 - Math.abs(y - ly) / meia) ** .6;
    };

    function abertura(t) {
      // Ao pousar, troca seca pelo logo do cabeçalho (mesmo desenho e lugar; um fade mostraria os dois desalinhados).
      const visivel = t < FIM_ABERTURA ? 1 : 0;
      el('vinheta').style.opacity = (1 - entre(t, FIM_ABERTURA - .6, FIM_ABERTURA)) * entre(t, 0, .4);
      el('bokeh').style.opacity = (1 - entre(t, 5.5, 6.5)) * entre(t, 0, .8);
      el('palco').style.opacity = visivel * entre(t, 0, .45);
      const s = janela(t, 6.45, FIM_ABERTURA - .35, .45);
      mostrar('slogan', s, t < 6.9 ? 30 * (1 - saida(entre(t, 6.45, 6.9))) : -40 * entre(t, FIM_ABERTURA - .8, FIM_ABERTURA - .35));
      if (!visivel) return;

      const { cx, cy, z } = camera(t);
      el('mundo').style.transform = 'translate(540px, 860px) scale(' + z + ') translate(' + (-cx) + 'px, ' + (-cy) + 'px)';

      // Personagem.
      const b = bicho(t);
      const o = olho(t);
      const luz = ligado(t);
      const pele = cor('#BDB8AC', '#F3EFE6', luz);
      el('bicho').setAttribute('transform', 'translate(' + b.x + ' ' + b.y + ') rotate(' + b.r + ') scale(' + b.sx + ' ' + b.sy + ')');
      document.querySelectorAll('#bicho .pele').forEach(e => e.setAttribute('fill', pele));
      const rolos = 1 - suave(entre(t, 4.3, 4.6));
      el('rolos').setAttribute('transform', 'translate(0 -7) scale(' + rolos + ') translate(0 7)');
      el('rolos').style.opacity = rolos > .02 ? 1 : 0;
      el('furos1').setAttribute('transform', 'rotate(' + (t * 170) + ' -1.6 -8.4)');
      el('furos2').setAttribute('transform', 'rotate(' + (t * 140) + ' 1.75 -8.85)');
      el('olho').setAttribute('transform', 'translate(' + o.ex + ' ' + o.ey + ') scale(' + o.es + ' ' + (o.es * o.pisca) + ')');
      el('olho').style.opacity = 1 - entre(t, LIGA_FEIXE, LIGA_FEIXE + .3);
      el('iris').setAttribute('fill', cor('#3A3D48', '#FFB547', Math.max(o.borda * .6, luz)));
      el('reflexo').style.opacity = 1 - o.borda;

      // Chão, luz de palco e sombra (somem quando a câmera recua para o logo).
      const palco = 1 - entre(t, 5.2, 6.2);
      const alturaU = CHAO - b.y;
      const sombra = el('sombra');
      sombra.setAttribute('cx', b.x);
      sombra.setAttribute('rx', 3.4 * (1 - .45 * Math.min(1, alturaU / 17)));
      sombra.style.opacity = .55 * (1 - .65 * Math.min(1, alturaU / 17)) * palco;
      el('chao').style.opacity = palco;
      Object.assign(el('spot').style, { left: mundoX(b.x) + 'px', top: mundoY(CHAO) + 'px', opacity: palco });
      Object.assign(el('cone').style, { left: mundoX(b.x) + 'px', top: mundoY(CHAO) + 'px', opacity: palco * (1 - .7 * luz) });

      // Feixe e barras.
      const x = frente(t);
      const acesa = t >= LIGA_FEIXE ? 1 : 0;
      el('feixe-corte').setAttribute('width', acesa * Math.max(0, Math.min(x, mundoX(FIM_FEIXE_U)) - mundoX(LENTE_U.x)) / U);
      [['b1', 15.5, '#F3EFE6'], ['b2', 20, '#F3EFE6'], ['b3', 24.5, '#FFB547']].forEach(([id, xb, acende]) => {
        // Momento em que a luz chega à barra.
        let tb = 99;
        for (let s = LIGA_FEIXE; s < 5.8; s += 1 / 120) if (frente(s) >= mundoX(xb + 1.3)) { tb = s; break; }
        const p = entre(t, tb, tb + .12);
        const [sx, sy] = pulo(t - tb);
        const barra = el(id);
        barra.setAttribute('fill', cor(id === 'b3' ? '#4A3A22' : '#2E3139', acende, p));
        barra.style.transform = 'scale(' + sx + ', ' + sy + ')';
        barra.style.filter = id === 'b3' && p > 0 ? 'drop-shadow(0 0 ' + (1.2 * p) + 'px #FFB547AA)' : 'none';
      });

      // Nome: a luz passa da esquerda para a direita (a máscara acompanha a frente do feixe).
      const xNome = x - INICIO_NOME;
      const aceso = nome.querySelector('.aceso');
      aceso.style.webkitMaskImage = aceso.style.maskImage =
        'linear-gradient(90deg, #000 ' + (xNome - 220) + 'px, transparent ' + (xNome + 40) + 'px)';
      aceso.style.opacity = acesa;

      // Brilho do olho que vira lente e o risco de luz anamórfico.
      const olhoX = mundoX(b.x + o.ex * b.sx), olhoY = mundoY(b.y + o.ey * b.sy);
      const pulso = t > 4.95 ? .85 + .15 * Math.sin(t * 9) * (1 - entre(t, 5, 7)) : 1;
      const brilho = luz * pulso * (1 - .45 * entre(t, 6.2, 8));
      Object.assign(el('brilho').style, { left: olhoX + 'px', top: olhoY + 'px', opacity: brilho, transform: 'scale(' + (.6 + .5 * luz) + ')' });
      Object.assign(el('risco').style, { left: olhoX + 'px', top: olhoY + 'px', opacity: brilho * .8 * (1 - entre(t, 6.2, 7.4)) });

      for (const p of poeiras) {
        const px = p.x + 14 * Math.sin(t * .55 + p.f);
        const py = p.y + 12 * Math.sin(t * .4 + p.f * 1.3) - t * 9;
        const naLuz = acesa && px < x ? dentroDoFeixe(px, py) : 0;
        Object.assign(p.d.style, {
          transform: 'translate(' + px + 'px, ' + py + 'px)',
          opacity: (.05 + .8 * naLuz) * (1 - entre(t, 6.2, 7.4)),
          boxShadow: naLuz > .2 ? '0 0 ' + (p.tamanho * 2) + 'px #FFB547' : 'none',
        });
      }
      for (const k of bokehs) {
        const bx = ((k.x - cx * z * .55) % 2600 + 2600) % 2600 - 760;
        k.b.style.transform = 'translate(' + bx + 'px, ' + k.y + 'px)';
      }

    }

    /** Instante do vídeo → instante da animação da abertura. */
    function relogio(t) {
      for (let i = 1; i < RELOGIO.length; i++) {
        const [va, aa] = RELOGIO[i - 1], [vb, ab] = RELOGIO[i];
        if (t < vb) return mix(aa, ab, (t - va) / (vb - va));
      }
      return FIM_ABERTURA + t - POUSO;
    }

    return {
      render(t) {
        if (!CAMERA) iniciar();
        abertura(relogio(t));
      },
    };
  })();`;
