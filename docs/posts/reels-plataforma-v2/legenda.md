# Reels de apresentação, versão 2 (@cinedata.br)

`reels.mp4`: 1080×1920 (9:16), 30 fps, 38 s, H.264 sem áudio. `capa.png`: capa do Reels (o mural de pôsteres com
"1.443 filmes que passaram nos cinemas do Brasil"). Imagens reais de cinedatabr.tech no celular, já com os pôsteres,
e dados até 23/10/2026.

A versão 1 (sem pôsteres, abertura curta) continua em `docs/posts/reels-plataforma/`, com o script
`scripts/gerar-reels.mjs`, caso a gente volte a ela.

Para regerar (com o site estático servido em http://localhost:4320 por `node scripts/servir-estatico.mjs`, depois de
`npm run build:estatico`, que copia os pôsteres para o site):

```bash
cd cinedata.front && node scripts/gerar-reels-v2.mjs ../docs/posts/reels-plataforma-v2
```

Os números ficam em `NUMEROS` no topo de `scripts/gerar-reels-v2.mjs`; com dados novos, conferir antes de regerar.
`REELS_PREVIA=2.4,3.6,9.4` grava só esses segundos como PNG, para ajustar o layout.

## Roteiro

| Tempo | Cena | Na tela |
| --- | --- | --- |
| 0–1,4 s | Entrada | o projetor do logo, como personagem (rolos de filme nas "orelhas", a lente como olho), entra pulando da direita, sob uma luz de palco |
| 1,4–3,3 s | O salto | para, olha as barras com a cabeça inclinada, agacha e pula por cima delas até o lugar do logo |
| 3,3–4,5 s | Para a câmera | vira para a direita, olha para a câmera, pisca e, num último pulo, para no lugar do projetor no logo; os rolos recolhem |
| 4,5–6,6 s | Acende | o olho vai para a borda e vira a lente; pisca duas vezes e liga; o feixe atravessa o símbolo, cada barra pula ao ser iluminada e a luz acende o nome |
| 6,4–8,5 s | Logo | "O cinema brasileiro em números / Entenda como o seu filme favorito está indo nos cinemas"; o logo encolhe e pousa no canto, onde vira o cabeçalho |
| 8,5–12,4 s | Mural | os pôsteres dos 84 filmes mais vistos desde 2016, inclinados, com uma faixa de luz passando; "1.443 filmes que passaram nos cinemas do Brasil"; crédito "Pôsteres: TMDB" |
| 12,4–18,1 s | Top 10 | home no celular com o pôster do nº 1; "Street Fighter, nº 1 da semana de 15 a 21 de outubro: 320.927 pessoas" e "1,5 milhão de ingressos em 7 dias" |
| 18,1–24,1 s | Mapa | São Paulo aberto ("33% do público do Brasil"); "quem venceu" em setembro: "27 de 27 estados" |
| 24,1–29 s | Filme | Ainda Estou Aqui com pôster, público e tempo em cartaz; "5,7 milhões de espectadores, em 35 semanas em cartaz" |
| 29–33 s | Números | contagem até 1,23 bilhão de ingressos desde 2016, 38,5 milhões de sessões, 27 estados |
| 33–38 s | Chamada | cinedatabr.tech, "Todos os cinemas do Brasil, atualizado toda semana", "Link na bio", fonte |

Conferência: 1.229.691.177 ingressos de ago/2016 a 23/10/2026 (soma de `dados/mes/2016-08..12` e `dados/ano/2017..2026`);
38.471.082 sessões no banco; semana de 15/10: 1.493.026 pessoas, Street Fighter 320.927, SP 490.801 (32,9%); Minha
Melhor Amiga líder nas 27 UFs em `dados/mes/2026-09.json`; Ainda Estou Aqui 5.731.852 e 35 semanas em
`dados/obras/B2400324700000.json`; 1.443 obras em `dados/indice.json`.

## Ao publicar

Não prometer "grátis" nem "aberto" nos textos: o acesso hoje é livre, mas pode passar a ser pago (ver backlog).

- Música: um instrumental leve e brincalhão na abertura, com uma "subida" quando o projetor acende, combina com o personagem (o personagem acende em 4,6 s e a
  luz cruza o logo até 6,6 s). O vídeo vai sem som para escolher na biblioteca do Instagram.
- Capa: `capa.png` (Editar capa → Adicionar da galeria).
- Bio: `https://cinedatabr.tech/?utm_source=instagram&utm_medium=bio&utm_campaign=lancamento`.
- Os pôsteres são do TMDB (crédito no vídeo e no site). Antes de impulsionar o post como anúncio pago ou de cobrar pelo
  acesso, ver a licença comercial do TMDB (docs/publicacao.md).

## Legenda

Contagem: ~900 caracteres (limite do Instagram: 2.200).

```text
O cinema brasileiro em números. 🎬

cinedatabr.tech reúne a bilheteria de todos os cinemas do país, atualizada toda semana:
▪️ Top 10 da semana e do mês, com o pôster de cada filme
▪️ 1.443 filmes com página própria: público, curva dia a dia e quanto tempo ficaram em cartaz
▪️ Mapa interativo: toque num estado e veja o público e o filme mais visto
▪️ 1,23 bilhão de ingressos desde 2016, em 38,5 milhões de sessões

Um dado do mapa: em setembro, Minha Melhor Amiga foi o filme mais visto em todos os 27 estados.

Acesse pelo link na bio. 🔗

Qual filme você quer ver no CineData? Comenta aqui que a gente procura.

Fonte: ANCINE (dados abertos). Pôsteres: TMDB. Projeto independente, sem vínculo com a ANCINE.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #dataviz
```
