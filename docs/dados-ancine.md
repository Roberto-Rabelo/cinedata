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
2. **Os CSVs internos (`AAAA-MM-sNN`) não são semanas cinematográficas:** são blocos do mês civil — dias 1–7, 8–14,
   15–21, 22–28 e 29 ao fim do mês (`2026-09-s04` = 22 a 28/09, de terça a segunda; `2026-09-s05` = 29 e 30/09).
   → A semana (quinta a quarta, `SemanaCinematografica`) é sempre derivada da data de exibição, e os agregados
   recalculam as semanas inteiras que cada arquivo toca.
3. **Os últimos dias publicados chegam incompletos.** Ex.: 18/10 tinha 209 salas reportando contra ~3.200 normais;
   15 a 17/10 tinham ~85%. → Um dia só é *consolidado* com ≥ 90% da mediana de salas da janela móvel de 8 semanas
   que termina nele ([ADR 0004](adr/0004-dias-consolidados.md)). Semanas sem 7 dias consolidados são "parciais" e a
   curva desenha esses dias tracejados.
4. **Pré-estreias distorcem a variação semanal** (+362.252% para um filme com sessões de pré-estreia na semana anterior).
   → Abaixo de 5% do público atual, a semana anterior é ignorada e o filme conta como estreia.
5. **`TITULO_BRASIL` vem vazio em filmes nacionais** (41% das linhas). → `Obra.Titulo` usa o título original.
6. **O prefixo do código diz a origem:** `B` = nacional (CPB), `E` = estrangeira (ROE), `G` = genérico
   (eventos, programação sem obra; ~1% do público).
7. **A bilheteria diária não tem renda (R$), só público.** Renda só no consolidado de lançamentos, que atrasa:
   filmes em cartaz há 3 semanas ainda não aparecem lá.
8. **A ANCINE aceita HTTP Range** (`Accept-Ranges: bytes`), base da ingestão incremental.
9. **A série só é representativa a partir de agosto de 2016.** De jun/2014 a jun/2016 o arquivo traz de 1 a 15 salas
   por dia (35 mil espectadores em 2014–2015 somados); em julho de 2016 o envio passa de ~130 para ~2.400 salas.
   → Comparações históricas e "neste dia" devem começar em 2016-08. Os dados antigos ficam no banco, mas não
   representam o mercado.
10. **A pandemia aparece como buraco, não como zero.** Abr–ago/2020 com 1 a 60 salas por dia, reabertura entre
   set e nov/2020 e novo fechamento em mar–abr/2021. Semanas sem nenhuma sessão não existem no arquivo.
11. **Linhas sem `TITULO_ORIGINAL` são rejeitadas** (regra mantida). São as únicas rejeições do histórico inteiro:
   14 linhas, 108 espectadores, de duas obras estrangeiras (`E1500271100000`, que tem título em outras linhas, e
   `E1500664500000`, sem título em nenhum lugar da ANCINE). Aceitá-las exigiria um título provisório no domínio e
   não muda nenhum número publicável. UF e `REGISTRO_SALA` vieram preenchidos em todos os anos.

## Qualidade

Na amostra de 8 semanas (01/09 a 18/10/2026): 605.394 sessões, **0 linhas rejeitadas**, 314 obras, 6.387 salas
(6.382 com capacidade), 7.254 lançamentos.

## Carga completa (23/10/2026, publicação com dados até 22/10/2026)

Medida num MacBook (Apple Silicon) com o PostgreSQL 17 do `docker-compose.yml`, comando
`dotnet run -c Release --project src/CineData.Ingestion -- bilheteria`.

| Medida | Valor |
| --- | --- |
| Arquivos | 661 (`2014-06-s01` a `2026-10-s04`) |
| Tempo | 18 min 46 s com os agregados (~1,7 s por arquivo; download e `COPY` sequenciais), 240 MB de RAM |
| Sessões | 38.458.225, de 01/06/2014 a 22/10/2026 (4.031 dias com dados, 579 semanas) |
| Público | 1.233.734.151 espectadores |
| Rejeitadas | 14 (todas por título vazio, ver achado 11) |
| Obras / salas | 6.265 / 6.387 |
| Banco | 5,1 GB, quase tudo em `sessoes` (3,1 GB de dados + 2 GB de índices) |
| Agregados (`agregado_*`) | 10 MB; recálculo do histórico inteiro em ~2 min, de uma semana em ~0,3 s |
| Ingestão sem mudanças | 1,9 s (só o diretório central do ZIP) |

A primeira medição (19 min 12 s) foi antes dos agregados; a de 18 min 46 s é a carga do zero com a versão final, que
registra os períodos de cada arquivo em `agregado_pendente` e recalcula tudo uma vez no fim. No caminho houve duas
cargas de 55–60 min: o `min/max(data_exibicao) WHERE arquivo_id = …` usado para achar o período anterior do arquivo
virava uma varredura do índice de datas (7,8 s por arquivo com a tabela cheia). Escrever `data_exibicao + 0` força o
índice de `arquivo_id` (0,5 ms). Os agregados das duas cargas são idênticos (md5 por tabela).

### Latência da API (histórico inteiro, mediana de 5–20 chamadas locais)

| Endpoint | Antes (varrendo `sessoes`) | Depois (agregados) |
| --- | --- | --- |
| `GET /api/v1/semanas` | 26,3 s | 10 ms |
| `GET /api/v1/painel` (semana padrão) | 26,8 s | 13 ms |
| `GET /api/v1/painel?data=2019-04-25` | 241 ms | 4 ms |
| `GET /api/v1/obras/{codigo}/curva` | 7,7 s | 64 ms |
| `GET /api/v1/obras?busca=vingadores` | 50 ms | 6 ms |

Filtros de período ([ADR 0005](adr/0005-periodos-de-calendario.md)), mesma máquina, API em Release, mediana de 20
chamadas após aquecimento:

| Endpoint | Latência |
| --- | --- |
| `GET /api/v1/periodos?periodo=mes` (e `trimestre`, `semestre`, `ano`) | 8–9 ms |
| `GET /api/v1/painel?periodo=mes` (último mês completo) | 10 ms |
| `GET /api/v1/painel?periodo=trimestre` / `semestre` | 9–10 ms |
| `GET /api/v1/painel?periodo=ano` / `?periodo=ano&data=2019-01-01` | 10 ms |
| `GET /api/v1/ranking?periodo=ano&top=50` | 9 ms |
| `GET /api/v1/ufs?periodo=trimestre` | 8 ms |
| `GET /api/v1/painel` (semana padrão) / `?data=2019-04-25` | 9 ms |

A semana com `data` passou de 4 para 9 ms porque toda consulta agora lê a cobertura diária para descrever o período
(completo ou parcial, dias consolidados). Respostas semanais idênticas às de antes (painel de 2014, 2019, 2020 e da
semana padrão comparados campo a campo, só com `publicoSemanaAnterior` renomeado para `publicoPeriodoAnterior`).
Os agregados de calendário conferem com `sessoes` direto (2019 e 3º tri/2025: público, sessões, obras, salas e
municípios distintos, salas por filme). A migration `PeriodosCalendario` levou 75 s no histórico inteiro.

O gargalo de antes era a cobertura diária (`count(DISTINCT registro_sala)` por dia sobre 38 milhões de linhas),
refeita a cada chamada de `/semanas`, `/painel` sem data e `/curva`. As respostas foram comparadas antes × depois em
semanas de 2014, 2016, 2019, 2020, 2021 e 2025: números idênticos, exceto empates de público, que agora têm
desempate determinístico pelo código da obra.

### Dias consolidados no histórico

Com a mediana global, 171 das 579 semanas ficavam "parciais", incluindo todo o 2º semestre de 2016 (a mediana
global, ~3.000 salas, era alta demais para a época). Com a janela móvel são 62, todas explicáveis: os dois primeiros
anos quase vazios, fechamentos reais (mar–abr/2020, mar–abr/2021), Natal e Ano-Novo (as salas fecham de fato
em 24, 25 e 31/12 e 1/1) e a cauda ainda chegando da ANCINE. Na publicação atual, a semana de 15/10 passa a contar
como parcial (21/10 tem 2.894 salas, 86% da mediana recente), e o painel usa a de 08/10.

Para conferir qualquer número à mão (banco, CSV original e Anuário), veja [verificacao.md](verificacao.md).
