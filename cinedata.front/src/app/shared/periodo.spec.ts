import { Periodo } from '../core/api/modelos';
import {
  chavePeriodo,
  inicioDaChave,
  inicioDoPeriodo,
  lerGranularidade,
  periodoVizinho,
  rotuloOpcao,
  semanaPorExtenso,
  tituloPeriodo,
} from './periodo';

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
    expect(tituloPeriodo({ granularidade: 'semana', inicio: '2026-10-08', fim: '2026-10-14' })).toBe('8 a 14 de outubro de 2026');
    expect(tituloPeriodo({ granularidade: 'mes', inicio: '2026-10-01', fim: '2026-10-31' })).toBe('outubro de 2026');
    expect(tituloPeriodo({ granularidade: 'trimestre', inicio: '2025-07-01', fim: '2025-09-30' })).toBe('3º trimestre de 2025');
    expect(tituloPeriodo({ granularidade: 'semestre', inicio: '2026-01-01', fim: '2026-06-30' })).toBe('1º semestre de 2026');
    expect(tituloPeriodo({ granularidade: 'ano', inicio: '2025-01-01', fim: '2025-12-31' })).toBe('2025');
  });

  it('escreve por extenso semanas que atravessam mês e ano', () => {
    expect(semanaPorExtenso('2025-10-30', '2025-11-05')).toBe('30 de outubro a 5 de novembro de 2025');
    expect(semanaPorExtenso('2026-12-31', '2027-01-06')).toBe('31 de dezembro de 2026 a 6 de janeiro de 2027');
  });

  it('usa o rótulo curto da API nas opções e avisa quando o período é parcial', () => {
    expect(rotuloOpcao(periodo({ rotulo: '3º tri 2025', granularidade: 'trimestre' }))).toBe('3º tri 2025');
    expect(rotuloOpcao(periodo({ rotulo: 'out/2026', dias: 31, diasConsolidados: 19, completo: false }))).toBe(
      'out/2026 (parcial, 19 de 31 dias)',
    );
  });

  // Os mesmos casos de ExportarSiteTests (back): nome do JSON e URL precisam bater.
  it('gera a mesma chave de período que o export do back', () => {
    expect(chavePeriodo('semana', '2026-10-12')).toBe('2026-10-08');
    expect(chavePeriodo('mes', '2026-09-15')).toBe('2026-09');
    expect(chavePeriodo('trimestre', '2025-08-20')).toBe('2025-t3');
    expect(chavePeriodo('semestre', '2026-03-01')).toBe('2026-s1');
    expect(chavePeriodo('ano', '2025-12-31')).toBe('2025');
  });

  it('a semana cinematográfica começa na quinta', () => {
    expect(inicioDoPeriodo('semana', '2026-10-08')).toBe('2026-10-08'); // quinta
    expect(inicioDoPeriodo('semana', '2026-10-14')).toBe('2026-10-08'); // quarta
    expect(inicioDoPeriodo('semana', '2026-01-01')).toBe('2026-01-01');
    expect(inicioDoPeriodo('semestre', '2026-07-01')).toBe('2026-07-01');
  });

  it('converte a chave da URL de volta no início e recusa o que não é da granularidade', () => {
    expect(inicioDaChave('semana', '2026-10-08')).toBe('2026-10-08');
    expect(inicioDaChave('semana', '2026-10-10')).toBe('2026-10-08');
    expect(inicioDaChave('mes', '2026-09')).toBe('2026-09-01');
    expect(inicioDaChave('trimestre', '2025-t3')).toBe('2025-07-01');
    expect(inicioDaChave('semestre', '2026-s2')).toBe('2026-07-01');
    expect(inicioDaChave('ano', '2025')).toBe('2025-01-01');
    expect(inicioDaChave('semana', '2026-02-30')).toBeNull();
    expect(inicioDaChave('mes', '2026-13')).toBeNull();
    expect(inicioDaChave('trimestre', '2025-3')).toBeNull();
  });

  it('anda um período para trás e para frente', () => {
    expect(periodoVizinho('semana', '2026-10-08', -1)).toBe('2026-10-01');
    expect(periodoVizinho('mes', '2026-01-01', -1)).toBe('2025-12-01');
    expect(periodoVizinho('trimestre', '2025-10-01', 1)).toBe('2026-01-01');
    expect(periodoVizinho('ano', '2025-01-01', 1)).toBe('2026-01-01');
  });
});
