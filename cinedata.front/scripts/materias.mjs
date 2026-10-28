// Matérias do site: converte conteudo/materias/<slug>.md (frontmatter YAML + Markdown) em
// public/conteudo/materias/<slug>.json e indice.json, que o front lê nos dois modos (API e estático).
//
//   node scripts/materias.mjs        (rodar depois de editar uma matéria; os JSON gerados vão para o git)
//
// Frontmatter: titulo, resumo, data (AAAA-MM-DD), formato (Notícia | Top 5 | Especial), imagem (URL), creditoImagem,
// obras (lista de códigos CPB/ROE), trailer ({ youtube, titulo }), instagram (URL do post), fontes ({ titulo, url }).
// As obras citadas ganham título, pôster e público a partir de dados/obras/<codigo>.json (as que o site tem página).
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { parse } from 'yaml';

const raiz = new URL('../', import.meta.url).pathname;
const origem = join(raiz, 'conteudo/materias');
const destino = join(raiz, 'public/conteudo/materias');
const FORMATOS = ['Notícia', 'Top 5', 'Especial'];

const lerObra = async codigo => {
  try {
    const d = JSON.parse(await readFile(join(raiz, 'dados/obras', `${codigo}.json`), 'utf8'));
    return { codigo, titulo: d.obra.titulo, poster: d.obra.poster ?? null, origem: d.obra.origem, publico: d.publicoNoPeriodo, temPagina: true };
  } catch {
    return { codigo, temPagina: false };
  }
};

const separar = (texto, arquivo) => {
  const m = texto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${arquivo}: falta o frontmatter entre ---`);
  return [parse(m[1]), m[2]];
};

/** Converte o texto de uma matéria (.md) no JSON que o front lê. `lerObra(codigo)` completa as obras citadas. */
export async function converterMateria(texto, arquivo, lerObra) {
  const slug = arquivo.replace(/\.md$/, '');
  const [meta, corpo] = separar(texto, arquivo);
  for (const campo of ['titulo', 'resumo', 'data', 'formato', 'imagem']) {
    if (!meta[campo]) throw new Error(`${arquivo}: campo obrigatório "${campo}"`);
  }
  if (!FORMATOS.includes(meta.formato)) throw new Error(`${arquivo}: formato "${meta.formato}" fora de ${FORMATOS.join(', ')}`);
  const data = meta.data instanceof Date ? meta.data.toISOString().slice(0, 10) : String(meta.data);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error(`${arquivo}: data "${data}" não é AAAA-MM-DD`);

  const resumo = {
    slug,
    titulo: meta.titulo,
    resumo: meta.resumo,
    data,
    formato: meta.formato,
    imagem: meta.imagem,
    creditoImagem: meta.creditoImagem ?? 'Imagem: divulgação',
  };
  return {
    resumo,
    materia: {
      ...resumo,
      obras: await Promise.all((meta.obras ?? []).map(lerObra)),
      trailer: meta.trailer ?? null,
      instagram: meta.instagram ?? null,
      fontes: meta.fontes ?? [],
      html: await marked.parse(corpo, { gfm: true }),
      palavras: corpo.split(/\s+/).filter(Boolean).length,
    },
  };
}

async function gerar() {
  await rm(destino, { recursive: true, force: true });
  await mkdir(destino, { recursive: true });

  const indice = [];
  for (const arquivo of (await readdir(origem)).filter(a => a.endsWith('.md')).sort()) {
    const { resumo, materia } = await converterMateria(await readFile(join(origem, arquivo), 'utf8'), arquivo, lerObra);
    await writeFile(join(destino, `${resumo.slug}.json`), JSON.stringify(materia, null, 1));
    indice.push(resumo);
    console.log(`${resumo.slug}: ${materia.palavras} palavras, ${materia.obras.filter(o => o.temPagina).length}/${materia.obras.length} obras com página`);
  }

  indice.sort((a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug));
  await writeFile(join(destino, 'indice.json'), JSON.stringify(indice, null, 1));
  console.log(`${indice.length} matérias em public/conteudo/materias.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await gerar();
