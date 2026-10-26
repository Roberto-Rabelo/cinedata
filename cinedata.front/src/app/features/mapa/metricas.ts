import { Granularidade, Origem, Uf } from '../../core/api/modelos';
import { corOrigem, formatar } from '../../shared/formatar';

/** O que o mapa pinta. Fica na URL (?ver=dublado) para o link compartilhado abrir igual. */
export type Metrica = 'publico' | 'sessao' | 'dublado' | 'lider';

export const METRICAS: readonly { valor: Metrica; rotulo: string; legenda: string }[] = [
  { valor: 'publico', rotulo: 'Público', legenda: 'espectadores' },
  { valor: 'sessao', rotulo: 'Por sessão', legenda: 'pessoas por sessão, em média' },
  { valor: 'dublado', rotulo: 'Dublados', legenda: '% do público de filmes estrangeiros que escolheu a versão dublada' },
  { valor: 'lider', rotulo: 'Quem venceu', legenda: 'origem do filme mais visto em cada estado' },
];

export const lerMetrica = (valor: string | null | undefined): Metrica => METRICAS.find(m => m.valor === valor)?.valor ?? 'publico';

/** O prefixo do código ANCINE diz a origem: B nacional, E estrangeira, G genérico. */
export const origemDoCodigo = (codigo: string | null): Origem | null =>
  !codigo ? null : codigo[0] === 'B' ? 'Nacional' : codigo[0] === 'E' ? 'Estrangeira' : 'Generica';

export function valorMetrica(metrica: Metrica, uf: Uf): number | null {
  switch (metrica) {
    case 'publico':
      return uf.publico;
    case 'sessao':
      return uf.publicoMedioPorSessao;
    case 'dublado':
      return uf.dubladoPctEstrangeiros;
    case 'lider':
      return null;
  }
}

/** Texto curto dentro do quadrado do estado. */
export function textoMetrica(metrica: Metrica, uf: Uf): string {
  if (metrica === 'lider') {
    const origem = origemDoCodigo(uf.liderCodigo);
    return origem === 'Nacional' ? 'nacional' : origem === 'Estrangeira' ? 'estrang.' : '—';
  }
  const valor = valorMetrica(metrica, uf);
  if (valor === null) return '—';
  return metrica === 'publico' ? formatar.compacto(valor) : metrica === 'sessao' ? formatar.decimal(valor) : `${Math.round(valor)}%`;
}

/** Texto completo da métrica, para a dica e para leitores de tela. */
export function descricaoMetrica(metrica: Metrica, uf: Uf): string {
  switch (metrica) {
    case 'publico':
      return `${formatar.inteiro(uf.publico)} espectadores`;
    case 'sessao':
      return `${formatar.decimal(uf.publicoMedioPorSessao)} pessoas por sessão`;
    case 'dublado':
      return uf.dubladoPctEstrangeiros === null ? 'sem filmes estrangeiros' : `${formatar.pct(uf.dubladoPctEstrangeiros)} dos estrangeiros dublados`;
    case 'lider':
      return uf.liderTitulo ? `mais visto: ${formatar.titulo(uf.liderTitulo)}` : 'sem filme líder';
  }
}

export interface Pintura {
  cor: string;
  /** Fundo claro o bastante para texto escuro. */
  clara: boolean;
}

/**
 * Cor de cada estado. Números: um só tom, do apagado ao âmbar de dado (raiz quadrada no público, porque SP concentra
 * muito; mínimo–máximo nas médias e percentuais). Quem venceu: verde nacional, azul estrangeiro, cinza outros.
 */
export function pintar(metrica: Metrica, ufs: Uf[]): (uf: Uf) => Pintura {
  if (metrica === 'lider') {
    return uf => {
      const origem = origemDoCodigo(uf.liderCodigo);
      return { cor: origem ? `color-mix(in oklab, ${corOrigem[origem]} 82%, var(--cd-poltrona-2))` : 'var(--cd-poltrona)', clara: false };
    };
  }
  const valores = ufs.map(u => valorMetrica(metrica, u)).filter((v): v is number => v !== null);
  const max = Math.max(...valores, 1);
  const min = Math.min(...valores, 0);
  return uf => {
    const v = valorMetrica(metrica, uf);
    if (v === null) return { cor: 'var(--cd-poltrona)', clara: false };
    const t = metrica === 'publico' ? Math.sqrt(v / max) : max > min ? (v - min) / (max - min) : 1;
    const intensidade = 0.08 + 0.92 * t;
    return { cor: `color-mix(in oklab, var(--cd-dado-ambar) ${(intensidade * 100).toFixed(1)}%, var(--cd-poltrona-2))`, clara: intensidade > 0.8 };
  };
}

const mesCurto = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' });

/** Rótulo de eixo: "08/10", "set", "3º tri", "1º sem", "2025" (com o ano quando muda). */
export function rotuloCurto(granularidade: Granularidade, inicio: string): string {
  const [ano, mes] = inicio.split('-').map(Number);
  switch (granularidade) {
    case 'semana':
      return formatar.diaMes(inicio);
    case 'mes':
      return `${mesCurto.format(new Date(`${inicio}T00:00:00Z`)).replace('.', '')}/${String(ano).slice(2)}`;
    case 'trimestre':
      return `${Math.floor((mes - 1) / 3) + 1}º tri/${String(ano).slice(2)}`;
    case 'semestre':
      return `${mes < 7 ? 1 : 2}º sem/${String(ano).slice(2)}`;
    case 'ano':
      return String(ano);
  }
}
