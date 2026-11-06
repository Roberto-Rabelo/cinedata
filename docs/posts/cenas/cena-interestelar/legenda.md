# Cena · Interestelar

Post coringa: sobe em qualquer dia sem pauta. Fala de Cooper (Matthew McConaughey) em *Interestelar* (2014). A legenda em português do slide 1 é tradução nossa; o slide 2 traz a fala original. Formato: [Cena](../../conteudo/formatos/cena.md). Carrossel de 2 slides 1080×1350 e Reels de 16 s.

| Peça | Arquivo | Conteúdo |
| --- | --- | --- |
| Slide 1 | `slide-01.png` | cena 1 (o céu e as pessoas olhando para cima) e cena 2 (a tempestade de poeira no estádio), com a fala traduzida |
| Slide 2 | `slide-02.png` | a fala original em inglês, 1,8 milhão de espectadores em 2014 e os 626 mil das voltas às salas em 2025; "Você viu Interestelar no cinema?" |
| Reels | `reels.mp4` + `capa-reels.png` | as duas cenas com a legenda, o número e a pergunta (16 s, sem áudio: a música entra no Instagram) |

Os arquivos vêm de `cinedata.front/src/app/features/marca/cenas.json` (rota `/marca/cena/interestelar`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/cena/interestelar ../docs/posts/cena-interestelar http://localhost:4300
node scripts/gerar-video-cena.mjs interestelar ../docs/posts/cena-interestelar
```

## Legenda

Contagem: 622 caracteres (limite do Instagram: 2.200). Serve para o carrossel e para o Reels.

```text
"A gente olhava para o céu e se perguntava qual era o nosso lugar nas estrelas. Agora só olhamos para baixo e nos preocupamos com o nosso lugar na poeira." 🌌

A fala é de Cooper, vivido por Matthew McConaughey, sobre a Terra tomada pela poeira, antes de partir pelo espaço (tradução nossa).

Interestelar levou 1,8 milhão de pessoas aos cinemas do Brasil em 2014. Em 2025, voltou às salas duas vezes e somou mais 626 mil.

Você viu Interestelar no cinema? 👇

Os números do filme estão no link da bio.
Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#Interestelar #Interstellar #ChristopherNolan #Cinema #CineData
```

Link para a bio ou o story (página do filme no site):
`https://cinedatabr.tech/obras/E1402450800000?utm_source=instagram&utm_medium=post&utm_campaign=cena-interestelar`

## Números e como conferir

| Número | Como conferir |
| --- | --- |
| 1,8 milhão (1.798.768) no lançamento de 2014 | `select sum(publico_total) from lancamentos where codigo_obra = 'E1402450800000';` |
| 626 mil nas voltas de 2025 (360.635 na semana de 09/01 e 265.203 na de 28/08, ambas em 4º lugar) | `select semana, publico from agregado_semana_obra where codigo_obra = 'E1402450800000' and semana >= '2025-01-01' and publico > 0;` |

## Fatos de fora da ANCINE (conferidos em 04/11/2026)

| Fato | Fonte 1 | Fonte 2 |
| --- | --- | --- |
| A fala de Cooper ("We used to look up at the sky…") | https://en.wikiquote.org/wiki/Interstellar_(film) | https://moviemistakes.com/film10773/quotes |

Imagens: TMDB 157336: `5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg` (o céu) e `chyoak0YgN9PpxEPNWcSWxrqpb5.jpg` (a poeira no estádio). Atenção: no TMDB, a miniatura w300 desses arquivos mostra outra imagem; vale o w1280.
