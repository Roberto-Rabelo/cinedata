import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ambiente } from '../../environments/ambiente';
import { DadoEstruturado, organizacao } from './dados-estruturados';

export interface DadosSeo {
  /** Título da aba e do cartão de compartilhamento (sem o sufixo da marca). */
  titulo: string;
  descricao: string;
  /** Caminho canônico da página, a partir da raiz: "/semana/2026-10-08". */
  caminho: string;
  /** Imagem de compartilhamento (URL absoluta); sem ela, a imagem da marca. */
  imagem?: string;
  /** og:type: "article" nas matérias; o resto do site é "website". */
  tipo?: 'website' | 'article';
  /** schema.org da página (Dataset, Movie, NewsArticle…); a Organization do CineData entra sempre. */
  estruturado?: DadoEstruturado[];
}

export const FONTE = 'Fonte: ANCINE (dados abertos)';
const IMAGEM = '/og-cinedata.png';

/**
 * Título, descrição, Open Graph e canonical de cada página. No site estático isso vai para o HTML pré-renderizado,
 * que é o que o Instagram, o WhatsApp e os buscadores leem.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly documento = inject(DOCUMENT);

  definir({ titulo, descricao, caminho, imagem: propria, tipo = 'website', estruturado = [] }: DadosSeo) {
    const tituloCompleto = `${titulo} · CineData`;
    const url = ambiente.urlSite + caminho;
    const imagem = propria ?? ambiente.urlSite + IMAGEM;

    this.title.setTitle(tituloCompleto);
    const nomes: [string, string][] = [
      ['description', descricao],
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', tituloCompleto],
      ['twitter:description', descricao],
      ['twitter:image', imagem],
    ];
    const propriedades: [string, string][] = [
      ['og:type', tipo],
      ['og:site_name', 'CineData'],
      ['og:locale', 'pt_BR'],
      ['og:title', tituloCompleto],
      ['og:description', descricao],
      ['og:url', url],
      ['og:image', imagem],
      // Pôster (obra) é vertical 780×1170; a cena de uma matéria, 16:9; sem imagem própria, o cartão da marca.
      ['og:image:width', !propria ? '1200' : tipo === 'article' ? '1280' : '780'],
      ['og:image:height', !propria ? '630' : tipo === 'article' ? '720' : '1170'],
      ['og:image:alt', !propria ? 'CineData: o cinema brasileiro em números' : tipo === 'article' ? titulo : `Pôster: ${titulo}`],
    ];
    for (const [name, content] of nomes) this.meta.updateTag({ name, content });
    for (const [property, content] of propriedades) this.meta.updateTag({ property, content });

    let canonical = this.documento.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.documento.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.documento.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    this.definirDadosEstruturados([organizacao(), ...estruturado]);
  }

  /** Um único <script type="application/ld+json"> por página, trocado a cada navegação. */
  private definirDadosEstruturados(itens: DadoEstruturado[]) {
    let script = this.documento.head.querySelector<HTMLScriptElement>('script#cd-dados-estruturados');
    if (!script) {
      script = this.documento.createElement('script');
      script.id = 'cd-dados-estruturados';
      script.type = 'application/ld+json';
      this.documento.head.appendChild(script);
    }
    // "<" escapado: um título com "</script>" não pode fechar o bloco.
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': itens }).replace(/</g, '\\u003c');
  }
}
