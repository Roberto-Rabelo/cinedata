---
name: cinedata-midia
description: Produz posts e vídeos do Instagram/TikTok do CineData seguindo as specs da cartela de conteúdo (docs/conteudo). Use quando o usuário pedir um Top 5 da semana, uma Notícia ("CineData | Notícia"), um post especial, um Reels, um carrossel ou um post sobre um filme/fato de cinema; também para criar um formato novo, registrar uma pauta ou atualizar o status de um post.
---

# Mídia do CineData (SDD)

A fonte da verdade são os arquivos em `docs/conteudo/`. Leia-os a cada execução; esta skill só dá o roteiro.

1. **Cartela**: leia `docs/conteudo/README.md` e identifique o formato pelo pedido (tabela "Formatos" e "Como pedir").
   - Nenhum formato serve → proponha ao usuário criar a spec (seção "Como incluir um formato novo") ou registrar em
     "Formatos propostos". Não produza fora de spec sem o ok dele.
2. **Spec**: leia `docs/conteudo/principios.md` e `docs/conteudo/formatos/<formato>.md` inteiros.
3. **Briefing**: preencha as "Entradas" da spec. Pergunte ao usuário só o que a spec manda perguntar (ex.: critério
   de um especial). Fatos de fora da ANCINE: 2 fontes abertas; divergência com o que o usuário disse → avise antes.
4. **Produção**: siga o "Passo a passo" da spec, partindo do exemplo mais recente do formato (componente em
   `cinedata.front/src/app/features/marca/`, saída em `docs/posts/<slug>/`). Dê notícias curtas do andamento.
5. **Aceite**: rode o checklist comum (`principios.md`) e o da spec. Abra e olhe cada PNG/quadro exportado.
6. **Registro**: linha nova em `docs/conteudo/registro.md`; tire a pauta da cartela; acrescente pautas novas que o
   post criar (ex.: acompanhamento prometido). Se o trabalho revelou uma regra nova, atualize a spec (não só o post).
7. **Commit** local só com os arquivos do post e dos docs de conteúdo, sem linha `Co-Authored-By`. Não faça push sem
   pedido.

Ao terminar, mande os arquivos ao usuário (PNGs e `legenda.md`) e diga em 2–3 linhas o que o post traz, o que ficou de
fora e o que ainda precisa dele (ex.: escolher a música do Reels).
