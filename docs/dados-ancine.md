# Dados da ANCINE: formato e achados

Inspecionado em 21–22/10/2026 sobre a publicação de 19/10/2026.

## Fontes usadas no MVP

| Conjunto | Arquivo | Tamanho | Atualização |
| --- | --- | --- | --- |
| Bilheteria diária por exibidoras | `bilheteria-diaria-obras-por-exibidoras-csv.zip` | 1,21 GB (8,8 GB descompactado, 660 CSVs) | semanal |
| Lançamentos comerciais | `lancamentos-comerciais-por-distribuidoras.csv` | 1 MB | mensal |
| Salas de exibição e complexos | `salas-de-exibicao-e-complexos.csv` | 2,2 MB | mensal |

Base: `https://dados.ancine.gov.br/dados-abertos/`. CSV com `;`, UTF-8, datas `dd/MM/yyyy`, moeda `R$ 65.671,62`.

## Achados que viraram regra no código

1. **O ZIP é acumulado, não incremental.** Toda semana o arquivo inteiro é regerado com o histórico desde 2014.
   → `ZipRemoto` lê só o diretório central (HTTP Range) e a ingestão baixa apenas os CSVs cujo CRC32 mudou.
2. **Cada CSV interno é uma semana cinematográfica** (quinta a quarta), sufixo `AAAA-MM-sNN`.
   → `SemanaCinematografica` no domínio.
3. **Os últimos dias publicados chegam incompletos.** Ex.: 18/10 tinha 209 salas reportando contra ~3.200 normais;
   15 a 17/10 tinham ~85%. → Um dia só é *consolidado* com ≥ 90% da mediana diária de salas. Semanas sem 7 dias
   consolidados são "parciais" e a curva desenha esses dias tracejados.
4. **Pré-estreias distorcem a variação semanal** (+362.252% para um filme com sessões de pré-estreia na semana anterior).
   → Abaixo de 5% do público atual, a semana anterior é ignorada e o filme conta como estreia.
5. **`TITULO_BRASIL` vem vazio em filmes nacionais** (41% das linhas). → `Obra.Titulo` usa o título original.
6. **O prefixo do código diz a origem:** `B` = nacional (CPB), `E` = estrangeira (ROE), `G` = genérico
   (eventos, programação sem obra; ~1% do público).
7. **A bilheteria diária não tem renda (R$), só público.** Renda só no consolidado de lançamentos, que atrasa:
   filmes em cartaz há 3 semanas ainda não aparecem lá.
8. **A ANCINE aceita HTTP Range** (`Accept-Ranges: bytes`), base da ingestão incremental.

## Qualidade

Na amostra de 8 semanas (01/09 a 18/10/2026): 605.394 sessões, **0 linhas rejeitadas**, 314 obras, 6.387 salas
(6.382 com capacidade), 7.254 lançamentos.
