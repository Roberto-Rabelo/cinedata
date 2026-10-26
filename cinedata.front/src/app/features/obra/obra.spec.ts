import { PontoCurva } from '../../core/api/modelos';
import { semanasEmCartaz } from './obra';

const dia = (data: string, publico: number, salas = 10, parcial = false): PontoCurva => ({ data, publico, sessoes: 1, salas, parcial });

describe('semanasEmCartaz', () => {
  it('agrupa a curva diária em semanas de quinta a quarta e calcula a variação', () => {
    const semanas = semanasEmCartaz([
      dia('2026-10-08', 100, 50), // quinta: estreia
      dia('2026-10-14', 100, 60), // quarta: mesma semana
      dia('2026-10-15', 100, 40),
      dia('2026-10-22', 10, 5, true), // semana parcial: sem variação
    ]);

    expect(semanas.map(s => [s.inicio, s.numero, s.publico, s.salas])).toEqual([
      ['2026-10-08', 1, 200, 60],
      ['2026-10-15', 2, 100, 40],
      ['2026-10-22', 3, 10, 5],
    ]);
    expect(semanas.map(s => s.variacaoPct)).toEqual([null, -50, null]);
  });
});
