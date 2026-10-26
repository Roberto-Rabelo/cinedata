import { ObraResumo } from '../../core/api/modelos';
import { filtrarObras } from './busca';

const obra = (codigo: string, titulo: string, tituloOriginal: string | null = null): ObraResumo => ({
  codigo,
  titulo,
  tituloOriginal,
  origem: 'Nacional',
  publico: 0,
});

describe('filtrarObras (busca do site estático)', () => {
  const indice = [
    obra('E1', 'VINGADORES: ULTIMATO', 'AVENGERS: ENDGAME'),
    obra('B1', 'AINDA ESTOU AQUI'),
    obra('B2', 'O AUTO DA COMPADECIDA 2'),
  ];

  it('acha pelo título no Brasil ou pelo original, sem diferenciar acento nem caixa', () => {
    expect(filtrarObras(indice, 'endgame').map(o => o.codigo)).toEqual(['E1']);
    expect(filtrarObras(indice, 'estou aqui').map(o => o.codigo)).toEqual(['B1']);
    expect(filtrarObras(indice, 'compadécida').map(o => o.codigo)).toEqual(['B2']);
  });

  it('precisa de ao menos 2 letras, como a API', () => {
    expect(filtrarObras(indice, ' a ')).toEqual([]);
  });
});
