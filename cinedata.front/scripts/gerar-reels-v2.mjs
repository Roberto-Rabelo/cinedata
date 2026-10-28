// Reels de apresentação da plataforma, versão 2 (1080×1920, 9:16, 30 fps, 35 s), com os pôsteres do site. A versão 1
// (gerar-reels.mjs, docs/posts/reels-plataforma) continua como está, para o caso de voltar a ela.
//
// Abertura animada, inspirada na vinheta da Pixar: o projetor do logo é um personagem. Ele entra pulando (os rolos de
// filme são as orelhas e a lente é o olho), olha as barras, pula por cima delas, vira, olha para a câmera e pisca, e
// num último pulo para no lugar do logo: os rolos recolhem, o olho vira a lente e acende; o feixe atravessa o símbolo,
// cada barra pula ao ser iluminada e a luz acende o nome. Depois o logo encolhe até o canto (vira o cabeçalho), entra
// um mural com os pôsteres dos filmes mais vistos e então as telas do site no celular, os números e a chamada final.
//
//   node scripts/servir-estatico.mjs &                         (o site estático, com posteres/, em http://localhost:4320)
//   node scripts/gerar-reels-v2.mjs <pasta-saida> [url-do-site]
//
// Gera <pasta>/reels.mp4 (H.264, sem áudio: a música entra no Instagram) e <pasta>/capa.png.
// Com REELS_PREVIA=2,3.5,8 (segundos) grava só esses quadros em <pasta>/previa-*.png, para ajustar o layout.
// Precisa de ffmpeg no PATH e do Google Chrome instalado (playwright-core).
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { gravarVideo } from './quadros.mjs';
import { cssVinheta, htmlVinheta, jsVinheta, relogioDaVinheta } from './vinheta-logo.mjs';

const [saidaArg, site = 'http://localhost:4320'] = process.argv.slice(2);
if (!saidaArg) throw new Error('uso: node scripts/gerar-reels-v2.mjs <pasta-saida> [url-do-site]');
const saida = resolve(saidaArg);
const FPS = 30;
/** Relógio da vinheta do logo (vinheta-logo.mjs) e quando o logo pousa no cabeçalho. */
const { relogio: RELOGIO, pouso: POUSO } = relogioDaVinheta();
/** Quando o celular entra (o corpo, igual ao da versão 1 a partir dos 3 s dela); antes, a abertura e o mural. */
const CORPO = POUSO + 2.8;
/** O corpo dura o mesmo que na versão 1 (25,6 s a partir da entrada do celular). */
const DURACAO = Math.round(CORPO + 25.6);

// Números do vídeo (export de 27/10/2026, dados até 23/10). Conferir antes de regerar com dados novos.
const NUMEROS = {
  semana: '15 a 21 de outubro',
  numeroUm: { titulo: 'Street Fighter', publico: '320.927' },
  publicoSemana: '1,5 milhão',
  sp: '33%',
  mes: { nome: 'setembro', lider: 'Minha Melhor Amiga' },
  obra: { titulo: 'Ainda Estou Aqui', publico: '5,7 milhões', semanas: 35 },
  ingressos: 1_229_691_177,
  sessoes: 38_471_082,
};

/** Telas do site (celular 390 px, 3×) e onde rolar em cada uma (px do PNG). */
const TELAS = [
  { nome: 'inicio', caminho: '/', ancoras: ['.numero-um', '.colunas'] },
  { nome: 'mapa', caminho: '/mapa?uf=SP', ancoras: ['cd-mapa-brasil', '.detalhe'] },
  { nome: 'vencedores', caminho: '/mapa/mes?ver=lider', ancoras: ['cd-mapa-brasil', '.legenda'] },
  { nome: 'obra', caminho: '/obras/B2400324700000', ancoras: ['h1', 'cd-curva-linha'] },
];
const ESCALA = 3;
const POSTERES_MURAL = 84;

async function capturarTelas(navegador) {
  const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: ESCALA, isMobile: true, hasTouch: true });
  // O vídeo não conta como visita no painel de acessos.
  await pagina.route('**/cloud.umami.is/**', r => r.abort());
  const telas = {};
  for (const tela of TELAS) {
    await pagina.goto(site + tela.caminho, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    // Pôsteres abaixo da dobra também (a foto é da página inteira).
    await pagina.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => (i.loading = 'eager'));
      await Promise.all([...document.images].map(i => (i.complete ? null : new Promise(r => { i.onload = i.onerror = r; }))));
    });
    await pagina.waitForTimeout(500);
    const ancoras = await pagina.evaluate(seletores =>
      seletores.map(s => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY)), tela.ancoras);
    const altura = Math.max(...ancoras) + 900;
    const png = await pagina.screenshot({ fullPage: true, clip: { x: 0, y: 0, width: 390, height: altura } });
    telas[tela.nome] = { url: `data:image/png;base64,${png.toString('base64')}`, ancoras: ancoras.map(a => a * ESCALA) };
  }
  await pagina.close();
  return telas;
}

/** Os filmes mais vistos com pôster, embaralhados sempre do mesmo jeito (franquias não ficam lado a lado). */
async function posteresDoMural() {
  const busca = JSON.parse(await readFile(new URL('../dados/busca.json', import.meta.url), 'utf8'));
  const lista = busca.filter(o => o.poster).slice(0, POSTERES_MURAL).map(o => `${site}/posteres/w342${o.poster}`);
  let semente = 7;
  const aleatorio = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

const composicao = (telas, simbolo, posteres) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; background: #0D0E12; }
  * { box-sizing: border-box; }
  #q { position: relative; width: 1080px; height: 1920px; overflow: hidden; color: #F3EFE6; font-family: Inter, sans-serif; background: #0D0E12; }
  .camada { position: absolute; will-change: opacity; }
  .logo { display: inline-flex; align-items: center; gap: .32em; font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.03em; color: #F3EFE6; }
  .logo svg { width: 1.3em; height: 1.3em; }
  .logo b { font-weight: 800; }

${cssVinheta}

  /* Mural de pôsteres. */
  #mural { inset: 0; overflow: hidden; }
  #parede { position: absolute; left: 540px; top: 1160px; display: grid; grid-template-columns: repeat(7, 210px); gap: 26px;
            transform-origin: 50% 0; }
  #parede img { width: 210px; height: 315px; object-fit: cover; border-radius: 12px; display: block;
                box-shadow: 0 0 0 1px #2A2E3A, 0 18px 40px #000A; }
  #mural::before { content: ''; position: absolute; inset: 0; z-index: 1;
                   background: linear-gradient(#0D0E12 0 26%, #0D0E12D9 36%, #0D0E1200 55%, #0D0E1200 78%, #0D0E12 97%); }
  #varredura { position: absolute; inset: -400px; z-index: 1; mix-blend-mode: screen;
               background: linear-gradient(105deg, transparent 42%, #FFB54726 49%, #FFE3B040 50%, #FFB54726 51%, transparent 58%); }
  #mural .titulo { z-index: 2; }
  #credito { z-index: 2; right: 80px; bottom: 120px; font-size: 26px; color: #A3A7B3; }

  /* Corpo (celular, números, chamada), como na versão 1. */
  #feixe { left: 0; top: 0; width: 1080px; height: 1920px; transform-origin: 0 50%;
           background: linear-gradient(100deg, #FFB54759, transparent 72%); clip-path: polygon(0 47%, 100% 18%, 100% 82%, 0 53%); }
  #topo { left: 80px; right: 80px; top: 150px; display: flex; justify-content: space-between; align-items: center; font-size: 26px; color: #A3A7B3; }
  #topo .logo { font-size: 38px; }
  .titulo { left: 80px; right: 80px; top: 250px; }
  .titulo span { display: block; color: #FFB547; font-size: 30px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 18px; }
  .titulo h1 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 82px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.02; }
  #celular { left: 220px; top: 560px; width: 640px; height: 1160px; border-radius: 72px; background: #1E212A; padding: 12px;
             box-shadow: 0 40px 120px #000C, 0 0 0 2px #2A2E3A; }
  #tela { position: relative; width: 100%; height: 100%; border-radius: 60px; overflow: hidden; background: #0D0E12; }
  #tela img { position: absolute; left: 0; top: 0; width: 616px; }
  .selo { left: 80px; right: 80px; top: 1290px; padding: 34px 40px; border-radius: 28px; background: #16181FF2; border: 2px solid #2A2E3A;
          box-shadow: 0 24px 60px #000A; font-size: 40px; line-height: 1.25; }
  .selo b { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 58px; display: block; letter-spacing: -0.02em; }
  .numero { left: 80px; right: 80px; }
  .numero b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 150px; letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums; }
  .numero span { font-size: 44px; color: #A3A7B3; }
  #final { left: 80px; right: 80px; top: 560px; text-align: center; }
  #final .logo { font-size: 96px; }
  #final h2 { margin: 70px 0 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 92px; font-weight: 800; letter-spacing: -0.03em;
              text-decoration: underline; text-decoration-color: #FFB547; text-decoration-thickness: 8px; text-underline-offset: 20px; }
  #final p { margin: 50px 0 0; font-size: 44px; color: #A3A7B3; line-height: 1.4; }
  #final .bio { display: inline-block; margin-top: 60px; padding: 22px 44px; border-radius: 999px; background: #F3EFE6; color: #0D0E12; font-weight: 700; font-size: 44px; }
  #fonte { left: 80px; right: 80px; top: 1500px; text-align: center; font-size: 30px; color: #A3A7B3; }
</style></head><body><div id="q">
  <div id="feixe" class="camada"></div>

  <div id="mural" class="camada">
    <div id="parede">${posteres.map(p => `<img src="${p}" alt="">`).join('')}</div>
    <div id="varredura"></div>
    <div id="tm" class="camada titulo"><span>Cada filme, sua página</span><h1>Os filmes mais vistos do Brasil, um a um</h1></div>
    <div id="credito" class="camada">Pôsteres: TMDB</div>
  </div>

  <div id="topo" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span><span>Fonte: ANCINE (dados abertos)</span></div>

  <div id="t1" class="camada titulo"><span>Toda semana</span><h1>O Top 10 do cinema no Brasil</h1></div>
  <div id="t2" class="camada titulo"><span>Mapa interativo</span><h1>Quem vai ao cinema, estado por estado</h1></div>
  <div id="t3" class="camada titulo"><span>Cada filme</span><h1>A curva de público e o tempo em cartaz</h1></div>

  <div id="celular" class="camada"><div id="tela">
    ${Object.entries(telas).map(([nome, t]) => `<img id="img-${nome}" src="${t.url}" alt="">`).join('')}
  </div></div>

  <div id="s1" class="camada selo"><b>${NUMEROS.numeroUm.titulo}</b>nº 1 da semana de ${NUMEROS.semana}: ${NUMEROS.numeroUm.publico} pessoas</div>
  <div id="s2" class="camada selo"><b>${NUMEROS.publicoSemana}</b>de ingressos em 7 dias, com nacional × estrangeiro e dublado × legendado</div>
  <div id="s3" class="camada selo"><b>São Paulo: ${NUMEROS.sp}</b>do público do Brasil. Toque num estado e veja o filme líder</div>
  <div id="s4" class="camada selo"><b>27 de 27 estados</b>${NUMEROS.mes.lider} foi o mais visto em todo o Brasil em ${NUMEROS.mes.nome}</div>
  <div id="s5" class="camada selo"><b>${NUMEROS.obra.publico}</b>de espectadores para ${NUMEROS.obra.titulo}, em ${NUMEROS.obra.semanas} semanas em cartaz</div>

  <div id="n1" class="camada numero" style="top: 420px"><b id="v1">0</b><span>ingressos de cinema desde 2016</span></div>
  <div id="n2" class="camada numero" style="top: 800px"><b id="v2">0</b><span>sessões, informadas pelos próprios cinemas</span></div>
  <div id="n3" class="camada numero" style="top: 1180px"><b>27 estados</b><span>atualizado toda semana</span></div>

  <div id="final" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span>
    <h2>cinedatabr.tech</h2><p>Todos os cinemas do Brasil,<br>atualizado toda semana</p><span class="bio">Link na bio</span></div>
  <div id="fonte" class="camada">Fonte: ANCINE (dados abertos) · projeto independente</div>

  ${htmlVinheta('O cinema brasileiro em números<small>Entenda como o seu <b>filme favorito</b><br>está indo nos cinemas</small>')}
</div>
<script>
${jsVinheta({ relogio: RELOGIO })}
  const telas = ${JSON.stringify(Object.fromEntries(Object.entries(telas).map(([n, t]) => [n, t.ancoras])))};
  const ESCALA_TELA = 616 / (390 * ${ESCALA});
  const CORPO = ${CORPO};
  const POUSO = ${POUSO};
  const lim = (x) => Math.min(1, Math.max(0, x));
  const suave = (x) => { x = lim(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const saida = (x) => 1 - Math.pow(1 - lim(x), 3);
  const mix = (a, b, p) => a + (b - a) * p;
  /** 0→1 entre a e b. */
  const entre = (t, a, b) => lim((t - a) / (b - a));
  /** Visível de a a b, com entrada e saída de d segundos. */
  const janela = (t, a, b, d = .35) => Math.min(entre(t, a, a + d), 1 - entre(t, b - d, b));
  const el = (id) => document.getElementById(id);
  const pt = new Intl.NumberFormat('pt-BR');
  function mostrar(id, o, dy = 0, escala = 1) {
    const e = el(id);
    e.style.opacity = o;
    e.style.transform = 'translateY(' + dy + 'px) scale(' + escala + ')';
  }
  /** Texto que entra subindo e sai subindo. */
  function texto(id, t, a, b) {
    const o = janela(t, a, b, .4);
    const dy = t < a + .4 ? 40 * (1 - saida(entre(t, a, a + .4))) : -30 * entre(t, b - .4, b);
    mostrar(id, o, dy);
  }
  // ---------- Mural de pôsteres ----------
  const imagensMural = [...el('parede').children];
  function mural(t) {
    const m = POUSO - .36;
    const o = Math.min(entre(t, m, m + .6), 1 - entre(t, CORPO - .4, CORPO + .2));
    el('mural').style.opacity = o;
    if (!o) return;
    const andar = saida(entre(t, m, CORPO + .2));
    el('parede').style.transform =
      'translate(-50%, 0) perspective(1600px) rotateX(30deg) rotateZ(-9deg) translateY(' + (-120 - 760 * andar) + 'px) scale(' + (1.05 + .1 * andar) + ')';
    imagensMural.forEach((img, i) => {
      const coluna = i % 7, linha = Math.floor(i / 7);
      const atraso = .035 * (Math.abs(coluna - 3) + linha * .7);
      const p = saida(entre(t, m + .1 + atraso, m + .6 + atraso));
      img.style.opacity = p;
      img.style.transform = 'translateY(' + (60 * (1 - p)) + 'px) scale(' + mix(.85, 1, p) + ')';
    });
    el('varredura').style.transform = 'translateX(' + mix(-900, 900, entre(t, m + .7, CORPO - .2)) + 'px)';
    texto('tm', t, m + .5, CORPO);
    texto('credito', t, m + .9, CORPO);
  }

  // ---------- Corpo: o mesmo roteiro da versão 1, a partir de CORPO ----------
  /** Posição de rolagem passando pelas âncoras da tela: [[tempo, px ou 'âncora' ou 'âncora±px CSS'], ...]. */
  function rolagem(nome, t, pontos) {
    const ancoras = telas[nome];
    const y = (v) => {
      if (typeof v !== 'string') return v;
      const [, i, delta] = v.match(/^(\\d)([+-]\\d+)?$/);
      return ancoras[Number(i)] + (Number(delta ?? -20)) * ${ESCALA};
    };
    let pos = y(pontos[0][1]);
    for (let i = 1; i < pontos.length; i++) {
      const [ta, va] = pontos[i - 1], [tb, vb] = pontos[i];
      if (t >= ta) pos = y(va) + (y(vb) - y(va)) * suave(entre(t, ta, tb));
    }
    el('img-' + nome).style.transform = 'translateY(' + (-Math.max(0, pos) * ESCALA_TELA) + 'px)';
  }

  /** t no relógio da versão 1 (o celular entra em t = 3); tGlobal só para o cabeçalho, que aparece quando o logo pousa. */
  function corpo(t, tGlobal) {
    el('feixe').style.opacity = .45 * entre(t, 2.6, 3.4) * (1 - entre(t, 27, 28));
    mostrar('topo', Math.min(tGlobal >= POUSO ? 1 : 0, 1 - entre(t, 23.4, 23.8)));

    const celular = janela(t, 3, 19.8, .6);
    const dyCelular = t < 4 ? 500 * (1 - saida(entre(t, 3, 3.7))) : 400 * suave(entre(t, 19.2, 19.8));
    mostrar('celular', celular, dyCelular);

    const visivel = { inicio: janela(t, 0, 8.9, .4), mapa: janela(t, 8.5, 12, .4), vencedores: janela(t, 11.6, 14.9, .4), obra: janela(t, 14.5, 30, .4) };
    for (const [nome, o] of Object.entries(visivel)) el('img-' + nome).style.opacity = o;
    rolagem('inicio', t, [[3, 0], [4.8, 0], [6.3, '0'], [6.9, '0'], [7.9, '1']]);
    rolagem('mapa', t, [[8.5, 0], [9.6, '0'], [10.4, '0'], [11.4, '1']]);
    rolagem('vencedores', t, [[11.6, '0'], [12.6, '0'], [13.6, '0+240']]);
    rolagem('obra', t, [[14.5, 0], [15.8, 0], [17, '1-90']]);

    texto('t1', t, 3.2, 8.7);
    texto('t2', t, 8.7, 14.7);
    texto('t3', t, 14.7, 19.6);
    texto('s1', t, 4.4, 6.5);
    texto('s2', t, 6.7, 8.6);
    texto('s3', t, 9.6, 11.6);
    texto('s4', t, 12.1, 14.5);
    texto('s5', t, 16.2, 19.4);

    texto('n1', t, 19.8, 23.6);
    texto('n2', t, 20.3, 23.6);
    texto('n3', t, 20.8, 23.6);
    const c1 = saida(entre(t, 19.8, 21.6)), c2 = saida(entre(t, 20.3, 22.1));
    el('v1').textContent = c1 < 1 ? pt.format(Math.round(${NUMEROS.ingressos} * c1)) : '1,23 bilhão';
    el('v2').textContent = c2 < 1 ? pt.format(Math.round(${NUMEROS.sessoes} * c2)) : '38,5 milhões';

    texto('final', t, 23.8, 40);
    texto('fonte', t, 24.4, 40);
  }

  window.render = function (t) {
    vinheta.render(t);
    mural(t);
    corpo(t - CORPO + 3, t);
  };
</script></body></html>`;

const simbolo = (await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8'))
  .replace('<rect width="32" height="32" rx="7" fill="#0D0E12"/>', '')
  .replace('<svg ', '<svg aria-hidden="true" ');
const navegador = await chromium.launch({ channel: 'chrome' });
try {
  const telas = await capturarTelas(navegador);
  const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
  await pagina.setContent(composicao(telas, simbolo, await posteresDoMural()), { waitUntil: 'networkidle' });
  await pagina.evaluate(() => document.fonts.ready);
  // Capa: o mural de pôsteres com o título.
  await gravarVideo(pagina, { fps: FPS, duracao: DURACAO, saida, nome: 'reels.mp4', capa: POUSO + 2, previa: process.env.REELS_PREVIA?.split(',').map(Number) });
} finally {
  await navegador.close();
}
if (!process.env.REELS_PREVIA) console.log(`Pronto: ${join(saida, 'reels.mp4')} e capa.png`);
