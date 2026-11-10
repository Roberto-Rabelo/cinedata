# Top 5 da semana · 29/10 a 04/11/2026

Carrossel de 6 slides 1080×1350, nesta ordem (suba os arquivos na ordem dos números). Mesmo modelo dos Top 5 de 15/10
e 22/10 (pôsteres do TMDB, comparação com a semana anterior). Publicar na terça, 10/11, com o story da matéria.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa do nº 1: O Bosque Selvagem (pôster), 241.312 ingressos em 996 salas; "Estreou e tirou Cara-de-Barro do topo por 12.261 ingressos" |
| 2 | `slide-02.png` | a troca no topo: O Bosque Selvagem (estreia → 1º) × Cara-de-Barro (1º → 2º); Cara-de-Barro caiu só 4% e soma 486 mil |
| 3 | `slide-03.png` | ranking do Top 5 com pôsteres e a posição da semana anterior (dois nacionais) |
| 4 | `slide-04.png` | o que mudou: Minha Melhor Amiga passou de 6 milhões (▲ 38% na 9ª semana); As Dez Vantagens de Morrer Depois de Você estreia em 3º; Verity e Street Fighter saíram |
| 5 | `slide-05.png` | a semana em números: 1,79 milhão (▲ 70,2%), Halloween e Finados; Top 5 com 48,3%; nacionais com 25,5% na semana do ingresso a R$ 12 |
| 6 | `slide-06.png` | os 5 pôsteres em leque e "Qual desses você viu?" |

Os PNGs vêm da rota `/marca/top5-2026-10-29` do front (`cinedata.front/src/app/features/marca/slides-top5-2026-10-29.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/top5-2026-10-29 ../docs/posts/top5-2026-10-29 http://localhost:4331
```

Semana completa: os 7 dias consolidados na publicação da ANCINE de 09/11/2026, com dados até 07/11.

## Legenda

Contagem: ~1.150 caracteres (limite do Instagram: 2.200).

```text
O Bosque Selvagem estreou e tirou Cara-de-Barro do topo: 241.312 ingressos contra 229.051. 🎬

O Top 5 de 29/10 a 04/11 (quinta a quarta), com a posição da semana anterior:
1. O Bosque Selvagem: 241.312 (estreia)
2. Cara-de-Barro: 229.051 (era 1º, ▼ 4,0%)
3. As Dez Vantagens de Morrer Depois de Você 🇧🇷: 132.397 (estreia)
4. Minha Melhor Amiga 🇧🇷: 131.827 (era 4º, ▲ 37,9%)
5. BTS World Tour ‘Arirang’ in São Paulo: 131.140 (estreia, show ao vivo)

Do 3º ao 5º, só 1.257 ingressos de diferença. Na semana do Festival do Cinema Brasileiro, com ingresso a R$ 12 para filmes nacionais, os brasileiros ficaram com 25,5% do público (eram 13,7%). Minha Melhor Amiga passou de 6 milhões de ingressos e Verity, de 2 milhões.

Foram 1,79 milhão de ingressos, 70% a mais que na semana anterior: teve Halloween no sábado e o feriado de Finados, o melhor dia (418 mil).

Qual desses você viu? Conta aqui nos comentários. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos). Pôsteres: TMDB.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #obosqueselvagem
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/top-5-semana-2026-10-29?utm_source=instagram&utm_medium=post&utm_campaign=top5-2026-10-29`

## Números e como conferir

Export do site (`cinedata.front/dados`, gerado em 10/11/2026 com a publicação da ANCINE até 07/11) e banco local.

| Número | Valor | Fonte |
| --- | --- | --- |
| Top 5 de 29/10 a 04/11 | 241.312 / 229.051 / 132.397 / 131.827 / 131.140 | `dados/semana/2026-10-29.json`, `ranking` |
| Posições e variações sobre 22 a 28/10 | Cara-de-Barro 1º (▼ 4,0%), Minha Melhor Amiga 4º (▲ 37,9%) | `variacaoPct` do mesmo arquivo; `dados/semana/2026-10-22.json` |
| Diferenças | 1º − 2º = 12.261; 3º − 5º = 1.257 | `ranking` |
| Saíram do Top 5 | Verity 2º → 6º (114.807, ▼ 21,8%), Street Fighter 3º → 7º (102.766, ▼ 28,4%) | os dois arquivos |
| Público da semana | 1.794.092 (▲ 70,2% sobre 1.054.322) | `periodo.publico` e `resumo.publicoPeriodoAnterior` |
| Dias fortes | 02/11 (Finados) 418.259; 31/10 (sábado, Halloween) 402.724 | `sum(publico)` de `sessoes` por dia |
| Top 5 | 865.727 de 1.794.092 = 48,3%, entre 139 filmes | `ranking` e `resumo.obras` |
| Nacionais | 25,5% (457.624); 13,7% na semana anterior | `origem[].participacaoPct` dos dois arquivos |
| Acumulados até 04/11 | Minha Melhor Amiga 6.046.368; Verity 2.034.945; Cara-de-Barro 486.123 (desde a pré-estreia de 21/10) | `sum(publico)` de `sessoes` por obra |
| 100 Dias (nacional, estreia) | 9º, 93.313 | `ranking` |
| Salas | O Bosque Selvagem 996; BTS 369 | `ranking[].salas` |

```sql
select data_exibicao, sum(publico) from sessoes
where data_exibicao between '2026-10-29' and '2026-11-04' group by 1 order by 1;

select codigo_obra, sum(publico) from sessoes
where codigo_obra in ('B2600181900000', 'E2600183000000', 'E2600305600000') and data_exibicao <= '2026-11-04'
group by 1;
```

**Estreias:** O Bosque Selvagem teve 113 ingressos na semana anterior e o show do BTS, 869: os dois abaixo de 5% da
semana atual, então contam como estreia (regra dos princípios).

**Minha Melhor Amiga × Ainda Estou Aqui:** os 6,05 milhões são a soma das sessões. A comparação com Ainda Estou Aqui
(5,86 milhões no consolidado de lançamentos) fica para a Notícia, com os dois no mesmo critério.

**Números revistos:** a publicação de 09/11 reprocessou o histórico. A semana de 22 a 28/10 tem hoje 1.054.322
ingressos (Cara-de-Barro 238.648); o post daquela semana, feito em 07/11, usou 1.049.903 e 238.097.

## Fatos de fora da ANCINE (conferidos em 10/11/2026)

| Fato | Fontes |
| --- | --- |
| Festival do Cinema Brasileiro de 29/10 a 04/11/2026: ingresso a R$ 12 para longas brasileiros em salas convencionais das redes participantes; organizado pela FENEEC e pela ABRAPLEX | [SBT News (29/10/2026)](https://sbtnews.sbt.com.br/noticia/brasil/festival-do-cinema-brasileiro-comeca-com-ingressos-a-r-12), [Ingresso.com (26/10/2026)](https://www.ingresso.com/noticias/festival-do-cinema-brasileiro-ingressos-promocionais-12-reais-saiba-mais) |

Só a Ingresso.com fala em "R$ 12 + taxas"; o post diz só "ingresso a R$ 12". Nenhuma das duas chama de 1ª edição, por
isso o post não diz isso.
