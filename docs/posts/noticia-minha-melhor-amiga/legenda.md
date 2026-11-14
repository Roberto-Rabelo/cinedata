# CineData | Notícia · Minha Melhor Amiga passou Ainda Estou Aqui

Minha Melhor Amiga entrou no consolidado de lançamentos da ANCINE (arquivo de 12/11/2026): 6.011.069 pessoas e
R$ 108,7 milhões. Passou os 5,86 milhões de Ainda Estou Aqui em público, mas não em renda (R$ 118,2 milhões), e ficou
em 9º entre os brasileiros desde 2009. Revisado em 14/11 com o consolidado (a 1ª versão, de 11/11, usava a soma das
sessões, 6,05 mi). Carrossel de 7 slides 1080×1350; suba na ordem dos números. Publicar no fim de semana de 14 e 15/11:
o gancho agora é o número oficial.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Passou Ainda Estou Aqui"; 6,01 milhões, o maior público de um brasileiro desde 2019; o número oficial acaba de sair |
| 2 | `slide-02.png` | o filme: sinopse, pôster; direção, elenco, distribuição, nos cinemas desde 03/09, na Netflix desde 02/11 |
| 3 | `slide-03.png` | o número: 6,01 mi no consolidado (Ainda Estou Aqui: 5,86 mi); R$ 108,7 mi de renda, contra R$ 118,2 mi; 5º filme mais visto de 2026 e maior brasileiro do ano |
| 4 | `slide-04.png` | a corrida: público acumulado nas sessões, semana a semana; em 2 semanas, o que Ainda Estou Aqui fez em 9 |
| 5 | `slide-05.png` | a régua: os 10 maiores brasileiros desde 2009 no consolidado; Minha Melhor Amiga em 9º, 132 mil atrás de Se Eu Fosse Você 2 |
| 6 | `slide-06.png` | o pico e a saída: 2,18 mi na Semana do Cinema (38% do país, maior semana de um brasileiro desde jan/2020); −94% depois da Netflix (552 → 65 salas) |
| 7 | `slide-07.png` | o que vamos acompanhar: 9º lugar oficial; renda (6ª maior de um brasileiro desde 2009), vendas pós-Netflix, 2026; "Você viu no cinema ou vai ver na Netflix?" |

Os PNGs vêm da rota `/marca/noticia-minha-melhor-amiga`
(`cinedata.front/src/app/features/marca/slides-noticia-minha-melhor-amiga.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/noticia-minha-melhor-amiga ../docs/posts/noticia-minha-melhor-amiga http://localhost:4331
```

## Legenda

Contagem: 1.117 caracteres (limite do Instagram: 2.200).

```text
Minha Melhor Amiga passou Ainda Estou Aqui. Agora é oficial. 👯‍♀️🇧🇷

O número da ANCINE saiu: 6,01 milhões de pessoas viram a comédia de Susana Garcia nos cinemas. É o maior público de um filme brasileiro desde Minha Mãe é uma Peça 3, em 2019, e mais que os 5,86 milhões do vencedor do Oscar.

Em dinheiro, o drama segue na frente: R$ 118,2 milhões, contra R$ 108,7 milhões da comédia.

E ela foi rápida: em 2 semanas, já tinha o público que Ainda Estou Aqui levou 9 semanas para fazer. O pico foi na Semana do Cinema, com 2,18 milhões de pessoas em 7 dias, 38% de todo o público do país.

Desde 2009, só 8 filmes brasileiros levaram mais gente ao cinema. O 8º, Se Eu Fosse Você 2, ficou 132 mil pessoas à frente.

Desde 2/11 o filme está na Netflix, e saiu de quase todas as salas: de 552 para 65 em três dias.

Você viu no cinema ou vai ver na Netflix? 👇

A matéria completa, com a tabela da corrida, está no link da bio.

Fonte: ANCINE (dados abertos), consolidado de lançamentos de 12/11/2026 e sessões até 8/11. Imagens: TMDB/divulgação.

#MinhaMelhorAmiga #CinemaBrasileiro #Bilheteria #AindaEstouAqui #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/minha-melhor-amiga-passou-ainda-estou-aqui?utm_source=instagram&utm_medium=post&utm_campaign=noticia-minha-melhor-amiga`

## Números e como conferir

Base: consolidado de lançamentos da ANCINE (`lancamentos`, desde 2009; arquivo publicado em 12/11/2026, importado em
14/11) para público e renda da carreira, e bilheteria por sala (`sessoes`, desde 2014; publicação de 09/11/2026 com
dados até 08/11) para as curvas, o pico e a saída. Conferido em 14/11/2026.

**Revisão de 14/11.** O consolidado trouxe Minha Melhor Amiga com **6.011.069** pessoas e **R$ 108.680.914,79**, menos
que a soma das sessões (6.049.185, −0,6%). Para Ainda Estou Aqui, o consolidado tinha vindo acima das sessões (+2,2%).
Com o número oficial, a posição fica em 9º, 132.012 atrás de Se Eu Fosse Você 2, e a dúvida "8º ou 9º?" da 1ª versão
caiu. O dia da ultrapassagem (24/10) saiu da peça: ele só existe na soma das sessões, que o consolidado não confirma.
Na ANCINE, a distribuidora aparece como SM Distribuidora de Filmes, a mesma razão social de Nada a Perder (lançado pela
Paris Filmes); o post mantém Paris Filmes, como dizem Forbes e AdoroCinema.

| Número | Valor | Consulta |
| --- | --- | --- |
| Público e renda de Minha Melhor Amiga | consolidado: 6.011.069 e R$ 108.680.914,79 (ingresso médio R$ 18,08); sessões: 6.049.185 (03/09 a 08/11/2026) | 2 e 1 |
| Renda de Ainda Estou Aqui | R$ 118.219.147,44 (ingresso médio R$ 20,18) | 2 |
| 2026 no consolidado | 5º lançamento do ano em público (Homem-Aranha: Um Novo Dia 18,8 mi, Toy Story 5, Michael, O Diabo Veste Prada 2) | 2 |
| Renda entre os brasileiros | 6ª desde 2009, valores da época (Minha Mãe é uma Peça 3, Minha Mãe é uma Peça 2, Nada a Perder, Ainda Estou Aqui, Os Dez Mandamentos) | 2 |
| Ainda Estou Aqui | 5.857.612 no consolidado (duas linhas: Columbia 5.856.874 + Cine Caxambu 738); 5.731.852 nas sessões (+2,2%) | 1 e 2 |
| Passou Ainda Estou Aqui (só nas sessões, fora da peça) | sábado, 24/10/2026: acumulado 5.870.562 (52º dia desde 03/09) | 3 |
| Os 10 maiores brasileiros desde 2009 | ver o slide 5; Se Eu Fosse Você 2 = 6.143.081 (132.012 à frente) | 2 |
| Curvas semanais | Amiga: semanas de 03/09 a 29/10; Ainda Estou Aqui: de 07/11/2024 a 27/03/2025 (o acumulado inclui 3.099 de duas sessões de festival em 19/09 e 17/10/2024) | 4 |
| 2ª semana | 10 a 16/09: 2.175.039 de 5.675.781 do país (38,3%); a maior semana de um brasileiro desde Minha Mãe é uma Peça 3 (09 a 15/01/2020, 2.273.384) | 4 e 5 |
| 2026 | 5º no ano (Homem-Aranha: Um Novo Dia, Toy Story 5, Michael, O Diabo Veste Prada 2) e 1º brasileiro | 6 |
| Saída | quinta a sábado: 47.959 (29 a 31/10) → 2.759 (05 a 07/11), −94%; salas no dia: 552 (04/11), 157 (05/11), 118 (06/11), 65 (07/11) | 7 |

A semana de 05/11 está parcial: o país tem 3.015, 2.673 e 2.626 salas com sessão em 05, 06 e 07/11, contra cerca de
3.250 nos dias anteriores. A queda do filme (−94%) é muito maior que a falta de dados.

```sql
-- 1. Público pelas sessões
SELECT codigo_obra, sum(publico), min(data_exibicao), max(data_exibicao)
FROM sessoes WHERE codigo_obra IN ('B2600181900000', 'B2400324700000') GROUP BY 1;

-- 2. Maiores brasileiros no consolidado
SELECT codigo_obra, titulo, data_lancamento, sum(publico_total) AS publico, sum(renda_total) AS renda
FROM lancamentos WHERE codigo_obra LIKE 'B%' GROUP BY 1, 2, 3 ORDER BY publico DESC LIMIT 12;

-- 3. Dia da ultrapassagem
WITH d AS (SELECT data_exibicao, sum(publico) p FROM sessoes WHERE codigo_obra = 'B2600181900000' GROUP BY 1)
SELECT data_exibicao, p, sum(p) OVER (ORDER BY data_exibicao) AS acumulado FROM d ORDER BY 1;

-- 4. Semanas (quinta a quarta)
SELECT semana, publico, salas, sum(publico) OVER (PARTITION BY codigo_obra ORDER BY semana) AS acumulado
FROM agregado_semana_obra WHERE codigo_obra IN ('B2600181900000', 'B2400324700000') ORDER BY codigo_obra, semana;

-- 5. Maiores semanas de filmes brasileiros
SELECT a.semana, o.titulo_original, a.publico FROM agregado_semana_obra a JOIN obras o ON o.codigo = a.codigo_obra
WHERE a.codigo_obra LIKE 'B%' ORDER BY a.publico DESC LIMIT 8;

-- 6. Mais vistos em 2026
SELECT codigo_obra, sum(publico) FROM sessoes WHERE data_exibicao >= '2026-01-01' GROUP BY 1 ORDER BY 2 DESC LIMIT 8;

-- 7. Saída depois da Netflix
SELECT data_exibicao, count(DISTINCT registro_sala) AS salas, sum(publico)
FROM sessoes WHERE codigo_obra = 'B2600181900000' AND data_exibicao >= '2026-10-29' GROUP BY 1 ORDER BY 1;
```

## Fatos de fora da ANCINE (conferidos em 11/11/2026)

| Fato | Fontes |
| --- | --- |
| Na Netflix desde 02/11/2026 (anúncio em 01/11) | [Omelete (01/11/2026)](https://www.omelete.com.br/filmes/minha-melhor-amiga-ingrid-guimaraes-monica-martelli-lancamento-netflix-brasil-data), [O Tempo (02/11/2026)](https://www.otempo.com.br/entretenimento/filmes-e-series/2026/11/2/apos-sucesso-nos-cinemas-minha-melhor-amiga-chega-ao-streaming-saiba-onde-assistir) |
| Direção de Susana Garcia; Mônica Martelli e Ingrid Guimarães; Giulia Benite e Gabi Amaral como as filhas | [Forbes Brasil (21/10/2026)](https://forbes.com.br/forbes-life/2026/10/minha-melhor-amiga-supera-bilheteria-do-vencedor-do-oscar-ainda-estou-aqui/), [AdoroCinema](https://www.adorocinema.com/filmes/filme-1000027736/) |
| Distribuição da Paris Filmes; estreia em 03/09/2026 | Forbes Brasil e AdoroCinema (acima); a 1ª sessão na ANCINE é de 03/09 |
| Sinopse: amigas na casa dos 50 viajam para a Europa quando as filhas vão fazer intercâmbio em Portugal | AdoroCinema, [Omelete (21/10/2026)](https://www.omelete.com.br/filmes/minha-melhor-amiga-ingrid-guimaraes-monica-martelli-supera-ainda-estou-aqui) |
| Semana do Cinema de 10 a 16/09/2026: R$ 10 nas sessões antes das 17h, R$ 12 nas demais | [Ingresso.com (31/08/2026)](https://www.ingresso.com/noticias/semana-do-cinema-2026-nona-edicao-ingresso-10-reais), [Omelete (31/08/2026)](https://www.omelete.com.br/filmes/semana-do-cinema-2026-datas-ingressos-a-10-reais-e-filmes-participantes) |

Divergências na imprensa, que ficaram de fora do post:

- O Tempo dá a direção a "Suzan Pires"; as outras cinco páginas dizem Susana Garcia.
- O roteiro varia de uma página para outra (AdoroCinema: Patrícia Leme e Susana Garcia; Omelete e Ingresso.com somam
  outras roteiristas), por isso a ficha não traz roteiro.
- A imprensa diz "8º maior público nacional do século" (5,84 mi sem fonte; 5,9 mi pelo Filme B, na Ingresso.com).
  Pela ANCINE, desde 2009, ela é a 9ª, atrás de Se Eu Fosse Você 2. O post diz isso e deixa a posição final para o
  consolidado.
- A renda (R$ 104,9 a 105 milhões na imprensa) não entra: a bilheteria por sala da ANCINE não traz renda e o
  consolidado de 2026 ainda não saiu.
- A continuação (Minha Melhor Amiga 2) apareceu numa busca, atribuída ao Filme B, mas não foi conferida em 2 fontes.

## Imagens (TMDB 1257147)

- Capa: backdrop `7y0tWfGwsGnlNAJTza3RkEwETPC.jpg` (as duas amigas rindo).
- Slide 2: pôster `wGfTFVeguXDXYrwPQ8QMFsaSK2M.jpg`.
- Slide 3: backdrop `1TWjcJmcmhCntrcjwiWbM6jQcni.jpg`.
- Trailer da matéria: YouTube `nf6OxQNIOeM` (`node scripts/buscar-trailer.mjs 1257147`).
