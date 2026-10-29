import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/core';
import { conjuntoDeDados, filme, materia, paginaDeNoticias, trilha } from './dados-estruturados';
import { Seo } from './seo';

const lerJsonLd = (doc: Document) => {
  const scripts = doc.head.querySelectorAll('script[type="application/ld+json"]');
  expect(scripts.length).toBe(1);
  return JSON.parse(scripts[0].textContent ?? '{}') as { '@context': string; '@graph': Record<string, unknown>[] };
};

describe('Seo: dados estruturados', () => {
  let seo: Seo;
  let doc: Document;

  beforeEach(() => {
    seo = TestBed.inject(Seo);
    doc = TestBed.inject(DOCUMENT);
  });

  it('põe a Organization em toda página e troca o bloco a cada navegação (um só script)', () => {
    seo.definir({ titulo: 'Verity', descricao: 'd', caminho: '/obras/E1', estruturado: [filme({ nome: 'Verity', caminho: '/obras/E1' })] });
    expect(lerJsonLd(doc)['@graph'].map(g => g['@type'])).toEqual(['Organization', 'Movie']);

    seo.definir({ titulo: 'Sobre', descricao: 'd', caminho: '/sobre' });
    const grafo = lerJsonLd(doc);
    expect(grafo['@context']).toBe('https://schema.org');
    expect(grafo['@graph'].map(g => g['@type'])).toEqual(['Organization']);
  });

  it('escapa "<" para um texto não fechar o <script>', () => {
    seo.definir({ titulo: 't', descricao: 'd', caminho: '/', estruturado: [filme({ nome: '</script><b>', caminho: '/x' })] });
    const bruto = doc.head.querySelector('script[type="application/ld+json"]')!.textContent!;
    expect(bruto).not.toContain('</script>');
    expect(lerJsonLd(doc)['@graph'][1]['name']).toBe('</script><b>');
  });

  it('matéria vira og:type article', () => {
    seo.definir({ titulo: 'm', descricao: 'd', caminho: '/materias/m', tipo: 'article', imagem: 'https://x/y.jpg' });
    expect(doc.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
    expect(doc.head.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1280');
  });
});

describe('construtores de schema.org', () => {
  it('Dataset traz a cobertura no formato início/fim e a fonte ANCINE', () => {
    const d = conjuntoDeDados({ nome: 'n', descricao: 'd', caminho: '/semana/2026-10-15', inicio: '2026-10-15', fim: '2026-10-21' });
    expect(d['temporalCoverage']).toBe('2026-10-15/2026-10-21');
    expect((d['isBasedOn'] as Record<string, string>)['url']).toContain('ancine');
  });

  it('BreadcrumbList numera os itens a partir de 1', () => {
    const t = trilha([['CineData', '/'], ['Verity', '/obras/E1']]);
    expect((t['itemListElement'] as { position: number }[]).map(i => i.position)).toEqual([1, 2]);
  });

  it('NewsArticle tem autor com nome e data de publicação', () => {
    const m = materia({ titulo: 't', resumo: 'r', caminho: '/materias/t', data: '2026-10-27' });
    expect((m['author'] as Record<string, string>)['name']).toBe('CineData');
    expect(m['datePublished']).toBe('2026-10-27');
  });

  it('página de notícias é uma CollectionPage com a lista numerada dos artigos, e cada artigo aponta para ela', () => {
    const p = paginaDeNoticias({
      nome: 'Notícias',
      descricao: 'd',
      caminho: '/materias',
      itens: [{ titulo: 'a', caminho: '/materias/a' }, { titulo: 'b', caminho: '/materias/b' }],
    });
    const lista = p['mainEntity'] as { numberOfItems: number; itemListElement: { position: number; url: string }[] };
    expect(p['@type']).toBe('CollectionPage');
    expect(lista.numberOfItems).toBe(2);
    expect(lista.itemListElement.map(i => i.position)).toEqual([1, 2]);
    expect(lista.itemListElement[1].url).toMatch(/\/materias\/b$/);

    const m = materia({ titulo: 't', resumo: 'r', caminho: '/materias/t', data: '2026-10-27', secao: 'Especial' });
    expect(m['articleSection']).toBe('Especial');
    expect((m['isPartOf'] as Record<string, string>)['@id']).toBe(p['@id']);
  });
});
