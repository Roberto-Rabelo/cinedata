# ADR 0005 — Períodos de calendário (mês, trimestre, semestre, ano)

**Status:** aceita · 2026-10-23

**Contexto.** O painel só tinha a semana cinematográfica (quinta a quarta). Para conteúdo ("o filme mais visto do
semestre", "o ano do cinema nacional") precisamos de mês, trimestre, semestre e ano. Três problemas:

1. A semana não cabe no mês: a de 30/10/2025 vai até 05/11. Somar semanas daria meses de 28 ou 35 dias.
2. Salas, municípios e obras distintos **não somam**: uma sala que exibe nas 4 semanas do mês contaria 4 vezes. O
   mesmo vale para "em quantas salas o filme passou" no ranking.
3. Pela regra da semana (ADR 0004), um período só é completo com todos os dias consolidados. Natal, Ano-Novo e a
   pandemia têm dias parciais de verdade (salas fechadas), então nenhum dezembro e nenhum ano seriam completos.

**Decisão.**

- `Periodo` (domínio) tem granularidade `Semana | Mes | Trimestre | Semestre | Ano` e início/fim. A semana continua
  sendo a cinematográfica; os demais são o calendário civil, **recortado pela data de exibição**. O anterior é o
  período equivalente imediatamente antes (mês anterior, trimestre anterior…), base da variação e da marca de estreia.
- Novos agregados `agregado_calendario`, `agregado_calendario_obra` e `agregado_calendario_uf`, chaveados por
  `(granularidade, inicio)`, mantidos por `atualizar_agregados_calendario(inicio, fim)`. A função recalcula **anos
  inteiros**: uma passada em `sessoes` monta uma base temporária mês × obra × sala (~40 mil linhas por mês), e dela
  saem os quatro recortes com `count(DISTINCT)` exato. Público, sessões, assentos e público dublado/original somam;
  salas, obras, municípios e o filme líder por UF são recontados.
- `atualizar_agregados_bilheteria` (chamada pela ingestão e pelo cadastro de salas) passou a chamar as duas funções; a
  antiga foi renomeada para `atualizar_agregados_semana`. Quem já chamava a função não mudou.
- Views `agregado_periodo`, `agregado_periodo_obra` e `agregado_periodo_uf` juntam semana e calendário com a mesma
  forma (`UNION ALL`). O SQL de leitura é um só para as cinco granularidades; o filtro por granularidade descarta o
  outro ramo no plano.
- **Período de calendário completo** = a série publicada cobre o período inteiro (o primeiro dia com dados não é
  posterior ao início) **e** o fim não passa do último dia consolidado. Dias parciais no meio do período não o tornam
  parcial: são fechamentos reais, e a contagem (`diasConsolidados` de `dias`) fica na resposta. A semana mantém a
  regra dos 7 dias consolidados. Sem `data`, a API usa o último período completo da granularidade.

**Alternativas descartadas.**
- *Somar `agregado_semana_*`*: errado nas bordas do mês e nas contagens distintas.
- *Agregar `agregado_dia` em tempo de consulta*: resolve público e sessões, mas não salas, obras e municípios distintos.
- *Consultar `sessoes` direto*: um ano tem ~4,4 mi de sessões (2,3 s só para agrupar); o painel precisa de ms.
- *Guardar a base mês × obra × sala*: tornaria a ingestão incremental mais barata (só o mês tocado), mas são ~6 mi de
  linhas e ~400 MB para economizar ~5 s por carga semanal.

**Consequências.**
- Uma carga incremental recalcula o ano inteiro do período tocado: +5,9 s por carga semanal (13,6 s quando cruza a
  virada do ano). O recálculo do histórico inteiro (cadastro de salas) ganha ~75 s.
- `agregado_calendario*` tem 224 períodos, 57 mil linhas de obra e 5 mil de UF (~9 MB).
- "Estreia" num mês ou ano significa "sem sessões no período anterior": o filme que estreou em 28/08 não é estreia
  em setembro.
- Período parcial tem variação enganosa (outubro com 19 de 31 dias cai 55%); o front oculta a variação nesse caso.
- Anos antes de 2016-08 aparecem na lista, mas não são representativos (achado 9 de `docs/dados-ancine.md`).
