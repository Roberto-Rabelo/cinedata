import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ambiente } from '../../environments/ambiente';

export interface DadosSeo {
  /** Título da aba e do cartão de compartilhamento (sem o sufixo da marca). */
  titulo: string;
  descricao: string;
  /** Caminho canônico da página, a partir da raiz: "/semana/2026-10-08". */
  caminho: string;
  /** Imagem de compartilhamento (URL absoluta); sem ela, a imagem da marca. */
  imagem?: string;
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

  definir({ titulo, descricao, caminho, imagem: propria }: DadosSeo) {
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
      ['og:type', 'website'],
      ['og:site_name', 'CineData'],
      ['og:locale', 'pt_BR'],
      ['og:title', tituloCompleto],
      ['og:description', descricao],
      ['og:url', url],
      ['og:image', imagem],
      ['og:image:width', propria ? '780' : '1200'],
      ['og:image:height', propria ? '1170' : '630'],
      ['og:image:alt', propria ? `Pôster: ${titulo}` : 'CineData: o cinema brasileiro em números'],
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
  }
}
