// Pôsteres servidos pelo próprio site estático: em vez de cada visitante buscar a imagem em image.tmdb.org, o build
// copia para dist/site/browser/posteres/<largura>/<arquivo> os pôsteres citados nos JSON de dados/. Usado por
// pos-build-estatico.mjs.
//
// As imagens baixadas ficam num cache fora do site (padrão .cache/posteres, ou PASTA_POSTERES), então a carga semanal
// só baixa os filmes novos. No GitHub Actions o cache é guardado por semestre: os termos do TMDB permitem guardar o
// conteúdo por até seis meses, e a cada semestre tudo é baixado de novo.
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/** As larguras usadas pelo componente cd-cartaz (mini, medio, grande). O og:image (w780) continua no TMDB. */
export const LARGURAS = ['w92', 'w185', 'w342'];
const TMDB = 'https://image.tmdb.org/t/p';
const PARALELISMO = 12;

async function* jsons(pasta) {
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, entrada.name);
    if (entrada.isDirectory()) yield* jsons(caminho);
    else if (entrada.name.endsWith('.json')) yield caminho;
  }
}

/** Caminhos de pôster ("/abc.jpg") citados nos JSON: campos poster e liderPoster. */
export async function posteresCitados(pastaDados) {
  const caminhos = new Set();
  for await (const arquivo of jsons(pastaDados)) {
    for (const [, caminho] of (await readFile(arquivo, 'utf8')).matchAll(/"(?:poster|liderPoster)":"(\/[\w.-]+\.(?:jpg|png))"/g)) {
      caminhos.add(caminho);
    }
  }
  return [...caminhos].sort();
}

const existe = (caminho) => stat(caminho).then(() => true, () => false);

async function baixar(url, destino, tentativas = 3) {
  for (let i = 1; ; i++) {
    try {
      const resposta = await fetch(url);
      if (resposta.status === 404) return false;
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      await mkdir(dirname(destino), { recursive: true });
      await writeFile(destino, Buffer.from(await resposta.arrayBuffer()));
      return true;
    } catch (erro) {
      if (i >= tentativas) throw erro;
      await new Promise(r => setTimeout(r, 500 * i));
    }
  }
}

/**
 * Baixa para o cache o que falta e copia para o site. Pôster que não baixar fica de fora: o cd-cartaz mostra o
 * cartaz tipográfico quando a imagem não carrega.
 * @returns {{ total: number, baixados: number, falhas: string[], bytes: number }}
 */
export async function copiarPosteres({ pastaDados, pastaSite, pastaCache }) {
  const caminhos = await posteresCitados(pastaDados);
  const tarefas = caminhos.flatMap(caminho => LARGURAS.map(largura => ({ largura, caminho })));
  let baixados = 0;
  let bytes = 0;
  const falhas = [];

  let proxima = 0;
  const trabalhador = async () => {
    while (proxima < tarefas.length) {
      const { largura, caminho } = tarefas[proxima++];
      const emCache = join(pastaCache, largura, caminho);
      try {
        if (!(await existe(emCache))) {
          if (!(await baixar(`${TMDB}/${largura}${caminho}`, emCache))) {
            falhas.push(`${largura}${caminho}`);
            continue;
          }
          baixados++;
        }
        const noSite = join(pastaSite, 'posteres', largura, caminho);
        await mkdir(dirname(noSite), { recursive: true });
        await copyFile(emCache, noSite);
        bytes += (await stat(noSite)).size;
      } catch (erro) {
        falhas.push(`${largura}${caminho} (${erro.message})`);
      }
    }
  };
  await Promise.all(Array.from({ length: PARALELISMO }, trabalhador));
  return { total: caminhos.length, baixados, falhas, bytes };
}
