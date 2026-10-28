// node --test scripts/materias.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { converterMateria } from './materias.mjs';

const semObras = async codigo => ({ codigo, temPagina: false });
const texto = (frontmatter, corpo = 'Texto com **negrito** e [link](/obras/E1).') => `---\n${frontmatter}\n---\n${corpo}\n`;
const valido = 'titulo: T\nresumo: R\ndata: 2026-10-27\nformato: Notícia\nimagem: https://x/y.jpg';

test('converte frontmatter e Markdown', async () => {
  const { resumo, materia } = await converterMateria(texto(`${valido}\nobras:\n  - E1`), 'minha-materia.md', semObras);
  assert.equal(resumo.slug, 'minha-materia');
  assert.equal(resumo.data, '2026-10-27');
  assert.equal(resumo.creditoImagem, 'Imagem: divulgação');
  assert.match(materia.html, /<strong>negrito<\/strong>/);
  assert.match(materia.html, /<a href="\/obras\/E1">link<\/a>/);
  assert.deepEqual(materia.obras, [{ codigo: 'E1', temPagina: false }]);
  assert.equal(materia.trailer, null);
});

test('recusa campo obrigatório faltando, formato fora da lista e data inválida', async () => {
  await assert.rejects(converterMateria(texto('titulo: T'), 'a.md', semObras), /campo obrigatório "resumo"/);
  await assert.rejects(converterMateria(texto(valido.replace('Notícia', 'Blog')), 'a.md', semObras), /formato "Blog"/);
  await assert.rejects(converterMateria(texto(valido.replace('2026-10-27', '27/10/2026')), 'a.md', semObras), /não é AAAA-MM-DD/);
  await assert.rejects(converterMateria('sem frontmatter', 'a.md', semObras), /falta o frontmatter/);
});
