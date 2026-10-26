import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Painel } from './painel';

describe('Painel', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [Painel],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );

  // Sem whenStable: as requisições pendentes do httpResource segurariam a estabilidade.
  const abrir = (inputs: Record<string, string>) => {
    const fixture = TestBed.createComponent(Painel);
    for (const [nome, valor] of Object.entries(inputs)) fixture.componentRef.setInput(nome, valor);
    fixture.detectChanges();
    TestBed.tick();
    const urls = TestBed.inject(HttpTestingController)
      .match(() => true)
      .map(r => r.request.urlWithParams)
      .sort();
    return { fixture, urls };
  };

  it('na página inicial pede a semana padrão, a lista de semanas e o último mês completo', () => {
    expect(abrir({}).urls).toEqual([
      '/api/v1/painel?periodo=mes&top=10',
      '/api/v1/painel?periodo=semana&top=10',
      '/api/v1/periodos?periodo=semana',
    ]);
  });

  it('continua aceitando granularidade e data na query string das URLs antigas', () => {
    expect(abrir({ periodo: 'trimestre', data: '2025-07-01' }).urls).toEqual([
      '/api/v1/painel?periodo=trimestre&data=2025-07-01&top=10',
      '/api/v1/periodos?periodo=trimestre',
    ]);
  });

  it('converte a chave do caminho (/mes/2026-09) no início do período', () => {
    expect(abrir({ periodo: 'mes', chave: '2026-09' }).urls).toContain('/api/v1/painel?periodo=mes&data=2026-09-01&top=10');
  });

  it('chave que não é da granularidade vira "período não encontrado" sem pedir o painel', () => {
    const { fixture, urls } = abrir({ periodo: 'semana', chave: '2026-t3' });
    expect(urls).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Período não encontrado');
  });
});
