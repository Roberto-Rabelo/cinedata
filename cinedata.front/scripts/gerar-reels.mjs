// Reels de apresentação da plataforma (1080×1920, 9:16, 30 fps, ~28 s): imagens reais do site num celular, com
// manchetes e números por cima. Montado quadro a quadro (cada quadro é uma foto do Chrome), então texto e movimento
// saem nítidos, sem gravação de tela.
//
//   node scripts/servir-estatico.mjs &                      (o site estático em http://localhost:4320)
//   node scripts/gerar-reels.mjs <pasta-saida> [url-do-site]
//
// Gera <pasta>/reels.mp4 (H.264, sem áudio: a música entra no Instagram) e <pasta>/capa.png.
// Com REELS_PREVIA=3.5,10,21 (segundos) grava só esses quadros em <pasta>/previa-*.png, para ajustar o layout.
// Precisa de ffmpeg no PATH e do Google Chrome instalado (playwright-core).
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { gravarVideo } from './quadros.mjs';

const [saidaArg, site = 'http://localhost:4320'] = process.argv.slice(2);
if (!saidaArg) throw new Error('uso: node scripts/gerar-reels.mjs <pasta-saida> [url-do-site]');
const saida = resolve(saidaArg);
const FPS = 30;
const DURACAO = 28;

// Números do vídeo (export de 22/10/2026). Conferir antes de regerar com dados novos.
const NUMEROS = {
  semana: '8 a 14 de outubro',
  numeroUm: { titulo: 'Verity', publico: '622.946' },
  publicoSemana: '2,3 milhões',
  sp: '32%',
  mes: { nome: 'setembro', lider: 'Minha Melhor Amiga' },
  obra: { titulo: 'Ainda Estou Aqui', publico: '5,7 milhões' },
  ingressos: 1_229_560_044,
  sessoes: 38_458_225,
};

/** Telas do site (celular 390 px, 3×) e onde rolar em cada uma (px do PNG). */
const TELAS = [
  { nome: 'inicio', caminho: '/', ancoras: ['.numero-um', '.colunas'] },
  { nome: 'mapa', caminho: '/mapa?uf=SP', ancoras: ['cd-mapa-brasil', '.detalhe'] },
  { nome: 'vencedores', caminho: '/mapa/mes?ver=lider', ancoras: ['cd-mapa-brasil', '.legenda'] },
  { nome: 'obra', caminho: '/obras/B2400324700000', ancoras: ['h1', 'cd-curva-linha'] },
];
const ESCALA = 3;

async function capturarTelas(navegador) {
  const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: ESCALA, isMobile: true, hasTouch: true });
  // O vídeo não conta como visita no painel de acessos.
  await pagina.route('**/cloud.umami.is/**', r => r.abort());
  const telas = {};
  for (const tela of TELAS) {
    await pagina.goto(site + tela.caminho, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
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

const composicao = (telas, simbolo) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; background: #0D0E12; }
  * { box-sizing: border-box; }
  #q { position: relative; width: 1080px; height: 1920px; overflow: hidden; color: #F3EFE6; font-family: Inter, sans-serif;
       background: radial-gradient(90% 45% at 100% 0%, #FFB5471F, transparent 60%), #0D0E12; }
  .camada { position: absolute; will-change: transform, opacity; }
  #feixe { left: 0; top: 0; width: 1080px; height: 1920px; transform-origin: 0 50%;
           background: linear-gradient(100deg, #FFB54759, transparent 72%); clip-path: polygon(0 47%, 100% 18%, 100% 82%, 0 53%); }
  #topo { left: 80px; right: 80px; top: 150px; display: flex; justify-content: space-between; align-items: center; font-size: 26px; color: #A3A7B3; }
  .logo { display: inline-flex; align-items: center; gap: .32em; font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.03em; color: #F3EFE6; }
  .logo svg { width: 1.3em; height: 1.3em; }
  .logo b { font-weight: 800; }
  #topo .logo { font-size: 38px; }
  #intro { left: 0; right: 0; top: 700px; text-align: center; }
  #intro .logo { font-size: 128px; }
  #intro p { margin: 40px auto 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 60px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; max-width: 860px; }
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
  <div id="topo" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span><span>Fonte: ANCINE (dados abertos)</span></div>
  <div id="intro" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span><p>O cinema brasileiro em números</p></div>

  <div id="t1" class="camada titulo"><span>Toda semana</span><h1>O Top 10 do cinema no Brasil</h1></div>
  <div id="t2" class="camada titulo"><span>Mapa interativo</span><h1>Quem vai ao cinema, estado por estado</h1></div>
  <div id="t3" class="camada titulo"><span>Cada filme</span><h1>A curva de público, dia a dia</h1></div>

  <div id="celular" class="camada"><div id="tela">
    ${Object.entries(telas).map(([nome, t]) => `<img id="img-${nome}" src="${t.url}" alt="">`).join('')}
  </div></div>

  <div id="s1" class="camada selo"><b>${NUMEROS.numeroUm.titulo}</b>nº 1 da semana de ${NUMEROS.semana}: ${NUMEROS.numeroUm.publico} pessoas</div>
  <div id="s2" class="camada selo"><b>${NUMEROS.publicoSemana}</b>de ingressos em 7 dias, com nacional × estrangeiro e dublado × legendado</div>
  <div id="s3" class="camada selo"><b>São Paulo: ${NUMEROS.sp}</b>do público do Brasil. Toque num estado e veja o filme líder</div>
  <div id="s4" class="camada selo"><b>27 de 27 estados</b>${NUMEROS.mes.lider} foi o mais visto em todo o Brasil em ${NUMEROS.mes.nome}</div>
  <div id="s5" class="camada selo"><b>${NUMEROS.obra.publico}</b>de espectadores para ${NUMEROS.obra.titulo}, semana a semana</div>

  <div id="n1" class="camada numero" style="top: 420px"><b id="v1">0</b><span>ingressos de cinema desde 2016</span></div>
  <div id="n2" class="camada numero" style="top: 800px"><b id="v2">0</b><span>sessões, informadas pelos próprios cinemas</span></div>
  <div id="n3" class="camada numero" style="top: 1180px"><b>27 estados</b><span>atualizado toda semana</span></div>

  <div id="final" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span>
    <h2>cinedatabr.tech</h2><p>Todos os cinemas do Brasil,<br>atualizado toda semana</p><span class="bio">Link na bio</span></div>
  <div id="fonte" class="camada">Fonte: ANCINE (dados abertos) · projeto independente</div>
</div>
<script>
  const telas = ${JSON.stringify(Object.fromEntries(Object.entries(telas).map(([n, t]) => [n, t.ancoras])))};
  const ESCALA_TELA = 616 / (390 * ${ESCALA});
  const lim = (x) => Math.min(1, Math.max(0, x));
  const suave = (x) => { x = lim(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const saida = (x) => 1 - Math.pow(1 - lim(x), 3);
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

  window.render = function (t) {
    // Feixe do projetor: acende na abertura e fica de fundo.
    const f = saida(entre(t, 0, 1.4));
    el('feixe').style.opacity = (t < 3 ? 1 : .45) * f;
    el('feixe').style.transform = 'scaleX(' + (.2 + .8 * f) + ')';

    // Abertura.
    const intro = janela(t, .2, 3.1, .5);
    mostrar('intro', intro, 0, .92 + .08 * saida(entre(t, .2, 1.2)));
    el('intro').querySelector('p').style.opacity = entre(t, 1, 1.5);
    mostrar('topo', Math.min(entre(t, 3, 3.5), 1 - entre(t, 23.4, 23.8)));

    // Celular: sobe em 3,0 s, sai em 19,6 s.
    const celular = janela(t, 3, 19.8, .6);
    const dyCelular = t < 4 ? 500 * (1 - saida(entre(t, 3, 3.7))) : 400 * suave(entre(t, 19.2, 19.8));
    mostrar('celular', celular, dyCelular);

    // Qual tela aparece (troca em fade).
    const visivel = { inicio: janela(t, 0, 8.9, .4), mapa: janela(t, 8.5, 12, .4), vencedores: janela(t, 11.6, 14.9, .4), obra: janela(t, 14.5, 30, .4) };
    for (const [nome, o] of Object.entries(visivel)) el('img-' + nome).style.opacity = o;
    rolagem('inicio', t, [[3, 0], [4.8, 0], [6.3, '0'], [6.9, '0'], [7.9, '1']]);
    rolagem('mapa', t, [[8.5, 0], [9.6, '0'], [10.4, '0'], [11.4, '1']]);
    rolagem('vencedores', t, [[11.6, '0'], [12.6, '0'], [13.6, '0+240']]);
    rolagem('obra', t, [[14.5, 0], [15.6, 0], [16.8, '1-90']]);

    texto('t1', t, 3.2, 8.7);
    texto('t2', t, 8.7, 14.7);
    texto('t3', t, 14.7, 19.6);
    texto('s1', t, 4.4, 6.5);
    texto('s2', t, 6.7, 8.6);
    texto('s3', t, 9.6, 11.6);
    texto('s4', t, 12.1, 14.5);
    texto('s5', t, 16.2, 19.4);

    // Números grandes, contando.
    texto('n1', t, 19.8, 23.6);
    texto('n2', t, 20.3, 23.6);
    texto('n3', t, 20.8, 23.6);
    const c1 = saida(entre(t, 19.8, 21.6)), c2 = saida(entre(t, 20.3, 22.1));
    el('v1').textContent = c1 < 1 ? pt.format(Math.round(${NUMEROS.ingressos} * c1)) : '1,23 bilhão';
    el('v2').textContent = c2 < 1 ? pt.format(Math.round(${NUMEROS.sessoes} * c2)) : '38,5 milhões';

    // Chamada final.
    texto('final', t, 23.8, 30);
    texto('fonte', t, 24.4, 30);
  };
</script></body></html>`;

const simbolo = (await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8'))
  .replace('<rect width="32" height="32" rx="7" fill="#0D0E12"/>', '')
  .replace('<svg ', '<svg aria-hidden="true" ');
const navegador = await chromium.launch({ channel: 'chrome' });
try {
  const telas = await capturarTelas(navegador);
  const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
  await pagina.setContent(composicao(telas, simbolo), { waitUntil: 'networkidle' });
  await pagina.evaluate(() => document.fonts.ready);
  // Capa: o mapa com "27 de 27 estados".
  await gravarVideo(pagina, { fps: FPS, duracao: DURACAO, saida, nome: 'reels.mp4', capa: 13.2, previa: process.env.REELS_PREVIA?.split(',').map(Number) });
} finally {
  await navegador.close();
}
if (!process.env.REELS_PREVIA) console.log(`Pronto: ${join(saida, 'reels.mp4')} e capa.png`);
