# Spec · Reels especial

## Objetivo

Vídeo vertical curto que conta a mesma história de um especial (ou da marca) em movimento: contagem regressiva,
números contando, revelação no fim. Feito quadro a quadro no Chrome, então texto e movimento saem nítidos.

## Gatilhos

"Reels", "vídeo do especial", "reels de <tema>", "versão em vídeo".

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| O especial de origem | JSON do carrossel (`features/marca/<slug>.json`) | não, se já existir |
| Duração e roteiro | proposta minha (25–45 s) | mostro o roteiro em tabela antes de gerar o vídeo final |
| Música | escolhida pelo usuário no Instagram | não (o vídeo sai sem áudio) |

## Especificação técnica

- 1080×1920 (9:16), 30 fps, H.264, **sem áudio**; `reels.mp4` + `capa-reels.png` (ou `capa.png`).
- Composição HTML com `window.render(t)` (t em segundos), gravada por `scripts/quadros.mjs`.
- Script do vídeo: `cinedata.front/scripts/gerar-video-<slug>.mjs <pasta-saida>`, lendo o mesmo JSON do carrossel.
- Prévia barata: `VIDEO_PREVIA=2,5,30 node scripts/gerar-video-<slug>.mjs <pasta>` grava só esses segundos em PNG.
- Precisa de `ffmpeg` no PATH, Google Chrome instalado e internet (imagens do TMDB).

## Estrutura (roteiro padrão de contagem)

| Tempo | Cena | Regras |
| --- | --- | --- |
| 0–3,5 s | Abertura | o projetor acende; título da lista e o número total; o gancho ("se tiver coragem") |
| 3,5 s–~75% | Itens | ~2,5 s por item: cena se aproximando, posição, título, ano, número contando, barra | ritmo constante |
| ~75%–80% | Suspense | tela escura, feixe piscando, "O nº 1 é…" | só em contagem regressiva |
| ~80%–90% | Revelação | o nº 1 com o número grande | a cena mais forte |
| ~90%–100% | Fecho | fatos da lista, pergunta, logo, `cinedatabr.tech`, fonte e crédito de imagens | legível por ≥ 2 s |

Transições: a tela apaga e a luz volta piscando, como um projetor trocando de rolo. Textos no terço central (a
interface do Instagram cobre o topo e a base).

## Legenda do Reels

Mais curta que a do carrossel (~400–600 caracteres): gancho, uma provocação para assistir até o fim, pergunta, link na
bio, fonte, hashtags. Vai na mesma `legenda.md` do especial, em seção "Reels". O Reels não tem matéria própria: aponta
para a matéria do especial.

## Passo a passo

1. Escrever o roteiro (tabela tempo × cena) e mostrar ao usuário.
2. Criar `scripts/gerar-video-<slug>.mjs` a partir de `gerar-video-halloween.mjs`.
3. Gerar prévias (`VIDEO_PREVIA`), olhar, ajustar; gerar o vídeo final.
4. Assistir/conferir os quadros-chave; documentar roteiro e comando na `legenda.md`.
5. Aceite, registro, commit.

## Aceite (além do comum)

- [ ] 1080×1920, 30 fps, duração dentro de 25–45 s (`ffprobe`).
- [ ] Números iguais aos do carrossel (mesmo JSON).
- [ ] Nenhum texto importante nos 250 px do topo ou da base.
- [ ] Capa exportada.

## Exemplos

[Halloween (reels)](../../posts/halloween-terror-top10/legenda.md#reels-vídeo) · [1º semestre de 2026](../../posts/semestre-2026-top10/legenda.md#reels-vídeo) · Institucionais:
[reels-plataforma](../../posts/reels-plataforma/legenda.md), [reels-plataforma-v2](../../posts/reels-plataforma-v2/legenda.md)
