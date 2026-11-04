# CineData | Notícia · Os Farofeiros 3 estreia

Os Farofeiros 3 estreia nos cinemas na quinta, 05/11/2026. Esta Notícia traz o filme e a franquia nos dados da ANCINE:
o 2º perdeu 26% do público, mas arrecadou quase o mesmo que o 1º. Carrossel de 7 slides 1080×1350; suba na ordem dos
números. Publicar no dia da estreia (05/11), de preferência à tarde; depois de domingo (08/11) perde o gancho.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Os Farofeiros 3 estreia hoje"; quinta (05/11); o 2º perdeu 26% do público e arrecadou quase o mesmo |
| 2 | `slide-02.png` | o filme: casamento na ilha fictícia de San Martinez, no Caribe; pôster; direção, roteiro, elenco, distribuição, coprodução, estreia |
| 3 | `slide-03.png` | a franquia até aqui: 2,6 mi e 1,9 mi; 1ª semana 785 mil (727 salas, 2º) e 639 mil (1.072 salas, 1º); "47% mais salas, 19% menos público" |
| 4 | `slide-04.png` | a franquia vem caindo? −26,3% de público; bilheteria R$ 36,7 → 36,5 mi (−0,7%); ingresso médio R$ 14,15 → R$ 19,06 (país: R$ 15,06 → R$ 19,67) |
| 5 | `slide-05.png` | a régua: comédias nacionais com 3º filme (Minha Mãe é uma Peça, De Pernas pro Ar, Até que a Sorte nos Separe); só uma cresceu; Se Eu Fosse Você 3 na nota |
| 6 | `slide-06.png` | a régua da estreia: 1ª semana de Minha Mãe é uma Peça 3, Os Farofeiros, De Pernas pro Ar 3, Os Farofeiros 2 e Se Eu Fosse Você 3; "o número a bater: 639 mil" |
| 7 | `slide-07.png` | o que vamos acompanhar: a semana de 05 a 11/11 (público, salas e lugar, estados); "Você vai ver o 3? Qual Farofeiros é o seu favorito?" |

Os PNGs vêm da rota `/marca/noticia-farofeiros-3` (`cinedata.front/src/app/features/marca/slides-noticia-farofeiros-3.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/noticia-farofeiros-3 ../docs/posts/noticia-farofeiros-3 http://localhost:4300
```

## Legenda

Contagem: 1.236 caracteres (limite do Instagram: 2.200).

```text
Os Farofeiros 2 levou 683 mil pessoas a menos que o primeiro aos cinemas, e arrecadou praticamente o mesmo. O 3 estreia hoje. 🏖️

Nos dados da ANCINE, o primeiro filme (2018) fez 2,6 milhões de espectadores e R$ 36,7 milhões. O segundo (2024) caiu para 1,9 milhão, mas a bilheteria ficou em R$ 36,5 milhões: o ingresso médio subiu de R$ 14,15 para R$ 19,06.

A franquia vem caindo? Em público, sim. Em dinheiro, não.

E o terceiro filme costuma ser difícil para as comédias brasileiras: das três que chegaram lá desde 2009, só Minha Mãe é uma Peça cresceu. De Pernas pro Ar e Até que a Sorte nos Separe voltaram ao tamanho do primeiro.

O número a bater na estreia: 639 mil pessoas, a 1ª semana do 2. Quando a ANCINE publicar a semana de 05 a 11/11, a gente mostra como foi.

Os Farofeiros 3, de Roberto Santucci, com Maurício Manfrini, Cacau Protásio, Danielle Winits e Aline Campos, chega só aos cinemas, com distribuição da Downtown Filmes.

Você vai ver o 3? Qual Farofeiros é o seu favorito? 👇

A matéria completa, com as tabelas da franquia, está no link da bio.

Fonte: ANCINE (dados abertos). Ficha: Ingresso.com, Omelete e Sopa Cultural. Imagens: TMDB/divulgação.

#OsFarofeiros #CinemaBrasileiro #Comedia #Bilheteria #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/os-farofeiros-3-estreia-franquia-em-numeros?utm_source=instagram&utm_medium=post&utm_campaign=noticia-farofeiros-3`

## Números e como conferir

Base: consolidado de lançamentos comerciais da ANCINE (público e renda da carreira, desde 2009) e bilheteria por sala
(desde 2016; publicação com dados até 23/10/2026). Conferido em 04/11/2026. Renda em valores da época.

**A franquia** (os dois filmes estão na ANCINE pela FreeSpirit Distribuidora; o 3 é da Downtown Filmes):

| Filme | CPB | Lançamento | Público | Renda | Ingresso médio |
| --- | --- | --- | --- | --- | --- |
| Os Farofeiros | B1700611000000 | 08/03/2018 | 2.596.209 | R$ 36.724.093,87 | R$ 14,15 |
| Os Farofeiros 2 | B2400012600000 | 07/03/2024 | 1.913.522 | R$ 36.468.385,54 | R$ 19,06 |

- Público: −26,3% (683 mil a menos). Renda: −0,7%. Ingresso médio: +34,7%.
- Ingresso médio do país (todos os lançamentos do ano): 2018 R$ 15,06; 2024 R$ 19,67 (+30,6%).
- A imprensa fala em "quase 3 milhões" para o 1º; o consolidado da ANCINE dá 2,6 milhões.

```sql
SELECT codigo_obra, titulo, data_lancamento, publico_total, renda_total,
       round(renda_total / publico_total, 2) AS ingresso_medio, distribuidora
FROM lancamentos WHERE titulo ILIKE '%farofeiros%' ORDER BY data_lancamento;

SELECT extract(year FROM data_lancamento)::int AS ano, round(sum(renda_total) / sum(publico_total), 2) AS ingresso_medio
FROM lancamentos WHERE extract(year FROM data_lancamento) IN (2018, 2024) GROUP BY 1;
```

**1ª semana** (quinta a quarta; primeira semana com pelo menos 50% do pico de salas): Os Farofeiros, 08 a 14/03/2018,
785.040 em 727 salas, 2º lugar (Pantera Negra, 822.797); Os Farofeiros 2, 07 a 13/03/2024, 639.239 em 1.072 salas,
1º lugar (Duna: Parte 2, 407.684). Salas: +47%; público: −19%.

```sql
WITH s AS (
  SELECT semana, codigo_obra, publico, salas, rank() OVER (PARTITION BY semana ORDER BY publico DESC) AS pos
  FROM agregado_semana_obra WHERE semana IN ('2018-03-08', '2024-03-07'))
SELECT s.*, o.titulo_original FROM s JOIN obras o ON o.codigo = s.codigo_obra WHERE pos <= 2 ORDER BY semana, pos;
```

**A régua: comédias brasileiras com 3º filme e carreira fechada no consolidado.** Procuradas por título entre todos os
lançamentos nacionais (`titulo ~* ' 3'`): só Minha Mãe é uma Peça 3, De Pernas pro Ar 3 e Até que a Sorte nos Separe 3
são comédias de franquia; Detetives do Prédio Azul 3 (infantil, 430 mil) ficou de fora. Se Eu Fosse Você 3 (2026) ainda
não está no consolidado: 268.266 nas sessões de 08 a 22/10/2026; Se Eu Fosse Você 2 (2009) fez 6.143.081.

| Franquia | 1º | 2º | 3º |
| --- | --- | --- | --- |
| Minha Mãe é uma Peça | 4.605.742 (2013) | 9.235.788 (2016) | 10.938.240 (2019) |
| De Pernas pro Ar | 3.506.553 (2010) | 4.846.317 (2012) | 3.587.914 (2019) |
| Até que a Sorte nos Separe | 3.417.510 (2012) | 3.978.191 (2013) | 3.335.670 (2015) |

```sql
SELECT titulo, min(data_lancamento) AS estreia, sum(publico_total) AS publico
FROM lancamentos
WHERE titulo ILIKE ANY (ARRAY['MINHA MÃE É UMA PEÇA%', 'DE PERNAS PRO AR%', 'ATÉ QUE A SORTE NOS SEPARE%', 'SE EU FOSSE VOCÊ%'])
GROUP BY 1 ORDER BY 1;

-- todos os "3" nacionais no consolidado
SELECT titulo, min(data_lancamento), sum(publico_total) FROM lancamentos
WHERE codigo_obra LIKE 'B%' AND (titulo ~* '( 3|III)( |$|:|-|\.)' OR titulo ~* ' 3$') GROUP BY 1 ORDER BY 3 DESC;

SELECT sum(publico) FROM agregado_semana_obra WHERE codigo_obra = 'B2600288300000';
```

**A régua da estreia** (1ª semana, mesma regra): Minha Mãe é uma Peça 3, 26/12/2019, 2.561.415 em 1.817 salas (1º);
De Pernas pro Ar 3, 11/04/2019, 675.082 em 1.008 salas (2º); Se Eu Fosse Você 3, 08/10/2026, 185.253 em 1.042 salas (5º).

```sql
WITH alvo AS (SELECT codigo, titulo_original FROM obras WHERE titulo_original IN
        ('DE PERNAS PRO AR 3', 'MINHA MÃE É UMA PEÇA 3', 'SE EU FOSSE VOCÊ 3', 'OS FAROFEIROS', 'OS FAROFEIROS 2')),
     s AS (SELECT a.*, rank() OVER (PARTITION BY a.semana ORDER BY a.publico DESC) AS pos FROM agregado_semana_obra a),
     pico AS (SELECT codigo_obra, max(salas) AS p FROM agregado_semana_obra GROUP BY 1),
     prim AS (SELECT s.codigo_obra, min(s.semana) AS semana FROM s JOIN pico USING (codigo_obra)
              WHERE s.salas >= 0.5 * pico.p GROUP BY 1)
SELECT alvo.titulo_original, s.semana, s.publico, s.salas, s.pos
FROM alvo JOIN prim ON prim.codigo_obra = alvo.codigo JOIN s ON s.codigo_obra = prim.codigo_obra AND s.semana = prim.semana
ORDER BY s.semana;
```

## Fatos de fora da ANCINE

Conferidos em 04/11/2026.

| Fato | Fontes |
| --- | --- |
| Estreia em 05/11/2026, só nos cinemas | [Ingresso.com, 28/10/2026](https://www.ingresso.com/noticias/filme-comedia-os-farofeiros-3-cena-exclusiva-cacau-protasio-mauricio-manfrini-danielle-winits), [Omelete, 26/08/2026](https://www.omelete.com.br/filmes/os-farofeiros-3-ganha-trailer-e-poster-confira), [Sopa Cultural, 27/10/2026](https://sopacultural.com/lecado-lanca-combo-em-parceria-com-a-downtown-filmes-para-o-lancamento-do-filme-os-farofeiros-3/) |
| Distribuição Downtown Filmes | Omelete, Sopa Cultural (o Ingresso.com cita a Downtown como parceira da cena exclusiva) |
| Coprodução Globo Filmes, Telecine e Panorama Filmes | [Ingresso.com, trailer, 26/08/2026](https://www.ingresso.com/noticias/filme-sequencia-comedia-os-farofeiros-3-trailer-1-oficial), Sopa Cultural |
| Direção Roberto Santucci, roteiro Paulo Cursino | Ingresso.com, Omelete, Sopa Cultural |
| Elenco: Maurício Manfrini, Cacau Protásio, Danielle Winits, Aline Campos, Antônio Fragoso, Charles Paraventi, Elisa Pinheiro (e Nilton Bicudo) | Ingresso.com, Omelete, Sopa Cultural, [IstoÉ](https://istoe.com.br/cacau-protasio-e-alice-palmar-os-farofeiros-3) |
| Viagem para um casamento na ilha fictícia de San Martinez, no Caribe | Ingresso.com (as duas matérias), Omelete, Sopa Cultural |

Divergências e o que ficou fora:

- **Data:** a IstoÉ (17/11/2025) dava a estreia em 24/12/2026; as três fontes de agosto a outubro de 2026 dizem 05/11.
- **De quem é o casamento:** o Ingresso.com diz "a filha de Alexandre (Antônio Fragoso)"; a Sopa Cultural, a do Rocha.
  O post fala só em "um casamento".
- **Camisa Listrada** como produtora aparece só na Sopa Cultural: ficou fora do slide (a coprodução está em duas fontes).
- Participação especial de Leo Jaime (Omelete, Sopa Cultural) e Alice Palmar no elenco (IstoÉ): fora do slide por espaço.

## Imagens

TMDB/divulgação: capa, *Os Farofeiros 3* (TMDB 1260263, `1FwuEcVE9xDlljPncsOHBAIE12m.jpg`, w1280) e pôster no slide 2
(`8VINm6QWFqh2GgNQxIb9scxxe9w.jpg`, w500); slide 3, *Os Farofeiros* (TMDB 494493, `wNDEEXoA5Wmt707lTzT3UeyHdxj.jpg`) e
*Os Farofeiros 2* (TMDB 1136897, `az8N2IEsN4bGeXVjXQRiAbjP4zf.jpg`), w780; slide 4, *Os Farofeiros 2*
(`mnNFqQMpLjsEhw5ZqIzoxJSu1eV.jpg`, w1280). Trailer da matéria: `node scripts/buscar-trailer.mjs 1260263` (YouTube
`eHz1DIYqg1M`).
