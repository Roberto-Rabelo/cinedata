/** Cartograma em grade: cada UF ocupa um quadrado na posição aproximada do mapa (coluna, linha), 6 × 8. */
export const GRADE: Record<string, [number, number]> = {
  RR: [2, 1], AP: [4, 1],
  AM: [2, 2], PA: [3, 2], MA: [4, 2], CE: [5, 2], RN: [6, 2],
  AC: [1, 3], RO: [2, 3], TO: [3, 3], PI: [4, 3], PE: [5, 3], PB: [6, 3],
  MT: [2, 4], GO: [3, 4], BA: [4, 4], SE: [5, 4], AL: [6, 4],
  MS: [2, 5], DF: [3, 5], MG: [4, 5], ES: [5, 5],
  PR: [2, 6], SP: [3, 6], RJ: [4, 6],
  SC: [2, 7],
  RS: [2, 8],
};

export const NOME_UF: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso',
  PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', PR: 'Paraná', RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul', SC: 'Santa Catarina',
  SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins',
};

/** "em São Paulo", "na Bahia", "no Rio de Janeiro". */
export const NO_ESTADO: Record<string, string> = Object.fromEntries(
  Object.entries(NOME_UF).map(([uf, nome]) => {
    const artigo = ['BA', 'PB'].includes(uf)
      ? 'na'
      : ['AC', 'AP', 'AM', 'CE', 'DF', 'ES', 'MA', 'MT', 'MS', 'PA', 'PR', 'PI', 'RJ', 'RN', 'RS', 'TO'].includes(uf)
        ? 'no'
        : 'em';
    return [uf, `${artigo} ${nome}`];
  }),
);

/** A API manda a região como no enum do domínio ("CentroOeste"). */
export const NOME_REGIAO: Record<string, string> = {
  Norte: 'Norte',
  Nordeste: 'Nordeste',
  CentroOeste: 'Centro-Oeste',
  Sudeste: 'Sudeste',
  Sul: 'Sul',
};

export const REGIOES = ['Norte', 'Nordeste', 'CentroOeste', 'Sudeste', 'Sul'] as const;

/** UF vizinha na grade, na direção da seta: a mais próxima naquela direção (foco por teclado no mapa). */
export function ufNaDirecao(atual: string, dx: number, dy: number): string | null {
  const [x, y] = GRADE[atual] ?? [0, 0];
  let melhor: string | null = null;
  let menor = Infinity;
  for (const [uf, [ux, uy]] of Object.entries(GRADE)) {
    const ax = (ux - x) * dx, ay = (uy - y) * dy;
    // Só quem está à frente na direção pedida; desvio lateral pesa mais que a distância.
    const frente = dx ? ax : ay;
    const lado = dx ? Math.abs(uy - y) : Math.abs(ux - x);
    if (frente <= 0) continue;
    const custo = frente + lado * 2.5;
    if (custo < menor) [melhor, menor] = [uf, custo];
  }
  return melhor;
}
