import { Periodo } from '../core/api/modelos';
import { lerGranularidade, rotuloOpcao, tituloPeriodo } from './periodo';

const periodo = (p: Partial<Periodo>): Periodo => ({
  granularidade: 'mes',
  inicio: '2026-09-01',
  fim: '2026-09-30',
  rotulo: 'set/2026',
  dias: 30,
  diasConsolidados: 30,
  publico: 0,
  sessoes: 0,
  completo: true,
  ...p,
});

describe('periodo', () => {
  it('lê a granularidade da URL e volta para semana quando não reconhece', () => {
    expect(lerGranularidade('trimestre')).toBe('trimestre');
    expect(lerGranularidade(undefined)).toBe('semana');
    expect(lerGranularidade('mensal')).toBe('semana');
  });

  it('titula cada granularidade em português', () => {
    expect(tituloPeriodo({ granularidade: 'mes', inicio: '2026-10-01', fim: '2026-10-31' })).toBe('outubro de 2026');
    expect(tituloPeriodo({ granularidade: 'trimestre', inicio: '2025-07-01', fim: '2025-09-30' })).toBe('3º trimestre de 2025');
    expect(tituloPeriodo({ granularidade: 'semestre', inicio: '2026-01-01', fim: '2026-06-30' })).toBe('1º semestre de 2026');
    expect(tituloPeriodo({ granularidade: 'ano', inicio: '2025-01-01', fim: '2025-12-31' })).toBe('2025');
  });

  it('usa o rótulo curto da API nas opções e avisa quando o período é parcial', () => {
    expect(rotuloOpcao(periodo({ rotulo: '3º tri 2025', granularidade: 'trimestre' }))).toBe('3º tri 2025');
    expect(rotuloOpcao(periodo({ rotulo: 'out/2026', dias: 31, diasConsolidados: 19, completo: false }))).toBe(
      'out/2026 (parcial, 19 de 31 dias)',
    );
  });
});
