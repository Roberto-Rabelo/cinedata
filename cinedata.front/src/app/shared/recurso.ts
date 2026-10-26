/**
 * Valor de um resource, ou `undefined` enquanto carrega e quando falhou. Ler `value()` de um resource com erro lança
 * exceção, e uma lista auxiliar que falha (períodos do seletor, curva do nº 1) não pode derrubar a página.
 */
export const valorDe = <T>(recurso: { hasValue(): boolean; value(): T }): T | undefined =>
  recurso.hasValue() ? recurso.value() : undefined;
