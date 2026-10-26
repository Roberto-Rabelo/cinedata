// Encaixa um vídeo vertical (spot oficial de distribuidora) num slide de vídeo 1080×1350 do carrossel:
// o vídeo inteiro no centro, sem cortar legendas, sobre uma cópia desfocada e escurecida; no topo o lugar
// e o título, no rodapé o crédito da distribuidora e o perfil. Não altera o conteúdo do vídeo.
// Uso:
//   node scripts/emoldurar-video.mjs <video> <saida.mp4> <lugar> <titulo> <credito>
//   node scripts/emoldurar-video.mjs original.mp4 slide-02.mp4 "nº 1" "Verity" "Sony Pictures Brasil"
// Precisa de ffmpeg no PATH; a moldura é desenhada pelo Chrome instalado (playwright-core).
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const [video, saida, lugar, titulo, credito] = process.argv.slice(2);
if (!video || !saida || !lugar || !titulo || !credito) {
  throw new Error('uso: node scripts/emoldurar-video.mjs <video> <saida.mp4> <lugar> <titulo> <credito>');
}

// Faixas da moldura: o vídeo ocupa 1110 px de altura entre o topo (120) e o rodapé (1230).
const quadro = { largura: 1080, altura: 1350, topo: 120, video: 1110 };

const simbolo = (await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8'))
  .replace('<rect width="32" height="32" rx="7" fill="#0D0E12"/>', '');
const escapar = (t) => t.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const moldura = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; background: transparent; }
  .q { position: relative; width: ${quadro.largura}px; height: ${quadro.altura}px; color: #F3EFE6; font-family: Inter, sans-serif; }
  .faixa { position: absolute; left: 0; right: 0; }
  .topo { top: 0; height: 220px; background: linear-gradient(#0D0E12F2, #0D0E1200); }
  .base { bottom: 0; height: 240px; background: linear-gradient(#0D0E1200, #0D0E12F2 55%); }
  .titulo { position: absolute; left: 80px; top: 34px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 44px; letter-spacing: -0.02em; }
  .titulo b { color: #FFB547; font-weight: 800; margin-right: 14px; }
  .logo { position: absolute; right: 80px; top: 32px; display: flex; align-items: center; gap: 14px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 40px; letter-spacing: -0.03em; }
  .logo svg { width: 54px; height: 54px; }
  .logo .data { font-weight: 800; }
  .rodape { position: absolute; left: 80px; right: 80px; bottom: 50px; display: flex; justify-content: space-between; font-size: 30px; color: #A3A7B3; }
  .rodape strong { color: #F3EFE6; font-weight: 600; }
</style></head><body><div class="q">
  <div class="faixa topo"></div><div class="faixa base"></div>
  <div class="titulo"><b>${escapar(lugar)}</b>${escapar(titulo)}</div>
  <div class="logo">${simbolo}<span>cine<span class="data">data</span></span></div>
  <div class="rodape"><span>Vídeo: <strong>${escapar(credito)}</strong></span><strong>@cinedata.br</strong></div>
</div></body></html>`;

const pasta = await mkdtemp(join(tmpdir(), 'cd-video-'));
try {
  const navegador = await chromium.launch({ channel: 'chrome' });
  try {
    const pagina = await navegador.newPage({ viewport: { width: quadro.largura, height: quadro.altura } });
    await pagina.setContent(moldura, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.locator('.q').screenshot({ path: join(pasta, 'moldura.png'), omitBackground: true });
  } finally {
    await navegador.close();
  }

  const { largura, altura, topo, video: alturaVideo } = quadro;
  const filtro = [
    `[0:v]scale=${largura}:${altura}:force_original_aspect_ratio=increase,crop=${largura}:${altura},boxblur=40:3,eq=brightness=-0.28[fundo]`,
    `[0:v]scale=-2:${alturaVideo}[frente]`,
    `[fundo][frente]overlay=(W-w)/2:${topo}[base]`,
    `[base][1:v]overlay=0:0,fps=30,format=yuv420p[v]`,
  ].join(';');
  execFileSync('ffmpeg', [
    '-v', 'error', '-y', '-i', resolve(video), '-i', join(pasta, 'moldura.png'),
    '-filter_complex', filtro, '-map', '[v]', '-map', '0:a?',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', resolve(saida),
  ], { stdio: 'inherit' });
  console.log(resolve(saida));
} finally {
  await rm(pasta, { recursive: true, force: true });
}
