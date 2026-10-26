const inteiro = new Intl.NumberFormat('pt-BR');
const compacto = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaCompacta = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });
const diaMes = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
const diaMesAno = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
const diaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' });

// Datas da API são DateOnly ("2026-10-08"); tratadas em UTC para não "voltar um dia" no fuso local.
const data = (iso: string) => new Date(`${iso}T00:00:00Z`);

// Títulos da ANCINE vêm em caixa alta ("VINGADORES: ULTIMATO"). Para leitura, caixa de título em português:
// partículas em minúscula, siglas sem vogal (BTS, NBA) e numerais romanos (II, IV) preservados.
const PARTICULAS = new Set([
  'a', 'à', 'ao', 'aos', 'as', 'às', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'na', 'nas', 'no', 'nos',
  'o', 'os', 'ou', 'para', 'pela', 'pelas', 'pelo', 'pelos', 'por', 'sem', 'um', 'uma', 'of', 'the', 'and',
]);
const ROMANO = /^(I{1,3}|IV|V|VI{1,3}|IX|X|XI{1,3})$/;
const SEM_VOGAL = /^[^AEIOUYÁÀÂÃÉÊÍÓÔÕÚ]+$/;
const LETRA = /\p{L}/u;

function palavraLegivel(palavra: string, inicioDeFrase: boolean): string {
  const nucleo = palavra.replace(/[^\p{L}\p{N}'’-]/gu, '');
  if (!LETRA.test(nucleo)) return palavra;
  if (ROMANO.test(nucleo) || SEM_VOGAL.test(nucleo)) return palavra;
  const minuscula = palavra.toLocaleLowerCase('pt-BR');
  if (!inicioDeFrase && PARTICULAS.has(nucleo.toLocaleLowerCase('pt-BR'))) return minuscula;
  // Maiúscula na primeira letra de cada parte: "HOMEM-ARANHA" → "Homem-Aranha".
  return minuscula.replace(/(^|[-(\["“'])(\p{L})/gu, (_, antes: string, letra: string) => antes + letra.toLocaleUpperCase('pt-BR'));
}

/** "VINGADORES: ULTIMATO" → "Vingadores: Ultimato". Texto que já vem com minúsculas fica como está. */
export function tituloLegivel(texto: string): string {
  if (texto !== texto.toLocaleUpperCase('pt-BR')) return texto;
  let inicioDeFrase = true;
  return texto
    .split(/(\s+)/)
    .map(parte => {
      if (/^\s+$/.test(parte) || parte === '') return parte;
      const legivel = palavraLegivel(parte, inicioDeFrase);
      inicioDeFrase = /[:.!?–—-]$/.test(parte) || /^[–—-]$/.test(parte);
      return legivel;
    })
    .join('');
}

export const formatar = {
  inteiro: (n: number) => inteiro.format(n),
  compacto: (n: number) => compacto.format(n),
  decimal: (n: number) => decimal.format(n),
  pct: (n: number) => `${decimal.format(n)}%`,
  variacao: (n: number) => `${n > 0 ? '+' : ''}${decimal.format(n)}%`,
  moeda: (n: number) => moeda.format(n),
  moedaCompacta: (n: number) => moedaCompacta.format(n),
  diaMes: (iso: string) => diaMes.format(data(iso)),
  diaMesAno: (iso: string) => diaMesAno.format(data(iso)),
  diaSemana: (iso: string) => diaSemana.format(data(iso)),
  periodo: (inicio: string, fim: string) => `${diaMes.format(data(inicio))} a ${diaMesAno.format(data(fim))}`,
  titulo: tituloLegivel,
};

export const rotuloOrigem: Record<string, string> = {
  Nacional: 'Nacional',
  Estrangeira: 'Estrangeiro',
  Generica: 'Outros',
};

export const corOrigem: Record<string, string> = {
  Nacional: 'var(--cd-dado-verde)',
  Estrangeira: 'var(--cd-dado-azul)',
  Generica: 'var(--cd-dado-neutro)',
};
