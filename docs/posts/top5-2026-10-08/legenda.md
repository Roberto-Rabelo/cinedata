# Top 5 da semana · 08 a 14/10/2026

3 slides 1080×1350 (`slide-01.png` … `slide-03.png`), da rota `/marca/top5-2026-10-08` do front
(`cinedata.front/src/app/features/marca/slides-top5.ts`). Publicação combinada: sábado, 24/10/2026, à noite.

```bash
cd cinedata.front && node scripts/exportar-slides.mjs /marca/top5-2026-10-08 ../docs/posts/top5-2026-10-08
```

Por que 08 a 14/10: é a última semana completa. A de 15 a 21/10 ainda está parcial pela regra de dias consolidados
(19/10 com 89,1% e 21/10 com 85,8% das salas do normal; ver `docs/posts/como-medimos/legenda.md`).

## Legenda

Contagem: 714 caracteres (limite do Instagram: 2.200).

```text
Verity levou 622.946 pessoas ao cinema de 08 a 14/10: mais de 1 em cada 4 ingressos da semana no Brasil. 🎬

O Top 5 da semana (quinta a quarta):
1. Verity: 622.946 (▼ 16,7%)
2. Minha Melhor Amiga 🇧🇷: 299.571 (▼ 28%)
3. Outra Mamãe: 277.657 (estreia)
4. Carros: 225.814 (relançamento)
5. Se Eu Fosse Você 3 🇧🇷: 185.253 (estreia)

Na semana, foram 2,33 milhões de ingressos, 7,2% a mais que na anterior. O Top 5 ficou com 69% do público, entre 155 filmes em cartaz.

Por que 08 a 14/10? Os cinemas ainda estão enviando os dados de 15 a 21/10, e o Top 5 só sai de semana completa.

Qual desses você viu? Conta aqui nos comentários. 👇

Fonte: ANCINE (dados abertos)

#cinemabrasileiro #bilheteria #cinema #dadosabertos
```

## Teaser do nº 1 (Verity)

Trailers oficiais da distribuidora (Sony Pictures Brasil), conferidos no YouTube em 24/10/2026:

- Trailer Oficial Legendado (2:24): https://www.youtube.com/watch?v=NTiqVJ8vVQM
- Teaser Oficial Legendado (1:56): https://www.youtube.com/watch?v=MXAaETtP3M0
- Trailer Oficial Dublado (2:24): https://www.youtube.com/watch?v=JjIVd97hoFE

O vídeo é da Sony Pictures Brasil, não nosso. Para usar no post, credite "Trailer: Sony Pictures Brasil" e prefira
compartilhar o Reel oficial da distribuidora ou um trecho curto; repostar o trailer inteiro pode levar a bloqueio
por direitos autorais no Instagram.

## De onde vem cada número

Banco local, publicação da ANCINE com dados até 22/10/2026, conferido em 24/10/2026. O ranking pelo agregado
(`agregado_semana_obra`, que a API lê) e pela tabela de fato (`sessoes`) devolve o mesmo top 5. É a mesma regra do
`/api/v1/painel?data=2026-10-08` (`ConsultasBilheteriaSql.ObterRankingAsync`).

| Slide | Número | Resultado |
| --- | --- | --- |
| 1, 2 | Top 5 (público, salas) | Verity 622.946 (1.228 salas) · Minha Melhor Amiga 299.571 (843) · Outra Mamãe 277.657 (778) · Carros 225.814 (787) · Se Eu Fosse Você 3 185.253 (1.042) |
| 1 | "mais de 1 em cada 4" | Verity = 26,7% do público da semana |
| 2 | Variação sobre 01 a 07/10 | Verity 748.093 → −16,7% · Minha Melhor Amiga 416.180 → −28,0% |
| 2 | Estreias | Outra Mamãe e Carros sem público em 01 a 07/10; Se Eu Fosse Você 3 tinha 51 (pré-estreia, < 5% do atual: conta como estreia, regra da API) |
| 2 | Carros = relançamento | código `E1500588000000` (registro de 2015); é o filme de 2006 voltando às salas |
| 2 | Origem | prefixo do código: `B` nacional, `E` estrangeiro |
| 3 | 2,33 mi na semana, +7,2% | 2.331.061 contra 2.174.028 |
| 3 | 69,1% com o Top 5, 155 filmes | 1.611.241 / 2.331.061; 155 obras na semana |

```sql
-- Ranking com semana anterior, salas e participação (mesma lógica da API)
WITH atual AS (SELECT codigo_obra, publico, sessoes, salas FROM agregado_semana_obra WHERE semana = '2026-10-08'),
     anterior AS (SELECT codigo_obra, publico FROM agregado_semana_obra WHERE semana = '2026-10-01')
SELECT a.codigo_obra, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo, o.pais,
       a.publico, a.sessoes, a.salas, an.publico AS anterior,
       round((a.publico::numeric / nullif(an.publico, 0) - 1) * 100, 1) AS variacao,
       round(a.publico * 100.0 / (SELECT sum(publico) FROM atual), 1) AS participacao
FROM atual a JOIN obras o ON o.codigo = a.codigo_obra LEFT JOIN anterior an USING (codigo_obra)
ORDER BY a.publico DESC, a.codigo_obra LIMIT 5;

-- O mesmo direto da tabela de fato
SELECT codigo_obra, sum(publico) AS publico, count(*) AS sessoes, count(DISTINCT registro_sala) AS salas
FROM sessoes WHERE data_exibicao BETWEEN '2026-10-08' AND '2026-10-14'
GROUP BY 1 ORDER BY 2 DESC LIMIT 5;

-- Totais da semana e da anterior
SELECT semana, publico, sessoes, obras, salas, municipios
FROM agregado_semana WHERE semana IN ('2026-10-01', '2026-10-08');

-- Histórico semanal do Top 5 (estreias, pré-estreias e relançamento)
SELECT codigo_obra, string_agg(semana::text || '=' || publico, ' ' ORDER BY semana)
FROM agregado_semana_obra
WHERE codigo_obra IN ('E2600183000000', 'B2600181900000', 'E2600226100000', 'E1500588000000', 'B2600288300000')
GROUP BY 1;
```

## Cuidados

- A API desta branch ainda varre `sessoes` e estoura o tempo com o histórico inteiro. Por isso os números estão fixos
  no componente; quando os agregados entrarem na `main`, o post pode ler `/api/v1/painel` direto.
- A API marca Carros como "estreia" (não tinha público na semana anterior). No post está como relançamento, que é o
  certo para o leitor.
