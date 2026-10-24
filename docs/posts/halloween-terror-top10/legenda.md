# Especial de Halloween: os 10 filmes de terror mais vistos nos cinemas do Brasil desde 2016

12 slides 1080×1350 (`slide-01.png` … `slide-12.png`), da rota `/marca/halloween-terror-top10` do front
(`cinedata.front/src/app/features/marca/slides-halloween.ts`). Inspiração de formato: carrossel do AdoroCinema com uma
foto do filme por slide. Sugestão de publicação: quinta (29/10) ou sexta (30/10), entre 18h e 19h, antes do Halloween
(sábado, 31/10).

```bash
cd cinedata.front && node scripts/exportar-slides.mjs /marca/halloween-terror-top10 ../docs/posts/halloween-terror-top10
```

## Legenda

Contagem: 1.162 caracteres (limite do Instagram: 2.200).

```text
A Freira levou 5,3 milhões de pessoas ao cinema no Brasil e é o terror mais visto desde 2016. 🎃

O top 10 do terror nos nossos cinemas (espectadores · bilheteria):
1. A Freira (2018): 5,29 mi · R$ 76,3 mi
2. Invocação do Mal 4 (2025): 4,68 mi · R$ 96,7 mi
3. It: A Coisa (2017): 4,42 mi · R$ 62,1 mi
4. Invocação do Mal 2 (2016): 3,61 mi · R$ 47,2 mi
5. It: Capítulo Dois (2019): 3,16 mi · R$ 47,8 mi
6. A Freira 2 (2023): 3,02 mi · R$ 55,0 mi
7. Five Nights at Freddy's (2023): 2,96 mi · R$ 53,7 mi
8. Annabelle 2 (2017): 2,96 mi · R$ 40,5 mi
9. Órfã 2: A Origem (2022): 2,15 mi · R$ 27,8 mi
10. Five Nights at Freddy's 2 (2025): 1,96 mi · R$ 38,5 mi

Juntos, 34,2 milhões de espectadores e R$ 545,5 milhões. Metade da lista é do universo Invocação do Mal, e 9 dos 10 foram distribuídos pela Warner.

E o terror nacional? O mais visto desde 2016 foi Os Exterminadores do Além contra a Loira do Banheiro, com 181,7 mil espectadores.

Qual desses te deu mais medo? 👻

Fonte: ANCINE (dados abertos), lançamentos comerciais. Bilheteria em valores da época, sem correção da inflação. Imagens: divulgação.

#halloween #filmesdeterror #cinema #bilheteria #dadosabertos
```

## Critério

- **Base:** consolidado de lançamentos comerciais da ANCINE (`lancamentos`), que soma público e renda de toda a
  carreira do filme. A bilheteria diária não tem renda e só é completa desde ago/2016 (Invocação do Mal 2, de jun/2016,
  tem 79 mil espectadores nela contra 3,6 milhões no consolidado).
- **Período:** filmes lançados de 01/01/2016 em diante. O consolidado inclui 2026 até a última publicação; filmes ainda
  em cartaz (Resident Evil, 2026, com 1,18 mi nas sessões até 22/10) não alcançam o 10º lugar.
- **Terror:** gênero principal terror, classificado à mão entre os 175 filmes com pelo menos 1.955.358 espectadores (o
  público do 10º lugar). Ficaram fora: Todo Mundo em Pânico (2026, paródia, 2,67 mi), A Múmia (2017, aventura, 3,05 mi)
  e A Empregada (2026, suspense, 4,76 mi).
- **Terror nacional:** nenhum filme brasileiro de terror passou de 200 mil espectadores desde 2016 (conferido na lista
  de todos os nacionais acima de 150 mil). O maior foi a terror-comédia Os Exterminadores do Além contra a Loira do
  Banheiro (2018, 181.695); o maior "terror puro" foi O Rastro (2017, 87.070).
- **Renda:** valores nominais. Por isso Invocação do Mal 4 (2025) arrecadou mais que A Freira (2018) com menos público.

## De onde vem cada número

| Slide | Número | Resultado |
| --- | --- | --- |
| 2 a 11 | Público e renda de cada filme | tabela da legenda; consulta abaixo |
| 1 | 34,2 mi de espectadores e R$ 545,5 mi | soma dos 10: 34.203.427 e R$ 545.483.426 |
| 12 | 5 de 10 do universo Invocação do Mal, 19,6 mi | A Freira, Invocação 4, Invocação 2, A Freira 2, Annabelle 2: 19.553.777 |
| 12 | Invocação do Mal 4: R$ 96,7 mi | R$ 96.662.489 com 4.677.895 espectadores, contra R$ 76.346.873 e 5.288.640 de A Freira |
| 12 | 181,7 mil no maior terror nacional | Os Exterminadores do Além contra a Loira do Banheiro: 181.695 |
| legenda | 9 dos 10 da Warner | `distribuidora` = WARNER BROS. (SOUTH) INC. em todos, menos Órfã 2 (Diamond Films) |

```sql
-- Candidatos: ficção e animação lançadas desde 2016, por público total (classificação de gênero feita à mão)
SELECT l.codigo_obra, extract(year FROM min(l.data_lancamento))::int AS ano,
       coalesce(nullif(o.titulo_brasil, ''), max(l.titulo)) AS titulo, o.titulo_original,
       sum(l.publico_total) AS publico, sum(l.renda_total) AS renda, count(*) AS lancamentos
FROM lancamentos l LEFT JOIN obras o ON o.codigo = l.codigo_obra
WHERE l.data_lancamento >= '2016-01-01' AND l.tipo_obra IN ('FICÇÃO', 'ANIMAÇÃO')
GROUP BY l.codigo_obra, o.titulo_brasil, o.titulo_original
ORDER BY publico DESC LIMIT 300;

-- O top 10, com distribuidora e o público pelas sessões para comparação
SELECT l.codigo_obra, l.titulo, l.data_lancamento, l.publico_total, l.renda_total, l.distribuidora,
       (SELECT sum(publico) FROM agregado_semana_obra a WHERE a.codigo_obra = l.codigo_obra) AS publico_sessoes
FROM lancamentos l
WHERE l.codigo_obra IN ('E1800306100000', 'E2500282800000', 'E1700363900000', 'E1600342300000', 'E1900346500000',
                        'E2300349600000', 'E2300351500000', 'E1700194500000', 'E2200255200000', 'E2500358900000')
ORDER BY l.publico_total DESC;

-- Filmes de 2026 com público alto nas sessões que podem não estar no consolidado
SELECT a.codigo_obra, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo, sum(a.publico) AS publico,
       (SELECT sum(publico_total) FROM lancamentos l WHERE l.codigo_obra = a.codigo_obra) AS consolidado
FROM agregado_semana_obra a JOIN obras o ON o.codigo = a.codigo_obra
WHERE a.semana >= '2026-01-01' GROUP BY 1, 2 HAVING sum(a.publico) > 800000 ORDER BY 3 DESC;

-- Terror nacional: todos os nacionais acima de 150 mil desde 2016 (nenhum é terror além do citado)
SELECT l.titulo, sum(l.publico_total) AS publico
FROM lancamentos l
WHERE l.data_lancamento >= '2016-01-01' AND l.codigo_obra LIKE 'B%' AND l.tipo_obra IN ('FICÇÃO', 'ANIMAÇÃO')
GROUP BY 1 HAVING sum(l.publico_total) >= 150000 ORDER BY 2 DESC;
```

## Imagens

Cenas de divulgação dos estúdios, do The Movie Database (TMDB), carregadas direto de `image.tmdb.org` na hora de gerar
o PNG (nenhum arquivo de imagem fica no repositório). Os arquivos de cada filme estão em `slides-halloween.ts`; a capa
usa outra cena de A Freira. Crédito no slide ("Imagem: divulgação") e na legenda.

| # | Filme | TMDB |
| --- | --- | --- |
| 1 | A Freira | https://www.themoviedb.org/movie/439079 |
| 2 | Invocação do Mal 4: O Último Ritual | https://www.themoviedb.org/movie/1038392 |
| 3 | It: A Coisa | https://www.themoviedb.org/movie/346364 |
| 4 | Invocação do Mal 2 | https://www.themoviedb.org/movie/259693 |
| 5 | It: Capítulo Dois | https://www.themoviedb.org/movie/474350 |
| 6 | A Freira 2 | https://www.themoviedb.org/movie/968051 |
| 7 | Five Nights at Freddy's | https://www.themoviedb.org/movie/507089 |
| 8 | Annabelle 2: A Criação do Mal | https://www.themoviedb.org/movie/396422 |
| 9 | Órfã 2: A Origem | https://www.themoviedb.org/movie/760161 |
| 10 | Five Nights at Freddy's 2 | https://www.themoviedb.org/movie/1228246 |
