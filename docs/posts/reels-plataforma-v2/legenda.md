# Reels de apresentação, versão 2 (@cinedata.br)

`reels.mp4`: 1080×1920 (9:16), 30 fps, 36 s, H.264 sem áudio. `capa.png`: capa do Reels (o mural de pôsteres com
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
| 0–2,2 s | Abertura no escuro | a câmera anda para a esquerda, da palavra "cinedata" apagada até o projetor, com poeira no ar e bokeh em primeiro plano |
| 2,2–3 s | O projetor acorda | duas piscadas, acende; brilho da lente e risco de luz anamórfico |
| 3–4,8 s | A luz | o feixe atravessa o símbolo e cada barra pula ao ser iluminada (achata, estica e assenta, a homenagem ao abajur da Pixar); a câmera recua acompanhando a luz, que acende o nome da esquerda para a direita |
| 4,8–6,9 s | Logo | "O cinema brasileiro em números / Todos os cinemas do país, semana a semana"; o logo encolhe e pousa no canto, onde vira o cabeçalho |
| 6,9–10,8 s | Mural | os pôsteres dos 84 filmes mais vistos desde 2016, inclinados, com uma faixa de luz passando; "1.443 filmes que passaram nos cinemas do Brasil"; crédito "Pôsteres: TMDB" |
| 10,8–16,5 s | Top 10 | home no celular com o pôster do nº 1; "Street Fighter, nº 1 da semana de 15 a 21 de outubro: 320.927 pessoas" e "1,5 milhão de ingressos em 7 dias" |
| 16,5–22,5 s | Mapa | São Paulo aberto ("33% do público do Brasil"); "quem venceu" em setembro: "27 de 27 estados" |
| 22,5–27,4 s | Filme | Ainda Estou Aqui com pôster, público e tempo em cartaz; "5,7 milhões de espectadores, em 35 semanas em cartaz" |
| 27,4–31,4 s | Números | contagem até 1,23 bilhão de ingressos desde 2016, 38,5 milhões de sessões, 27 estados |
| 31,4–36 s | Chamada | cinedatabr.tech, "Todos os cinemas do Brasil, atualizado toda semana", "Link na bio", fonte |

Conferência: 1.229.691.177 ingressos de ago/2016 a 23/10/2026 (soma de `dados/mes/2016-08..12` e `dados/ano/2017..2026`);
38.471.082 sessões no banco; semana de 15/10: 1.493.026 pessoas, Street Fighter 320.927, SP 490.801 (32,9%); Minha
Melhor Amiga líder nas 27 UFs em `dados/mes/2026-09.json`; Ainda Estou Aqui 5.731.852 e 35 semanas em
`dados/obras/B2400324700000.json`; 1.443 obras em `dados/indice.json`.

## Ao publicar

Não prometer "grátis" nem "aberto" nos textos: o acesso hoje é livre, mas pode passar a ser pago (ver backlog).

- Música: um instrumental com uma "subida" nos primeiros 3 s combina com a abertura (o projetor acende em 2,3 s e a
  luz cruza o logo até 4,8 s). O vídeo vai sem som para escolher na biblioteca do Instagram.
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
