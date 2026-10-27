import { Granularidade, Periodo } from '../core/api/modelos';
import { formatar } from './formatar';

export const granularidades: readonly { valor: Granularidade; rotulo: string }[] = [
  { valor: 'semana', rotulo: 'Semana' },
  { valor: 'mes', rotulo: 'Mês' },
  { valor: 'trimestre', rotulo: 'Trimestre' },
  { valor: 'semestre', rotulo: 'Semestre' },
  { valor: 'ano', rotulo: 'Ano' },
];

/** Query param da URL → granularidade; qualquer valor desconhecido volta para a semana (padrão da API). */
export const lerGranularidade = (valor: string | null | undefined): Granularidade =>
  granularidades.find(g => g.valor === valor)?.valor ?? 'semana';

/** "Top 10 do mês", "público da semana". */
export const doPeriodo: Record<Granularidade, string> = {
  semana: 'da semana',
  mes: 'do mês',
  trimestre: 'do trimestre',
  semestre: 'do semestre',
  ano: 'do ano',
};

/** "Verity liderou a semana". */
export const oPeriodo: Record<Granularidade, string> = {
  semana: 'a semana',
  mes: 'o mês',
  trimestre: 'o trimestre',
  semestre: 'o semestre',
  ano: 'o ano',
};

/** Base da variação: "vs. mês anterior". */
export const periodoAnterior: Record<Granularidade, string> = {
  semana: 'semana anterior',
  mes: 'mês anterior',
  trimestre: 'trimestre anterior',
  semestre: 'semestre anterior',
  ano: 'ano anterior',
};

/** Opção padrão do seletor: o que a API usa sem `data`. */
export const ultimoCompleto: Record<Granularidade, string> = {
  semana: 'Última semana completa',
  mes: 'Último mês completo',
  trimestre: 'Último trimestre completo',
  semestre: 'Último semestre completo',
  ano: 'Último ano completo',
};

export const legendaGranularidade: Record<Granularidade, string> = {
  semana: 'Semana cinematográfica · quinta a quarta',
  mes: 'Mês · por data de exibição',
  trimestre: 'Trimestre · por data de exibição',
  semestre: 'Semestre · por data de exibição',
  ano: 'Ano · por data de exibição',
};

const mesPorExtenso = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const nomeDoMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' });

/** "8 a 14 de outubro de 2026", "30 de outubro a 5 de novembro de 2025", "31 de dezembro de 2026 a 6 de janeiro de 2027". */
export function semanaPorExtenso(inicio: string, fim: string): string {
  const [anoI, mesI, diaI] = inicio.split('-').map(Number);
  const [anoF, mesF, diaF] = fim.split('-').map(Number);
  const mes = (iso: string) => nomeDoMes.format(new Date(`${iso}T00:00:00Z`));
  const final = `${diaF} de ${mes(fim)} de ${anoF}`;
  if (anoI !== anoF) return `${diaI} de ${mes(inicio)} de ${anoI} a ${final}`;
  if (mesI !== mesF) return `${diaI} de ${mes(inicio)} a ${final}`;
  return `${diaI} a ${final}`;
}

/** Título do painel: "8 a 14 de outubro de 2026", "setembro de 2026", "3º trimestre de 2025", "2025". */
export function tituloPeriodo(p: Pick<Periodo, 'granularidade' | 'inicio' | 'fim'>): string {
  const [ano, mes] = p.inicio.split('-').map(Number);
  switch (p.granularidade) {
    case 'semana':
      return semanaPorExtenso(p.inicio, p.fim);
    case 'mes':
      return mesPorExtenso.format(new Date(`${p.inicio}T00:00:00Z`));
    case 'trimestre':
      return `${Math.floor((mes - 1) / 3) + 1}º trimestre de ${ano}`;
    case 'semestre':
      return `${Math.floor((mes - 1) / 6) + 1}º semestre de ${ano}`;
    case 'ano':
      return String(ano);
  }
}

/** Opção do seletor: o rótulo curto da API ("3º tri 2025") e, se faltar dado, quantos dias já fecharam. */
export function rotuloOpcao(p: Periodo): string {
  const rotulo = p.granularidade === 'semana' ? formatar.periodo(p.inicio, p.fim) : p.rotulo;
  return p.completo ? rotulo : `${rotulo} (parcial, ${p.diasConsolidados} de ${p.dias} dias)`;
}

// Datas como DateOnly ("2026-10-08"), calculadas em UTC para não depender do fuso.
const dia = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const doisDigitos = (n: number) => String(n).padStart(2, '0');
const mesesNoPeriodo: Record<Exclude<Granularidade, 'semana'>, number> = { mes: 1, trimestre: 3, semestre: 6, ano: 12 };

/** Início do período que contém a data. Espelha `Periodo.Contendo` do back: a semana cinematográfica começa na quinta. */
export function inicioDoPeriodo(granularidade: Granularidade, data: string): string {
  const d = dia(data);
  const ano = d.getUTCFullYear();
  const mes = d.getUTCMonth();
  switch (granularidade) {
    case 'semana':
      d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() - 4 + 7) % 7));
      return iso(d);
    case 'mes':
      return `${ano}-${doisDigitos(mes + 1)}-01`;
    case 'trimestre':
      return `${ano}-${doisDigitos(mes - (mes % 3) + 1)}-01`;
    case 'semestre':
      return `${ano}-${mes < 6 ? '01' : '07'}-01`;
    case 'ano':
      return `${ano}-01-01`;
  }
}

/**
 * Chave do período na URL e no nome do JSON exportado: "2026-10-08", "2026-10", "2025-t3", "2026-s1", "2025".
 * Espelha `ChavePeriodo` do back (CineData.Application.Exportacao).
 */
export function chavePeriodo(granularidade: Granularidade, data: string): string {
  const inicio = inicioDoPeriodo(granularidade, data);
  const [ano, mes] = inicio.split('-').map(Number);
  switch (granularidade) {
    case 'semana':
      return inicio;
    case 'mes':
      return inicio.slice(0, 7);
    case 'trimestre':
      return `${ano}-t${Math.floor((mes - 1) / 3) + 1}`;
    case 'semestre':
      return `${ano}-s${mes < 7 ? 1 : 2}`;
    case 'ano':
      return String(ano);
  }
}

const formatoChave: Record<Granularidade, RegExp> = {
  semana: /^\d{4}-\d{2}-\d{2}$/,
  mes: /^(\d{4})-(0[1-9]|1[0-2])$/,
  trimestre: /^(\d{4})-t([1-4])$/,
  semestre: /^(\d{4})-s([12])$/,
  ano: /^(\d{4})$/,
};

/** Chave da URL → início do período; `null` quando a chave não é da granularidade (vira "não encontrado"). */
export function inicioDaChave(granularidade: Granularidade, chave: string): string | null {
  const m = formatoChave[granularidade].exec(chave);
  if (!m) return null;
  switch (granularidade) {
    case 'semana': {
      const d = dia(chave);
      return Number.isNaN(d.getTime()) || iso(d) !== chave ? null : inicioDoPeriodo('semana', chave);
    }
    case 'mes':
      return `${m[1]}-${m[2]}-01`;
    case 'trimestre':
      return `${m[1]}-${doisDigitos((Number(m[2]) - 1) * 3 + 1)}-01`;
    case 'semestre':
      return `${m[1]}-${m[2] === '1' ? '01' : '07'}-01`;
    case 'ano':
      return `${m[1]}-01-01`;
  }
}

/** Início do período anterior (−1) ou seguinte (+1). */
export function periodoVizinho(granularidade: Granularidade, inicio: string, passo: 1 | -1): string {
  const d = dia(inicio);
  if (granularidade === 'semana') d.setUTCDate(d.getUTCDate() + 7 * passo);
  else d.setUTCMonth(d.getUTCMonth() + passo * mesesNoPeriodo[granularidade]);
  return iso(d);
}

/** Endereço da página do período: /semana/2026-10-08, /mes/2026-09, /ano/2025; no mapa, /mapa/mes/2026-09. */
export const linkPeriodo = (granularidade: Granularidade, inicio: string, secao: string[] = []) => [
  '/',
  ...secao,
  granularidade,
  chavePeriodo(granularidade, inicio),
];

/** Página padrão da granularidade (último período completo): a semana é a raiz da seção (/ ou /mapa). */
export const linkGranularidade = (granularidade: Granularidade, secao: string[] = []) => [
  '/',
  ...secao,
  ...(granularidade === 'semana' ? [] : [granularidade]),
];

/** "semana anterior", "próximo mês": rótulo dos links de navegação. */
export const vizinhoPorExtenso: Record<Granularidade, [string, string]> = {
  semana: ['Semana anterior', 'Próxima semana'],
  mes: ['Mês anterior', 'Próximo mês'],
  trimestre: ['Trimestre anterior', 'Próximo trimestre'],
  semestre: ['Semestre anterior', 'Próximo semestre'],
  ano: ['Ano anterior', 'Próximo ano'],
};

/**
 * Tempo em cartaz no ranking: na semana, "3ª semana" (na 1ª o selo de estreia já diz tudo); em mês, trimestre,
 * semestre e ano, "em cartaz desde 08/10/26".
 */
export function rotuloEmCartaz(granularidade: Granularidade, item: { emCartazDesde?: string | null; semanasEmCartaz?: number | null }) {
  if (!item.semanasEmCartaz || !item.emCartazDesde) return null;
  if (granularidade === 'semana') return item.semanasEmCartaz > 1 ? `${item.semanasEmCartaz}ª semana` : null;
  return `em cartaz desde ${formatar.dataCurta(item.emCartazDesde)}`;
}
