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
