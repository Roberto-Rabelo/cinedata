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
  const urlsPedidas = (params: Record<string, string>) => {
    const fixture = TestBed.createComponent(Painel);
    for (const [nome, valor] of Object.entries(params)) fixture.componentRef.setInput(nome, valor);
    fixture.detectChanges();
    TestBed.tick();
    const http = TestBed.inject(HttpTestingController);
    return http.match(() => true).map(r => r.request.urlWithParams);
  };

  it('sem query params pede a semana padrão, como antes', () => {
    expect(urlsPedidas({})).toEqual(['/api/v1/periodos?periodo=semana', '/api/v1/painel?periodo=semana&top=10']);
  });

  it('repassa granularidade e data da URL para a API', () => {
    expect(urlsPedidas({ periodo: 'trimestre', data: '2025-07-01' })).toEqual([
      '/api/v1/periodos?periodo=trimestre',
      '/api/v1/painel?periodo=trimestre&data=2025-07-01&top=10',
    ]);
  });
});
