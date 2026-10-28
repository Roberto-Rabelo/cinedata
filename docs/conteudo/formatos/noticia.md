# Spec · CineData | Notícia

## Objetivo

Um fato do dia (estreia relevante, Oscar, recorde, festival, reabertura de cinema) **com o contexto que só os dados da
ANCINE dão**. A notícia em si qualquer portal dá; o nosso diferencial é o slide de dados e a régua histórica.

## Gatilhos

"Notícia", "CineData | Notícia", "post sobre <filme/fato>", "saiu <fato>, faz um post".

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| O fato e o ângulo | o pedido | sim, se o ângulo não estiver claro |
| Datas, prêmios, elenco, distribuidora | imprensa + fonte oficial (2 fontes) | **sempre** aviso se o que ele disse diverge das fontes |
| Código da obra | `SELECT codigo, titulo_original FROM obras WHERE titulo_original ILIKE '%<título>%'` | não |
| Imagens | TMDB (`search/movie`, `movie/{id}/images`) | não |

## Dados (o que procurar)

1. **O filme já está na base?** Festivais, sessões especiais e pré-estreias aparecem antes da estreia:
   `SELECT data_exibicao, sum(publico), count(*), string_agg(DISTINCT municipio||'/'||uf, ', ') FROM sessoes JOIN salas … WHERE codigo_obra = …`.
   Ocupação = `sum(publico) / sum(assentos)`; comparar com a média do país no mesmo mês.
2. **A régua**: os casos comparáveis (mesma categoria, mesmo diretor, mesmo gênero, mesma época do ano), com público
   total (`lancamentos`) e semana de estreia (primeira semana com ≥ 50% do pico de salas).
3. **O número que resume a régua** (ex.: "os 2 últimos viraram fenômeno; os 8 anteriores somaram 814,6 mil").

## Estrutura (5–7 slides)

| # | Slot | Conteúdo | Regras |
| --- | --- | --- | --- |
| 1 | Capa | foto de divulgação, selo **CineData \| Notícia**, manchete curta com o fato, a data | manchete ≤ 6 palavras |
| 2 | O fato / o filme | sinopse em 1 frase, ficha (direção, elenco, distribuição) | sinopse fiel à fonte |
| 3 | Contexto externo (opcional) | prêmios, recordes, trajetória | só o que foi conferido em 2 fontes |
| 4 | O que os dados já mostram | o número da ANCINE (sessões antes da estreia, ocupação, público até agora) | número grande + comparação com a média |
| 5 | A régua | histórico dos comparáveis em barras, com a frase-resumo | mesma escala; destacar os relevantes |
| 6 | A régua da estreia (opcional) | 1–2 casos com pré-estreia/estreia em números | o caso mais parecido primeiro |
| 7 | O que vamos acompanhar | as métricas que vamos publicar + agenda de datas | fecha com pergunta e @cinedata.br |

Selo: `<span class="selo">CineData <i>|</i> Notícia</span>` (ver `slides-noticia-feito-pipa.ts`).

## Regras específicas

- Notícia é **datada**: publicar no dia ou véspera do fato; a legenda.md diz até quando publicar.
- Toda Notícia que promete acompanhamento gera uma pauta "Acompanhamento" na [cartela](../README.md#pautas).
- Não especular resultado (Oscar, bilheteria futura): "o que esperar" é sempre a régua do passado.

## Passo a passo

1. Pesquisar o fato (2 fontes, abrir as páginas); listar divergências e avisar o usuário antes de seguir.
2. Levantar os dados (itens 1–3 acima); escolher o número de capa do slide de dados.
3. Escolher imagens no TMDB (baixar em w780 para ver, usar w1280 no slide).
4. Criar `slides-noticia-<assunto>.ts` a partir de `slides-noticia-feito-pipa.ts`; rota `marca/noticia-<assunto>`.
5. Exportar, olhar cada PNG, ajustar; escrever `legenda.md` com "Fatos de fora da ANCINE".
   Matéria `<slug>.md`: o fato, o contexto e a régua em tabela, com o trailer do filme e as fontes.
6. Incluir as pautas de acompanhamento na cartela; aceite, registro, commit.

## Aceite (além do comum)

- [ ] Toda data e prêmio com 2 fontes e link na legenda.md.
- [ ] Pelo menos um número que só a ANCINE tem.
- [ ] Pautas de acompanhamento registradas, se o post prometer.

## Exemplos

[noticia-feito-pipa](../../posts/noticia-feito-pipa/legenda.md)
