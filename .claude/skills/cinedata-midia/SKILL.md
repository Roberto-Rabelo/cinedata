---
name: cinedata-midia
description: Produz posts e vídeos do Instagram/TikTok do CineData seguindo as specs da cartela de conteúdo (docs/conteudo). Use quando o usuário pedir um Top 5 da semana, uma Notícia ("CineData | Notícia"), um post especial, um Reels, um carrossel ou um post sobre um filme/fato de cinema; também para criar um formato novo, registrar uma pauta ou atualizar o status de um post.
---

# Mídia do CineData (SDD)

A fonte da verdade são os arquivos em `docs/conteudo/`. Leia-os a cada execução; esta skill só dá o roteiro.

0. **Painel**: as ideias e pautas do dia a dia ficam no artefato Pauta CineData
   (`https://claude.ai/artifact/DcvcgGKfbvcCN7Xuxz6nNR`, coleção `cartoes`). Leia com a ferramenta `ArtifactData`
   (`list`/`query`) quando o pedido for "o que tem para postar", "próximas pautas" ou um assunto que pode já estar lá.
   Ao começar um post, mova o cartão para `producao`; ao terminar, para `pronto` (com `pasta` e `materia`); quando o
   usuário disser que publicou, `publicado` com `publicadoEm`; números do Insights vão em `metricas`. Escreva sempre
   com `if_version` do que leu. Ideia nova que surgir no trabalho vira cartão `ideia`.
   - **Varredura da internet** ("procura pautas nos sites", "o que está saindo"): buscar estreias, relançamentos,
     recordes e prêmios nos canais de cinema (Ingresso.com, Omelete, AdoroCinema, CNN Brasil Pop, Terra, Forbes,
     Deadline, The Hollywood Reporter, Variety). Só vira cartão o que tem ângulo com dado da ANCINE: conferir o número
     no banco e escrever no `gancho`/`notas`. Cartão com `status: "internet"`, `fonte` (nome do canal) e `link`
     (URL da notícia); o que estiver em uma fonte só ou divergente fica anotado como "conferir". Não duplicar
     cartão que já existe (procurar pelo filme antes). O usuário aprova movendo para `ideia` (→).
1. **Cartela**: leia `docs/conteudo/README.md` e identifique o formato pelo pedido (tabela "Formatos" e "Como pedir").
   - Nenhum formato serve → proponha ao usuário criar a spec (seção "Como incluir um formato novo") ou registrar em
     "Formatos propostos". Não produza fora de spec sem o ok dele.
2. **Spec**: leia `docs/conteudo/principios.md` e `docs/conteudo/formatos/<formato>.md` inteiros.
3. **Briefing**: preencha as "Entradas" da spec. Pergunte ao usuário só o que a spec manda perguntar (ex.: critério
   de um especial). Fatos de fora da ANCINE: 2 fontes abertas; divergência com o que o usuário disse → avise antes.
4. **Produção**: siga o "Passo a passo" da spec, partindo do exemplo mais recente do formato (componente em
   `cinedata.front/src/app/features/marca/`, saída em `docs/posts/<slug>/`). Dê notícias curtas do andamento.
5. **Matéria**: escreva `cinedata.front/conteudo/materias/<slug>.md` (seção "Matéria" dos princípios), busque o
   trailer com `node scripts/buscar-trailer.mjs <id-tmdb>`, rode `npm run materias` e confira `/materias/<slug>`.
6. **Aceite**: rode o checklist comum (`principios.md`) e o da spec. Abra e olhe cada PNG/quadro exportado.
7. **Registro**: linha nova em `docs/conteudo/registro.md`; tire a pauta da cartela; acrescente pautas novas que o
   post criar (ex.: acompanhamento prometido). Se o trabalho revelou uma regra nova, atualize a spec (não só o post).
8. **Commit** local só com os arquivos do post e dos docs de conteúdo, sem linha `Co-Authored-By`. Não faça push sem
   pedido.

**Métricas**: quando o usuário mandar números do Insights do Instagram ou do Umami, registre na seção "Desempenho" de
`docs/conteudo/registro.md` e diga em 2–3 linhas o que funcionou melhor por formato.

Ao terminar, mande os arquivos ao usuário (PNGs e `legenda.md`) e diga em 2–3 linhas o que o post traz, o que ficou de
fora e o que ainda precisa dele (ex.: escolher a música do Reels).
