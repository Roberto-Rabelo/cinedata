# Cartela de conteúdo do CineData

Mídia orientada por spec (SDD): cada formato de post tem uma spec com entradas, estrutura, fontes de dados, passo a
passo e critérios de aceite. Um pedido ("faz o Top 5 da semana") vira: **cartela → spec do formato → briefing →
produção → aceite → registro**. Formato novo entra primeiro aqui, como spec, e só depois vira post.

Cada post tem duas peças: o **carrossel/vídeo** do Instagram e a **matéria** no site (`/materias/<slug>`), que o Google
indexa e para onde o post leva o leitor ([princípios](principios.md#matéria-a-versão-do-post-no-site)).

## Formatos

| Formato | Para quê | Quando | Peça | Spec | Último exemplo |
| --- | --- | --- | --- | --- | --- |
| **Top 5** | o ranking da semana, com o que mudou | toda semana, depois da atualização da ANCINE | carrossel 6 slides | [top5.md](formatos/top5.md) | [top5-2026-10-15](../posts/top5-2026-10-15/legenda.md) |
| **Notícia** | um fato do dia com o contexto que só os dados dão | quando acontece (estreia relevante, Oscar, recorde, festival) | carrossel 5–7 slides | [noticia.md](formatos/noticia.md) | [noticia-feito-pipa](../posts/noticia-feito-pipa/legenda.md) |
| **Post especial** | uma lista ou recorte temático, atemporal ou de data | datas do calendário e temas fortes | carrossel 8–12 slides | [especial.md](formatos/especial.md) | [halloween-terror-top10](../posts/halloween-terror-top10/legenda.md) |
| **Reels especial** | a versão em vídeo de um especial (ou da marca) | junto com um especial, ou campanha | vídeo 9:16, 25–45 s | [reels-especial.md](formatos/reels-especial.md) | [halloween reels](../posts/halloween-terror-top10/legenda.md#reels-vídeo) |

Regras comuns a todos (voz, dados, checagem, legenda, pipeline, aceite): [principios.md](principios.md).
Tudo o que já foi produzido: [registro.md](registro.md).

### Formatos propostos (ainda sem spec)

Viram spec quando forem pedidos pela segunda vez ou quando a gente decidir torná-los recorrentes.

| Formato | Ideia | Exemplos existentes |
| --- | --- | --- |
| Institucional | apresentar a marca e o método | [apresentacao](../posts/apresentacao/legenda.md), [como-medimos](../posts/como-medimos/legenda.md), [reels-plataforma-v2](../posts/reels-plataforma-v2/legenda.md) |
| Acompanhamento ("semana N") | seguir um filme semana a semana depois de uma Notícia | — (primeiro: Feito Pipa · semana 1) |
| Mapa do mês | o filme mais visto em cada estado no mês | — |

## Como pedir

Basta dizer o formato e o assunto; o resto sai da spec. Exemplos:

- "Top 5 da semana" → usa a última semana completa.
- "Notícia: os indicados ao Oscar saíram" → pesquisa o fato, cruza com os dados.
- "Especial de Natal: os filmes de família mais vistos" → define o critério e confirma com você antes de produzir.
- "Reels do especial de Natal" → reaproveita os dados do carrossel.

Se o pedido não couber em nenhum formato, a proposta é criar a spec primeiro (ou registrar em "Formatos propostos").

## Pautas

Ideias com data. Ao produzir, a pauta sai daqui e vai para o [registro](registro.md).

| Quando | Formato | Pauta | Gancho |
| --- | --- | --- | --- |
| toda semana | Top 5 | Top 5 da semana seguinte | atualização semanal da ANCINE |
| após a semana de 29/10 a 04/11 | Acompanhamento | Feito Pipa · semana 1: pré-estreias | prometido no post de 27/10; régua: O Agente Secreto fez 54,9 mil nas pré-estreias |
| após 05/11 | Acompanhamento | Feito Pipa · semana de estreia | régua: 381 mil (O Agente Secreto) e 579 mil (Ainda Estou Aqui) |
| dezembro | Notícia | pré-lista (shortlist) do Oscar de Filme Internacional | Feito Pipa está ou não está |
| fim de dezembro | Post especial | os filmes mais vistos de 2026 | retrospectiva do ano |
| 21/01/2027 | Notícia | indicados ao Oscar 2027 | Feito Pipa |
| 14/03/2027 | Notícia | resultado do Oscar 2027 | Feito Pipa |

## Melhorias do processo

| Quando | Ideia |
| --- | --- |
| com volume (~20+ posts) | puxar os insights do Instagram por API (conta Profissional + Página do Facebook + app na Meta), em vez de copiar à mão |
| depois da indexação | ver no Search Console quais buscas trazem gente e transformar as melhores em pautas |

## Como incluir um formato novo

1. Copie a estrutura de uma spec existente para `formatos/<nome>.md` (seções: objetivo, gatilhos, entradas, dados,
   estrutura, regras, passo a passo, aceite, exemplos).
2. Acrescente a linha na tabela **Formatos** acima e tire de "Formatos propostos", se estava lá.
3. Se o formato precisar de componente novo, siga o padrão de `cinedata.front/src/app/features/marca/` (rota em
   `/marca/<slug>`).
