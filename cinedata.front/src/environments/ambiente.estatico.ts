import { Ambiente } from './ambiente.modelo';

export const ambiente: Ambiente = {
  fonte: 'estatico',
  // Trocado pelo endereço real em scripts/pos-build-estatico.mjs (variável URL_SITE), depois do prerender.
  urlSite: '%URL_SITE%',
  posteres: 'posteres/',
};
