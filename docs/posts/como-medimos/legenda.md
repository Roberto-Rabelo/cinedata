# Como medimos (post fixado)

5 slides 1080×1350 (`slide-01.png` … `slide-05.png`), da rota `/marca/como-medimos` do front
(`cinedata.front/src/app/features/marca/slides-como-medimos.ts`). Publicação combinada: segunda, 26/10/2026.

```bash
cd cinedata.front && node scripts/exportar-slides.mjs /marca/como-medimos ../docs/posts/como-medimos
```

## Legenda

Contagem: 1.001 caracteres (limite do Instagram: 2.200).

```text
Todo número que a gente posta sai de 38,5 milhões de sessões de cinema. Veja como medimos. 📏

1. A fonte: dados abertos da ANCINE, na base "bilheteria diária por exibidoras". Os próprios cinemas informam cada sessão: filme, sala, dia, horário, público e se foi dublado ou legendado.

2. A semana: de quinta a quarta, a semana do cinema, porque os filmes estreiam às quintas. Todo Top 5 e toda comparação usam essa semana.

3. Os últimos dias: os dados chegam aos poucos. Um dia só entra na conta quando 90% das salas já informaram, por isso o Top 5 sai só de semana completa.

4. Os limites: a série é confiável desde agosto de 2016 (antes disso a base quase não tem sessões). Os números podem diferir um pouco do Anuário do OCA, que usa outra base, com correções posteriores.

Somos um projeto independente: não somos a ANCINE, usamos os dados que ela publica.

Ficou alguma dúvida sobre os números? Pergunta aqui. 👇

Fonte: ANCINE (dados abertos)

#dadosabertos #cinema #bilheteria #cinemabrasileiro
```

## De onde vem cada número

Banco local, publicação da ANCINE com dados até 22/10/2026, conferido em 24/10/2026.

| Slide | Número | Resultado |
| --- | --- | --- |
| 1 | 38,5 milhões de sessões | 38.458.225 |
| 4 | Salas que informaram cada dia, em % do normal | 08 a 14/10 entre 96,4% e 100,1%; 15 a 21/10 com 19/10 em 89,1% e 21/10 em 85,8%; 22/10 em 5,8% (196 salas) |
| 5 | Confiável desde ago/2016 | jan a jun/2016 abaixo de 200 mil ingressos por mês; jul 3,7 mi; ago 12,0 mi |

"Normal" é a mediana de salas dos 56 dias que terminam naquele dia; o dia é consolidado com pelo menos 90% dela
(`DiasConsolidados`, ADR 0004). Os detalhes da regra ficaram fora do post de propósito, para não usar jargão.

```sql
-- Slide 1
SELECT count(*) FROM sessoes;

-- Slide 4: salas por dia contra a mediana móvel de 56 dias (mesma regra de DiasConsolidados)
SELECT d.data, d.salas,
       (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY x.salas)
        FROM agregado_dia x WHERE x.data > d.data - 56 AND x.data <= d.data) AS mediana,
       round(d.salas / (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY x.salas)
        FROM agregado_dia x WHERE x.data > d.data - 56 AND x.data <= d.data)::numeric * 100, 1) AS pct
FROM agregado_dia d WHERE d.data BETWEEN '2026-10-08' AND '2026-10-22' ORDER BY d.data;

-- Slide 5: por que "desde ago/2016"
SELECT date_trunc('month', data)::date AS mes, sum(publico)
FROM agregado_dia WHERE data BETWEEN '2016-01-01' AND '2016-11-30' GROUP BY 1 ORDER BY 1;
```

## Cuidados

- O gráfico do slide 4 é um retrato de 23/10. Na segunda (26/10) a ANCINE pode já ter completado a semana de 15/10;
  a nota do slide diz "situação em 23/10", então continua correto.
