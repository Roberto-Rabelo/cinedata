import { Ambiente } from './ambiente.modelo';

/**
 * De onde o front lê os dados. O build `estatico` troca este arquivo por `ambiente.estatico.ts`
 * (fileReplacements no angular.json); o resto do código é o mesmo nos dois modos.
 */
export const ambiente: Ambiente = {
  fonte: 'api',
  urlSite: '',
};
