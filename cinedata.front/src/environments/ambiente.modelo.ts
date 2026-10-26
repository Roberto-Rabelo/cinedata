/** Configuração por modo de build. Fica num arquivo à parte porque `ambiente.ts` é trocado no build `estatico`. */
export interface Ambiente {
  /** `api`: CineData API (desenvolvimento, proxy do ng serve). `estatico`: JSON exportados (site publicado). */
  fonte: 'api' | 'estatico';
  /** Endereço público do site, para og:url, og:image e canonical. Vazio = caminhos relativos. */
  urlSite: string;
}
