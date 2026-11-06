# Cena · O Auto da Compadecida 2

Post coringa: sobe em qualquer dia sem pauta. O bordão de Chicó (Selton Mello) em *O Auto da Compadecida 2* (2024). Formato: [Cena](../../conteudo/formatos/cena.md). Carrossel de 2 slides 1080×1350 e Reels de 16 s.

| Peça | Arquivo | Conteúdo |
| --- | --- | --- |
| Slide 1 | `slide-01.png` | cena 1 (Chicó e João Grilo) com "Não sei…" e cena 2 (João Grilo) com "só sei que foi assim." |
| Slide 2 | `slide-02.png` | a fala, o contexto (o bordão da peça de Ariano Suassuna), 4,4 milhões de espectadores, 13º brasileiro mais visto desde 2009; "Qual é o bordão de filme que você mais usa?" |
| Reels | `reels.mp4` + `capa-reels.png` | as duas cenas com a legenda, o número e a pergunta (16 s, sem áudio: a música entra no Instagram) |

Os arquivos vêm de `cinedata.front/src/app/features/marca/cenas.json` (rota `/marca/cena/auto-da-compadecida-2`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/cena/auto-da-compadecida-2 ../docs/posts/cena-auto-da-compadecida-2 http://localhost:4300
node scripts/gerar-video-cena.mjs auto-da-compadecida-2 ../docs/posts/cena-auto-da-compadecida-2
```

## Legenda

Contagem: 604 caracteres (limite do Instagram: 2.200). Serve para o carrossel e para o Reels.

```text
"Não sei… só sei que foi assim." 🤷

O bordão de Chicó, da peça de Ariano Suassuna, voltou aos cinemas em O Auto da Compadecida 2, com Selton Mello e Matheus Nachtergaele de novo como Chicó e João Grilo, 24 anos depois do primeiro filme.

Nos cinemas do Brasil, 4,4 milhões de pessoas foram ver a volta da dupla. Lançado em dezembro de 2024, é o 13º filme brasileiro mais visto desde 2009.

Qual é o bordão de filme que você mais usa? 👇

Os números do filme estão no link da bio.
Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#AutoDaCompadecida #CinemaBrasileiro #SeltonMello #Cinema #CineData
```

Link para a bio ou o story (página do filme no site):
`https://cinedatabr.tech/obras/B2400470400000?utm_source=instagram&utm_medium=post&utm_campaign=cena-auto-da-compadecida-2`

## Números e como conferir

| Número | Como conferir |
| --- | --- |
| 4,4 milhões (4.442.196) | `select sum(publico_total) from lancamentos where codigo_obra = 'B2400470400000';` |
| 13º brasileiro mais visto desde 2009 | `with t as (select codigo_obra, sum(publico_total) p from lancamentos where codigo_obra like 'B%' group by 1) select count(*) + 1 from t where p > (select p from t where codigo_obra = 'B2400470400000');` |
| lançado em dezembro de 2024 (26/12/2024 no consolidado; a imprensa cita 25/12, por isso o post diz só o mês) | `select min(data_lancamento) from lancamentos where codigo_obra = 'B2400470400000';` |

## Fatos de fora da ANCINE (conferidos em 04/11/2026)

| Fato | Fonte 1 | Fonte 2 |
| --- | --- | --- |
| O bordão "não sei, só sei que foi assim" de Chicó está no filme | https://www.adorocinema.com/filmes/filme-314577/criticas-adorocinema/ | https://mais.opovo.com.br/colunistas/flavio-paiva/2024/12/30/so-sei-que-foi-assim-2.html |

Imagens: TMDB 1099413: `6JIt4kiymurp4B8RIY53ufATNel.jpg` (Chicó e João Grilo) e `6z3Ja0ZdBrgDB7adMJJFWOZyzrn.jpg` (João Grilo).
