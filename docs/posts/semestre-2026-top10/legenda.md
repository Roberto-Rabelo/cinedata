# Post especial · os 10 filmes mais vistos entre os lançados no 1º semestre de 2026

12 slides 1080×1350 (`slide-01.png` … `slide-12.png`), da rota `/marca/semestre-2026-top10` do front
(`cinedata.front/src/app/features/marca/slides-semestre-2026.ts`), no mesmo formato do especial de Halloween. Atemporal:
pode sair em qualquer dia; sugestão, um dia útil entre 18h e 19h, sem bater com o Halloween e o Feito Pipa (29–31/10).

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Os 10 filmes que bombaram nos cinemas do Brasil", 41,3 milhões de espectadores e R$ 919,1 milhões |
| 2–11 | `slide-02.png` … `slide-11.png` | do 1º ao 10º: posição, título, data de estreia, espectadores, bilheteria e barra contra o nº 1 |
| 12 | `slide-12.png` | o que a lista revela: 71% do público dos 233 lançamentos, +8% sobre 2025, Velhos Bandidos com 431 mil; "Qual desses você viu no cinema?" |

```bash
cd cinedata.front && node scripts/exportar-slides.mjs /marca/semestre-2026-top10 ../docs/posts/semestre-2026-top10 http://localhost:4300
```

## Legenda

Contagem: 1.334 caracteres (limite do Instagram: 2.200).

```text
Toy Story 5 estreou em 18 de junho, a 13 dias do fim do semestre, e mesmo assim foi o filme mais visto entre os lançados no 1º semestre de 2026: 8,2 milhões de espectadores. 🍿

O top 10 dos lançamentos de janeiro a junho (espectadores · bilheteria):
1. Toy Story 5: 8,16 mi · R$ 177,8 mi
2. Michael: 7,44 mi · R$ 169,2 mi
3. O Diabo Veste Prada 2: 6,97 mi · R$ 165,8 mi
4. A Empregada: 4,76 mi · R$ 98,2 mi
5. Super Mario Galaxy: O Filme: 4,38 mi · R$ 95,9 mi
6. Todo Mundo em Pânico: 2,67 mi · R$ 58,5 mi
7. Devoradores de Estrelas: 2,00 mi · R$ 48,1 mi
8. Mestres do Universo: 1,87 mi · R$ 41,9 mi
9. Pânico 7: 1,65 mi · R$ 34,7 mi
10. Cara de Um, Focinho de Outro: 1,37 mi · R$ 28,9 mi

Juntos, 41,3 milhões de espectadores e R$ 919,1 milhões. É 8% a mais que o top 10 do 1º semestre de 2025, e 71% de todo o público dos 233 filmes lançados no período.

E o cinema brasileiro? O nacional mais visto entre os lançados no semestre foi Velhos Bandidos 🇧🇷, com 431 mil espectadores.

Qual desses você viu no cinema? 🎬

A matéria completa, com a comparação com 2025, está no link da bio.

Fonte: ANCINE (dados abertos), lançamentos comerciais; público e renda de toda a carreira, até a última publicação. Bilheteria em valores da época. Imagens: TMDB/divulgação.

#cinema #bilheteria #toystory5 #michael #odiabovesteprada2 #dadosabertos
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/filmes-mais-vistos-primeiro-semestre-2026?utm_source=instagram&utm_medium=post&utm_campaign=semestre-2026-top10`

## Critério

- **Base:** consolidado de lançamentos comerciais da ANCINE (`lancamentos`), que soma público e renda de toda a
  carreira do filme (o mesmo do especial de Halloween). "Bombar no semestre" = ser lançado de 01/01 a 30/06/2026 e
  somar o maior público.
- **Data de lançamento:** a do consolidado (`min(data_lancamento)`). A Empregada consta como lançada em 01/01/2026, mas
  teve 209.624 espectadores em sessões de pré-estreia desde 16/12/2025; entra pela data oficial.
- **Ainda em cartaz:** Toy Story 5, Super Mario Galaxy, Devoradores de Estrelas, Mestres do Universo e Cara de Um,
  Focinho de Outro tinham sessões em outubro. O consolidado vale até a última publicação da ANCINE; pelas sessões até
  23/10, Toy Story 5 já soma 8.333.937. A ordem do top 10 não muda com as sessões.
- **Alternativa descartada (combinada com o usuário):** público vendido dentro do semestre (sessões de 01/01 a 30/06),
  que põe Michael em 1º (7,38 mi), traz Avatar: Fogo e Cinzas e Zootopia 2 (lançados em 2025) e deixa Toy Story 5 em 7º,
  com só 13 dias no período (3.051.754).
- **Renda:** valores nominais, sem correção da inflação.

## Números e como conferir

| Slide | Número | Resultado |
| --- | --- | --- |
| 2 a 11 | Público e renda de cada filme | tabela da legenda; primeira consulta abaixo |
| 1 | 41,3 mi de espectadores e R$ 919,1 mi | soma dos 10: 41.276.931 e R$ 919.089.551 |
| 12 | 71% | 41.276.931 de 58.118.629 espectadores dos 233 filmes lançados no semestre (71,0%) |
| 12 | +8% | top 10 do 1º semestre de 2025: 38.163.329 (Lilo & Stitch, 10.418.672, na frente); 41.276.931 / 38.163.329 = +8,2% |
| 12 | 431 mil | Velhos Bandidos (B2600027400000, lançado em 26/03/2026): 431.355 |
| legenda | 13 dias | Toy Story 5 lançado em 18/06/2026 (quinta); o semestre acaba em 30/06 |

```sql
-- Top 10 dos lançados no 1º semestre de 2026 (carreira inteira)
SELECT l.codigo_obra, coalesce(nullif(o.titulo_brasil, ''), max(l.titulo)) AS titulo, min(l.data_lancamento) AS lancamento,
       sum(l.publico_total) AS publico, sum(l.renda_total) AS renda, string_agg(DISTINCT l.distribuidora, ', ') AS distribuidora
FROM lancamentos l LEFT JOIN obras o ON o.codigo = l.codigo_obra
GROUP BY l.codigo_obra, o.titulo_brasil
HAVING min(l.data_lancamento) BETWEEN '2026-01-01' AND '2026-06-30'
ORDER BY publico DESC LIMIT 10;

-- Total dos lançados no semestre (233 filmes, 58.118.629); trocar o ano para o top 10 de 2025
SELECT count(*), sum(p) FROM (
  SELECT codigo_obra, sum(publico_total) AS p FROM lancamentos GROUP BY 1
  HAVING min(data_lancamento) BETWEEN '2026-01-01' AND '2026-06-30') t;

-- Nacional mais visto entre os lançados no semestre
SELECT codigo_obra, max(titulo), sum(publico_total) FROM lancamentos WHERE codigo_obra LIKE 'B%'
GROUP BY 1 HAVING min(data_lancamento) BETWEEN '2026-01-01' AND '2026-06-30' ORDER BY 3 DESC LIMIT 1;

-- Sessões (para os ainda em cartaz e a alternativa descartada)
SELECT codigo_obra, min(data_exibicao), max(data_exibicao), sum(publico) FROM sessoes
WHERE codigo_obra = 'E2600061000000' GROUP BY 1;
```

## Imagens

Cenas de divulgação do TMDB, carregadas de `image.tmdb.org` na hora de gerar o PNG (nenhuma imagem no repositório).
Arquivos em `cinedata.front/src/app/features/marca/semestre-2026-top10.json`; a capa usa outra cena de Toy Story 5.
O Diabo Veste Prada 2 (fundo claro) usa `escurecer`.

| # | Filme | TMDB |
| --- | --- | --- |
| 1 | Toy Story 5 | https://www.themoviedb.org/movie/1084244 |
| 2 | Michael | https://www.themoviedb.org/movie/936075 |
| 3 | O Diabo Veste Prada 2 | https://www.themoviedb.org/movie/1314481 |
| 4 | A Empregada | https://www.themoviedb.org/movie/1368166 |
| 5 | Super Mario Galaxy: O Filme | https://www.themoviedb.org/movie/1226863 |
| 6 | Todo Mundo em Pânico | https://www.themoviedb.org/movie/1273221 |
| 7 | Devoradores de Estrelas | https://www.themoviedb.org/movie/687163 |
| 8 | Mestres do Universo | https://www.themoviedb.org/movie/454639 |
| 9 | Pânico 7 | https://www.themoviedb.org/movie/1159559 |
| 10 | Cara de Um, Focinho de Outro | https://www.themoviedb.org/movie/1327819 |
