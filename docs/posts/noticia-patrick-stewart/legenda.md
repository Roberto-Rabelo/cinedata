# CineData | Notícia · Morre Patrick Stewart, o Professor X

Patrick Stewart morreu em 28/10/2026. Esta Notícia traz a trajetória dele e os filmes dele que fizeram sucesso no Brasil, com uma
frase de *Logan*. Carrossel de 7 slides 1080×1350; suba na ordem dos números. Publicar até sábado, 31/10/2026: notícia de
morte perde força rápido.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Morre Patrick Stewart, o Professor X"; morreu na quarta (28/10), aos 86 anos; Xavier e Picard |
| 2 | `slide-02.png` | o que se sabe: morreu em casa, em Los Angeles, ao lado de Sunny Ozell; nascimento, morte, causa |
| 3 | `slide-03.png` | a trajetória: Royal Shakespeare Company (1966), Picard (1987), Xavier (2000), Sir (2010), Logan (2017), Star Trek: Picard (2020), último papel (2026) |
| 4 | `slide-04.png` | a frase: "A vida é isto: um lar, pessoas que se amam, um lugar seguro." (Logan, 2017) + 6,4 mi no Brasil |
| 5 | `slide-05.png` | 27,0 milhões de ingressos nos 5 filmes como Professor X desde 2009; 2,2 mi viram Logan legendado (35%); 42,3 mi nos 14 filmes com ele |
| 6 | `slide-06.png` | os filmes dele acima de 3 milhões, em barras; em âmbar, como Xavier; os outros 8 somam 6,6 mi |
| 7 | `slide-07.png` | a despedida: Vingadores: Doutor Destino em 17/12; régua da estreia (Doutor Estranho 2: 4,0 mi; Logan: 2,5 mi); "Xavier ou Picard?" |

Os PNGs vêm da rota `/marca/noticia-patrick-stewart` (`cinedata.front/src/app/features/marca/slides-noticia-patrick-stewart.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/noticia-patrick-stewart ../docs/posts/noticia-patrick-stewart http://localhost:4300
```

Tom: é um obituário. Sem emoji de festa e sem "bombou"; o número entra como homenagem ao alcance dele aqui.

## Legenda

Contagem: 1.155 caracteres (limite do Instagram: 2.200).

```text
Patrick Stewart (1940–2026)

O ator britânico morreu na quarta-feira (28/10), aos 86 anos, em casa, em Los Angeles. Segundo a família, ele enfrentava Alzheimer e demência com corpos de Lewy.

Do teatro de Shakespeare ao capitão Picard de Star Trek, foi no cinema o Professor Charles Xavier, o líder dos X-Men, por mais de duas décadas.

Nos dados da ANCINE, desde 2009, os cinco filmes em que ele foi Xavier levaram 27 milhões de pessoas aos cinemas do Brasil. Logan (2017) fez 6,4 milhões, e 2,2 milhões viram o filme legendado, com a voz dele. Somando vozes e participações, são 14 filmes e 42,3 milhões de espectadores.

"A vida é isto: um lar, pessoas que se amam, um lugar seguro." (Charles Xavier, em Logan)

A despedida está marcada: Vingadores: Doutor Destino, o último filme que ele gravou, de novo como Xavier, estreia em 17/12. Vamos acompanhar os números por aqui.

Xavier ou Picard: qual papel dele marcou você? 👇

A matéria completa, com a trajetória e a tabela dos filmes, está no link da bio.

Fonte: ANCINE (dados abertos). Biografia: NPR, CBS News e Poder360. Imagens: TMDB/divulgação.

#PatrickStewart #XMen #ProfessorX #Logan #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/morre-patrick-stewart-professor-x-filmes-no-brasil?utm_source=instagram&utm_medium=post&utm_campaign=noticia-patrick-stewart`

## Números e como conferir

Base: consolidado de lançamentos comerciais da ANCINE (desde 2009) e bilheteria por sala (publicação com dados até
23/10/2026). Público de carreira = soma das distribuidoras em `lancamentos`.

**Os 14 filmes com Patrick Stewart lançados no Brasil desde 2009** (papéis na filmografia da Wikipedia; títulos
brasileiros do TMDB/ANCINE):

| Ano | Filme | CPB/ROE | Papel | Público |
| --- | --- | --- | --- | --- |
| 2009 | X-Men Origens: Wolverine | E1600606100000 | Xavier (participação, sem crédito) | 3.199.434 |
| 2011 | Gnomeu e Julieta | E1500419800000 | voz | 1.127.519 |
| 2012 | A Era do Gelo 4 | E1500228600000 | voz (Ariscratle) | 8.729.837 |
| 2012 | Ted | E1402578800000 | narrador | 1.784.311 |
| 2013 | Wolverine: Imortal | E1500282900000 | Xavier (participação, sem crédito) | 3.955.740 |
| 2014 | A Lenda de Oz | E1402302700000 | voz | 540.780 |
| 2014 | X-Men: Dias de um Futuro Esquecido | E1500054300000 | Xavier | 4.923.664 |
| 2015 | Ted 2 | E1500451000000 | narrador | 743.118 |
| 2017 | Logan | E1600773900000 | Xavier | 6.400.985 |
| 2017 | Emoji: O Filme | E1700366300000 | voz | 1.684.128 |
| 2019 | O Menino que Queria Ser Rei | E1800598900000 | Merlin | 230.528 |
| 2019 | As Panteras | E1900271700000 | Bosley | 453.406 |
| 2022 | Doutor Estranho no Multiverso da Loucura | E2200135700000 | Xavier (Terra-838) | 8.489.568 |
| 2026 | As Ovelhas Detetives | E2600029100000 | voz | 52.300 |

- Total dos 14: **42.315.318**. Como Xavier (5 filmes): **26.969.391** (27,0 mi). Os outros 8 abaixo de 3 milhões: 6.616.090.
- Fora da base: X-Men (2000), X2 (2003) e X-Men: O Confronto Final (2006), anteriores ao consolidado; Star Trek
  (filmes de 1994–2002). Ficaram de fora por não terem Stewart: X-Men: Primeira Classe, Apocalipse, Fênix Negra e
  Deadpool & Wolverine; CODA (2021) é outro filme, não o *Coda* (2019) com ele.

```sql
SELECT codigo_obra, titulo, min(data_lancamento), sum(publico_total)
FROM lancamentos
WHERE codigo_obra IN ('E1600606100000','E1500419800000','E1500228600000','E1402578800000','E1500282900000',
  'E1402302700000','E1500054300000','E1500451000000','E1600773900000','E1700366300000','E1800598900000',
  'E1900271700000','E2200135700000','E2600029100000')
GROUP BY 1, 2 ORDER BY 3;
```

**Logan legendado**: 2.187.676 de 6.172.791 espectadores nas sessões (35,4%). O total das sessões é um pouco menor que o
consolidado (6.400.985).

```sql
SELECT sum(publico) FILTER (WHERE legendada), sum(publico)
FROM sessoes WHERE codigo_obra = 'E1600773900000';
```

**Semanas de estreia** (quinta a quarta): Logan, 02 a 08/03/2017, 2.474.657 (o 2º da semana fez 396.386); Doutor
Estranho 2, 05 a 11/05/2022, 4.001.017. É a maior estreia de um filme com ele desde 2016, quando começa a bilheteria por
sala; os anteriores (A Era do Gelo 4, Dias de um Futuro Esquecido) não têm semana na base.

```sql
SELECT codigo_obra, sum(publico) FROM sessoes
WHERE data_exibicao BETWEEN '2017-03-02' AND '2017-03-08' GROUP BY 1 ORDER BY 2 DESC LIMIT 2;
SELECT codigo_obra, sum(publico) FROM sessoes
WHERE data_exibicao BETWEEN '2022-05-05' AND '2022-05-11' GROUP BY 1 ORDER BY 2 DESC LIMIT 1;
```

## Fatos de fora da ANCINE

Conferidos em 30/10/2026.

| Fato | Fontes |
| --- | --- |
| Morte em 28/10/2026 (quarta), aos 86 anos, em casa em Los Angeles; Alzheimer e demência com corpos de Lewy; ao lado de Sunny Ozell; confirmada pela porta-voz Kelly Bush Novak | [NPR](https://www.npr.org/2026/10/29/1230906945/patrick-stewart-dead), [CBS News](https://www.cbsnews.com/news/patrick-stewart-dies-age-86-star-trek-actor/), [Poder360](https://www.poder360.com.br/poder-cultura/morre-aos-86-anos-patrick-stewart-ator-de-star-trek-e-x-men/), [Exame](https://exame.com/pop/morre-patrick-stewart-ator-de-x-men-e-star-trek-morre-aos-86-anos/) |
| Nascimento: 13/7/1940, Mirfield (Inglaterra) | [Wikipedia](https://en.wikipedia.org/wiki/Patrick_Stewart), [Britannica](https://www.britannica.com/biography/Patrick-Stewart) |
| Royal Shakespeare Company 1966–1982; Picard em A Nova Geração 1987–1994 e em 4 filmes; Star Trek: Picard 2020–2023; Sir em 2010 | Wikipedia, CBS News, Poder360 |
| Vingadores: Doutor Destino (Avengers: Doomsday), estreia no Brasil em 17/12/2026, com Stewart como Xavier | [Omelete](https://www.omelete.com.br/filmes/vingadores-doomsday-titulo-nacional-confirmado-disney), [Ingresso.com](https://www.ingresso.com/noticias/relancamento-vingadores-ultimato-cinemas-brasil-2026), CBS News |
| Filmografia (papéis desde 2009) | [Wikipedia, Patrick Stewart on screen and stage](https://en.wikipedia.org/wiki/Patrick_Stewart_on_screen_and_stage) |
| A frase de Logan: "This is what life looks like: a home, people who love each other, a safe place." | [Wikiquote](https://en.wikiquote.org/wiki/Logan_(film)), [The Matinee](https://www.thematinee.ca/logan/) |

Divergências: alguns veículos brasileiros dão a morte em 29/10 (data do comunicado); NPR, CBS e Poder360 dizem quarta,
28/10. O Ingresso.com ainda chama o filme de "Vingadores: Doomsday"; o título nacional confirmado pela Disney é
"Vingadores: Doutor Destino". A tradução da frase é nossa (não a da legenda ou da dublagem oficial).

## Imagens

TMDB/divulgação, `w1280`: capa e slide 2, *X-Men: Dias de um Futuro Esquecido* (TMDB 127585:
`gHzfytt17AAaGuvkIKUC20CZ6gL.jpg`, `mDamDyeFwQiHCmYsWR9YEy0V0Y8.jpg`); slides 4 e 5, *Logan* (TMDB 263115:
`yEv8c6i79vk06sZDC3Z9D8HQLVV.jpg`, `aCxTSTb2ujpkkX8xAX2nCzSKNwI.jpg`).
