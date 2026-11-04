# Spec · Story de matéria

## Objetivo

Levar quem viu o post para a matéria no site. O link da bio cai na página inicial (128 dos 137 visitantes até
04/11/2026), e só o story tem link clicável direto para uma página. Um story por matéria, com a capa da matéria e uma
faixa vazia para o adesivo de link do Instagram.

## Gatilhos

"Story da matéria", "story com link", "story do <post>". Também faz parte do aceite de todo post que tem matéria:
publicou o post, sobe o story.

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| Matéria | `cinedata.front/conteudo/materias/<slug>.md`, já convertida com `npm run materias` | não |
| Foto, selo, título e chamada | a própria matéria: `imagem` (TMDB em tamanho original), `formato`, `titulo` e a 1ª frase do `resumo` | não |
| Link do adesivo | `https://cinedatabr.tech/materias/<slug>?utm_source=instagram&utm_medium=story&utm_campaign=<slug>` | não |

Não há componente por post: a rota `/marca/story/<slug>` monta o story de qualquer matéria
(`cinedata.front/src/app/features/marca/story-materia.ts`). `/marca/story` lista as matérias com o link de cada uma.

## Estrutura (1 quadro 1080×1920)

| Faixa | Conteúdo |
| --- | --- |
| topo (até ~240 px) | só foto: o Instagram cobre com a barra de progresso e o perfil |
| logo | logo CineData e crédito da imagem |
| capa | selo "CineData \| <formato>", título da matéria, 1ª frase do resumo |
| chamada | "Leia a matéria completa" e a seta para baixo, em âmbar |
| adesivo | faixa vazia de ~170 px: é onde entra o adesivo de link |
| rodapé | fonte e cinedatabr.tech, acima dos ~230 px que a barra de resposta cobre |

## Passo a passo

1. Com o front em modo API rodando: `cd cinedata.front && node scripts/exportar-story.mjs <slug>` (ou `todas`). O PNG
   vai para `docs/posts/stories/<slug>.png` e o script imprime o link com UTM.
2. Abrir o PNG e conferir: título sem corte, texto legível sobre a foto, faixa do adesivo vazia.
3. No Instagram: novo story com o PNG → adesivo **Link** → colar o link → texto do adesivo "Ler a matéria" →
   posicionar sobre a faixa vazia, logo abaixo da seta.
4. Destacar nos **Destaques** do perfil ("Matérias"), para o link continuar acessível depois de 24 h.

## Regras específicas

- O título é o da matéria; se ele não couber em 4 linhas, encurte o `titulo` da matéria (vale para o site também),
  não o story.
- O story sai no mesmo dia do post ou no dia seguinte. Story antigo não volta: o destaque faz esse papel.
- Sempre o link com UTM `utm_medium=story`: é o que separa story, bio e post no Umami (relatório UTM).

## Aceite (além do comum)

- [ ] Story 1080×1920 exportado pelo script (ele falha se o conteúdo passar do quadro).
- [ ] Link com UTM colado no adesivo e testado no celular.
- [ ] Story no destaque "Matérias".

## Exemplos

[docs/posts/stories](../../posts/stories/), um PNG por matéria publicada até 04/11/2026.
