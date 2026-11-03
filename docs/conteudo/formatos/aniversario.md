# Spec · Aniversário

## Objetivo

Um filme que faz 5, 10 ou 15 anos ("La La Land faz 10 anos"), contado pelo que ele fez nos cinemas do Brasil: a
estreia, as semanas em cartaz, quem viu (legendado ou dublado, onde) e como ele se compara com os rivais da época. É
nostalgia com número, e funciona bem com filmes que voltam às salas no aniversário.

## Gatilhos

"<filme> faz N anos", "aniversário de <filme>", "relançamento de <filme>", e as pautas do levantamento de aniversários
(ver [README](../README.md#pautas)).

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| Filme e data do aniversário | o pedido ou a pauta | não |
| **Qual data conta** (estreia mundial, nos EUA, no Brasil) | 2 fontes + `lancamentos.data_lancamento` | não; as datas vão para o slide da linha do tempo e a escolhida, para a legenda.md |
| Relançamento no aniversário | imprensa (2 fontes) + `sessoes` depois da carreira original | não |
| Comparação da época (indicados ao Oscar, rivais da semana, a franquia) | proposta minha | só se o recorte for discutível |
| Frase do filme | fala (nunca letra de música), conferida em 2 fontes; tradução nossa, com o original | não |
| Imagens | cenas de divulgação do TMDB | não |

## Dados

- Público e renda da carreira original: `lancamentos` (soma das distribuidoras). O consolidado começa em 2009: o
  formato serve para filmes lançados no Brasil a partir de 2009 (aniversários de 5, 10 e 15 anos).
- Semana a semana, posição no ranking, legendado × dublado e cidades: só com bilheteria por sala (`sessoes`,
  `agregado_semana_obra`), ou seja, filmes lançados a partir de 2016. Para os anteriores, o post fica no consolidado e
  na comparação com os rivais (avisar na legenda.md).
- Posição na semana: `rank()` sobre `agregado_semana_obra` da semana.
- Relançamento: `sessoes` do filme depois do fim da carreira original (somado à parte; o consolidado não muda).

## Estrutura (7 slides)

| # | Slot | Conteúdo | Regras |
| --- | --- | --- | --- |
| 1 | Capa | cena icônica, "<filme> faz N anos", o público no Brasil | selo "CineData \| N anos" |
| 2 | Linha do tempo | da estreia mundial até hoje: festival, estreia nos EUA e no Brasil, prêmios, relançamento | datas com 2 fontes |
| 3 | A frase | uma fala do filme (tradução nossa + original), quem diz | nunca letra de música |
| 4 | Nos cinemas do Brasil | público por semana, com os marcos (indicações, Oscar, feriado) | barras de uma cor; destaque só no marco |
| 5 | Quem viu | legendado × dublado, as cidades | número grande + 2 cartões |
| 6 | A comparação | o filme contra os rivais da época, em barras | mesma escala; o filme em âmbar |
| 7 | N anos depois | o relançamento (ou o que o filme deixou) + pergunta | |

## Regras específicas

- Dizer qual data é o aniversário: quase sempre o filme chegou ao Brasil semanas ou meses depois da estreia mundial.
  Se o aniversário brasileiro ainda não chegou, o post pode sair no aniversário mundial ou no relançamento, e isso vai
  para a legenda.md.
- Publicar perto da data (ou do relançamento); a pauta guarda a data do aniversário no Brasil.
- Não comparar público de anos diferentes sem dizer o ano; renda sempre "em valores da época".
- O tom é de celebração, sem saudosismo inventado: o que a gente afirma está no dado ou em 2 fontes.

## Passo a passo

1. Fatos: datas (mundial, EUA, Brasil), prêmios, relançamento, frase. Duas fontes cada; divergências ao usuário.
2. Dados: consolidado, semanas, posição, legendado, cidades, rivais. SQL na legenda.md.
3. Imagens: folha de contato dos backdrops do TMDB (`/3/movie/{id}/images`), escolher 3–4 cenas.
4. Componente `slides-aniversario-<filme>.ts` a partir do exemplo mais recente; rota `marca/aniversario-<filme>`.
5. Exportar, olhar, ajustar; `legenda.md`; matéria `<filme>-faz-N-anos-...md` com trailer (de preferência o do
   relançamento, se houver).
6. Aceite, registro, commit.

## Aceite (além do comum)

- [ ] A data do aniversário está explicada (mundial × Brasil).
- [ ] A frase é fala, não letra de música, e está em 2 fontes.
- [ ] Os números do relançamento estão separados dos da carreira original.

## Exemplos

[aniversario-la-la-land](../../posts/aniversario-la-la-land/legenda.md)
