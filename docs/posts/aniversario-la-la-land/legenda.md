# Aniversário · La La Land faz 10 anos

Primeiro post do formato [Aniversário](../../conteudo/formatos/aniversario.md). La La Land estreou no mundo em
31/08/2016 (abertura do Festival de Veneza), chegou ao Brasil em 19/01/2017 e foi relançado aqui em 20/08/2026 pelos 10
anos. Carrossel de 7 slides 1080×1350; suba na ordem dos números. Publicar quando quiser em novembro (o aniversário
mundial e o relançamento já passaram). Outra opção é esperar 09/12, os 10 anos da estreia nos EUA, ou 19/01/2027, os 10
anos no Brasil.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "La La Land faz 10 anos"; 1,4 milhão de pessoas no Brasil em 2017; voltou às salas em agosto |
| 2 | `slide-02.png` | linha do tempo: Veneza (31/08/16), EUA (09/12/16), 7 Globos de Ouro (08/01/17), Brasil (19/01/17), 14 indicações (24/01/17), 6 Oscars e o envelope trocado (26/02/17), relançamento (20/08/26) |
| 3 | `slide-03.png` | a frase: "As pessoas amam aquilo que apaixona os outros." (Mia) |
| 4 | `slide-04.png` | semana a semana em 2017: pré-estreias 152 mil, estreia 377 mil, 7 semanas no top 10 sem passar do 5º; na semana do Oscar o público dobrou |
| 5 | `slide-05.png` | 94% viram legendado; 315 mil na cidade de São Paulo e 218 mil no Rio (38% do público) |
| 6 | `slide-06.png` | os 9 indicados a melhor filme de 2017 no Brasil: La La Land 1,4 mi, 4 vezes Moonlight (341 mil), o vencedor |
| 7 | `slide-07.png` | 10 anos depois: 21,4 mil na semana do relançamento (9º, 127 salas), 30,4 mil em 2026; "Você viu no cinema em 2017 ou agora?" |

Os PNGs vêm da rota `/marca/aniversario-la-la-land` (`cinedata.front/src/app/features/marca/slides-aniversario-la-la-land.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/aniversario-la-la-land ../docs/posts/aniversario-la-la-land http://localhost:4300
```

## Legenda

Contagem: 1.182 caracteres (limite do Instagram: 2.200).

```text
La La Land faz 10 anos, e 1,4 milhão de pessoas viram o musical nos cinemas do Brasil 🎹

O filme de Damien Chazelle abriu o Festival de Veneza em agosto de 2016 e chegou aqui em janeiro de 2017, já com o recorde de 7 Globos de Ouro. Dias depois, recebeu 14 indicações ao Oscar.

Nos dados da ANCINE:
🎟️ 377 mil pessoas na semana de estreia, e 7 semanas no top 10
🗣️ 94% viram legendado, ouvindo Emma Stone e Ryan Gosling cantarem
🏙️ só a cidade de São Paulo somou 315 mil espectadores
🏆 na semana do Oscar, o público dobrou

Na cerimônia, foi anunciado por engano como melhor filme, e o prêmio era de Moonlight. Nos cinemas do Brasil, La La Land levou 4 vezes mais gente que o vencedor.

Dez anos depois, ele voltou às salas em 20 de agosto e ficou em 9º na semana, à frente de estreias.

"As pessoas amam aquilo que apaixona os outros." (Mia, em La La Land)

Você viu no cinema em 2017 ou agora, na volta? Conta aqui 👇

A matéria completa, com as semanas em cartaz e os indicados de 2017, está no link da bio.

Fonte: ANCINE (dados abertos). Fatos: Wikipedia, Rolling Stone Brasil e Folha de Pernambuco. Imagens: TMDB/divulgação.

#LaLaLand #EmmaStone #RyanGosling #Oscar #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/la-la-land-faz-10-anos-publico-no-brasil?utm_source=instagram&utm_medium=post&utm_campaign=aniversario-la-la-land`

## Números e como conferir

Base: consolidado de lançamentos comerciais da ANCINE e bilheteria por sala (publicação com dados até 23/10/2026).
CPB/ROE de La La Land: `E1600677400000`.

**Público total (carreira de 2017)**: 1.422.952, renda R$ 24.342.316,91 (valores da época), SM Distribuidora,
lançamento 19/01/2017.

```sql
SELECT codigo_obra, min(data_lancamento), sum(publico_total), sum(renda_total)
FROM lancamentos WHERE codigo_obra = 'E1600677400000' GROUP BY 1;
```

**Semana a semana** (quinta a quarta) e posição no ranking da semana. A de 12/01 é a das pré-estreias (7º lugar). Da
estreia (19/01) até 02/03 são 7 semanas seguidas no top 10, com 5º lugar como melhor posição (atrás de Moana, Minha
Mãe é uma Peça 2, xXx: Reativado e Assassin's Creed na semana de estreia). Na semana de 23/02 (Oscar em 26/02), as
salas foram de 156 para 287 e o público de 47.484 para 99.456 (×2,1).

| Semana | Público | Salas | Posição |
| --- | --- | --- | --- |
| 12/01/2017 | 152.270 | 208 | 7º |
| 19/01 | 377.084 | 319 | 5º |
| 26/01 | 313.178 | 356 | 5º |
| 02/02 | 189.412 | 282 | 5º |
| 09/02 | 98.456 | 213 | 8º |
| 16/02 | 47.484 | 156 | 9º |
| 23/02 | 99.456 | 287 | 10º |
| 02/03 | 53.679 | 248 | 8º |
| 09/03 | 13.983 | 79 | 15º |

```sql
WITH s AS (SELECT semana, codigo_obra, publico, salas,
             rank() OVER (PARTITION BY semana ORDER BY publico DESC) pos
           FROM agregado_semana_obra WHERE semana BETWEEN '2017-01-01' AND '2017-06-30')
SELECT semana, publico, salas, pos FROM s WHERE codigo_obra = 'E1600677400000' ORDER BY semana;
```

**Legendado e cidades** (todas as sessões, 2017 a 2026): 1.303.070 de 1.385.041 em sessões legendadas (94,1%). Cidade
de São Paulo 315.012, Rio de Janeiro 218.076, as duas juntas 38,5%. O total das sessões é um pouco menor que o
consolidado.

```sql
SELECT sum(publico), sum(publico) FILTER (WHERE legendada) FROM sessoes WHERE codigo_obra = 'E1600677400000';
SELECT s.municipio, sum(x.publico) FROM sessoes x JOIN salas s ON s.registro = x.registro_sala
WHERE x.codigo_obra = 'E1600677400000' GROUP BY 1 ORDER BY 2 DESC LIMIT 5;
```

**Os 9 indicados a melhor filme do Oscar 2017** (público total no Brasil): La La Land 1.422.952; A Chegada
(`E1700028800000`) 581.942; Estrelas Além do Tempo (`E1600763600000`) 398.251; Moonlight: Sob a Luz do Luar
(`E1600788800000`) 340.862; Até o Último Homem (`E1600757700000`) 271.736; Lion: Uma Jornada para Casa
(`E1600776400000`) 209.164; Manchester à Beira-Mar (`E1600573600000`) 105.869; Um Limite Entre Nós (`E1700063700000`)
83.641; A Qualquer Custo (`E1600689600000`) 52.136. Os outros oito somam 2.043.601. La La Land / Moonlight = 4,17.

```sql
SELECT codigo_obra, titulo, sum(publico_total) FROM lancamentos
WHERE codigo_obra IN ('E1600677400000','E1700028800000','E1600763600000','E1600788800000','E1600757700000',
  'E1600776400000','E1600573600000','E1700063700000','E1600689600000')
GROUP BY 1, 2 ORDER BY 3 DESC;
```

**Relançamento (2026)**: semana de 20/08/2026, 21.373 pessoas em 127 salas, 9º lugar, à frente de estreias da mesma
semana (Amigas Sem Filtro, 12º, e Refém por um Fio, 16º, entre outras). Em 2026 todo: 30.426 (inclui 4.882 numa sessão
especial de um dia, em 01/06/2026). Houve também sessões avulsas em 2020 (1.558) e 2025 (544). O relançamento não muda o
consolidado de 2017.

```sql
SELECT extract(year FROM data_exibicao), sum(publico) FROM sessoes
WHERE codigo_obra = 'E1600677400000' GROUP BY 1 ORDER BY 1;
```

## Fatos de fora da ANCINE

Conferidos em 03/11/2026.

| Fato | Fontes |
| --- | --- |
| Estreia mundial em 31/08/2016, abrindo o 73º Festival de Veneza; nos EUA em 09/12/2016 | [Wikipedia](https://en.wikipedia.org/wiki/La_La_Land), [Folha de Pernambuco](https://www.folhape.com.br/cultura/o-musical-la-la-land-volta-aos-cinemas-do-brasilem-comemoracao-aos/504754/) |
| 7 Globos de Ouro em 08/01/2017, todos a que concorria, recorde | [Wikipedia (74º Globo de Ouro)](https://en.wikipedia.org/wiki/74th_Golden_Globe_Awards), [Rolling Stone Brasil](https://rollingstone.com.br/cinema/la-la-land-cantando-estacoes-reestreia-nos-cinemas/) |
| 14 indicações ao Oscar (anunciadas em 24/01/2017), empatado com A Malvada e Titanic; 6 prêmios (direção, atriz, fotografia, direção de arte, trilha, canção); anúncio errado de melhor filme, vencido por Moonlight | [Wikipedia (89º Oscar)](https://en.wikipedia.org/wiki/89th_Academy_Awards), Rolling Stone Brasil, Folha de Pernambuco |
| Relançamento no Brasil em 20/08/2026 pelos 10 anos, pela Paris Filmes | Rolling Stone Brasil, Folha de Pernambuco, [Ingresso.com](https://www.ingresso.com/noticias/filme-la-la-land-cantando-estacoes-relancamento-cinemas-brasil-ryan-gosling-emma-stone) |
| A frase: "People love what other people are passionate about", Mia a Sebastian (o clube de jazz) | [Wikiquote](https://en.wikiquote.org/wiki/La_La_Land), [Movie Mistakes](https://moviemistakes.com/film11758/quotes) |

Divergências: a bilheteria mundial aparece como US$ 447 milhões (Rolling Stone Brasil) e US$ 540,8 milhões
(Wikipedia, que pode já somar relançamentos); ficou fora do post. Nos EUA, o relançamento foi em 16/08/2026 (Wikipedia),
e no Brasil em 20/08. A tradução da frase é nossa.

## Imagens

TMDB/divulgação (filme 313369), `w1280`: capa, a dança no mirante (`ik2D3KqxFD0O0Bc3Wv1CZm8sOg8.jpg`); slide 3, Mia
(`frM7tvt49DjYJx5TW7GSDyRogEw.jpg`); slide 5, os dois na sala de cinema (`nofXR1TN1vgGjdfnwGQwFaAWBaY.jpg`).
