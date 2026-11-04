// Reels do post coringa "Cena" (1080×1920, 9:16, 30 fps, 16 s): a fala do filme em duas cenas de divulgação (TMDB),
// com a legenda em português entrando como no cinema, depois o número do filme nos cinemas do Brasil e o fecho.
// Os dados são os mesmos do carrossel: src/app/features/marca/cenas.json.
//
//   node scripts/gerar-video-cena.mjs <slug> <pasta-saida>
//
// Gera <pasta>/reels.mp4 (H.264, sem áudio: a música entra no Instagram) e <pasta>/capa-reels.png.
// Com VIDEO_PREVIA=2,6,11,14 (segundos) grava só esses quadros em <pasta>/previa-*.png.
// Precisa de ffmpeg no PATH, do Google Chrome instalado (playwright-core) e de internet (imagens do TMDB).
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { gravarVideo } from './quadros.mjs';

const [slug, saidaArg] = process.argv.slice(2);
if (!slug || !saidaArg) throw new Error('uso: node scripts/gerar-video-cena.mjs <slug> <pasta-saida>');
const saida = resolve(saidaArg);

const dados = JSON.parse(await readFile(new URL('../src/app/features/marca/cenas.json', import.meta.url), 'utf8'));
const cena = dados.cenas.find(c => c.slug === slug);
if (!cena) throw new Error(`cena "${slug}" não está em cenas.json (há: ${dados.cenas.map(c => c.slug).join(', ')})`);
const imagem = (arquivo) => `https://image.tmdb.org/t/p/w1280/${arquivo}`;
const escapar = (t) => t.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Linha do tempo (segundos).
const T_FALA2 = 4.8;
const T_NUMERO = 9.8;
const T_FINAL = 13.6;
const DURACAO = 16;

const [fala1, fala2] = cena.falas;

const composicao = (simbolo) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; background: #0D0E12; }
  * { box-sizing: border-box; }
  p { margin: 0; }
  #q { position: relative; width: 1080px; height: 1920px; overflow: hidden; color: #F3EFE6; font-family: Inter, sans-serif; background: #000; }
  .camada { position: absolute; inset: 0; opacity: 0; will-change: opacity, transform; }
  .logo { display: inline-flex; align-items: center; gap: .32em; font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.03em; color: #F3EFE6; }
  .logo svg { width: 1.3em; height: 1.3em; }
  .logo b { font-weight: 800; }

  /* As duas cenas empilhadas no centro, como o slide 1 do carrossel. */
  #cenas { opacity: 1; }
  .quadro { position: absolute; left: 0; right: 0; height: 608px; overflow: hidden; background: #000; opacity: 0; }
  #q1 { top: 344px; }
  #q2 { top: 960px; }
  .quadro img { width: 100%; height: 100%; object-fit: cover; }
  .legenda {
    position: absolute; left: 64px; right: 64px; bottom: 40px; text-align: center; text-wrap: balance;
    font-weight: 500; font-size: 48px; line-height: 1.25; color: #fff; opacity: 0;
    text-shadow: 0 0 6px #000, 0 0 6px #000, 2px 2px 4px #000, -2px -2px 4px #000;
  }
  #topo { opacity: 1; left: 80px; right: 80px; top: 200px; bottom: auto; height: 60px; display: flex; justify-content: space-between; align-items: center; font-size: 28px; color: #A3A7B3; }
  #topo .logo { font-size: 40px; }
  #obra { opacity: 1; left: 80px; right: 80px; top: 1600px; bottom: auto; text-align: center; font-size: 32px; color: #A3A7B3; }
  #obra em { color: #F3EFE6; }

  /* O número: a primeira cena ao fundo, bem escura. */
  #numero { background: #0D0E12; }
  #numero .fundo { position: absolute; inset: 0; }
  #numero .fundo img { width: 100%; height: 100%; object-fit: cover; object-position: ${fala1.posicao}; filter: saturate(.7) blur(2px); opacity: .35; }
  #numero .fundo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(#0D0E12EE, #0D0E1299 40%, #0D0E12EE); }
  #numero .conteudo { position: absolute; left: 80px; right: 80px; top: 470px; }
  .quem { font-size: 36px; font-weight: 600; color: #FFB547; }
  .grande { margin-top: 70px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 170px; line-height: .95; letter-spacing: -0.05em; color: #FFB547; }
  .sub { margin-top: 24px; font-size: 46px; line-height: 1.25; font-weight: 600; text-wrap: balance; }
  .fato { margin-top: 50px; font-size: 38px; line-height: 1.35; color: #C9CCD4; text-wrap: pretty; }

  #final { background: #0D0E12; }
  #final .conteudo { position: absolute; left: 80px; right: 80px; top: 560px; text-align: center; }
  #final h2 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 92px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.04; text-wrap: balance; }
  #final .comente { margin-top: 40px; font-size: 44px; color: #A3A7B3; }
  #final .marca { margin-top: 140px; }
  #final .marca .logo { font-size: 80px; }
  #final .site { margin-top: 30px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 58px; font-weight: 700; text-decoration: underline; text-decoration-color: #FFB547; text-decoration-thickness: 6px; text-underline-offset: 14px; }
  #final .fonte { position: absolute; left: 80px; right: 80px; top: 1500px; text-align: center; font-size: 27px; line-height: 1.5; color: #A3A7B3; }

  #cortina { inset: 0; background: #000; }
</style></head><body><div id="q">
  <div id="cenas" class="camada">
    <div class="quadro" id="q1"><img src="${imagem(fala1.imagem)}" style="object-position: ${fala1.posicao}" alt=""><p class="legenda">${escapar(fala1.texto)}</p></div>
    <div class="quadro" id="q2"><img src="${imagem(fala2.imagem)}" style="object-position: ${fala2.posicao}" alt=""><p class="legenda">${escapar(fala2.texto)}</p></div>
  </div>
  <div id="topo" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span><span>Imagens: divulgação</span></div>
  <p id="obra" class="camada"><em>${escapar(cena.titulo)}</em> (${cena.ano})</p>
  <div id="numero" class="camada">
    <div class="fundo"><img src="${imagem(fala1.imagem)}" alt=""></div>
    <div class="conteudo">
      <p class="quem">${escapar(cena.quem)}, em <em>${escapar(cena.titulo)}</em> (${cena.ano})</p>
      <p class="grande">${escapar(cena.numero)}</p>
      <p class="sub">${escapar(cena.numeroTexto)}</p>
      <p class="fato">${escapar(cena.fato)}</p>
    </div>
  </div>
  <div id="final" class="camada"><div class="conteudo">
    <h2>${escapar(cena.pergunta)}</h2>
    <p class="comente">Conta nos comentários</p>
    <div class="marca"><span class="logo">${simbolo}<span>cine<b>data</b></span></span></div>
    <p class="site">cinedatabr.tech</p>
  </div>
  <p class="fonte">Fonte: ANCINE (dados abertos), lançamentos comerciais.<br>Imagens: TMDB/divulgação.</p></div>
  <div id="cortina" class="camada"></div>
</div>
<script>
  const T = { fala2: ${T_FALA2}, numero: ${T_NUMERO}, final: ${T_FINAL}, fim: ${DURACAO} };
  const lim = (x) => Math.min(1, Math.max(0, x));
  const entre = (t, a, b) => lim((t - a) / (b - a));
  const saida = (x) => 1 - Math.pow(1 - lim(x), 3);
  const el = (id) => document.getElementById(id);
  /** Ruído determinístico (o mesmo quadro sempre sai igual): o piscar do projetor. */
  const ruido = (t) => (Math.sin(t * 91.7) + Math.sin(t * 37.3 + 1.3) + Math.sin(t * 13.1 + 2.1)) / 3;
  const cortes = [T.numero, T.final];

  function estilo(e, o, transform) {
    e.style.opacity = o;
    if (transform !== undefined) e.style.transform = transform;
  }

  window.render = function (t) {
    const nasCenas = t < T.numero;
    // Cenas: cada uma entra e aproxima devagar; a legenda aparece um instante depois, como no cinema.
    [['q1', .2], ['q2', T.fala2]].forEach(([id, a]) => {
      const q = el(id);
      estilo(q, nasCenas ? saida(entre(t, a, a + .5)) : 0);
      q.querySelector('img').style.transform = 'scale(' + (1.08 - .06 * entre(t, a, T.numero)) + ')';
      q.querySelector('.legenda').style.opacity = nasCenas && t >= a + .6 ? 1 : 0;
    });
    estilo(el('topo'), nasCenas ? entre(t, 0, .6) : 0);
    estilo(el('obra'), nasCenas ? entre(t, .6, 1.2) : 0);

    // O número: sobe do escuro e fica.
    const noNumero = t >= T.numero && t < T.final;
    estilo(el('numero'), noNumero ? 1 : 0);
    el('numero').querySelectorAll('.conteudo > *').forEach((l, i) => {
      const a = T.numero + .15 + i * .4;
      estilo(l, saida(entre(t, a, a + .45)), 'translateY(' + 40 * (1 - saida(entre(t, a, a + .45))) + 'px)');
    });
    estilo(el('final'), t >= T.final ? entre(t, T.final, T.final + .4) : 0);

    // Abertura e cortes: a tela apaga e a luz volta piscando, como projetor trocando de rolo.
    let cortina = t < .35 ? 1 - entre(t, 0, .35) * lim(.7 + .3 * ruido(t * 3)) : 0;
    for (const c of cortes) {
      if (t >= c - .1 && t < c + .22) cortina = Math.max(cortina, t < c ? entre(t, c - .1, c) : (1 - entre(t, c, c + .22)) * lim(.7 + .3 * ruido(t * 3)));
    }
    estilo(el('cortina'), cortina);
  };
</script></body></html>`;

const simbolo = (await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8'))
  .replace('<rect width="32" height="32" rx="7" fill="#0D0E12"/>', '')
  .replace('<svg ', '<svg aria-hidden="true" ');
const navegador = await chromium.launch({ channel: 'chrome' });
try {
  const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
  await pagina.setContent(composicao(simbolo), { waitUntil: 'networkidle', timeout: 120_000 });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
  // Capa: as duas cenas com as duas falas.
  await gravarVideo(pagina, {
    duracao: DURACAO, saida, nome: 'reels.mp4', capa: T_NUMERO - .6, nomeCapa: 'capa-reels.png',
    previa: process.env.VIDEO_PREVIA?.split(',').map(Number),
  });
} finally {
  await navegador.close();
}
if (!process.env.VIDEO_PREVIA) console.log(`Pronto: ${join(saida, 'reels.mp4')} (${DURACAO} s) e capa-reels.png`);
