# Identidade visual

**Conceito: a sala escura e a luz do projetor.** O fundo é a sala de cinema, o texto tem a cor da tela (branco quente)
e o único acento de marca é o âmbar do feixe do projetor, que ilumina o número que importa.
A página `/marca` do front mostra tudo isso ao vivo, inclusive uma prévia de post com dados reais.

## Logo

O **feixe do projetor** formando um gráfico: o projetor (cor da tela) lança um feixe âmbar — a luz do exibidor —, em
degradê de opacidade (~0,55 na lente a ~0,07 na tela), que ilumina **três barras crescentes**; a maior é âmbar.
Wordmark `cinedata` em Bricolage Grotesque: "cine" regular + "data" extra-bold. Fonte: `cinedata.front/src/app/shared/ui/logo.ts`
e `cinedata.front/public/favicon.svg`. Foto de perfil do Instagram: `docs/marca/avatar-instagram-1080.png` (fonte em
`docs/marca/avatar-instagram.svg`; símbolo centralizado num círculo escuro, com margem para o recorte circular).

## Cores

| Nome | Hex | Uso |
| --- | --- | --- |
| Sala | `#0D0E12` | fundo |
| Poltrona | `#16181F` | cartões |
| Linha | `#2A2E3A` | bordas, grade de gráficos |
| Tela | `#F3EFE6` | texto principal |
| Tela 2 | `#A3A7B3` | texto secundário |
| Projetor | `#FFB547` | acento de marca: logo, foco, destaques |
| Âmbar (dado) | `#CF7A25` | série única, dublado |
| Azul (dado) | `#5A78EC` | estrangeiro, legendado |
| Verde (dado) | `#2EAE6C` | nacional |

As três cores de dados passaram no validador de paleta (luminosidade OKLCH 0,48–0,67, croma, separação para
daltonismo ΔE ≥ 25, contraste ≥ 3:1) sobre a superfície `#16181F`. O âmbar de marca (`#FFB547`) é claro demais para
marcar dados no fundo escuro, por isso existe o âmbar de dado.

Regras: cor nunca é a única pista (legenda ou rótulo direto sempre); texto nunca usa a cor da série; escala sequencial
(mapa) é um só tom, do apagado ao âmbar de dado (`--cd-dado-ambar`); alta/queda sempre com ▲▼ além da cor. O âmbar de
marca aparece no site só como marca: logo, foco, sobretítulos e o feixe decorativo atrás do título da página.

## Site público

Home "esta semana no cinema": título da semana por extenso em Bricolage 800, manchete com o número do nº 1, cartão do
nº 1 com público em destaque e barras do público por dia, depois KPIs, Top 10, nacional × estrangeiro, dublado ×
legendado, mapa e o último mês. Pôsteres do TMDB (proporção 2:3, cantos arredondados, borda da cor da linha) no nº 1,
no Top 10, na busca, no mapa e na página do filme; sem pôster, um cartaz tipográfico com as iniciais do título e a faixa
da cor da origem (`shared/ui/cartaz.ts`). A página do filme usa o pôster como imagem de compartilhamento. Mapa interativo (`/mapa`): quadrados por estado em um só tom de âmbar de dado (ou
verde/azul em "quem venceu"); o estado escolhido ganha contorno na cor da tela e os outros apagam (foco e contexto);
a lista dos estados repete o dado sem depender da cor. Títulos de filmes em caixa de título (a ANCINE manda em caixa alta). Imagem de compartilhamento 1200×630: `cinedata.front/public/og-cinedata.png` (fonte em
`docs/marca/og-cinedata.html`). Rodapé de toda página: "Fonte: ANCINE (dados abertos)".

## Tipografia

- **Bricolage Grotesque** (Google Fonts): títulos, manchetes, números grandes. Tem cara de cartaz de cinema.
- **Inter**: texto, tabelas, interface; números tabulares (`font-variant-numeric: tabular-nums`).

## Voz

1. **O número primeiro.** A manchete é o dado.
2. **Contexto, não opinião.** Comparar com a semana anterior, outros estados, o histórico.
3. **Sempre com fonte.** "Fonte: ANCINE (dados abertos)" em todo post e página; nunca "oficial ANCINE" nem logo da agência.
4. **Brasileiro e regional.** O leitor quer se ver no mapa.

## Formatos de post

| Formato | Tamanho | Status |
| --- | --- | --- |
| Carrossel / feed | 1080×1350 (4:5) | template "Top 5 da semana" pronto (`post-ranking.ts`) |
| Carrossel de apresentação | 7 × 1080×1350 | pronto: `/marca/apresentacao` (`slides-apresentacao.ts`), PNGs e legenda em `docs/posts/apresentacao` |
| Top 5 da semana (carrossel) | 6 × 1080×1350 (2 vídeos) | pronto para 08 a 14/10: `/marca/top5-2026-10-08` (`slides-top5.ts`); capa e vídeo do nº 1 e do nº 2, ranking, contexto; números ainda fixos no componente |
| Como medimos | 5 × 1080×1350 | pronto: `/marca/como-medimos` (`slides-como-medimos.ts`) |
| Especial com foto (Halloween) | 12 × 1080×1350 | pronto: `/marca/halloween-terror-top10` (`slides-halloween.ts`); `cd-slide` aceita `fundo` (foto de divulgação) e `credito` |
| Reels / TikTok | 1080×1920 (9:16) | a fazer |
| Story | 1080×1920 | a fazer |

Os slides em PNG saem de `cinedata.front/scripts/exportar-slides.mjs` (playwright-core com o Chrome instalado), que
fotografa cada `cd-slide` da rota em 1080×1350 (uso: `node scripts/exportar-slides.mjs <rota> <pasta>`). Slides de vídeo usam
`scripts/emoldurar-video.mjs`: o spot oficial da distribuidora inteiro, sem cortes, numa moldura 4:5 com lugar,
título e "Vídeo: <distribuidora>" no rodapé e falha se algum conteúdo passar do quadro. Rodapé de todo slide:
"Fonte: ANCINE (dados abertos)" e o perfil; nunca "oficial ANCINE" nem logo da agência.
