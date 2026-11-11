# Cena · Pecadores

Post coringa: sobe em qualquer dia sem pauta. Narração de abertura de *Pecadores* (2025), de Ryan Coogler. A legenda
em português do slide 1 é tradução nossa; o slide 2 traz a fala original. Formato: [Cena](../../../conteudo/formatos/cena.md).
Carrossel de 2 slides 1080×1350 e Reels de 16 s. Referência do usuário (cartão `cena-ref-pecadores`, 11/11/2026).

| Peça | Arquivo | Conteúdo |
| --- | --- | --- |
| Slide 1 | `slide-01.png` | cena 1 (a igreja, com a figura na porta) e cena 2 (o juke joint, com Michael B. Jordan), com a narração traduzida |
| Slide 2 | `slide-02.png` | a narração original em inglês, 870 mil espectadores, a estreia em 881 salas e quase 300 mil na primeira semana; "Você viu Pecadores no cinema?" |
| Reels | `reels.mp4` + `capa-reels.png` | as duas cenas com a legenda, o número e a pergunta (16 s, sem áudio: a música entra no Instagram) |

Os arquivos vêm de `cinedata.front/src/app/features/marca/cenas.json` (rota `/marca/cena/pecadores`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/cena/pecadores ../docs/posts/cenas/cena-pecadores http://localhost:4300
node scripts/gerar-video-cena.mjs pecadores ../docs/posts/cenas/cena-pecadores
```

## Legenda

Contagem: ~610 caracteres (limite do Instagram: 2.200). Serve para o carrossel e para o Reels.

```text
"Há lendas de gente que nasce com o dom de fazer música tão verdadeira que atravessa o véu entre a vida e a morte, invocando espíritos do passado e do futuro." 🎸🩸

É a voz que abre Pecadores, o terror de Ryan Coogler sobre blues e vampiros (tradução nossa).

O filme levou 870 mil pessoas aos cinemas do Brasil. Estreou em 881 salas em abril de 2025 e fez quase 300 mil só na primeira semana.

Você viu Pecadores no cinema? Conta aqui 👇

Os números do filme estão no link da bio.
Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#Pecadores #Sinners #RyanCoogler #Cinema #CineData
```

Link para a bio ou o story (página do filme no site):
`https://cinedatabr.tech/obras/E2500012000000?utm_source=instagram&utm_medium=post&utm_campaign=cena-pecadores`

## Números e como conferir

Banco local, publicação da ANCINE de 09/11/2026, conferido em 11/11/2026.

| Número | Como conferir |
| --- | --- |
| 870 mil (870.305: Warner 870.240 + 65 de uma segunda distribuidora) | `select sum(publico_total) from lancamentos where codigo_obra = 'E2500012000000';` |
| 881 salas e 299.697 pessoas na semana de estreia (17/04/2025) | `select semana, publico, salas from agregado_semana_obra where codigo_obra = 'E2500012000000' order by semana limit 2;` |

Fora do post: voltou a poucas salas de janeiro a março de 2026 (no máximo 3.026 pessoas numa semana); não é
relançamento comercial e não entra no texto.

## Fatos de fora da ANCINE (conferidos em 11/11/2026)

| Fato | Fonte 1 | Fonte 2 |
| --- | --- | --- |
| A narração de abertura ("There are legends of people born with the gift of making music so true it can pierce the veil between life and death, conjuring spirits from the past and the future") | https://www.wfae.org/2025-05-05/in-sinners-the-blues-is-a-portal-between-this-world-and-the-next (NPR) | https://truthout.org/articles/in-era-of-book-bans-and-war-on-history-sinners-reveals-what-us-tries-to-forget |
| Filme de Ryan Coogler, terror sobre blues e vampiros | mesma matéria da NPR | mesma matéria da Truthout |

As fontes não dizem quem narra, por isso o slide diz só "Narração de abertura" (uma terceira fonte, The Hub, atribui a
voz a Annie, personagem de Wunmi Mosaku). Nada de letra de música: é narração falada.

Imagens: TMDB 1233413: `mTSL8FmdAO1YiPQzr0fUacCUS0H.jpg` (a igreja) e `aWM8eYmhqBgH4YC5WLLPTJxlc2t.jpg` (o juke joint).
