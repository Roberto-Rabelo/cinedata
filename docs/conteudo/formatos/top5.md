# Spec · Top 5 da semana

## Objetivo

Os 5 filmes mais vistos da semana cinematográfica (quinta a quarta) e **o que mudou** em relação à semana anterior.
É o post recorrente que dá ritmo ao perfil.

## Gatilhos

"Top 5", "top 5 da semana", "ranking da semana", "post da semana". Sem data → última semana completa.

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| Semana (quinta de início) | última semana com `periodo.completo = true` em `cinedata.front/dados/semana/` | só se houver dúvida (semana parcial, feriado) |
| Dados atualizados | `scripts/publicar-semana.sh` (sem `--enviar`) se o JSON da semana ainda não existir | aviso que vou rodar a ingestão |
| Vídeos de distribuidora (opcional) | o usuário fornece o arquivo | só se ele quiser slides de vídeo |

## Dados

`cinedata.front/dados/semana/<inicio>.json` e o da semana anterior:

| Uso | Campo |
| --- | --- |
| Top 5 | `ranking[0..4]`: `titulo`, `publico`, `salas`, `origem`, `poster`, `estreia`, `semanasEmCartaz`, `emCartazDesde` |
| Posição anterior | `ranking` do JSON da semana anterior, por `codigoObra` |
| Variação | `variacaoPct` (nula ou ignorada quando é estreia/pré-estreia) |
| Total da semana | `periodo.publico`, `resumo.publicoPeriodoAnterior`, `resumo.variacaoPct`, `resumo.obras` |
| Participação nacional | `origem` (Nacional) das duas semanas |
| Acumulado de um filme | `SELECT sum(publico) FROM sessoes WHERE codigo_obra = '<cpb>' AND data_exibicao <= '<fim>'` |
| Explicar quedas/altas | feriados e datas (ex.: 12/10), `SELECT data_exibicao, sum(publico) … GROUP BY 1` |

## Estrutura (6 slides)

| # | Slot | Conteúdo | Regras |
| --- | --- | --- | --- |
| 1 | Capa: o nº 1 | pôster grande, título, público, frase do fato da semana ("Estreou e tirou X do topo") | a frase é o gancho do post inteiro |
| 2 | A história do topo | a troca de posições, a resistência do nº 1, ou o recorde: o que for a notícia | escolher **uma** história |
| 3 | Ranking | os 5 com pôster, público e posição anterior (▲▼ ou "estreia") | barras na mesma escala; nacional marcado |
| 4 | O que mudou | estreias, quem saiu do Top 5 (de → para, variação), acumulados marcantes | no máx. 4 fatos |
| 5 | A semana em números | público total (▲▼ % e o porquê), fatia do Top 5, participação nacional | explicar variação grande (feriado, estreia forte) |
| 6 | Pergunta | os 5 pôsteres em leque + "Qual desses você viu?" | CTA para comentários |

Variação com vídeos (como em `top5-2026-10-08`): os slides 2 e 4 viram o spot oficial do nº 1 e do nº 2, com
`node scripts/emoldurar-video.mjs <video> <saida.mp4> "nº 1" "<Título>" "<Distribuidora>"`.

## Regras específicas

- Semana só com os 7 dias consolidados. Se a última semana ainda é parcial, usar a anterior e dizer isso ao usuário.
- Pré-estreia: o site pode contar o filme na 2ª semana (`emCartazDesde` anterior); o post trata a semana da estreia no
  circuito (quinta) como estreia e explica na legenda.md.
- Títulos em caixa normal ("Street Fighter", não "STREET FIGHTER"); nacional com 🇧🇷 na legenda.

## Passo a passo

1. Garantir os dados: `ls cinedata.front/dados/semana/` e conferir `periodo.completo`; se faltar, rodar a ingestão e o
   export (ver [publicacao.md](../../publicacao.md)).
2. Copiar o último componente (`slides-top5-<anterior>.ts`) para `slides-top5-<inicio>.ts`, trocar o objeto `semana`
   (números do JSON) e os textos dos slots; registrar a rota `marca/top5-<inicio>`.
3. `ng serve --port 4330` (modo API, para os pôsteres) e exportar para `docs/posts/top5-<inicio>/`.
4. Olhar os 6 PNGs; escrever a `legenda.md` no padrão dos [princípios](../principios.md#legenda-legendamd), com a
   tabela "De onde vem cada número".
5. Aceite, registro, commit.

## Aceite (além do comum)

- [ ] Top 5 bate com `ranking` do JSON; posições anteriores e variações batem com a semana anterior.
- [ ] Toda variação grande explicada (feriado, estreia, pré-estreia).
- [ ] Legenda lista os 5 com público e posição anterior.

## Exemplos

[top5-2026-10-08](../../posts/top5-2026-10-08/legenda.md) (com vídeos) · [top5-2026-10-15](../../posts/top5-2026-10-15/legenda.md) (com pôsteres)
