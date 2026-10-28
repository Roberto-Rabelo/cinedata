// Acabamento do site estático depois do `ng build --configuration estatico` (npm run build:estatico).
//
//   URL_SITE=https://cinedata.com.br node scripts/pos-build-estatico.mjs
//
// 1. Troca o marcador %URL_SITE% (og:url, og:image, canonical) pelo endereço público e, com UMAMI_ID, inclui o
//    script do Umami (contagem de acessos sem cookies) em todas as páginas.
// 2. Cria o 404.html a partir do index.csr.html (o app sem pré-render mostra a página "não encontrada").
// 3. Achata as páginas: <rota>/index.html vira <rota>.html. O host serve /obras/X a partir de obras/X.html com 200,
//    sem redirecionar para /obras/X/, e assim o endereço servido é o mesmo do canonical, do sitemap e dos links.
// 4. Gera sitemap.xml (só páginas cujo canonical é o próprio endereço, com lastmod) e robots.txt.
// 5. Copia para posteres/ os pôsteres do TMDB citados nos dados (posteres-estaticos.mjs), baixando só os que faltam
//    no cache (.cache/posteres ou PASTA_POSTERES). SEM_POSTERES=1 pula a etapa (o site mostra os cartazes tipográficos).
// 6. Mostra o tamanho do site.
//
// Sem URL_SITE as metas ficam com caminhos relativos e o sitemap não é gerado (ele exige endereços absolutos).
import { copyFile, readFile, readdir, rename, rmdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { copiarPosteres } from './posteres-estaticos.mjs';

const raiz = new URL('../dist/site/', import.meta.url).pathname;
const site = join(raiz, 'browser');
const urlSite = (process.env.URL_SITE ?? '').trim().replace(/\/+$/, '');
const MARCADOR = '%URL_SITE%';
const umamiId = (process.env.UMAMI_ID ?? '').trim();
// data-domains: só conta acessos no endereço público (não no localhost de quem testa o build).
const umami = umamiId
  ? `<script defer src="https://cloud.umami.is/script.js" data-website-id="${umamiId}"` +
    `${urlSite ? ` data-domains="${new URL(urlSite).hostname}"` : ''}></script>`
  : '';

if (!urlSite) console.warn('URL_SITE não definida: og:url, og:image e canonical ficam relativos e não há sitemap.');

async function* arquivos(pasta) {
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, entrada.name);
    if (entrada.isDirectory()) yield* arquivos(caminho);
    else yield caminho;
  }
}

let posteres = '';
if (!process.env.SEM_POSTERES) {
  const pastaCache = resolve(process.env.PASTA_POSTERES ?? new URL('../.cache/posteres', import.meta.url).pathname);
  const r = await copiarPosteres({ pastaDados: new URL('../dados', import.meta.url).pathname, pastaSite: site, pastaCache });
  posteres = `, ${r.total} pôsteres (${r.baixados} baixados agora, ${(r.bytes / 1024 / 1024).toFixed(1)} MB)`;
  if (r.falhas.length) console.warn(`${r.falhas.length} pôsteres não baixaram (o site mostra o cartaz tipográfico): ${r.falhas.slice(0, 5).join(', ')}`);
}

let bytes = 0;
let total = 0;
for await (const arquivo of arquivos(site)) {
  total++;
  bytes += (await stat(arquivo)).size;
  if (!/\.(html|js)$/.test(arquivo)) continue;
  const texto = await readFile(arquivo, 'utf8');
  let novo = texto.replaceAll(MARCADOR, urlSite);
  if (umami && arquivo.endsWith('.html') && !novo.includes('cloud.umami.is')) novo = novo.replace('</head>', `${umami}</head>`);
  if (novo !== texto) await writeFile(arquivo, novo);
}

await copyFile(join(site, 'index.csr.html'), join(site, '404.html'));

const { routes } = JSON.parse(await readFile(join(raiz, 'prerendered-routes.json'), 'utf8'));
const rotas = Object.keys(routes).sort();

const arquivoDaRota = rota => (rota === '/' ? join(site, 'index.html') : join(site, `${rota.slice(1)}.html`));
for (const rota of rotas) {
  if (rota === '/') continue;
  const pasta = join(site, rota.slice(1));
  await rename(join(pasta, 'index.html'), arquivoDaRota(rota));
  // A pasta continua quando tem filhos (semana/ → semana/2026-10-15.html); vazia, sai.
  if ((await readdir(pasta)).length === 0) await rmdir(pasta);
}

if (urlSite) {
  const dados = new URL('../dados/', import.meta.url).pathname;
  const lerJson = async caminho => JSON.parse(await readFile(join(dados, caminho), 'utf8'));
  const { dadosAte } = await lerJson('indice.json');
  const menor = (a, b) => (a < b ? a : b);
  const somarDias = (data, dias) => new Date(Date.parse(data) + dias * 864e5).toISOString().slice(0, 10);

  // lastmod = quando o conteúdo da página mudou de verdade: um período antigo não muda mais (os exibidores enviam
  // retificações por até ~2 semanas); a página atual e os filmes em cartaz mudam a cada carga.
  const ultimaMudanca = async rota => {
    const partes = rota.split('/').filter(Boolean);
    if (partes[0] === 'mapa') partes.shift();
    const [secao, chave] = partes;
    try {
      if (secao === 'materias') {
        const materias = JSON.parse(await readFile(join(site, 'conteudo/materias/indice.json'), 'utf8'));
        return chave ? (materias.find(m => m.slug === chave)?.data ?? null) : (materias[0]?.data ?? null);
      }
      if (secao === 'obras' && chave) {
        const obra = await lerJson(`obras/${chave}.json`);
        return obra.emCartaz ? dadosAte : menor(obra.dias.at(-1)?.data ?? dadosAte, dadosAte);
      }
      if (chave && ['semana', 'mes', 'trimestre', 'semestre', 'ano'].includes(secao)) {
        const { periodo } = await lerJson(`${secao}/${chave}.json`);
        return menor(somarDias(periodo.fim, 14), dadosAte);
      }
    } catch {
      return null;
    }
    return rota === '/' || rota === '/mapa' ? dadosAte : null;
  };

  const linhas = [];
  for (const rota of rotas) {
    const endereco = `${urlSite}${rota === '/' ? '/' : rota}`;
    const html = await readFile(arquivoDaRota(rota), 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    // Página-alias (/semana, /mapa/mes…): o canonical aponta para o período padrão, que já está no sitemap.
    if (canonical && canonical !== endereco) continue;
    const lastmod = await ultimaMudanca(rota);
    linhas.push(`  <url><loc>${endereco}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`);
  }
  await writeFile(
    join(site, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${linhas.join('\n')}\n</urlset>\n`,
  );
  console.log(`sitemap.xml: ${linhas.length} de ${rotas.length} páginas (as demais são aliases de outra URL).`);
}
await writeFile(join(site, 'robots.txt'), `User-agent: *\nAllow: /\n${urlSite ? `Sitemap: ${urlSite}/sitemap.xml\n` : ''}`);

console.log(
  `Site estático em ${site}: ${rotas.length} páginas pré-renderizadas, ${total} arquivos, ` +
    `${(bytes / 1024 / 1024).toFixed(1)} MB${posteres}${urlSite ? `, endereço ${urlSite}` : ''}${umami ? ', com Umami' : ', sem contagem de acessos'}.`,
);
