# CineData | Notícia · Feito Pipa chega aos cinemas

Primeiro post do formato **CineData | Notícia**: um fato do dia, com o contexto que só os dados dão. Carrossel de 7 slides
1080×1350; suba na ordem dos números. Publicar até quinta, 29/10/2026 (início das pré-estreias).

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Feito Pipa chega aos cinemas"; pré-estreias a partir de 29/10, estreia em 5/11 |
| 2 | `slide-02.png` | o filme: sinopse, sertão do Ceará, direção, elenco, Paris Filmes |
| 3 | `slide-03.png` | prêmios em Berlim (Generation Kplus) e Gramado 2026 |
| 4 | `slide-04.png` | 1.430 pessoas já viram o filme em 14 sessões especiais; 86,5% de ocupação contra 18% da média do país |
| 5 | `slide-05.png` | os 10 representantes do Brasil no Oscar desde 2017: os 2 últimos viraram fenômeno, os 8 anteriores somaram 814,6 mil |
| 6 | `slide-06.png` | a régua da estreia: O Agente Secreto (54,9 mil em pré-estreias, 381,1 mil na estreia) e Ainda Estou Aqui (579,1 mil) |
| 7 | `slide-07.png` | o que vamos acompanhar toda semana + agenda até o Oscar |

Os PNGs vêm da rota `/marca/noticia-feito-pipa` (`cinedata.front/src/app/features/marca/slides-noticia-feito-pipa.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/noticia-feito-pipa ../docs/posts/noticia-feito-pipa http://localhost:4340
```

## Legenda

Contagem: ~1.240 caracteres (limite do Instagram: 2.200).

```text
Feito Pipa chega aos cinemas 🪁

O representante do Brasil no Oscar 2027 tem pré-estreias a partir desta quinta (29/10) e estreia em 5 de novembro. Dirigido por Allan Deberton e rodado no sertão do Ceará, com Yuri Gomes, Teca Pereira e Lázaro Ramos.

Antes de chegar às salas, o filme ganhou o Urso de Cristal e o Grande Prêmio da mostra Generation Kplus em Berlim e foi o mais premiado de Gramado.

E ele já aparece nos dados da ANCINE: 1.430 pessoas viram Feito Pipa em 14 sessões especiais, em Quixadá e Juazeiro do Norte (CE) e no Festival do Rio. Ocupação de 86,5%, quando a média das salas do país em setembro foi 18%.

O que esperar? Os dois últimos representantes do Brasil viraram fenômeno: Ainda Estou Aqui levou 5,9 milhões de pessoas ao cinema e O Agente Secreto, 2,5 milhões. Os oito anteriores, somados, ficaram em 814,6 mil.

A partir de agora, vamos acompanhar os números de Feito Pipa toda semana aqui no CineData: público, salas, ocupação, o mapa por estado e a curva ao lado dos dois últimos fenômenos.

Vai ver na pré-estreia? 👇

Fonte: ANCINE (dados abertos), dados até 23/10/2026. Prêmios e datas: Academia Brasileira de Cinema, Paris Filmes e imprensa.

#FeitoPipa #Oscar2027 #CinemaBrasileiro #CineData #Bilheteria
```

## Números e como conferir

Base: publicação da ANCINE com bilheteria até 23/10/2026.

**Feito Pipa (CPB `B2600253800000`)**: 14 sessões, 1.430 espectadores, 1.653 assentos (86,5%). Quixadá (Cine Quixadá Sala 01,
10 a 16/09), Juazeiro do Norte (Orient Cineplace Cariri Garden Sala 05, 17 a 23/09), Rio de Janeiro (São Luiz 2, 08/10,
Festival do Rio). Ainda não está no consolidado de lançamentos.

```sql
SELECT s.data_exibicao, sa.nome, sa.municipio, sa.uf, s.publico, sa.assentos
FROM sessoes s JOIN salas sa ON sa.registro = s.registro_sala
WHERE s.codigo_obra = 'B2600253800000' ORDER BY 1;
```

**Ocupação nacional de setembro/2026**: 18,0% (público ÷ assentos das salas com capacidade cadastrada).

```sql
SELECT round(100.0 * sum(s.publico) / sum(sa.assentos), 1)
FROM sessoes s JOIN salas sa ON sa.registro = s.registro_sala
WHERE s.data_exibicao BETWEEN '2026-09-01' AND '2026-09-30' AND sa.assentos > 0;
```

**Representantes do Brasil no Oscar** (lista: Academia Brasileira de Cinema / Wikipedia), público total do consolidado de
lançamentos comerciais (soma das distribuidoras). Que Horas Ela Volta? (Oscar 2016) fica de fora: em 2015 a bilheteria por
sala ainda não cobre o país, critério usado em todo o site.

| Oscar | Filme | CPB | Público total |
| --- | --- | --- | --- |
| 2017 | Pequeno Segredo | B1600530200000 | 187.055 |
| 2018 | Bingo: O Rei das Manhãs | B1700330100000 | 249.309 |
| 2019 | O Grande Circo Místico | B1800000800000 | 51.480 |
| 2020 | A Vida Invisível | B1900366600000 | 136.419 |
| 2021 | Babenco | B2000006500000 | 4.798 |
| 2022 | Deserto Particular | B2100408300000 | 9.141 |
| 2023 | Marte Um | B2000312900000 | 104.113 |
| 2024 | Retratos Fantasmas | B2300327500000 | 72.251 |
| 2025 | Ainda Estou Aqui | B2400324700000 | 5.857.612 (Columbia 5.856.874 + Cine Caxambu 738) |
| 2026 | O Agente Secreto | B2500325300000 | 2.476.469 |

```sql
SELECT codigo_obra, sum(publico_total) FROM lancamentos
WHERE codigo_obra IN ('B1600530200000', 'B1700330100000', 'B1800000800000', 'B1900366600000', 'B2000006500000',
                      'B2100408300000', 'B2000312900000', 'B2300327500000', 'B2400324700000', 'B2500325300000')
GROUP BY 1;
```

**Semanas de estreia** (semana cinematográfica, quinta a quarta, bilheteria por sala):

- O Agente Secreto: pré-estreias em 23 a 29/10/2025 (25.500, 251 salas) e 30/10 a 05/11/2025 (29.440, 299 salas), soma 54.940;
  estreia em 06 a 12/11/2025: 381.089 em 1.436 salas.
- Ainda Estou Aqui: estreia em 07 a 13/11/2024: 579.064 em 767 salas.

```sql
SELECT (data_exibicao - ((extract(isodow FROM data_exibicao)::int + 3) % 7)) AS semana,
       sum(publico), count(DISTINCT registro_sala)
FROM sessoes WHERE codigo_obra = 'B2500325300000' AND data_exibicao < '2025-11-13'
GROUP BY 1 ORDER BY 1;
```

## Fatos de fora da ANCINE (conferidos em 27/10/2026)

- Escolhido pela Academia Brasileira de Cinema em 16/09/2026; indicados ao Oscar em 21/01/2027, cerimônia em 14/03/2027;
  pré-lista (shortlist) em dezembro.
  [Gazeta do Povo](https://www.gazetadopovo.com.br/cultura/feito-pipa-chega-ao-oscar-2027-apos-vencer-premios-em-berlim-e-gramado/)
- Pré-estreias de 29/10 a 04/11, estreia comercial em 05/11, Paris Filmes.
  [Omelete, 27/10/2026](https://www.omelete.com.br/filmes/feito-pipa-representante-brasil-oscar-2027-pre-estreias-data)
- Berlim (Generation Kplus): Urso de Cristal de Melhor Filme (Júri Jovem) e Grande Prêmio do Júri Internacional. Gramado:
  Direção, Atriz (Teca Pereira), Ator Coadjuvante (Lázaro Ramos), Júri Popular e Menção Honrosa (Yuri Gomes). Fontes acima.
- Uma matéria fala em "13 prêmios"; não consegui abrir a fonte, então o post não usa esse número.
- Imagens: cenas de divulgação no TMDB (filme 1393615).

## Próximos posts da série

Os números da semana de pré-estreias (29/10 a 04/11) saem na atualização semanal da ANCINE seguinte. Sugestão: post
"Feito Pipa · semana 1" com público, salas, ocupação e a comparação com as pré-estreias de O Agente Secreto (54,9 mil).
