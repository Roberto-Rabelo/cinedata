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

  it('numera a partir da estreia do back e deixa de fora temporadas antigas', () => {
    const dias = [dia('2016-01-07', 900_000), dia('2026-10-01', 2_000), dia('2026-10-08', 225_000), dia('2026-10-15', 150_000)];
    const semanas = semanasEmCartaz(dias, '2026-10-08');
    expect(semanas.map(s => [s.inicio, s.numero])).toEqual([['2026-10-01', 0], ['2026-10-08', 1], ['2026-10-15', 2]]);
  });

  it('não calcula variação contra semana de pré-estreia (menos de 5% do público)', () => {
    const semanas = semanasEmCartaz([dia('2026-10-01', 474), dia('2026-10-08', 579_064), dia('2026-10-15', 797_813)]);
    expect(semanas.map(s => s.variacaoPct)).toEqual([null, null, 37.8]);
  });
});
