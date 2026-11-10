# Especial · Outubro de 2026 em números

Carrossel de 7 slides 1080×1350 e matéria no site. Critério confirmado pelo usuário em 10/11: **público visto em
outubro** (mês civil, soma das sessões de 01 a 31/10), comparado com os outubros desde 2016, com o Top 10 do mês e a
fatia dos nacionais. Publicar no sábado, 14/11 (vaga de Especial do ritmo), com o story da matéria.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: 7,9 milhões de ingressos em outubro, ▲ 62,4% sobre outubro de 2025, nacionais com 21,5%; pôsteres do Top 5 |
| 2 | `slide-02.png` | colunas dos outubros de 2016 a 2026 na mesma escala: 2025 foi o pior fora da pandemia (4,9 mi); 2026 ficou abaixo de 2023 e 2024 |
| 3 | `slide-03.png` | o filme do mês: Verity, 1,88 milhão em outubro, 24% do público, 2,5× o líder de outubro de 2025 |
| 4 | `slide-04.png` | Top 10 de outubro com barras (nacionais em verde) |
| 5 | `slide-05.png` | cinema brasileiro: 21,5% (1,70 milhão), contra 6,6% em 2025; a maior fatia num outubro desde 2016; Minha Melhor Amiga e Se Eu Fosse Você 3; 25,5% na semana do ingresso a R$ 12 |
| 6 | `slide-06.png` | o mês em quatro números: 615 mil no sábado 03/10; 596 mil no feriado de 12/10; 1,05 mi de 22 a 28/10 (a semana mais fraca de 2026); ▼ 41% sobre setembro |
| 7 | `slide-07.png` | os 5 pôsteres em leque e "Qual filme você viu em outubro?" |

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/mes-2026-10 ../docs/posts/mes-2026-10 http://localhost:4331
```

Dados do carrossel: `cinedata.front/src/app/features/marca/mes-2026-10.json` (componente `slides-mes-2026-10.ts`).

## Legenda

Contagem: ~1.150 caracteres (limite do Instagram: 2.200).

```text
Outubro de 2026 nos cinemas: 7,9 milhões de ingressos, 62% a mais que em outubro de 2025. 🎬🇧🇷

O filme do mês foi Verity, com 1,88 milhão de pessoas só em outubro (24% de todo o público).

O Top 10 de outubro:
1. Verity: 1,88 mi
2. Minha Melhor Amiga 🇧🇷: 1,04 mi
3. Street Fighter: 528 mil
4. Outra Mamãe: 501 mil
5. Cara-de-Barro: 349 mil
6. Carros (relançamento): 309 mil
7. Se Eu Fosse Você 3 🇧🇷: 306 mil
8. Coração Selvagem: 289 mil
9. Resident Evil: 258 mil
10. As Aventuras de Tadeo e a Lâmpada Mágica: 212 mil

O cinema brasileiro ficou com 21,5% do público, a maior fatia num outubro desde 2016 (em outubro de 2025 foram 6,6%). Na última semana, com ingresso a R$ 12 para filmes nacionais, chegou a 25,5%.

Mesmo assim, o mês ficou abaixo de outubro de 2023 e de 2024, e caiu 41% em relação a setembro.

Qual filme você viu em outubro? Conta aqui. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos), público visto de 1º a 31/10. Pôsteres: TMDB.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #verity
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/cinema-outubro-2026-em-numeros?utm_source=instagram&utm_medium=post&utm_campaign=mes-2026-10`

## Critério

- **Visto em outubro**: soma de `sessoes` de 2026-10-01 a 2026-10-31, todos os filmes em cartaz (inclui os que estrearam
  em setembro, como Verity e Minha Melhor Amiga). É o mesmo número do filtro mensal do site (`dados/mes/2026-10.json`).
- Alternativa descartada: **lançados em outubro** (carreira inteira dos filmes que estrearam no mês), que tiraria
  Verity e Minha Melhor Amiga da lista.
- Fica de fora do Top 10 o código genérico `G0000000000002` (Shows e Musicais, 293.930 ingressos), que reúne eventos e
  ficaria em 8º. Com ele de fora, Tadeo (11º no ranking bruto) entra em 10º.
- Nacional = código da obra começando com `B` (mesma regra do campo `origem` do site).
- "Fora da pandemia": 2020 e 2021 ficam de fora da comparação; sem eles, 2025 é o menor outubro da série desde 2016.

## Números e como conferir

Banco local e export do site, publicação da ANCINE de 09/11/2026 (dados até 07/11), conferidos em 10/11/2026.

| Número | Valor | Fonte |
| --- | --- | --- |
| Público de outubro de 2026 | 7.913.447, 271 obras | `dados/mes/2026-10.json`, `periodo.publico` e `resumo.obras` |
| Outubro de 2025 | 4.871.629 (▲ 62,4%) | `dados/mes/2025-10.json` |
| Setembro de 2026 | 13.304.682 (▼ 40,5%) | `resumo.publicoPeriodoAnterior` |
| Outubros de 2016 a 2026 | 11,0 / 10,7 / 10,5 / 15,1 / 0,6 / 6,6 / 6,8 / 9,7 / 8,6 / 4,9 / 7,9 mi | 1ª consulta abaixo |
| Nacionais | 1.702.114 = 21,5% (2025: 6,6%; 2016: 22,2%) | `origem` do JSON; 1ª consulta |
| Verity em outubro | 1.878.388 = 23,7% do mês | `ranking` do JSON |
| Líder de outubro de 2025 | O Telefone Preto 2, 750.219 (Verity = 2,50×) | `dados/mes/2025-10.json`, `ranking[0]` |
| Top 10 | ver a legenda | `ranking` do JSON, sem o código genérico |
| Melhores dias | 03/10 (sábado) 615.006; 12/10 (feriado) 595.686 | 2ª consulta |
| Semana mais fraca de 2026 | 22 a 28/10, 1.054.322 | `dados/semana/2026-10-22.json` |
| Semana do Festival | nacionais com 25,5% de 29/10 a 04/11 | `dados/semana/2026-10-29.json`, `origem` |

```sql
select extract(year from data_exibicao)::int ano, sum(publico),
       round(100.0 * sum(publico) filter (where codigo_obra like 'B%') / sum(publico), 1) pct_nacional
from sessoes where extract(month from data_exibicao) = 10 and data_exibicao >= '2016-10-01'
group by 1 order by 1;

select data_exibicao, sum(publico) from sessoes
where data_exibicao between '2026-10-01' and '2026-10-31' group by 1 order by 2 desc limit 4;
```

## Fatos de fora da ANCINE (conferidos em 10/11/2026)

| Fato | Fontes |
| --- | --- |
| Festival do Cinema Brasileiro de 29/10 a 04/11/2026: ingresso a R$ 12 para longas brasileiros em salas convencionais das redes participantes; FENEEC e ABRAPLEX | [SBT News (29/10/2026)](https://sbtnews.sbt.com.br/noticia/brasil/festival-do-cinema-brasileiro-comeca-com-ingressos-a-r-12), [Ingresso.com (26/10/2026)](https://www.ingresso.com/noticias/festival-do-cinema-brasileiro-ingressos-promocionais-12-reais-saiba-mais) |

Carros aparece como "relançamento": voltou às salas na semana de 08/10 (`emCartazDesde`) e está no cartão
`retro-2026-relancamentos`. O ano do filme original não entra no post.
