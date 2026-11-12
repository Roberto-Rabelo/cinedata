# CineData | Acompanhamento · Feito Pipa · semana 1: pré-estreias

Primeiro post do formato [Acompanhamento](../../conteudo/formatos/acompanhamento.md), prometido na
[Notícia de 27/10](../publicados/noticia-feito-pipa/legenda.md). A semana de pré-estreias (29/10 a 04/11/2026), na
publicação da ANCINE de 09/11. Carrossel de 5 slides 1080×1350; suba na ordem dos números. Publicar até sábado, 14/11.
Depois disso, juntar com a semana de estreia (ANCINE por volta de 16/11).

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Feito Pipa · semana 1"; 47.284 pessoas nas pré-estreias em 235 salas; mais que cada semana de pré-estreia de O Agente Secreto, com mais de 5 vezes as sessões |
| 2 | `slide-02.png` | a semana dia a dia (pico de 10.533 no feriado de 02/11); 1.585 sessões, ocupação de 17,3% (país: 10,9%), 11º na semana e 4º entre os brasileiros |
| 3 | `slide-03.png` | a régua: Feito Pipa (1 semana) × O Agente Secreto (2 semanas de pré-estreia): público, sessões, por sessão (30 × 98), ocupação (17,3% × 43,3%); Festival do Cinema Brasileiro |
| 4 | `slide-04.png` | onde: 8 estados em barras com a ocupação; Ceará com 35,9%; cidades com mais público |
| 5 | `slide-05.png` | o que vem: a semana de estreia (05 a 11/11) na ANCINE perto de 16/11; régua de 381,1 mil e 579,1 mil; pré-lista do Oscar em dezembro |

Os PNGs vêm da rota `/marca/acompanhamento-feito-pipa-1`
(`cinedata.front/src/app/features/marca/slides-acompanhamento-feito-pipa-1.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/acompanhamento-feito-pipa-1 ../docs/posts/acompanhamento-feito-pipa-semana-1 http://localhost:4331
```

## Legenda

Contagem: 990 caracteres (limite do Instagram: 2.200).

```text
Feito Pipa · semana 1 🪁

Prometemos acompanhar o representante do Brasil no Oscar 2027 toda semana. Começamos pelas pré-estreias: 47.284 pessoas viram o filme de 29/10 a 04/11, em 235 salas de 24 estados.

O pico foi no feriado de Finados: 10.533 pessoas na segunda, 02/11. A ocupação das salas ficou em 17,3%, acima da média do país na semana (10,9%).

E a régua? O Agente Secreto fez 54,9 mil em duas semanas de pré-estreia. Feito Pipa chegou perto em uma só, mas com muito mais sessões: 30 pessoas por sessão, contra 98. Foi quase um lançamento, e na semana do ingresso a R$ 12 para filmes brasileiros.

No Ceará, onde o filme foi rodado, a ocupação chegou a 35,9%.

A estreia foi em 05/11. Quando a ANCINE fechar a semana, a gente mostra como foi.

Você já viu Feito Pipa? Conta aqui o que achou. 👇

A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos), publicação de 09/11/2026. Imagens: TMDB/divulgação.

#FeitoPipa #Oscar2027 #CinemaBrasileiro #Bilheteria #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/feito-pipa-semana-1-pre-estreias?utm_source=instagram&utm_medium=post&utm_campaign=acompanhamento-feito-pipa-semana-1`

## Números e como conferir

Base: bilheteria por sala da ANCINE, publicação de 09/11/2026 (dados até 08/11). Feito Pipa: CPB `B2600253800000`.
Semana cinematográfica de quinta a quarta. Conferido em 11/11/2026.

| Número | Valor | Consulta |
| --- | --- | --- |
| Semana de 29/10 a 04/11 | 47.284 pessoas, 235 salas, 1.585 sessões (6,7 por sala), ocupação 17,3% | 1 |
| Ocupação do país na semana | 10,9% (setembro: 18,0%, com a Semana do Cinema) | 2 |
| Dia a dia | 2.707 · 5.749 · 9.082 · 9.923 · 10.533 (02/11, Finados) · 4.020 · 5.270 | 3 |
| Posição | 11º da semana sem os códigos genéricos (Mostras e Festivais, Shows e Musicais), 13º com eles; 4º brasileiro, atrás de As Dez Vantagens de Morrer Depois de Você, Minha Melhor Amiga e 100 Dias | 4 |
| O Agente Secreto (B2500325300000) | pré-estreias 23/10 a 05/11/2025: 25.500 (252 sessões, 251 salas) + 29.440 (306 sessões, 299 salas) = 54.940 em 558 sessões, ocupação 43,3% (país nas duas semanas: 6,6%); estreia 06 a 12/11/2025: 381.089 em 1.436 salas | 1 e 2 |
| Por sessão | Feito Pipa 47.284 ÷ 1.585 = 29,8; O Agente Secreto 54.940 ÷ 558 = 98,5 | — |
| Estados | RJ 10.876 (27,0%), SP 10.679 (14,9%), CE 5.920 (35,9%), BA 5.023 (14,8%), DF 2.154 (42,2%), PE 1.936, MG 1.904, PR 1.164; 24 UFs | 5 |
| Cidades | Rio de Janeiro 10.011, São Paulo 6.632, Salvador 4.008, Fortaleza 3.765, Brasília 2.154, Juazeiro do Norte 1.670 | 6 |
| Antes de 29/10 | 2.338 pessoas em sessões especiais (Quixadá, Juazeiro do Norte, Festival do Rio, e 725 em 28/10); fora do total da semana | 7 |

Ainda Estou Aqui não entra na régua das pré-estreias: antes da estreia (07/11/2024), teve só duas sessões de festival.

```sql
-- 1. A semana (e O Agente Secreto)
SELECT codigo_obra, semana, publico, sessoes, salas, round(100.0 * publico_com_assentos / assentos, 1) AS ocupacao
FROM agregado_semana_obra WHERE codigo_obra IN ('B2600253800000', 'B2500325300000') ORDER BY 1, 2;

-- 2. Ocupação do país
SELECT semana, round(100.0 * sum(publico_com_assentos) / sum(assentos), 1)
FROM agregado_semana_obra WHERE semana IN ('2026-10-29', '2025-10-23', '2025-10-30') GROUP BY 1;

-- 3. Dia a dia
SELECT data_exibicao, count(*) AS sessoes, count(DISTINCT registro_sala) AS salas, sum(publico)
FROM sessoes WHERE codigo_obra = 'B2600253800000' GROUP BY 1 ORDER BY 1;

-- 4. Ranking da semana
SELECT o.titulo_original, a.publico FROM agregado_semana_obra a JOIN obras o ON o.codigo = a.codigo_obra
WHERE a.semana = '2026-10-29' ORDER BY 2 DESC LIMIT 14;

-- 5 e 6. Estados e cidades
SELECT sa.uf, sum(s.publico), count(DISTINCT sa.registro),
       round(100.0 * sum(s.publico) FILTER (WHERE sa.assentos > 0) / sum(sa.assentos), 1) AS ocupacao
FROM sessoes s JOIN salas sa ON sa.registro = s.registro_sala
WHERE s.codigo_obra = 'B2600253800000' AND s.data_exibicao BETWEEN '2026-10-29' AND '2026-11-04'
GROUP BY 1 ORDER BY 2 DESC;   -- trocar sa.uf por sa.municipio, sa.uf para as cidades

-- 7. Antes das pré-estreias
SELECT sum(publico) FROM sessoes WHERE codigo_obra = 'B2600253800000' AND data_exibicao < '2026-10-29';
```

## Fatos de fora da ANCINE (conferidos em 11/11/2026)

| Fato | Fontes |
| --- | --- |
| Pré-estreias de 29/10 a 04/11 e estreia em 05/11/2026, Paris Filmes; rodado no sertão do Ceará | [Omelete (27/10/2026)](https://www.omelete.com.br/filmes/feito-pipa-representante-brasil-oscar-2027-pre-estreias-data), a Notícia de 27/10 e as sessões na ANCINE (a partir de 29/10) |
| Festival do Cinema Brasileiro, 29/10 a 04/11/2026: ingresso a R$ 12 para longas brasileiros nas redes participantes | [SBT News (29/10/2026)](https://sbtnews.sbt.com.br/noticia/brasil/festival-do-cinema-brasileiro-comeca-com-ingressos-a-r-12), [Ingresso.com (26/10/2026)](https://www.ingresso.com/noticias/festival-do-cinema-brasileiro-ingressos-promocionais-12-reais-saiba-mais) |
| Pré-lista do Oscar de Filme Internacional em dezembro | [Gazeta do Povo](https://www.gazetadopovo.com.br/cultura/feito-pipa-chega-ao-oscar-2027-apos-vencer-premios-em-berlim-e-gramado/), na Notícia de 27/10 |

## Imagens (TMDB 1393615)

- Capa: backdrop `4riq7SB76q2I3zyEIK3nTtTJeCX.jpg` (o menino, em close).
- Slide 3: backdrop `o3TqdDs8QJ2Jb5iAXOxETWsvp4J.jpg` (a dança, luz roxa).
- Trailer da matéria: YouTube `F8tFWtLvL64` (o mesmo da Notícia).

## Próximo da série

"Feito Pipa · semana de estreia" (05 a 11/11), depois da atualização da ANCINE por volta de 16/11. Régua: O Agente
Secreto 381.089 (1.436 salas) e Ainda Estou Aqui 579.064 (767 salas) na semana de estreia. Prévia parcial (05 a
08/11, dados incompletos): 25.369 pessoas em 375 salas, ocupação de 9,8%.
