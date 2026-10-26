# Reels de lançamento do site (@cinedata.br)

`reels.mp4`: 1080×1920 (9:16), 30 fps, 28 s, H.264 sem áudio. `capa.png`: capa do Reels (o mapa com "27 de 27
estados"). Imagens reais de cinedatabr.tech no celular, com dados até 22/10/2026.

Para regerar (com o site estático servido em http://localhost:4320 por `node scripts/servir-estatico.mjs`):

```bash
cd cinedata.front && node scripts/gerar-reels.mjs ../docs/posts/reels-plataforma
```

Os números ficam em `NUMEROS` no topo de `scripts/gerar-reels.mjs`; com dados novos, conferir antes de regerar.
`REELS_PREVIA=3.5,13.2,22.5` grava só esses segundos como PNG, para ajustar o layout.

## Roteiro

| Tempo | Cena | Na tela |
| --- | --- | --- |
| 0–3 s | Abertura | feixe do projetor acende, logo, "O cinema brasileiro em números" |
| 3–8,7 s | Top 10 | home no celular rolando até o Top 10; selos "Verity, nº 1 da semana de 8 a 14 de outubro: 622.946 pessoas" e "2,3 milhões de ingressos em 7 dias" |
| 8,7–14,7 s | Mapa | mapa com São Paulo aberto ("32% do público do Brasil"); depois "quem venceu" em setembro: "27 de 27 estados" |
| 14,7–19,6 s | Filme | Ainda Estou Aqui: curva diária; "5,7 milhões de espectadores" |
| 19,6–23,6 s | Números | contagem até 1,23 bilhão de ingressos desde 2016, 38,5 milhões de sessões, 27 estados |
| 23,6–28 s | Chamada | cinedatabr.tech, "Todos os cinemas do Brasil, atualizado toda semana", "Link na bio", fonte |

Conferência: 1.229.560.044 ingressos de ago/2016 a 22/10/2026 (soma de `dados/mes/2016-08..12` e `dados/ano/2017..2026`);
38.458.225 sessões no banco; SP com 748.727 de 2.331.061 na semana de 08/10 (32,1%); Minha Melhor Amiga líder nas 27
UFs em `dados/mes/2026-09.json`; Ainda Estou Aqui 5.731.852 em `dados/obras/B2400324700000.json`.

## Ao publicar

Não prometer "grátis" nem "aberto" nos textos: o acesso hoje é livre, mas pode passar a ser pago (ver backlog).

- Música: escolha um áudio instrumental da biblioteca do Instagram (o vídeo vai sem som para isso).
- Capa: `capa.png` (Editar capa → Adicionar da galeria).
- Bio: `https://cinedatabr.tech/?utm_source=instagram&utm_medium=bio&utm_campaign=lancamento`. No Umami, as visitas
  vindas do lançamento aparecem separadas pela campanha.
- Compartilhar também nos Stories com o adesivo de link para o mesmo endereço, trocando `utm_medium=bio` por `story`.

## Legenda

Contagem: ~870 caracteres (limite do Instagram: 2.200).

```text
O cinema brasileiro em números, agora num site. 🎬

cinedatabr.tech reúne a bilheteria de todos os cinemas do país, atualizada toda semana:
▪️ Top 10 da semana e do mês, com nacional × estrangeiro e dublado × legendado
▪️ Mapa interativo: toque num estado e veja o público, o filme mais visto e como ele mudou semana a semana
▪️ A curva de cada filme, dia a dia
▪️ 1,23 bilhão de ingressos desde 2016, em 38,5 milhões de sessões

Um dado do mapa: em setembro, Minha Melhor Amiga foi o filme mais visto em todos os 27 estados.

Acesse pelo link na bio. 🔗

E você: qual estado vai mais ao cinema, na sua opinião? Responde aqui e confere no mapa.

Fonte: ANCINE (dados abertos). Projeto independente, sem vínculo com a ANCINE.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #dataviz
```
