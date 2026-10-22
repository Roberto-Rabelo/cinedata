// Espelho dos DTOs de CineData.Application.Consultas (serializados em camelCase pela API).

export type Origem = 'Nacional' | 'Estrangeira' | 'Generica';

export interface Semana {
  inicio: string;
  fim: string;
  diasComDados: number;
  publico: number;
  sessoes: number;
  completa: boolean;
}

export interface ResumoSemana {
  inicio: string;
  fim: string;
  publico: number;
  sessoes: number;
  obras: number;
  salas: number;
  municipios: number;
  publicoMedioPorSessao: number;
  publicoSemanaAnterior: number | null;
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
  publicoSemanaAnterior: number | null;
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

export interface PainelSemana {
  resumo: ResumoSemana;
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
