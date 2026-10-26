// Serve dist/site/browser como um host estático (GitHub Pages / Cloudflare Pages), para conferir antes de publicar:
//
//   node scripts/servir-estatico.mjs [porta]      (padrão 4320)
//
// /semana/2026-10-08 → semana/2026-10-08/index.html; o que não existe recebe o 404.html com status 404.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const site = new URL('../dist/site/browser/', import.meta.url).pathname;
const porta = Number(process.argv[2] ?? 4320);
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function arquivo(caminho) {
  const alvo = normalize(join(site, decodeURIComponent(caminho)));
  if (!alvo.startsWith(site)) return null;
  for (const candidato of [alvo, join(alvo, 'index.html')]) {
    try {
      if ((await stat(candidato)).isFile()) return candidato;
    } catch {
      // tenta o próximo
    }
  }
  return null;
}

createServer(async (req, res) => {
  const caminho = new URL(req.url ?? '/', 'http://localhost').pathname;
  const encontrado = await arquivo(caminho);
  const servido = encontrado ?? join(site, '404.html');
  res.writeHead(encontrado ? 200 : 404, { 'content-type': tipos[extname(servido)] ?? 'application/octet-stream' });
  res.end(await readFile(servido));
}).listen(porta, () => console.log(`Site estático em http://localhost:${porta}`));
