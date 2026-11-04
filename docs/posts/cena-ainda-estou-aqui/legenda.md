# Cena · Ainda Estou Aqui

Post coringa: sobe em qualquer dia sem pauta. Fala de Eunice Paiva (Fernanda Torres) em *Ainda Estou Aqui* (2024). Formato: [Cena](../../conteudo/formatos/cena.md). Carrossel de 2 slides 1080×1350 e Reels de 16 s.

| Peça | Arquivo | Conteúdo |
| --- | --- | --- |
| Slide 1 | `slide-01.png` | cena 1 (Eunice) com "Nós vamos sorrir." e cena 2 (a família na frente da casa) com "Sorriam!" |
| Slide 2 | `slide-02.png` | a fala, o contexto, 5,9 milhões de espectadores, 9º brasileiro mais visto desde 2009 e o Oscar de filme internacional; "Qual cena de filme brasileiro você nunca esqueceu?" |
| Reels | `reels.mp4` + `capa-reels.png` | as duas cenas com a legenda, o número e a pergunta (16 s, sem áudio: a música entra no Instagram) |

Os arquivos vêm de `cinedata.front/src/app/features/marca/cenas.json` (rota `/marca/cena/ainda-estou-aqui`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/cena/ainda-estou-aqui ../docs/posts/cena-ainda-estou-aqui http://localhost:4300
node scripts/gerar-video-cena.mjs ainda-estou-aqui ../docs/posts/cena-ainda-estou-aqui
```

## Legenda

Contagem: 596 caracteres (limite do Instagram: 2.200). Serve para o carrossel e para o Reels.

```text
"Nós vamos sorrir. Sorriam!" 📸

Eunice Paiva, vivida por Fernanda Torres, pede aos filhos que sorriam na foto para o jornal, depois que o marido, Rubens Paiva, é levado pela ditadura.

Ainda Estou Aqui levou 5,9 milhões de pessoas aos cinemas do Brasil. É o 9º filme brasileiro mais visto desde 2009, e o primeiro do país a ganhar o Oscar de filme internacional.

Qual cena de filme brasileiro você nunca esqueceu? Conta aqui 👇

Os números do filme estão no link da bio.
Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#AindaEstouAqui #CinemaBrasileiro #FernandaTorres #Cinema #CineData
```

Link para a bio ou o story (página do filme no site):
`https://cinedatabr.tech/obras/B2400324700000?utm_source=instagram&utm_medium=post&utm_campaign=cena-ainda-estou-aqui`

## Números e como conferir

| Número | Como conferir |
| --- | --- |
| 5,9 milhões (5.857.612) | `select sum(publico_total) from lancamentos where codigo_obra = 'B2400324700000';` |
| 9º brasileiro mais visto desde 2009 | `with t as (select codigo_obra, sum(publico_total) p from lancamentos where codigo_obra like 'B%' group by 1) select count(*) + 1 from t where p > (select p from t where codigo_obra = 'B2400324700000');` |

## Fatos de fora da ANCINE (conferidos em 04/11/2026)

| Fato | Fonte 1 | Fonte 2 |
| --- | --- | --- |
| A fala "Nós vamos sorrir. Sorriam!" é de Eunice, na foto da família para o jornal | https://www.omelete.com.br/filmes/ainda-estou-aqui-fernanda-torres-comemora-oscar-com-frase-do-filme | https://www.metropoles.com/brasil/nos-vamos-sorrir-sorriam-diz-fernanda-torres-apos-oscar |
| Primeiro filme brasileiro a ganhar o Oscar de filme internacional (2025) | https://www.omelete.com.br/filmes/ainda-estou-aqui-fernanda-torres-comemora-oscar-com-frase-do-filme | https://www.metropoles.com/brasil/nos-vamos-sorrir-sorriam-diz-fernanda-torres-apos-oscar |

Imagens: TMDB 1000837: `yUOJzi3qIeXCAK1nZ7el7DUBDNV.jpg` (Eunice) e `fhF8OGrJue5U2NdnIBRFQCbTJZ9.jpg` (a família na frente da casa).
