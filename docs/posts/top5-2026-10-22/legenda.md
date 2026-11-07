# Top 5 da semana · 22 a 28/10/2026

Carrossel de 6 slides 1080×1350, nesta ordem (suba os arquivos na ordem dos números). Mesmo modelo do Top 5 de 15 a
21/10 (pôsteres do TMDB, comparação com a semana anterior). A ANCINE só publicou esta semana em 07/11 (atraso do
feriado de 02/11), então o post sai atrasado; a semana de 29/10 a 04/11 também já está completa.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa do nº 1: Cara-de-Barro (pôster), 238.097 ingressos em 1.102 salas; "Estreou e tirou Street Fighter do topo" |
| 2 | `slide-02.png` | a troca no topo: Cara-de-Barro (estreia → 1º) × Street Fighter (1º → 3º), 67% a mais; Verity em 2º com 1,92 milhão |
| 3 | `slide-03.png` | ranking do Top 5 com pôsteres e a posição da semana anterior |
| 4 | `slide-04.png` | o que mudou: Minha Melhor Amiga com 5,91 milhões na 8ª semana; Daniel e a Fornalha Ardente estreia em 5º; Outra Mamãe e Dentro da Baleia saíram do Top 5 |
| 5 | `slide-05.png` | a semana em números: 1,05 milhão (▼ 31,7%), a semana mais fraca de 2026; Top 5 com 66,1%; nacionais com 13,7% |
| 6 | `slide-06.png` | os 5 pôsteres em leque e "Qual desses você viu?" |

Os PNGs vêm da rota `/marca/top5-2026-10-22` do front (`cinedata.front/src/app/features/marca/slides-top5-2026-10-22.ts`),
com o front em modo API (`ng serve`; os pôsteres em w780 vêm do TMDB):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/top5-2026-10-22 ../docs/posts/top5-2026-10-22 http://localhost:4331
```

Semana completa: os 7 dias consolidados na publicação da ANCINE de 07/11/2026, com dados até 05/11.

## Legenda

Contagem: ~1.050 caracteres (limite do Instagram: 2.200).

```text
Cara-de-Barro estreou e tirou Street Fighter do topo: 238.097 ingressos, 67% a mais que o líder da semana anterior. 🎬

O Top 5 de 22 a 28/10 (quinta a quarta), com a posição da semana anterior:
1. Cara-de-Barro: 238.097 (estreia)
2. Verity: 146.389 (era 2º, ▼ 53,6%)
3. Street Fighter: 142.791 (era 1º, ▼ 56,6%)
4. Minha Melhor Amiga 🇧🇷: 95.205 (era 3º, ▼ 47,0%)
5. Daniel e a Fornalha Ardente: 71.374 (estreia)

Minha Melhor Amiga, na 8ª semana, já soma 5,91 milhões de ingressos, e Verity passou de 1,9 milhão. Outra Mamãe e Dentro da Baleia saíram do Top 5.

Foi a semana mais fraca de 2026 até aqui: 1,05 milhão de ingressos, 31,7% a menos que na anterior e abaixo até de 12 a 18/03 (1,07 milhão). O Top 5 ficou com 66,1% do público, entre 128 filmes.

Qual desses você viu? Conta aqui nos comentários. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos). Pôsteres: TMDB.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #caradebarro
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/top-5-semana-2026-10-22?utm_source=instagram&utm_medium=post&utm_campaign=top5-2026-10-22`

## Números e como conferir

Export do site (`cinedata.front/dados`, gerado em 07/11/2026 com a publicação da ANCINE até 05/11) e banco local.

| Número | Valor | Fonte |
| --- | --- | --- |
| Top 5 de 22 a 28/10 | 238.097 / 146.389 / 142.791 / 95.205 / 71.374 | `dados/semana/2026-10-22.json`, `ranking` |
| Posições e variações sobre 15 a 21/10 | Verity 2º (▼ 53,6%), Street Fighter 1º (▼ 56,6%), Minha Melhor Amiga 3º (▼ 47,0%) | `publicoPeriodoAnterior` e `variacaoPct` do mesmo arquivo; `dados/semana/2026-10-15.json` |
| Vantagem do nº 1 | 238.097 ÷ 142.791 = 1,667 (67% a mais que Street Fighter) | `ranking` |
| Saíram do Top 5 | Outra Mamãe 4º → 6º (55.340, ▼ 64,9%), Dentro da Baleia 5º → 10º (22.014, ▼ 75,7%) | os dois arquivos |
| Público da semana | 1.049.903 (▼ 31,7% sobre 1.537.160) | `periodo.publico` e `resumo.publicoPeriodoAnterior` |
| Semana mais fraca de 2026 | 1.049.903; a segunda é 12 a 18/03, com 1.067.488 | consulta abaixo |
| Top 5 | 693.856 de 1.049.903 = 66,1%, entre 128 filmes | `ranking` e `resumo.obras` |
| Nacionais | 13,7% (19,6% na semana anterior) | `origem[].participacaoPct` dos dois arquivos |
| Acumulados até 28/10 | Minha Melhor Amiga 5.911.955; Verity 1.919.262; Street Fighter 491.057 | `sum(publico)` de `sessoes` por obra, até 2026-10-28 |
| Salas | Cara-de-Barro 1.102; Daniel e a Fornalha Ardente 371 | `ranking[].salas` |

```sql
-- semanas cinematográficas de 2026 (01/01/2026 foi quinta), da mais fraca para a mais forte
with w as (select date '2026-01-01' + ((data_exibicao - date '2026-01-01') / 7) * 7 ini, sum(publico) pub
           from sessoes where data_exibicao between '2026-01-01' and '2026-10-28' group by 1)
select ini, pub from w order by pub limit 4;

-- acumulados até o fim da semana
select codigo_obra, sum(publico) from sessoes
where codigo_obra in ('B2600181900000', 'E2600183000000', 'E2600270100000') and data_exibicao <= '2026-10-28'
group by 1;
```

**Cara-de-Barro:** no site ele aparece na 2ª semana em cartaz (`emCartazDesde` 15/10, ▲ 1.192%), porque teve 18.424
ingressos de pré-estreia na quarta, 21/10, em 527 salas, acima de 5% do total desta semana. A estreia no circuito foi
na quinta, 22/10, então o post trata a semana como a de estreia (como foi feito com Street Fighter no post anterior).
O título segue o do TMDB e o do trailer oficial dublado ("Cara-de-Barro"); na ANCINE está "CARA DE BARRO".

**Números revistos:** a semana de 15 a 21/10 tem hoje 1.537.160 ingressos (Street Fighter 329.095, Verity 315.255).
No post anterior, feito com a publicação até 23/10, eram 1.493.026, 320.927 e 307.282: os exibidores mandaram dados
atrasados. As variações deste post usam os números atuais.
