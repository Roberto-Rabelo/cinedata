# Top 5 da semana · 15 a 21/10/2026

Carrossel de 6 slides 1080×1350, nesta ordem (suba os arquivos na ordem dos números). Desta vez sem vídeos das
distribuidoras: o apoio visual são os pôsteres (TMDB), com paralelos com a semana anterior (08 a 14/10).

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa do nº 1: Street Fighter (pôster), 320.927 ingressos; "Estreou e tirou Verity do topo por 13.645 ingressos" |
| 2 | `slide-02.png` | a troca no topo: Street Fighter (estreia → 1º) × Verity (1º → 2º); Verity já soma 1,76 milhão |
| 3 | `slide-03.png` | ranking do Top 5 com pôsteres e a posição da semana anterior |
| 4 | `slide-04.png` | o que mudou: Minha Melhor Amiga com 5,81 milhões na 7ª semana; Dentro da Baleia estreia em 5º; Carros e Se Eu Fosse Você 3 saíram do Top 5 |
| 5 | `slide-05.png` | a semana em números: 1,49 milhão (▼ 36%, a anterior teve o feriado de 12/10), Top 5 com 69,9%, nacionais com 19,8% |
| 6 | `slide-06.png` | os 5 pôsteres em leque e "Qual desses você viu?" |

Os PNGs vêm da rota `/marca/top5-2026-10-15` do front (`cinedata.front/src/app/features/marca/slides-top5-2026-10-15.ts`),
com o front em modo API (`ng serve`; os pôsteres em w780 vêm do TMDB):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/top5-2026-10-15 ../docs/posts/top5-2026-10-15 http://localhost:4330
```

Semana completa: os 7 dias consolidados na publicação da ANCINE com dados até 23/10/2026.

## Legenda

Contagem: ~1.000 caracteres (limite do Instagram: 2.200).

```text
Street Fighter estreou e tirou Verity do topo: 320.927 ingressos contra 307.282, uma diferença de 13.645. 🎬

O Top 5 de 15 a 21/10 (quinta a quarta), com a posição da semana anterior:
1. Street Fighter: 320.927 (estreia)
2. Verity: 307.282 (era 1º, ▼ 50,7%)
3. Minha Melhor Amiga 🇧🇷: 176.273 (era 2º, ▼ 41,2%)
4. Outra Mamãe: 151.749 (era 3º, ▼ 45,4%)
5. Dentro da Baleia: 87.468 (estreia)

Minha Melhor Amiga, na 7ª semana, já soma 5,81 milhões de ingressos. Carros e Se Eu Fosse Você 3 saíram do Top 5.

Na semana foram 1,49 milhão de ingressos, 36% a menos que na anterior, que teve o feriado de 12/10 (só no Dia das Crianças foram 593 mil). O Top 5 ficou com 69,9% do público, entre 139 filmes.

Qual desses você viu? Conta aqui nos comentários. 👇
O Top 10 completo e o filme mais visto em cada estado: link na bio.

Fonte: ANCINE (dados abertos). Pôsteres: TMDB.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #streetfighter
```

## De onde vem cada número

Export do site (`cinedata.front/dados`, gerado em 27/10/2026 com a publicação da ANCINE até 23/10) e banco local.

| Número | Valor | Fonte |
| --- | --- | --- |
| Top 5 de 15 a 21/10 | 320.927 / 307.282 / 176.273 / 151.749 / 87.468 | `dados/semana/2026-10-15.json`, `ranking` |
| Posições e variações sobre 08 a 14/10 | Verity 1º (▼ 50,7%), Minha Melhor Amiga 2º (▼ 41,2%), Outra Mamãe 3º (▼ 45,4%) | `publicoPeriodoAnterior` e `variacaoPct` do mesmo arquivo; `dados/semana/2026-10-08.json` |
| Saíram do Top 5 | Carros 4º → 7º (▼ 75,4%), Se Eu Fosse Você 3 5º → 6º (▼ 56,8%) | os dois arquivos |
| Público da semana | 1.493.026 (▼ 36,0% sobre 2.331.322) | `periodo.publico` e `resumo.publicoPeriodoAnterior` |
| Feriado | 593.139 ingressos em 12/10 | `sum(publico)` de `sessoes` em 2026-10-12 |
| Top 5 | 1.043.699 de 1.493.026 = 69,9%, entre 139 filmes | `ranking` e `resumo.obras` |
| Nacionais | 19,8% (25,7% na semana anterior) | `origem` dos dois arquivos |
| Acumulados até 21/10 | Verity 1.763.002 (desde 24/09); Minha Melhor Amiga 5.812.557 | `sum(publico)` de `sessoes` por obra, até 2026-10-21 |
| Salas | Street Fighter 1.075; Dentro da Baleia 598 | `ranking[].salas` |

Street Fighter: no site ele aparece na 2ª semana em cartaz (`emCartazDesde` 08/10), porque teve 19.141 ingressos de
pré-estreia em 13 e 14/10 (19.028 só na quarta, 14/10, em 568 salas), acima de 5% do pico. A estreia no circuito foi
na quinta, 15/10 (data do pôster), então o post trata a semana como a de estreia.
