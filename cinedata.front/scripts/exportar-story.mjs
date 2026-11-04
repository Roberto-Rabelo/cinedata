// Exporta o story 1080×1920 de uma matéria (rota /marca/story/<slug>) em PNG e imprime o link para o adesivo.
// Uso (com o front rodando em modo API):
//   node scripts/exportar-story.mjs <slug|todas> [pasta-saida] [url-base]
//   node scripts/exportar-story.mjs os-farofeiros-3-estreia-franquia-em-numeros
//   node scripts/exportar-story.mjs todas ../docs/posts/stories http://localhost:4300
// Saída: <pasta-saida>/<slug>.png (padrão ../docs/posts/stories). "todas" lê public/conteudo/materias/indice.json.
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';

const [alvo, pasta = '../docs/posts/stories', base = 'http://localhost:4300'] = process.argv.slice(2);
if (!alvo) throw new Error('uso: node scripts/exportar-story.mjs <slug|todas> [pasta-saida] [url-base]');
const saida = resolve(pasta);
const indice = new URL('../public/conteudo/materias/indice.json', import.meta.url);
const slugs = alvo === 'todas' ? JSON.parse(await readFile(indice, 'utf8')).map(m => m.slug) : [alvo];

await mkdir(saida, { recursive: true });
const navegador = await chromium.launch({ channel: 'chrome' });
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
  for (const slug of slugs) {
    await pagina.goto(`${base}/marca/story/${slug}?exportar=1`, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.addStyleTag({ content: 'app-root > header, app-root > footer { display: none !important; }' });

    const story = pagina.locator('.moldura .story');
    await story.waitFor();
    await pagina.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    const caixa = await story.boundingBox();
    if (caixa?.width !== 1080 || caixa.height !== 1920) throw new Error(`${slug}: story com ${caixa?.width}×${caixa?.height}`);
    // A capa e a chamada não podem invadir a faixa do adesivo nem o rodapé.
    const sobra = await story.evaluate(s => s.scrollHeight - s.clientHeight);
    if (sobra > 0) throw new Error(`${slug}: conteúdo passa ${sobra} px do quadro`);

    const arquivo = resolve(saida, `${slug}.png`);
    await story.screenshot({ path: arquivo });
    console.log(arquivo);
    console.log(`  link: https://cinedatabr.tech/materias/${slug}?utm_source=instagram&utm_medium=story&utm_campaign=${slug}`);
  }
} finally {
  await navegador.close();
}
