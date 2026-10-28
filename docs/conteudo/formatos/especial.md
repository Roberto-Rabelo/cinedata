# Spec · Post especial

## Objetivo

Uma lista ou recorte temático com o histórico da ANCINE ("os 10 terrores mais vistos desde 2016"), ligado a uma data
do calendário ou a um tema forte. É o formato mais compartilhável e o que melhor vira Reels.

## Gatilhos

"Especial", "post especial de <data/tema>", "top 10 de <gênero/tema>", "os mais vistos de <recorte>".

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| Tema e data de publicação | o pedido | sim, se não houver data |
| **Critério do recorte** (gênero, período, nacional/estrangeiro, quantos itens) | proposta minha | **sim, sempre confirmo** antes de produzir |
| Gênero de cada filme | TMDB (`genres` do filme); `lancamentos.tipo_obra` só separa ficção/animação/documentário | não; casos de fronteira vão para a legenda.md |
| Imagens | uma cena de divulgação por item (TMDB, 4K quando houver) | não |

## Dados

- Público e renda da carreira: `lancamentos` (soma das distribuidoras por `codigo_obra`), lançados a partir de 2016.
- Ano: `min(data_lancamento)`.
- Fatos da lista ("5 de 10 são do universo X", "9 de 10 da mesma distribuidora", "o maior nacional") saem de
  agregações sobre os itens.
- Os dados ficam num JSON `cinedata.front/src/app/features/marca/<slug>.json`, lido pelo carrossel **e** pelo Reels.

## Estrutura (8–12 slides)

| # | Slot | Conteúdo | Regras |
| --- | --- | --- | --- |
| 1 | Capa | foto do nº 1 ou do tema, título da lista, o total somado ("34,2 milhões de espectadores") | CTA de arraste com o tom do tema |
| 2…N+1 | Um item por slide | foto, posição, título, ano, público, renda, barra contra o nº 1 | mesma escala em todos; contagem de 1 a N (ou regressiva) |
| último | O que a lista revela | 2–3 fatos em cartões + pergunta | fatos que só aparecem olhando a lista inteira |

Lista longa (mais de 10) ou itens sem foto boa: usar um slide de ranking compacto no lugar de um slide por item.

## Regras específicas

- O critério vai escrito na legenda.md (o que entrou, o que ficou de fora e por quê).
- Renda sempre "em valores da época".
- Recorte de período ("o semestre", "o ano"): dizer se é **lançado no período** (carreira inteira, `lancamentos`) ou
  **visto no período** (soma de `sessoes`); as listas mudam bastante. A alternativa descartada vai para a legenda.md.
- Data de calendário: publicar 1–2 dias antes (ex.: Halloween na quinta ou sexta antes de 31/10, 18h–19h).
- Se o especial tiver Reels, produzir o carrossel primeiro e o vídeo a partir do mesmo JSON
  ([reels-especial.md](reels-especial.md)).

## Passo a passo

1. Propor o critério ao usuário; com o ok, montar a consulta e o JSON.
2. Escolher as imagens (ver cada uma; anotar `posicao4x5`, o recorte 4:5 de cada foto).
3. Criar `slides-<slug>.ts` a partir de `slides-halloween.ts`; rota `marca/<slug>`.
4. Exportar, olhar, ajustar; `legenda.md` com critério, SQL e lista completa.
   Matéria `<slug>.md`: a lista em tabela com links para as obras, "o que a lista revela" e o critério.
5. Aceite, registro, commit. Se houver Reels, seguir a spec dele.

## Aceite (além do comum)

- [ ] Critério confirmado com o usuário e escrito na legenda.md.
- [ ] Soma da capa = soma dos itens.
- [ ] Casos de fronteira (gênero ambíguo, relançamento) decididos e anotados.

## Exemplos

[halloween-terror-top10](../../posts/halloween-terror-top10/legenda.md) · [semestre-2026-top10](../../posts/semestre-2026-top10/legenda.md)
