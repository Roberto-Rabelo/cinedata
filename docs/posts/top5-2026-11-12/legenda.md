# Top 5 da semana · 12 a 18/11/2026

Carrossel de 6 slides 1080×1350, nesta ordem. Mesmo modelo dos Top 5 anteriores. A história da semana está no slide 2:
Jogos Vorazes: Amanhecer na Colheita fez 144 mil ingressos num único dia de pré-estreia (quarta, 18/11) e já entrou
em 2º. Publicar depois do Top 5 de 05 a 11/11.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa do nº 1: Os Farofeiros 3 (pôster), 253.712 ingressos em 1.142 salas; "Segue no topo na 2ª semana e já soma 644 mil" |
| 2 | `slide-02.png` | Jogos Vorazes: 144.211 num só dia (pré-estreia de 18/11), contra 250.300 da semana inteira de estreia de A Cantiga dos Pássaros e das Serpentes (2023) e 15.344 do 2º filme daquele dia; 69% dos ingressos do dia |
| 3 | `slide-03.png` | ranking do Top 5 com pôsteres e a posição da semana anterior (pré-estreia e relançamento marcados) |
| 4 | `slide-04.png` | o que mudou: Ebenezer estreia em 3º; Velozes e Furiosos (2001) de volta em 5º; saíram O Gatola, O Bosque Selvagem e Cara-de-Barro |
| 5 | `slide-05.png` | a semana em números: 1,16 milhão (▼ 14,6%); sábado 14/11 com 295 mil; a quarta com 208 mil; Top 5 com 60%; nacionais com 28,3% (77% disso de Os Farofeiros 3) |
| 6 | `slide-06.png` | os 5 pôsteres em leque e "Qual desses você viu?" |

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/top5-2026-11-12 ../docs/posts/top5-2026-11-12 http://localhost:4331
```

Números da publicação da ANCINE de 23/11/2026 (dados até 22/11).

## Legenda

Contagem: 1.154 caracteres (limite do Instagram: 2.200).

```text
Os Farofeiros 3 segue no topo na 2ª semana, com 253.712 ingressos e 644 mil no total. Mas a notícia da semana é outra: Jogos Vorazes vendeu 144 mil ingressos num único dia. 🏹🎬

O Top 5 de 12 a 18/11 (quinta a quarta), com a posição da semana anterior:
1. Os Farofeiros 3 🇧🇷: 253.712 (era 1º, ▼ 35%)
2. Jogos Vorazes: Amanhecer na Colheita: 144.211 (pré-estreia, 1 dia)
3. Ebenezer e os Fantasmas do Natal: 126.750 (estreia)
4. Godzilla Minus Zero: 86.825 (era 2º, ▼ 49%)
5. Velozes e Furiosos: 86.131 (relançamento do filme de 2001)

Todos os ingressos de Jogos Vorazes saíram na pré-estreia da quarta, 18/11: 69% de tudo o que os cinemas do país venderam naquele dia. Para comparar, A Cantiga dos Pássaros e das Serpentes, o filme anterior da saga, fez 250 mil na semana inteira de estreia, em 2023.

Foram 1,16 milhão de ingressos na semana, 14,6% menos que na anterior. Os filmes brasileiros ficaram com 28,3%, e Os Farofeiros 3 fez 77% disso.

Qual desses você viu? Conta aqui nos comentários. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos). Pôsteres: TMDB.

#cinemabrasileiro #bilheteria #cinema #jogosvorazes #osfarofeiros
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/top-5-semana-2026-11-12?utm_source=instagram&utm_medium=post&utm_campaign=top5-2026-11-12`

## Números e como conferir

Export do site (`cinedata.front/dados`, gerado em 24/11/2026 com a publicação da ANCINE até 22/11) e banco local.

| Número | Valor | Fonte |
| --- | --- | --- |
| Top 5 de 12 a 18/11 | 253.712 / 144.211 / 126.750 / 86.825 / 86.131 | `dados/semana/2026-11-12.json`, `ranking` |
| Posições e variações sobre 05 a 11/11 | Os Farofeiros 3 1º (▼ 35,0%), Godzilla Minus Zero 2º (▼ 49,0%) | `variacaoPct` |
| Os Farofeiros 3 | 644.429 até 18/11 | `sum(publico)` de `sessoes` |
| Jogos Vorazes: Amanhecer na Colheita (E2600327900000) | 144.211 em 1.416 salas, todos em 18/11; 69% dos 208.380 ingressos do dia | 1ª consulta |
| 2º filme de 18/11 | Os Farofeiros 3, 15.344 | 1ª consulta |
| A Cantiga dos Pássaros e das Serpentes (E2300444800000) | 1ª semana (09 a 15/11/2023): 250.300 em 1.307 salas | 2ª consulta |
| Ebenezer e os Fantasmas do Natal | estreia, 126.750 em 827 salas | `ranking` |
| Velozes e Furiosos (E1402487800000, filme de 2001) | 86.131 em 723 salas | `ranking`; pôster definido à mão (TMDB 9799) |
| Saíram do Top 5 | O Gatola da Cartola 3º → 6º (62.661), O Bosque Selvagem 4º → 8º (55.263), Cara-de-Barro 5º → 10º (45.398) | os dois arquivos e o banco |
| Público da semana | 1.162.875 (▼ 14,6% sobre 1.362.251) | `periodo.publico` e `resumo` |
| Dias | sábado 14/11 295.030; quarta 18/11 208.380; sexta 13/11 128.837 | 3ª consulta |
| Top 5 | 697.629 de 1.162.875 = 60,0%, entre 132 filmes | `ranking` e `resumo.obras` |
| Nacionais | 28,3% (329.089); 39,7% na semana anterior; Os Farofeiros 3 = 77% dos nacionais | `origem` |

```sql
-- 1. O dia da pré-estreia
select o.titulo_original, sum(s.publico) from sessoes s join obras o on o.codigo = s.codigo_obra
where s.data_exibicao = '2026-11-18' group by 1 order by 2 desc limit 5;

-- 2. 1ª semana de A Cantiga (primeira com pelo menos 50% do pico de salas)
select semana, publico, salas from agregado_semana_obra where codigo_obra = 'E2300444800000' order by 1 limit 3;

-- 3. Dia a dia
select data_exibicao, sum(publico) from sessoes
where data_exibicao between '2026-11-12' and '2026-11-18' group by 1 order by 1;
```

**Pré-estreia:** Jogos Vorazes teve sessões só na quarta, 18/11, nesta semana; a estreia em circuito é na semana
seguinte (19/11). O post marca o filme como "pré-estreia (1 dia)" e não como estreia.

**Relançamento:** Velozes e Furiosos é o filme de 2001 de volta às salas (código da ANCINE de 2014).
