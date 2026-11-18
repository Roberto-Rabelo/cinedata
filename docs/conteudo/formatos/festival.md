# Spec · CineData | No festival

## Objetivo

Anunciar a sessão de um filme brasileiro num festival (curta ou longa que ainda não está no circuito comercial) e
contar, com os dados da ANCINE, **o lugar de onde o filme vem**: as salas de cinema da cidade e do estado onde foi feito
e o público de cinema por lá. O filme não tem bilheteria própria (sessões de festival entram no código genérico
"Mostras e Festivais" da ANCINE, e curtas quase nunca têm lançamento comercial); o número que só a ANCINE dá é o do
lugar.

Formato leve: 4 slides, sem régua de bilheteria. Quando o filme chegar ao circuito, o assunto passa para a
[Notícia](noticia.md) e o [Acompanhamento](acompanhamento.md).

## Gatilhos

"Notícia sobre o curta X no festival Y", "o filme X passa no festival", "estreia em festival", "faz um post do X no
MixBrasil / Gramado / Tiradentes / Mostra de SP".

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| O filme e o festival | o pedido | não |
| Ficha, sinopse, sessões (data, hora, local, gratuidade) | site do festival + imprensa (2 fontes) | aviso se houver divergência ou sessão já passada |
| Cidade e estado do filme | imprensa (onde foi filmado) ou o site do festival | não |
| Imagens | TMDB (`movie/{id}/images`); sem imagem no TMDB, perguntar se há material oficial | sim, se não houver imagem |
| Salas e público do lugar | `salas` (cadastro: arquivo `salas-de-exibicao-e-complexos.csv`, com situação e operação) e `sessoes` | não |

## Dados (o que procurar)

1. **A cidade do filme no cadastro**: quantas salas em funcionamento, de quem (prefeitura, rede, cineclube), quantos
   lugares, operação comercial ou não, e se alguma sessão foi informada à ANCINE (`sessoes` por `registro_sala`).
2. **O estado**: salas em funcionamento e municípios com sala (cadastro); municípios com sessão informada no ano e o
   público do ano (`sessoes` + `salas.uf`), com a fatia da capital.
3. **Se houver**: o público dos filmes brasileiros no estado, ou outro filme feito na mesma cidade que tenha passado
   no circuito (régua leve, opcional).

Não inventar causa para um número (ex.: por que a sala não informa sessões): dizer o que o cadastro diz.

## Estrutura (4 slides)

| # | Slot | Conteúdo | Regras |
| --- | --- | --- | --- |
| 1 | Capa | foto, selo **CineData \| No festival**, título do filme, festival, dia e hora da sessão | o título do filme é a manchete |
| 2 | O filme | sinopse em 1–2 frases, pôster, ficha (direção, elenco, duração, onde foi feito, financiamento) | só o que foi conferido em 2 fontes |
| 3 | O lugar nos dados | a cidade no cadastro da ANCINE e o estado em 2–3 números | número grande + o contexto do estado |
| 4 | Onde ver | sessões (data, hora, sala, cidade), gratuidade, a mostra; pergunta e @cinedata.br | sessão já passada aparece como "já passou" |

Selo: `<span class="selo">CineData <i>|</i> No festival</span>`.

## Regras específicas

- Publicar até a véspera ou o dia da sessão; depois dela, o post perde o sentido (a matéria fica no site).
- Datas, horários e local da sessão com 2 fontes (o site do festival conta como uma).
- Sem público do filme: não estimar plateia de festival.
- Matéria `<slug>.md` com formato `Festival`: o filme, a ficha, o lugar nos dados e as sessões, com as fontes.

## Passo a passo

1. Pesquisar o filme e as sessões (2 fontes, abrir as páginas); avisar o usuário de divergências e sessões passadas.
2. Levantar os dados do lugar (itens 1–3); conferir a situação das salas no arquivo de cadastro mais recente.
3. Escolher as imagens (TMDB; sem imagem, perguntar).
4. Criar `slides-festival-<filme>.ts` a partir do exemplo mais recente; rota `marca/festival-<filme>`; exportar para
   `docs/posts/festival-<filme>/`.
5. Legenda com tabela de números, SQL e fatos de fora; matéria; aceite, registro, commit.

## Aceite (além do comum)

- [ ] Sessões (data, hora, local) com 2 fontes e link na legenda.md.
- [ ] Pelo menos um número do cadastro ou da bilheteria da ANCINE sobre o lugar do filme.
- [ ] Nenhum número de público atribuído ao filme.

## Exemplos

[festival-se-a-mare-te-trouxe-fica](../../posts/festival-se-a-mare-te-trouxe-fica/legenda.md)
