import { ambiente } from '../../../environments/ambiente';
import { chavePeriodo } from '../../shared/periodo';
import { Granularidade } from './modelos';

/** URLs de onde cada tela lê os dados. Os componentes não sabem se é a API ou o site estático. */
export interface RotasDados {
  periodos(periodo: Granularidade): string;
  painel(periodo?: Granularidade, data?: string, top?: number): string;
  buscarObras(busca: string): string;
  curvaObra(codigo: string): string;
  /** Índice do export (data dos dados, limites e período padrão); a API não tem. */
  indice(): string | undefined;
  /** A busca devolve todas as obras do site e o front filtra (no estático não há quem filtre). */
  buscaLocal: boolean;
}

const consulta = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  for (const [chave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== '') q.set(chave, String(valor));
  }
  const texto = q.toString();
  return texto ? `?${texto}` : '';
};

// CineData API. Em desenvolvimento o proxy do `ng serve` encaminha /api para o back.
const API = '/api/v1';

export const rotasDaApi: RotasDados = {
  periodos: periodo => `${API}/periodos${consulta({ periodo })}`,
  painel: (periodo, data, top = 10) => `${API}/painel${consulta({ periodo, data, top })}`,
  buscarObras: busca => `${API}/obras${consulta({ busca })}`,
  curvaObra: codigo => `${API}/obras/${encodeURIComponent(codigo)}/curva`,
  indice: () => undefined,
  buscaLocal: false,
};

// JSON do `exportar` da CLI (docs/publicacao.md). Caminho relativo: funciona sob qualquer base href.
// O export tem só o top 10, o mesmo padrão da API.
const DADOS = 'dados';

export const rotasEstaticas: RotasDados = {
  periodos: periodo => `${DADOS}/${periodo}/periodos.json`,
  painel: (periodo = 'semana', data) => `${DADOS}/${periodo}/${data ? chavePeriodo(periodo, data) : 'padrao'}.json`,
  buscarObras: () => `${DADOS}/busca.json`,
  curvaObra: codigo => `${DADOS}/obras/${encodeURIComponent(codigo)}.json`,
  indice: () => `${DADOS}/indice.json`,
  buscaLocal: true,
};

export const rotasApi: RotasDados = ambiente.fonte === 'estatico' ? rotasEstaticas : rotasDaApi;
