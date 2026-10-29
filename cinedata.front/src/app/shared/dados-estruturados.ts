import { ambiente } from '../../environments/ambiente';

/**
 * Dados estruturados (schema.org em JSON-LD) das páginas. É o que permite ao Google entender que uma página é um
 * conjunto de dados de bilheteria, um filme ou uma matéria, e não só texto. Os endereços são absolutos (o marcador
 * %URL_SITE% do site estático é trocado no pós-build).
 */
export type DadoEstruturado = Record<string, unknown>;

const absoluta = (caminho: string) => ambiente.urlSite + caminho;
const ID_ORGANIZACAO = () => absoluta('/#organizacao');

export const INSTAGRAM = 'https://www.instagram.com/cinedata.br/';
const FONTE_ANCINE = 'https://www.gov.br/ancine/pt-br/oca/dados-abertos';

export const organizacao = (): DadoEstruturado => ({
  '@type': 'Organization',
  '@id': ID_ORGANIZACAO(),
  name: 'CineData',
  url: absoluta('/'),
  logo: absoluta('/logo-cinedata.png'),
  description: 'O cinema brasileiro em números: bilheteria, salas e lançamentos a partir dos dados abertos da ANCINE.',
  sameAs: [INSTAGRAM],
});

export const site = (): DadoEstruturado => ({
  '@type': 'WebSite',
  '@id': absoluta('/#site'),
  name: 'CineData',
  url: absoluta('/'),
  inLanguage: 'pt-BR',
  publisher: { '@id': ID_ORGANIZACAO() },
});

/** Um período (semana, mês…) de bilheteria: o recorte dos dados abertos da ANCINE que a página mostra. */
export const conjuntoDeDados = (d: { nome: string; descricao: string; caminho: string; inicio: string; fim: string }): DadoEstruturado => ({
  '@type': 'Dataset',
  name: d.nome,
  description: d.descricao,
  url: absoluta(d.caminho),
  inLanguage: 'pt-BR',
  temporalCoverage: `${d.inicio}/${d.fim}`,
  spatialCoverage: { '@type': 'Country', name: 'Brasil' },
  creator: { '@id': ID_ORGANIZACAO() },
  isBasedOn: { '@type': 'Dataset', name: 'Dados abertos da ANCINE (Observatório Brasileiro do Cinema e do Audiovisual)', url: FONTE_ANCINE },
});

export const filme = (f: { nome: string; caminho: string; imagem?: string; pais?: string | null }): DadoEstruturado => ({
  '@type': 'Movie',
  name: f.nome,
  url: absoluta(f.caminho),
  ...(f.imagem ? { image: f.imagem } : {}),
  ...(f.pais ? { countryOfOrigin: { '@type': 'Country', name: f.pais } } : {}),
});

/** Trilha de navegação: [nome, caminho] do início até a página. */
export const trilha = (itens: [string, string][]): DadoEstruturado => ({
  '@type': 'BreadcrumbList',
  itemListElement: itens.map(([name, caminho], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absoluta(caminho) })),
});

export const materia = (m: {
  titulo: string;
  resumo: string;
  caminho: string;
  data: string;
  /** Formato (Notícia, Top 5, Especial): vira a editoria do artigo. */
  secao?: string;
  imagem?: string;
  sobre?: DadoEstruturado[];
}): DadoEstruturado => ({
  '@type': 'NewsArticle',
  headline: m.titulo,
  description: m.resumo,
  url: absoluta(m.caminho),
  mainEntityOfPage: absoluta(m.caminho),
  datePublished: m.data,
  dateModified: m.data,
  inLanguage: 'pt-BR',
  ...(m.secao ? { articleSection: m.secao } : {}),
  isPartOf: { '@id': absoluta('/materias#pagina') },
  ...(m.imagem ? { image: [m.imagem] } : {}),
  // Nome e URL repetidos (além do @id): o validador do Google pede o nome do autor no próprio artigo.
  author: { '@type': 'Organization', '@id': ID_ORGANIZACAO(), name: 'CineData', url: absoluta('/') },
  publisher: { '@type': 'Organization', '@id': ID_ORGANIZACAO(), name: 'CineData', logo: { '@type': 'ImageObject', url: absoluta('/logo-cinedata.png') } },
  ...(m.sobre?.length ? { about: m.sobre } : {}),
});

/** A página de notícias: uma coleção cujo conteúdo principal é a lista dos artigos, do mais recente ao mais antigo. */
export const paginaDeNoticias = (p: {
  nome: string;
  descricao: string;
  caminho: string;
  itens: { titulo: string; caminho: string; imagem?: string }[];
}): DadoEstruturado => ({
  '@type': 'CollectionPage',
  '@id': absoluta(`${p.caminho}#pagina`),
  name: p.nome,
  description: p.descricao,
  url: absoluta(p.caminho),
  inLanguage: 'pt-BR',
  isPartOf: { '@id': absoluta('/#site') },
  publisher: { '@id': ID_ORGANIZACAO() },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: p.itens.length,
    itemListElement: p.itens.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluta(m.caminho),
      name: m.titulo,
      ...(m.imagem ? { image: m.imagem } : {}),
    })),
  },
});
