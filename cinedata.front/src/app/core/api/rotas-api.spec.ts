import { rotasDaApi, rotasEstaticas } from './rotas-api';

describe('rotas de dados', () => {
  it('no site estático cada tela lê um JSON do export, pelo mesmo nome que o back grava', () => {
    expect(rotasEstaticas.painel('semana', '2026-10-08')).toBe('dados/semana/2026-10-08.json');
    expect(rotasEstaticas.painel('trimestre', '2025-07-01')).toBe('dados/trimestre/2025-t3.json');
    expect(rotasEstaticas.painel('mes')).toBe('dados/mes/padrao.json');
    expect(rotasEstaticas.periodos('ano')).toBe('dados/ano/periodos.json');
    expect(rotasEstaticas.curvaObra('E2600183000000')).toBe('dados/obras/E2600183000000.json');
    expect(rotasEstaticas.buscarObras('verity')).toBe('dados/busca.json');
    expect(rotasEstaticas.indice()).toBe('dados/indice.json');
    expect(rotasEstaticas.serieUf('SP', 'mes')).toBe('dados/ufs/SP/mes.json');
  });

  it('em desenvolvimento continua na API', () => {
    expect(rotasDaApi.painel('mes', '2026-09-01')).toBe('/api/v1/painel?periodo=mes&data=2026-09-01&top=10');
    expect(rotasDaApi.buscarObras('ainda estou')).toBe('/api/v1/obras?busca=ainda+estou');
    expect(rotasDaApi.indice()).toBeUndefined();
    expect(rotasDaApi.serieUf('SP', 'mes')).toBe('/api/v1/ufs/SP/serie?periodo=mes');
  });
});
