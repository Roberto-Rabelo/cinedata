// Espelho dos DTOs de CineData.Application.Consultas (serializados em camelCase pela API).

export type Origem = 'Nacional' | 'Estrangeira' | 'Generica';

/** Valor do parâmetro `periodo` da API. Semana é a cinematográfica (quinta a quarta); os demais, o calendário civil. */
export type Granularidade = 'semana' | 'mes' | 'trimestre' | 'semestre' | 'ano';

export interface Periodo {
  granularidade: Granularidade;
  inicio: string;
  fim: string;
  /** "08/10 a 14/10/2026", "out/2026", "3º tri 2025", "1º sem 2026", "2025". */
  rotulo: string;
  dias: number;
  /** Dias com ao menos 90% da mediana de salas da janela de 8 semanas (ADR 0004). */
  diasConsolidados: number;
  publico: number;
  sessoes: number;
  /** Semana: 7 dias consolidados. Calendário: a ANCINE já publicou e consolidou o período inteiro (ADR 0005). */
  completo: boolean;
}

export interface Resumo {
  inicio: string;
  fim: string;
  publico: number;
  sessoes: number;
  obras: number;
  salas: number;
  municipios: number;
  publicoMedioPorSessao: number;
  publicoPeriodoAnterior: number | null;
  variacaoPct: number | null;
}

export interface ItemRanking {
  posicao: number;
  codigoObra: string;
  titulo: string;
  origem: Origem;
  pais: string | null;
  publico: number;
  sessoes: number;
  salas: number;
  publicoMedioPorSessao: number;
  ocupacaoPct: number | null;
  participacaoPct: number;
  publicoPeriodoAnterior: number | null;
  variacaoPct: number | null;
  estreia: boolean;
}

export interface Uf {
  uf: string;
  regiao: string;
  publico: number;
  sessoes: number;
  publicoMedioPorSessao: number;
  liderCodigo: string | null;
  liderTitulo: string | null;
  liderPublico: number;
  dubladoPctEstrangeiros: number | null;
}

export interface OrigemResumo {
  origem: Origem;
  publico: number;
  obras: number;
  sessoes: number;
  participacaoPct: number;
}

export interface Audio {
  publicoDublado: number;
  publicoLegendado: number;
  dubladoPct: number;
}

export interface PainelPeriodo {
  periodo: Periodo;
  resumo: Resumo;
  ranking: ItemRanking[];
  origem: OrigemResumo[];
  audio: Audio;
  ufs: Uf[];
}

export interface Lancamento {
  data: string;
  distribuidora: string;
  tipoObra: string;
  publicoTotal: number;
  rendaTotal: number;
  ticketMedio: number | null;
}

export interface Obra {
  codigo: string;
  titulo: string;
  tituloOriginal: string;
  pais: string | null;
  origem: Origem;
  lancamento: Lancamento | null;
}

export interface ObraResumo {
  codigo: string;
  titulo: string;
  origem: Origem;
  publico: number;
}

export interface PontoCurva {
  data: string;
  publico: number;
  sessoes: number;
  salas: number;
  /** Dia ainda não consolidado na ANCINE (parte das salas não reportou). */
  parcial: boolean;
}

export interface CurvaObra {
  obra: Obra;
  publicoNoPeriodo: number;
  dias: PontoCurva[];
}
