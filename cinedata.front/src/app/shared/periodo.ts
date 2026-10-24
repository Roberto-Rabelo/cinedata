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

/** Título do painel: "08/10 a 14 de out. de 2026", "setembro de 2026", "3º trimestre de 2025", "2025". */
export function tituloPeriodo(p: Pick<Periodo, 'granularidade' | 'inicio' | 'fim'>): string {
  const [ano, mes] = p.inicio.split('-').map(Number);
  switch (p.granularidade) {
    case 'semana':
      return formatar.periodo(p.inicio, p.fim);
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
