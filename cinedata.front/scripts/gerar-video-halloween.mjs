// Reels do especial de Halloween (1080×1920, 9:16, 30 fps, ~42 s): contagem regressiva do 10º ao 1º terror mais
// visto nos cinemas do Brasil desde 2016, uma cena de divulgação por filme (TMDB, em 4K quando há), o público contando
// e a revelação do nº 1 no fim. Os dados são os mesmos do carrossel: src/app/features/marca/halloween-top10.json.
//
//   node scripts/gerar-video-halloween.mjs <pasta-saida>
//
// Gera <pasta>/reels.mp4 (H.264, sem áudio: a música entra no Instagram) e <pasta>/capa-reels.png.
// Com VIDEO_PREVIA=2,5,30 (segundos) grava só esses quadros em <pasta>/previa-*.png.
// Precisa de ffmpeg no PATH, do Google Chrome instalado (playwright-core) e de internet (imagens do TMDB).
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { gravarVideo } from './quadros.mjs';

const [saidaArg] = process.argv.slice(2);
if (!saidaArg) throw new Error('uso: node scripts/gerar-video-halloween.mjs <pasta-saida>');
const saida = resolve(saidaArg);

const dados = JSON.parse(await readFile(new URL('../src/app/features/marca/halloween-top10.json', import.meta.url), 'utf8'));
const original = (arquivo) => `https://image.tmdb.org/t/p/original/${arquivo}`;
const filmes = [...dados.filmes].sort((a, b) => b.posicao - a.posicao); // 10º primeiro: contagem regressiva

// Linha do tempo (segundos).
const INTRO = 3.6;
const CARTAO = 2.5;
const SUSPENSE = 1.5;
const NUMERO_UM = 5;
const FATOS = 4.8;
const FINAL = 4.4;
const inicioCartao = (i) => INTRO + i * CARTAO; // i = 0 (10º) … 8 (2º)
const T_SUSPENSE = inicioCartao(9);
const T_UM = T_SUSPENSE + SUSPENSE;
const T_FATOS = T_UM + NUMERO_UM;
const T_FINAL = T_FATOS + FATOS;
const DURACAO = T_FINAL + FINAL;

const umaCasa = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const milhoes = (n) => umaCasa.format(n / 1e6);
const soma = (lista, campo) => lista.reduce((t, f) => t + f[campo], 0);
const invocacao = dados.filmes.filter(f => dados.universoInvocacao.includes(f.posicao));
const escapar = (t) => t.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const cartao = (f, i) => `
  <div class="cartao camada" id="c${i}" data-inicio="${f.posicao === 1 ? T_UM : inicioCartao(i)}"
       data-duracao="${f.posicao === 1 ? NUMERO_UM : CARTAO}" data-publico="${f.publico}">
    <div class="foto"><img src="${original(f.imagem)}" style="object-position: ${f.posicao4x5}" alt=""></div>
    <span class="credito">Imagem: divulgação</span>
    <div class="info">
      <p class="lugar">${f.posicao}º${f.posicao === 1 ? '<small>o mais visto</small>' : ''}</p>
      <p class="titulo">${escapar(f.titulo)}</p>
      <p class="ano">${f.ano}</p>
      <div class="dados">
        <div><strong class="contador">0</strong><span>espectadores</span></div>
        <div><strong>R$ ${milhoes(f.renda)} mi</strong><span>de bilheteria</span></div>
      </div>
      <span class="barra" style="--largura: ${(100 * f.publico) / dados.filmes[0].publico}%"></span>
    </div>
  </div>`;

const composicao = (simbolo) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; background: #0D0E12; }
  * { box-sizing: border-box; }
  p { margin: 0; }
  #q { position: relative; width: 1080px; height: 1920px; overflow: hidden; color: #F3EFE6; font-family: Inter, sans-serif; background: #0D0E12; }
  .camada { position: absolute; inset: 0; opacity: 0; will-change: opacity, transform; }
  .logo { display: inline-flex; align-items: center; gap: .32em; font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -0.03em; color: #F3EFE6; }
  .logo svg { width: 1.3em; height: 1.3em; }
  .logo b { font-weight: 800; }
  .rotulo { color: #FFB547; font-size: 30px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }

  /* Fundo da abertura e do suspense: a sala escura e o feixe do projetor que pisca. */
  #feixe { inset: 0; background: linear-gradient(100deg, #FFB54766, transparent 72%); clip-path: polygon(0 46%, 100% 14%, 100% 86%, 0 54%); transform-origin: 0 50%; }
  #intro .fundo { position: absolute; inset: 0; }
  #intro .fundo img { width: 100%; height: 100%; object-fit: cover; object-position: 42% 50%; filter: saturate(.75) contrast(1.1); }
  #intro .fundo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(#0D0E12CC, #0D0E1255 30%, #0D0E1299 55%, #0D0E12 80%); }
  #intro .texto { position: absolute; left: 80px; right: 80px; top: 1000px; }
  #intro h1 { margin: 22px 0 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 96px; font-weight: 800; letter-spacing: -0.035em; line-height: 1; text-wrap: balance; }
  #intro .sub { margin-top: 30px; font-size: 42px; color: #A3A7B3; }
  #intro .sub b { color: #F3EFE6; }
  #intro .chamada { margin-top: 44px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 46px; font-weight: 700; color: #FFB547; }

  #topo { left: 80px; right: 80px; top: 150px; bottom: auto; height: 60px; display: flex; justify-content: space-between; align-items: center; font-size: 28px; color: #A3A7B3; }
  #topo .logo { font-size: 38px; }

  /* Um cartão por filme: foto em cima (Ken Burns), números embaixo. */
  .foto { position: absolute; left: 0; right: 0; top: 0; height: 1180px; overflow: hidden; }
  .foto img { width: 100%; height: 100%; object-fit: cover; transform-origin: 50% 40%; filter: saturate(.85) contrast(1.06); }
  .foto::after { content: ''; position: absolute; inset: 0; background: linear-gradient(#0D0E12D9, #0D0E1200 22%, #0D0E1200 50%, #0D0E12 97%); }
  .credito { position: absolute; right: 80px; top: 222px; font-size: 22px; color: #A3A7B3; text-shadow: 0 2px 12px #000; }
  .info { position: absolute; left: 80px; right: 80px; top: 820px; }
  .lugar { display: flex; align-items: baseline; gap: 26px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 260px; line-height: .85; letter-spacing: -0.05em; color: #FFB547; text-shadow: 0 10px 50px #000C; }
  .lugar small { font-size: 46px; letter-spacing: -0.01em; color: #F3EFE6; }
  .titulo { margin-top: 26px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 82px; line-height: 1; letter-spacing: -0.035em; text-wrap: balance; }
  .ano { margin-top: 14px; font-size: 38px; color: #A3A7B3; }
  .dados { display: grid; grid-template-columns: 1.15fr 1fr; gap: 40px; margin-top: 44px; }
  .dados div { display: flex; flex-direction: column; gap: 6px; }
  .dados strong { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 76px; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
  .dados span { font-size: 32px; color: #A3A7B3; }
  .barra { display: block; height: 16px; margin-top: 40px; border-radius: 0 8px 8px 0; background: #CF7A25; width: 0; }
  #c9 .titulo { font-size: 110px; }

  #suspense .texto { position: absolute; left: 80px; right: 80px; top: 760px; }
  #suspense p { font-family: 'Bricolage Grotesque', sans-serif; font-size: 92px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.02; }

  #fatos .conteudo { position: absolute; left: 80px; right: 80px; top: 330px; }
  #fatos ul { list-style: none; margin: 40px 0 0; padding: 0; display: flex; flex-direction: column; gap: 34px; }
  #fatos li { padding: 36px 40px; border-radius: 32px; background: #16181F; border: 2px solid #2A2E3A; opacity: 0; }
  #fatos li b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 84px; letter-spacing: -0.035em; line-height: 1; color: #FFB547; }
  #fatos li span { display: block; margin-top: 14px; font-size: 38px; line-height: 1.3; color: #A3A7B3; }

  #final .conteudo { position: absolute; left: 80px; right: 80px; top: 470px; text-align: center; }
  #final h2 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-size: 104px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.02; }
  #final .comente { margin-top: 40px; font-size: 46px; color: #A3A7B3; }
  #final .marca { margin-top: 150px; }
  #final .marca .logo { font-size: 80px; }
  #final .site { margin-top: 30px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 60px; font-weight: 700; text-decoration: underline; text-decoration-color: #FFB547; text-decoration-thickness: 6px; text-underline-offset: 14px; }
  #final .fonte { position: absolute; left: 80px; right: 80px; top: 1440px; text-align: center; font-size: 27px; line-height: 1.5; color: #A3A7B3; }

  #cortina { inset: 0; background: #000; }
</style></head><body><div id="q">
  <div id="intro" class="camada">
    <div class="fundo"><img src="${original(dados.capa)}" alt=""></div>
    <div class="texto">
      <span class="rotulo">Especial de Halloween</span>
      <h1>Os 10 filmes de terror mais vistos nos cinemas do Brasil</h1>
      <p class="sub">desde 2016 · <b>${milhoes(soma(dados.filmes, 'publico'))} milhões</b> de espectadores</p>
      <p class="chamada">Do 10º ao 1º. Se tiver coragem.</p>
    </div>
  </div>
  <div id="feixe" class="camada"></div>
  ${filmes.map(cartao).join('')}
  <div id="suspense" class="camada"><div class="texto"><span class="rotulo">E o nº 1</span>
    <p>O terror mais visto do Brasil desde 2016 é…</p></div></div>
  <div id="fatos" class="camada"><div class="conteudo">
    <span class="rotulo">O que a lista revela</span>
    <ul>
      <li><b>5 de 10</b><span>são do universo Invocação do Mal: ${milhoes(soma(invocacao, 'publico'))} milhões de espectadores.</span></li>
      <li><b>R$ ${milhoes(soma(dados.filmes, 'renda'))} mi</b><span>de bilheteria somando os 10 (valores da época, sem correção).</span></li>
      <li><b>${umaCasa.format(dados.terrorNacional.publico / 1e3)} mil</b><span>no maior terror nacional: ${escapar(dados.terrorNacional.titulo)} (${dados.terrorNacional.ano}).</span></li>
    </ul>
  </div></div>
  <div id="final" class="camada"><div class="conteudo">
    <h2>Qual desses te deu mais medo?</h2>
    <p class="comente">Conta nos comentários</p>
    <div class="marca"><span class="logo">${simbolo}<span>cine<b>data</b></span></span></div>
    <p class="site">cinedatabr.tech</p>
  </div>
  <p class="fonte">Fonte: ANCINE (dados abertos), lançamentos comerciais desde 2016.<br>Bilheteria em valores da época. Imagens: divulgação.</p></div>
  <div id="topo" class="camada"><span class="logo">${simbolo}<span>cine<b>data</b></span></span><span>Especial de Halloween</span></div>
  <div id="cortina" class="camada"></div>
</div>
<script>
  const T = { intro: ${INTRO}, suspense: ${T_SUSPENSE}, um: ${T_UM}, fatos: ${T_FATOS}, final: ${T_FINAL}, fim: ${DURACAO} };
  const lim = (x) => Math.min(1, Math.max(0, x));
  const entre = (t, a, b) => lim((t - a) / (b - a));
  const saida = (x) => 1 - Math.pow(1 - lim(x), 3);
  const el = (id) => document.getElementById(id);
  const pt = new Intl.NumberFormat('pt-BR');
  /** Ruído determinístico (o mesmo quadro sempre sai igual): o piscar do projetor. */
  const ruido = (t) => (Math.sin(t * 91.7) + Math.sin(t * 37.3 + 1.3) + Math.sin(t * 13.1 + 2.1)) / 3;
  const cortes = [T.intro, ${filmes.slice(0, 9).map((_, i) => inicioCartao(i + 1)).join(', ')}, T.um, T.fatos, T.final];

  function estilo(e, o, transform) {
    e.style.opacity = o;
    if (transform !== undefined) e.style.transform = transform;
  }

  window.render = function (t) {
    // Abertura: o projetor liga piscando sobre a cena de A Freira.
    const intro = 1 - entre(t, T.intro - .25, T.intro);
    const liga = t < 1.1 ? lim(.55 + .45 * ruido(t)) * entre(t, 0, .3) : 1;
    estilo(el('intro'), intro * liga);
    el('intro').querySelector('img').style.transform = 'scale(' + (1.12 - .1 * entre(t, 0, T.intro)) + ')';
    const linhas = el('intro').querySelectorAll('.texto > *');
    linhas.forEach((l, i) => { const a = .5 + i * .35; estilo(l, entre(t, a, a + .4), 'translateY(' + 30 * (1 - saida(entre(t, a, a + .4))) + 'px)'); });

    // Feixe: forte no suspense, discreto no resto.
    const noSuspense = t >= T.suspense && t < T.um;
    const feixe = noSuspense ? lim(.6 + .4 * ruido(t * 1.7)) : t < T.intro ? .35 * entre(t, .4, 1.2) : t >= T.fatos ? .3 : 0;
    estilo(el('feixe'), feixe, 'scaleX(' + (noSuspense ? .7 + .3 * entre(t, T.suspense, T.um) : 1) + ')');

    // Cartões: entram com a foto aproximando devagar; os números sobem e contam.
    document.querySelectorAll('.cartao').forEach((c) => {
      const a = +c.dataset.inicio, d = +c.dataset.duracao, u = t - a;
      const visivel = u >= 0 && u < d;
      c.style.opacity = visivel ? 1 : 0;
      if (!visivel) return;
      c.querySelector('.foto img').style.transform = 'scale(' + (1.14 - .12 * (u / d)) + ') translateX(' + (-12 * (u / d)) + 'px)';
      const partes = [['.lugar', 0, -60, 0], ['.titulo', .15, 0, 40], ['.ano', .25, 0, 30], ['.dados', .3, 0, 30]];
      for (const [s, a0, dx, dy] of partes) {
        const p = saida(entre(u, a0, a0 + .45));
        estilo(c.querySelector(s), p, 'translate(' + dx * (1 - p) + 'px,' + dy * (1 - p) + 'px)');
      }
      const conta = saida(entre(u, .3, d > 3 ? 2.2 : 1.4));
      c.querySelector('.contador').textContent = pt.format(Math.round(+c.dataset.publico * conta));
      c.querySelector('.barra').style.width = 'calc(var(--largura) * ' + saida(entre(u, .4, 1.5)) + ')';
    });

    texto('suspense', t, T.suspense, T.um);
    // Fatos: os três entram um a um e ficam.
    estilo(el('fatos'), t >= T.fatos && t < T.final ? 1 : 0);
    el('fatos').querySelectorAll('li, .rotulo').forEach((l, i) => {
      const a = T.fatos + .1 + i * .55;
      estilo(l, saida(entre(t, a, a + .4)), 'translateY(' + 40 * (1 - saida(entre(t, a, a + .4))) + 'px)');
    });
    estilo(el('final'), entre(t, T.final, T.final + .5), 'translateY(' + 30 * (1 - saida(entre(t, T.final, T.final + .5))) + 'px)');
    estilo(el('topo'), t >= T.intro && t < T.final ? 1 : 0);

    // Corte entre cenas: a tela apaga e a luz volta piscando, como projetor trocando de rolo.
    let cortina = 0;
    for (const c of cortes) {
      const antes = entre(t, c - .1, c), depois = 1 - entre(t, c, c + .22);
      if (t >= c - .1 && t < c + .22) cortina = Math.max(cortina, t < c ? antes : depois * lim(.7 + .3 * ruido(t * 3)));
    }
    estilo(el('cortina'), cortina);
  };

  function texto(id, t, a, b) {
    const o = Math.min(entre(t, a, a + .3), 1 - entre(t, b - .15, b));
    estilo(el(id), t >= a && t < b ? o : 0, 'translateY(' + 30 * (1 - saida(entre(t, a, a + .4))) + 'px)');
  }
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
  // Capa: o nº 1 revelado.
  await gravarVideo(pagina, {
    duracao: DURACAO, saida, nome: 'reels.mp4', capa: T_UM + 2.5, nomeCapa: 'capa-reels.png',
    previa: process.env.VIDEO_PREVIA?.split(',').map(Number),
  });
} finally {
  await navegador.close();
}
if (!process.env.VIDEO_PREVIA) console.log(`Pronto: ${join(saida, 'reels.mp4')} (${DURACAO.toFixed(1)} s) e capa-reels.png`);
