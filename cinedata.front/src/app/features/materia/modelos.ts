import { Origem } from '../../core/api/modelos';

/** Gerado por scripts/materias.mjs a partir de conteudo/materias/*.md (servido como estático nos dois modos). */
export const PASTA_MATERIAS = 'conteudo/materias';

export type FormatoMateria = 'Notícia' | 'Top 5' | 'Especial';

export interface MateriaResumo {
  slug: string;
  titulo: string;
  resumo: string;
  /** AAAA-MM-DD */
  data: string;
  formato: FormatoMateria;
  imagem: string;
  creditoImagem: string;
}

export interface ObraCitada {
  codigo: string;
  /** Falso quando o filme não tem página no site (fora dos Top 10 do export). */
  temPagina: boolean;
  titulo?: string;
  poster?: string | null;
  origem?: Origem;
  publico?: number;
}

export interface Materia extends MateriaResumo {
  obras: ObraCitada[];
  trailer: { youtube: string; titulo: string } | null;
  instagram: string | null;
  fontes: { titulo: string; url: string }[];
  html: string;
  palavras: number;
}
