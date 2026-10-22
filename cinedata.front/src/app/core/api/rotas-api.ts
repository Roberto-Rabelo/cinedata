// URLs da CineData API. Em desenvolvimento o proxy do `ng serve` encaminha /api para o back.
const BASE = '/api/v1';

const consulta = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  for (const [chave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== '') q.set(chave, String(valor));
  }
  const texto = q.toString();
  return texto ? `?${texto}` : '';
};

export const rotasApi = {
  semanas: () => `${BASE}/semanas`,
  painel: (data?: string, top = 10) => `${BASE}/painel${consulta({ data, top })}`,
  buscarObras: (busca: string) => `${BASE}/obras${consulta({ busca })}`,
  curvaObra: (codigo: string) => `${BASE}/obras/${encodeURIComponent(codigo)}/curva`,
};
