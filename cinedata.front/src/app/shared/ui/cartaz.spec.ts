import { TestBed } from '@angular/core/testing';
import { Cartaz } from './cartaz';

describe('Cartaz', () => {
  const montar = (inputs: Record<string, unknown>) => {
    const fixture = TestBed.createComponent(Cartaz);
    for (const [nome, valor] of Object.entries(inputs)) fixture.componentRef.setInput(nome, valor);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('mostra o pôster do TMDB no tamanho pedido', () => {
    const el = montar({ poster: '/abc.jpg', titulo: 'Verity', tamanho: 'grande' });
    expect(el.querySelector('img')?.getAttribute('src')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg');
  });

  it('se a imagem não carrega, mostra o cartaz tipográfico', () => {
    const el = montar({ poster: '/sumiu.jpg', titulo: 'Verity' });
    el.querySelector('img')!.dispatchEvent(new Event('error'));
    TestBed.tick();
    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent?.trim()).toBe('V');
  });

  it('sem pôster, faz um cartaz tipográfico com as iniciais', () => {
    const el = montar({ poster: null, titulo: 'Os Exterminadores do Além contra a Loira do Banheiro', origem: 'Nacional' });
    expect(el.querySelector('img')).toBeNull();
    expect(el.textContent?.trim()).toBe('EA'); // palavras curtas (os, do, a) ficam de fora
  });
});
