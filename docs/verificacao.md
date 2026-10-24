# Como conferir os números à mão

Três níveis, do mais rápido ao mais independente: (1) agregado × sessões brutas no nosso banco, (2) sessões × CSV
original da ANCINE, (3) totais × publicações oficiais (Anuário do OCA).

## Acesso ao banco

PostgreSQL 17 do `docker-compose.yml`: `localhost:5432`, banco/usuário/senha `cinedata` (só desenvolvimento local).

```bash
docker exec -it cinedata-postgres psql -U cinedata -d cinedata
```

Num cliente gráfico (DBeaver, DataGrip, TablePlus, extensão PostgreSQL do VS Code), use o mesmo host, porta e
credenciais. As tabelas estão no schema `public`; o modelo está em [arquitetura.md](arquitetura.md#modelo-de-dados).

## Onde estão os parâmetros

| Regra | Valor | Arquivo |
| --- | --- | --- |
| Dia consolidado | ≥ 90% da mediana de salas, janela de 56 dias | `cinedata.back/src/CineData.Domain/Bilheteria/DiasConsolidados.cs` |
| Semana cinematográfica | quinta a quarta | `cinedata.back/src/CineData.Domain/Common/SemanaCinematografica.cs` |
| Pré-estreia vira estreia | semana anterior < 5% do público atual | `ConsultasBilheteriaSql.cs` (`LimitePreEstreia`) |
| Linha rejeitada na carga | código, UF, data, sessão, público ≥ 0, sala > 0, áudio, legenda ou título inválidos | `cinedata.back/src/CineData.Application/Ingestao/ImportarBilheteria.cs` (`TentarConverter`) |
| Origem da obra | prefixo `B` nacional, `E` estrangeira, `G` genérico | `cinedata.back/src/CineData.Domain/Obras/CodigoObra.cs` |
| Agregados | SQL da função `atualizar_agregados_bilheteria` | `cinedata.back/src/CineData.Infrastructure/Persistence/Migrations/20261023214503_AgregadosBilheteria.cs` |
| Consultas da API | SQL de cada endpoint | `cinedata.back/src/CineData.Infrastructure/Persistence/Leitura/ConsultasBilheteriaSql.cs` |

Para ver o SQL exato que a API rodou, olhe o log da API: o Npgsql registra cada comando com a duração.

## 1. Agregado × sessões brutas

Ranking de uma semana (quinta a quarta) recalculado direto do fato, sem agregado:

```sql
SELECT s.codigo_obra, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo,
       sum(s.publico) AS publico, count(*) AS sessoes, count(DISTINCT s.registro_sala) AS salas
FROM sessoes s JOIN obras o ON o.codigo = s.codigo_obra
WHERE s.data_exibicao BETWEEN '2026-10-08' AND '2026-10-14'
GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 5;

-- o mesmo pelo agregado que a API lê
SELECT codigo_obra, publico, sessoes, salas
FROM agregado_semana_obra WHERE semana = '2026-10-08' ORDER BY publico DESC LIMIT 5;
```

Em 23/10/2026 as duas devolveram o mesmo top 5 (VERITY 622.946, MINHA MELHOR AMIGA 299.571, OUTRA MAMÃE 277.657,
CARROS 225.814, SE EU FOSSE VOCÊ 3 185.253), em 161 ms e 0,8 ms.

Público por ano (varre 38 milhões de linhas, ~10 s):

```sql
SELECT extract(year FROM data_exibicao) AS ano, sum(publico) AS publico
FROM sessoes GROUP BY 1 ORDER BY 1;
```

Cobertura diária, base dos dias consolidados:

```sql
SELECT data, salas, sessoes, publico FROM agregado_dia WHERE data >= current_date - 30 ORDER BY data;
```

## 2. Sessões × CSV original da ANCINE

Cada sessão guarda de qual arquivo veio (`arquivo_id`):

```sql
SELECT a.nome, a.crc32, a.linhas, a.linhas_rejeitadas, a.importado_em,
       min(s.data_exibicao), max(s.data_exibicao), sum(s.publico)
FROM arquivos_importados a JOIN sessoes s ON s.arquivo_id = a.id
WHERE a.nome LIKE '%2026-10-s02%'
GROUP BY a.id;
```

O arquivo original está no ZIP acumulado (1,21 GB) em
`https://dados.ancine.gov.br/dados-abertos/bilheteria-diaria-obras-por-exibidoras-csv.zip`. Baixe uma vez e confira
um arquivo semanal:

```bash
unzip -l bilheteria-diaria-obras-por-exibidoras-csv.zip | tail -5
unzip -p bilheteria-diaria-obras-por-exibidoras-csv.zip bilheteria-diaria-obras-por-exibidoras-2026-10-s02.csv \
  | awk -F';' 'NR > 1 && $5 == "E2600183000000" { p += $11 } END { print p }'   # público de VERITY no arquivo
unzip -v bilheteria-diaria-obras-por-exibidoras-csv.zip | grep 2026-10-s02                # CRC32 em hex
```

Esperado na publicação de 22/10/2026: 622.946 espectadores e CRC `a6bf6e23` (= 2797563427 em
`arquivos_importados.crc32`, que guarda o valor em decimal).

Colunas do CSV: `DATA_EXIBICAO;SESSAO;TITULO_ORIGINAL;TITULO_BRASIL;CPB_ROE;AUDIO;LEGENDADA;PAIS_OBRA;REGISTRO_SALA;
NOME_SALA;PUBLICO;…` (separador `;`, UTF-8). Lembre que `sNN` é bloco do mês civil (dias 8 a 14 em `s02`), não semana
cinematográfica: compare por data, não por arquivo.

## 3. Totais × publicações oficiais

A ANCINE publica totais anuais no Observatório (OCA). Eles partem de outras bases (com renda e correções posteriores)
e podem diferir um pouco da bilheteria diária por exibidoras. Antes de publicar "recorde" ou um total anual, confira
com o Anuário Estatístico do Cinema Brasileiro do ano.
