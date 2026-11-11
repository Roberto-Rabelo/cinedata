# Cena · Bacurau

Post coringa: sobe em qualquer dia sem pauta. Diálogo de *Bacurau* (2019): uma forasteira do Sudeste pergunta e um
menino do povoado responde. Formato: [Cena](../../../conteudo/formatos/cena.md). Carrossel de 2 slides 1080×1350 e
Reels de 16 s. Escolhido em 11/11/2026 no espírito das referências do usuário (Pecadores, Anatomia de uma Queda): cinema
de autor com gênero, aqui brasileiro.

| Peça | Arquivo | Conteúdo |
| --- | --- | --- |
| Slide 1 | `slide-01.png` | cena 1 (a forasteira de roupa de motocross, sorrindo, no povoado) com "Quem nasce em Bacurau é o quê?" e cena 2 (o povo de Bacurau, de frente) com "É gente!" |
| Slide 2 | `slide-02.png` | a fala, o contexto, 742 mil espectadores, 8º brasileiro mais visto entre os lançados em 2019; "Qual fala de filme brasileiro virou parte do seu vocabulário?" |
| Reels | `reels.mp4` + `capa-reels.png` | as duas cenas com a legenda, o número e a pergunta (16 s, sem áudio: a música entra no Instagram) |

Os arquivos vêm de `cinedata.front/src/app/features/marca/cenas.json` (rota `/marca/cena/bacurau`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/cena/bacurau ../docs/posts/cenas/cena-bacurau http://localhost:4300
node scripts/gerar-video-cena.mjs bacurau ../docs/posts/cenas/cena-bacurau
```

## Legenda

Contagem: ~560 caracteres (limite do Instagram: 2.200). Serve para o carrossel e para o Reels.

```text
"Quem nasce em Bacurau é o quê?"
"É gente!" 🌵

A visitante do Sudeste pergunta na bodega do povoado, e um menino responde. A cena é de Bacurau, de Kleber Mendonça Filho e Juliano Dornelles.

O filme levou 742 mil pessoas aos cinemas do Brasil e foi o 8º brasileiro mais visto entre os lançados em 2019.

Qual fala de filme brasileiro virou parte do seu vocabulário? Conta aqui 👇

Os números do filme estão no link da bio.
Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#Bacurau #CinemaBrasileiro #KleberMendonçaFilho #Cinema #CineData
```

Link para a bio ou o story (página do filme no site):
`https://cinedatabr.tech/obras/B1900232600000?utm_source=instagram&utm_medium=post&utm_campaign=cena-bacurau`

## Números e como conferir

Banco local, publicação da ANCINE de 09/11/2026, conferido em 11/11/2026.

| Número | Como conferir |
| --- | --- |
| 742 mil (741.938) | `select sum(publico_total) from lancamentos where codigo_obra = 'B1900232600000';` |
| 8º brasileiro mais visto entre os lançados em 2019 | `with t as (select codigo_obra, sum(publico_total) p from lancamentos where codigo_obra like 'B%' and extract(year from data_lancamento) = 2019 group by 1) select count(*) + 1 from t where p > (select p from t where codigo_obra = 'B1900232600000');` |

Fora do post: estreou em 29/08/2019 em 317 salas (141 mil na semana) e teve sessões antes da estreia nas duas semanas
anteriores (`agregado_semana_obra`).

## Fatos de fora da ANCINE (conferidos em 11/11/2026)

| Fato | Fonte 1 | Fonte 2 |
| --- | --- | --- |
| O diálogo: a forasteira do Sudeste pergunta "Quem nasce em Bacurau é o quê?" e um menino responde "É gente!" | https://www.brasildefato.com.br/2019/08/29/o-que-tu-indica-bacurau-e-o-brasil-que-resiste | https://diariodonordeste.verdesmares.com.br/opiniao/colunistas/xico-sa/bacurau-tem-a-politica-do-brasil-de-baixo-e-do-brasil-de-cima-1.3713595 |

A coluna de Xico Sá grafa a resposta como "Gente"; Brasil de Fato e a Reactor
(https://reactormag.com/e-quem-nasce-em-bacurau-e-o-que-brazilian-resistance-and-identity-in-bacurau/) trazem "É gente!".
Ficou de fora "Se for, vá na paz": é a placa da estrada (texto escrito, não diálogo) e vem da letra de "Juízo Final".

Imagens: TMDB 446159: `i1ctlmMNXZfApda8Vo4YJWZsDyf.jpg` (a forasteira no povoado) e `5KxxFy2pgUXPeYmI80llFxJ5Dt8.jpg` (o povo de Bacurau).
