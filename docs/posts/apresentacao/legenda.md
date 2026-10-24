# Carrossel de apresentação (@cinedata.br, post fixado)

7 slides 1080×1350 (`slide-01.png` … `slide-07.png`), gerados a partir da rota `/marca/apresentacao` do front
(`cinedata.front/src/app/features/marca/slides-apresentacao.ts`). Para regerar, com o front rodando:

```bash
cd cinedata.front && node scripts/exportar-slides.mjs http://localhost:4300 ../docs/posts/apresentacao
```

O script usa o Google Chrome instalado (playwright-core), confere que cada slide tem 1080×1350 e falha se algum
conteúdo passar do quadro.

## Legenda

Contagem: 1.047 caracteres (limite do Instagram: 2.200).

```text
1,23 bilhão de ingressos de cinema no Brasil desde 2016. Agora em números. 🎬

O CineData transforma em números cada sessão de cinema do país: são 38,5 milhões de sessões, informadas pelos próprios cinemas à ANCINE e publicadas como dados abertos.

O que vem por aí:
▪️ Top 5 da semana, de quinta a quarta
▪️ Mapa por estado
▪️ Dublado × legendado
▪️ Recordes e "neste dia"

Duas amostras no carrossel:
📉 2020, o ano em que o cinema parou: de 174,5 milhões de ingressos em 2019 para 39,2 milhões (−77,5%).
📈 2026 já passou 2025 inteiro: 114,7 milhões até 22/10, contra 114,3 milhões no ano passado todo.

Como medimos: bilheteria diária por exibidoras (dados abertos da ANCINE), semana de quinta a quarta. Os últimos dias podem chegar parciais e a série é confiável desde agosto de 2016. Somos um projeto independente: não somos a ANCINE, usamos os dados que ela publica.

Siga para receber o Top 5 toda semana. E comenta aqui: qual filme você quer ver em números?

Fonte: ANCINE (dados abertos)

#cinemabrasileiro #bilheteria #cinema #dadosabertos
```

## De onde vem cada número

Banco local (`docker exec -it cinedata-postgres psql -U cinedata -d cinedata`), publicação da ANCINE com dados até
22/10/2026, conferido em 23/10/2026. Os valores estão congelados no componente (o post é um retrato e não lê a API).
`agregado_dia` é a soma diária de `sessoes`; os totais batem com a tabela de fato (1.233.734.151 espectadores e
38.458.225 sessões nas duas).

| Slide | Número | Resultado |
| --- | --- | --- |
| 1 | 1,23 bilhão desde 2016 | 1.233.698.421 |
| 2 | 38,5 milhões de sessões | 38.458.225 |
| 2 | 6.387 salas e 6.265 filmes na base | 6.387 / 6.265 |
| 4 | Público anual 2017–2025 (barras) | 177,7 · 161,7 · 174,5 · 39,2 · 50,9 · 96,4 · 116,1 · 127,2 · 114,3 mi |
| 4 | 2019 → 2020: −77,5% | 174.499.298 → 39.248.445 |
| 4 | 2025 ainda 34,5% abaixo de 2019 | 114.261.351 / 174.499.298 |
| 5 | 2026 até 22/10: 114,7 mi; 2025 inteiro: 114,3 mi | 114.706.089 / 114.261.351 |
| 5 | Passou em 18/10 | acumulado de 2026 em 18/10: 114.310.073 |
| 5 | +20% sobre o mesmo período de 2025 | 1/1–22/10/2025: 95.560.265 |
| 6 | Série confiável desde ago/2016 | jan–jun/2016 < 200 mil por mês; jul 3,7 mi; ago 12,0 mi |

```sql
-- Slides 1 e 2: público desde 2016 e total de sessões
SELECT sum(publico) FROM agregado_dia WHERE data >= '2016-01-01';
SELECT count(*), sum(publico) FROM sessoes;                 -- 38.458.225 sessões (confere o agregado)

-- Slide 2: salas e obras na base
SELECT count(*) FROM salas;
SELECT count(*) FROM obras;

-- Slides 4 e 5: público por ano (o mesmo pela tabela de fato está em docs/verificacao.md)
SELECT extract(year FROM data)::int AS ano, sum(publico) AS publico, sum(sessoes) AS sessoes
FROM agregado_dia GROUP BY 1 ORDER BY 1;

-- Slide 5: dia em que o acumulado de 2026 passou o total de 2025
SELECT data, acumulado
FROM (SELECT data, sum(publico) OVER (ORDER BY data) AS acumulado
      FROM agregado_dia WHERE data >= '2026-01-01') t
WHERE acumulado > (SELECT sum(publico) FROM agregado_dia WHERE extract(year FROM data) = 2025)
ORDER BY data LIMIT 1;

-- Slide 5: mesmo período de 2025
SELECT sum(publico) FROM agregado_dia WHERE data BETWEEN '2025-01-01' AND '2025-10-22';

-- Slide 5: curvas do acumulado (a cada 7 dias do ano e no último dia com dados)
WITH d AS (
  SELECT data, extract(year FROM data)::int AS ano, extract(doy FROM data)::int AS dia,
         sum(publico) OVER (PARTITION BY extract(year FROM data) ORDER BY data) AS acumulado,
         max(data) OVER (PARTITION BY extract(year FROM data)) AS ultimo
  FROM agregado_dia WHERE data >= '2025-01-01')
SELECT ano, string_agg(dia || ':' || round(acumulado / 1e6, 1), ' ' ORDER BY dia)
FROM d WHERE dia % 7 = 0 OR data = ultimo GROUP BY ano;

-- Slide 6: por que "desde ago/2016"
SELECT date_trunc('month', data)::date AS mes, sum(publico)
FROM agregado_dia WHERE data BETWEEN '2016-01-01' AND '2016-11-30' GROUP BY 1 ORDER BY 1;
```

## Cuidados

- O último dia (22/10/2026) chegou com só 196 salas: o número de 2026 ainda vai crescer quando a ANCINE completar a
  semana. Isso só reforça a manchete do slide 5.
- Os totais anuais podem diferir um pouco dos do Anuário do OCA (outra base, com correções posteriores); por isso o
  post diz de onde vem o número (bilheteria informada pelos cinemas) e não o chama de oficial.
- Nada de "oficial ANCINE" nem logo da agência: a ANCINE aparece só como fonte.
