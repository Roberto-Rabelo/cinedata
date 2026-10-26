import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Uf } from '../../core/api/modelos';
import { NO_ESTADO, ufNaDirecao } from '../../shared/ufs';
import { Mapa } from './mapa';
import { lerMetrica, origemDoCodigo, pintar, rotuloCurto, textoMetrica } from './metricas';

const uf = (sigla: string, publico: number, extra: Partial<Uf> = {}): Uf => ({
  uf: sigla,
  regiao: 'Sudeste',
  publico,
  sessoes: 10,
  publicoMedioPorSessao: publico / 10,
  liderCodigo: 'B2600281500000',
  liderTitulo: 'MINHA MELHOR AMIGA',
  liderPublico: publico / 2,
  dubladoPctEstrangeiros: 80,
  ...extra,
});

describe('Mapa', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [Mapa],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );

  const abrir = (inputs: Record<string, string>) => {
    const fixture = TestBed.createComponent(Mapa);
    for (const [nome, valor] of Object.entries(inputs)) fixture.componentRef.setInput(nome, valor);
    fixture.detectChanges();
    TestBed.tick();
    return TestBed.inject(HttpTestingController)
      .match(() => true)
      .map(r => r.request.urlWithParams)
      .filter(u => !u.includes('/periodos'))
      .sort();
  };

  it('pede o painel do período e, com um estado na URL, a série dele na mesma granularidade', () => {
    expect(abrir({ periodo: 'mes', chave: '2026-09', uf: 'pe' })).toEqual([
      '/api/v1/painel?periodo=mes&data=2026-09-01&top=10',
      '/api/v1/ufs/PE/serie?periodo=mes',
    ]);
  });

  it('ignora sigla que não é estado', () => {
    expect(abrir({ uf: 'XX' })).toEqual(['/api/v1/painel?periodo=semana&top=10']);
  });
});

describe('métricas do mapa', () => {
  it('lê a métrica da URL e volta para público quando não reconhece', () => {
    expect(lerMetrica('dublado')).toBe('dublado');
    expect(lerMetrica('renda')).toBe('publico');
  });

  it('a origem do líder vem do prefixo do código', () => {
    expect(origemDoCodigo('B2600281500000')).toBe('Nacional');
    expect(origemDoCodigo('E2600183000000')).toBe('Estrangeira');
    expect(origemDoCodigo(null)).toBeNull();
  });

  it('pinta em um só tom, do apagado ao âmbar, e escurece o texto só nos tons mais fortes', () => {
    const ufs = [uf('SP', 10_000), uf('AC', 100)];
    const cor = pintar('publico', ufs);
    expect(cor(ufs[0])).toEqual({ cor: 'color-mix(in oklab, var(--cd-dado-ambar) 100.0%, var(--cd-poltrona-2))', clara: true });
    expect(cor(ufs[1]).clara).toBe(false);
    expect(pintar('lider', ufs)(ufs[0]).cor).toContain('--cd-dado-verde');
  });

  it('escreve o valor curto dentro do quadrado', () => {
    expect(textoMetrica('publico', uf('SP', 748_727))).toMatch(/^748,7\smil$/); // Intl separa com espaço inseparável
    expect(textoMetrica('dublado', uf('SP', 1, { dubladoPctEstrangeiros: 78.8 }))).toBe('79%');
    expect(textoMetrica('dublado', uf('SP', 1, { dubladoPctEstrangeiros: null }))).toBe('—');
    expect(textoMetrica('lider', uf('SP', 1))).toBe('nacional');
  });

  it('rotula o eixo da série por granularidade', () => {
    expect(rotuloCurto('semana', '2026-10-08')).toBe('08/10');
    expect(rotuloCurto('mes', '2026-09-01')).toBe('set/26');
    expect(rotuloCurto('trimestre', '2025-07-01')).toBe('3º tri/25');
  });
});

describe('estados', () => {
  it('as setas andam para o estado vizinho na grade', () => {
    expect(ufNaDirecao('MG', 1, 0)).toBe('ES');
    expect(ufNaDirecao('MG', -1, 0)).toBe('DF');
    expect(ufNaDirecao('SP', 0, 1)).toBe('SC');
    expect(ufNaDirecao('RR', 0, -1)).toBeNull();
  });

  it('usa a preposição certa para cada estado', () => {
    expect([NO_ESTADO['SP'], NO_ESTADO['BA'], NO_ESTADO['RJ']]).toEqual(['em São Paulo', 'na Bahia', 'no Rio de Janeiro']);
  });
});
