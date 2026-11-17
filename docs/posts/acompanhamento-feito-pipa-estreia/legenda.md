# CineData | Acompanhamento · Feito Pipa · semana de estreia

Segundo post do formato [Acompanhamento](../../conteudo/formatos/acompanhamento.md), prometido na
[Notícia de 27/10](../publicados/noticia-feito-pipa/legenda.md). A semana de estreia (05 a 11/11/2026), com as
pré-estreias (29/10 a 04/11) dentro: o post da [semana 1](../acompanhamento-feito-pipa-semana-1/legenda.md) não foi
publicado e entrou aqui. Publicação da ANCINE de 16/11/2026 (dados até 15/11). Carrossel de 5 slides 1080×1350; suba na
ordem dos números. Publicar até quinta, 19/11 (3 dias depois da atualização da ANCINE).

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Feito Pipa · a estreia"; 61.486 pessoas de 05 a 11/11 em 409 salas; 111,1 mil em duas semanas com as pré-estreias |
| 2 | `slide-02.png` | a semana dia a dia (pico de 14,7 mil no domingo, 08/11); 3.971 sessões, ocupação 9,4% (país 8,2%), 7º na semana e 2º brasileiro |
| 3 | `slide-03.png` | a régua das estreias: Feito Pipa × O Agente Secreto × Ainda Estou Aqui (público, salas, por sessão, ocupação); 28% das salas, 16% do público de O Agente Secreto |
| 4 | `slide-04.png` | onde: 8 estados em barras com a ocupação; Ceará com 17,3%, quase o dobro da média do filme |
| 5 | `slide-05.png` | o que vem: 2ª semana parcial (233 salas, −42% de quinta a domingo); ANCINE perto de 23/11; pré-lista do Oscar em dezembro |

Os PNGs vêm da rota `/marca/acompanhamento-feito-pipa-2`
(`cinedata.front/src/app/features/marca/slides-acompanhamento-feito-pipa-2.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/acompanhamento-feito-pipa-2 ../docs/posts/acompanhamento-feito-pipa-estreia http://localhost:4331
```

## Legenda

Contagem: 1.097 caracteres (limite do Instagram: 2.200).

```text
Feito Pipa · a estreia 🪁

O representante do Brasil no Oscar 2027 estreou em 05/11. Na primeira semana, 61.486 pessoas viram o filme em 409 salas. Com as pré-estreias da semana anterior (47,3 mil), são 111 mil pessoas em duas semanas.

O melhor dia foi o domingo, 08/11, com 14,7 mil. A ocupação das salas ficou em 9,4%, um pouco acima da média do país na semana (8,2%). Foi o 7º filme mais visto da semana e o 2º brasileiro, atrás de Os Farofeiros 3.

E a régua? Os dois últimos representantes do Brasil estrearam muito maiores: O Agente Secreto fez 381 mil em 1.436 salas, e Ainda Estou Aqui, 579 mil em 767. Feito Pipa teve 28% das salas de O Agente Secreto e fez 16% do público dele.

No Ceará, onde o filme foi rodado, a ocupação chegou a 17,3%, quase o dobro da média.

A 2ª semana começou em 233 salas. Quando a ANCINE fechar a semana, a gente mostra.

Você já viu Feito Pipa? Conta aqui o que achou. 👇

A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos), publicação de 16/11/2026. Imagens: TMDB/divulgação.

#FeitoPipa #Oscar2027 #CinemaBrasileiro #Bilheteria #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/feito-pipa-semana-de-estreia?utm_source=instagram&utm_medium=post&utm_campaign=acompanhamento-feito-pipa-estreia`

## Números e como conferir

Base: bilheteria por sala da ANCINE, publicação de 16/11/2026 (dados até 15/11). Feito Pipa: CPB `B2600253800000`.
Semana cinematográfica de quinta a quarta. Conferido em 16/11/2026.

| Número | Valor | Consulta |
| --- | --- | --- |
| Semana de estreia, 05 a 11/11 | 61.486 pessoas, 409 salas, 3.971 sessões (15,5 por sessão), ocupação 9,4% | 1 |
| Ocupação do país na semana | 8,2% | 2 |
| Dia a dia | 5.102 · 7.608 · 13.715 · 14.650 (dom, 08/11) · 6.120 · 6.771 · 7.520 | 3 |
| Posição | 7º da semana sem os códigos genéricos (Os Farofeiros 3, Godzilla Minus Zero, Wildwood, The Cat in the Hat, Clayface, Stray Kids World Tour); 2º brasileiro, atrás de Os Farofeiros 3 (379.544) | 4 |
| Pré-estreias, 29/10 a 04/11 | 47.284 em 235 salas, ocupação 17,3% (sem mudança com a publicação de 16/11) | 1 |
| Total até 11/11 | 111.108 (2.338 em sessões especiais de setembro e outubro + 47.284 + 61.486); até 15/11, 134.833 | 5 |
| O Agente Secreto (B2500325300000) | estreia 06 a 12/11/2025: 381.089, 1.436 salas, 20.037 sessões (19,0 por sessão), ocupação 10,0% (país 8,0%) | 1 e 2 |
| Ainda Estou Aqui (B2400324700000) | estreia 07 a 13/11/2024: 579.064, 767 salas, 11.255 sessões (51,4 por sessão), ocupação 29,6% (país 13,2%) | 1 e 2 |
| Proporções | salas 409 ÷ 1.436 = 28%; público 61.486 ÷ 381.089 = 16% | — |
| Estados | SP 18.665 (9,4%), RJ 9.854 (9,4%), CE 7.594 (17,3%), BA 4.715 (7,8%), DF 2.626 (14,8%), PE 2.465 (8,0%), MG 2.265 (8,4%), RS 1.855 (8,2%); 25 UFs. Maior ocupação: SE, 18,6%, com 652 pessoas (por isso o post diz "quase o dobro da média", não "a maior") | 6 |
| Cidades | São Paulo 12.896, Rio de Janeiro 7.897, Fortaleza 5.573, Salvador 3.549, Brasília 2.626, Porto Alegre 1.686 | 6 |
| 2ª semana, parcial | 12 a 15/11 (quinta a domingo): 23.725 em 233 salas, contra 41.075 de 05 a 08/11 (−42%); O Agente Secreto fez 230.753 na 2ª semana e Ainda Estou Aqui, 797.813 | 3 e 1 |

Vicentina Pede Desculpas (B2600253100000), outro brasileiro que entrou em circuito em 05/11, fez 1.854 pessoas em 23
salas na mesma semana. Ficou fora do post (cartão `net-oscar-feito-pipa-vicentina` no painel).

```sql
-- 1. Semanas (Feito Pipa e a régua)
SELECT codigo_obra, semana, publico, sessoes, salas, round(100.0 * publico_com_assentos / assentos, 1) AS ocupacao
FROM agregado_semana_obra
WHERE codigo_obra IN ('B2600253800000', 'B2500325300000', 'B2400324700000') ORDER BY 1, 2;

-- 2. Ocupação do país
SELECT semana, round(100.0 * sum(publico_com_assentos) / sum(assentos), 1)
FROM agregado_semana_obra WHERE semana IN ('2026-11-05', '2025-11-06', '2024-11-07') GROUP BY 1;

-- 3. Dia a dia
SELECT data_exibicao, count(*) AS sessoes, count(DISTINCT registro_sala) AS salas, sum(publico)
FROM sessoes WHERE codigo_obra = 'B2600253800000' AND data_exibicao >= '2026-11-05' GROUP BY 1 ORDER BY 1;

-- 4. Ranking da semana
SELECT o.titulo_original, a.publico, a.salas FROM agregado_semana_obra a JOIN obras o ON o.codigo = a.codigo_obra
WHERE a.semana = '2026-11-05' ORDER BY 2 DESC LIMIT 16;

-- 5. Total
SELECT sum(publico) FROM sessoes WHERE codigo_obra = 'B2600253800000' AND data_exibicao <= '2026-11-11';

-- 6. Estados (trocar sa.uf por sa.municipio, sa.uf para as cidades)
SELECT sa.uf, sum(s.publico), count(DISTINCT sa.registro),
       round(100.0 * sum(s.publico) FILTER (WHERE sa.assentos > 0) / sum(sa.assentos), 1) AS ocupacao
FROM sessoes s JOIN salas sa ON sa.registro = s.registro_sala
WHERE s.codigo_obra = 'B2600253800000' AND s.data_exibicao BETWEEN '2026-11-05' AND '2026-11-11'
GROUP BY 1 ORDER BY 2 DESC;
```

## Fatos de fora da ANCINE

| Fato | Fontes |
| --- | --- |
| Estreia em 05/11/2026, Paris Filmes; rodado no sertão do Ceará | [Omelete (27/10/2026)](https://www.omelete.com.br/filmes/feito-pipa-representante-brasil-oscar-2027-pre-estreias-data), a Notícia de 27/10 e as sessões na ANCINE |
| Pré-lista do Oscar de Filme Internacional em dezembro | [Gazeta do Povo](https://www.gazetadopovo.com.br/cultura/feito-pipa-chega-ao-oscar-2027-apos-vencer-premios-em-berlim-e-gramado/), na Notícia de 27/10 |

## Imagens (TMDB 1393615)

- Capa: backdrop `mFLrSOufgG7JcMIRUxcpj6ZtaOt.jpg` (pai e filho na moto).
- Slide 3: backdrop `63AoM6fGNhXr4byWtV9PHA1P0l6.jpg` (o menino de capa diante do açude).
- Trailer da matéria: YouTube `F8tFWtLvL64`.

## Próximo da série

"Feito Pipa · 2ª semana" (12 a 18/11), depois da atualização da ANCINE perto de 23/11, ou junto com a pré-lista do
Oscar em dezembro, se a 2ª semana sozinha não render post.
