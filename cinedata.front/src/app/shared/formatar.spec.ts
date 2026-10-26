import { tituloLegivel } from './formatar';

describe('tituloLegivel', () => {
  it('passa a caixa alta da ANCINE para caixa de título em português', () => {
    expect(tituloLegivel('VINGADORES: ULTIMATO')).toBe('Vingadores: Ultimato');
    expect(tituloLegivel('O AGENTE SECRETO')).toBe('O Agente Secreto');
    expect(tituloLegivel('HARRY POTTER E A PEDRA FILOSOFAL')).toBe('Harry Potter e a Pedra Filosofal');
    expect(tituloLegivel('HOMEM-ARANHA: SEM VOLTA PARA CASA')).toBe('Homem-Aranha: Sem Volta para Casa');
    expect(tituloLegivel('DIVERTIDA MENTE 2')).toBe('Divertida Mente 2');
  });

  it('preserva numerais romanos, siglas sem vogal e textos que já têm minúsculas', () => {
    expect(tituloLegivel('ROCKY II')).toBe('Rocky II');
    expect(tituloLegivel('BTS: YET TO COME')).toBe('BTS: Yet To Come');
    expect(tituloLegivel('Ainda Estou Aqui')).toBe('Ainda Estou Aqui');
  });
});
