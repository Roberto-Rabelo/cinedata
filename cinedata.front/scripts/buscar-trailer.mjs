// Trailer oficial de um filme no TMDB (YouTube), para o frontmatter de uma matéria:
//
//   node scripts/buscar-trailer.mjs <id-tmdb>        → youtube: <chave> e o título do vídeo
//
// Token: variável TMDB_TOKEN ou o user-secret Tmdb:Token do projeto CineData.Ingestion (nunca no repositório).
import { execFileSync } from 'node:child_process';

const id = process.argv[2];
if (!id) throw new Error('uso: node scripts/buscar-trailer.mjs <id-tmdb>');

const token =
  process.env.TMDB_TOKEN ??
  execFileSync('dotnet', ['user-secrets', 'list', '--project', new URL('../../cinedata.back/src/CineData.Ingestion', import.meta.url).pathname], { encoding: 'utf8' })
    .match(/^Tmdb:Token = (.+)$/m)?.[1];
if (!token) throw new Error('sem token do TMDB (TMDB_TOKEN ou dotnet user-secrets)');

const buscar = async idioma => {
  const r = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=${idioma}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`TMDB ${r.status}`);
  return (await r.json()).results.filter(v => v.site === 'YouTube' && v.type === 'Trailer');
};

// Preferência: trailer oficial em português, depois qualquer trailer em português, depois em inglês.
const pt = await buscar('pt-BR');
const escolhido = pt.find(v => v.official) ?? pt[0] ?? (await buscar('en-US')).find(v => v.official);
if (!escolhido) {
  console.log('nenhum trailer no YouTube para esse filme');
} else {
  console.log(`trailer:\n  youtube: ${escolhido.key}\n  titulo: "${escolhido.name}"`);
}
