// Exporta os slides de uma rota do front em PNG 1080×1350, um arquivo por slide.
// Uso (com o front rodando):
//   node scripts/exportar-slides.mjs <rota> <pasta-saida> [url-base]
//   node scripts/exportar-slides.mjs /marca/apresentacao ../docs/posts/apresentacao http://localhost:4300
// Usa o Google Chrome instalado (playwright-core, canal "chrome"), sem baixar navegador.
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';

const [rota, pasta, base = 'http://localhost:4300'] = process.argv.slice(2);
if (!rota || !pasta) throw new Error('uso: node scripts/exportar-slides.mjs <rota> <pasta-saida> [url-base]');
const saida = resolve(pasta);

await mkdir(saida, { recursive: true });
const navegador = await chromium.launch({ channel: 'chrome' });
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
  await pagina.goto(`${base}${rota}?exportar=1`, { waitUntil: 'networkidle' });
  await pagina.evaluate(() => document.fonts.ready);
  // O cabeçalho fixo do app cobriria o topo dos slides na captura.
  await pagina.addStyleTag({ content: 'app-root > header, app-root > footer { display: none !important; }' });

  const slides = pagina.locator('cd-slide');
  const total = await slides.count();
  for (let i = 0; i < total; i++) {
    const caixa = await slides.nth(i).boundingBox();
    if (caixa?.width !== 1080 || caixa.height !== 1350) throw new Error(`slide ${i + 1} com ${caixa?.width}×${caixa?.height}`);
    // Conteúdo maior que o quadro passaria por cima do rodapé sem erro nenhum.
    const sobra = await slides.nth(i).locator('.corpo').evaluate(c => c.scrollHeight - c.clientHeight);
    if (sobra > 0) throw new Error(`slide ${i + 1}: conteúdo passa ${sobra} px do quadro`);
    const arquivo = resolve(saida, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slides.nth(i).screenshot({ path: arquivo });
    console.log(arquivo);
  }
} finally {
  await navegador.close();
}
