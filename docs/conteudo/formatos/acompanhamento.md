# Spec · CineData | Acompanhamento

## Objetivo

Cumprir a promessa de uma [Notícia](noticia.md): mostrar, semana a semana, como um filme está indo nos cinemas, com
**os números da semana que acabou de fechar na ANCINE** e a mesma régua do post original. É curto, datado e serializado
("semana 1", "semana de estreia", "semana 2"…): quem viu a Notícia sabe o que esperar.

## Gatilhos

"Acompanhamento", "<filme> · semana N", "como foi a estreia de <filme>", uma pauta "Acompanhamento" da
[cartela](../README.md#pautas) ou do painel.

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| O filme e a semana | a pauta (prometida na Notícia) | não |
| A régua | a Notícia original (`docs/posts/.../noticia-<filme>/legenda.md`) | não; mudar a régua só com motivo, dito na legenda |
| Números da semana | banco (`agregado_semana_obra`, `sessoes` + `salas`) | não |
| Fatos de fora (promoção de ingresso, festival, data de streaming) | imprensa (2 fontes) | aviso se mudar a leitura do número |

A semana só entra **completa** na ANCINE (quinta a quarta). Semana parcial pode aparecer como prévia, sempre marcada
como parcial.

## Dados (o que procurar)

1. **A semana**: público, salas, sessões, sessões por sala, ocupação (`publico_com_assentos / assentos`) e a ocupação
   média do país na mesma semana; posição no ranking da semana e entre os brasileiros.
2. **Dia a dia**: `sessoes` por `data_exibicao` (quinta a quarta), para achar o pico (fim de semana, feriado).
3. **Onde**: público e ocupação por UF (`salas.uf`) e as cidades com mais público.
4. **A régua**: os mesmos números para o caso da Notícia, na semana equivalente. Comparar **por sessão** e por ocupação,
   não só o total: circuitos de tamanhos diferentes enganam.

## Estrutura (5 slides)

| # | Slot | Conteúdo | Regras |
| --- | --- | --- | --- |
| 1 | Capa | foto, selo **CineData \| Acompanhamento**, "<filme> · semana N", o número da semana e uma frase | número grande; a frase diz o que ele significa |
| 2 | A semana | salas, sessões, ocupação contra a média do país, e o dia a dia em barras | ocupação sempre com a média do país ao lado |
| 3 | A régua | o caso da Notícia na semana equivalente: total, sessões, público por sessão, ocupação | mesma unidade lado a lado; dizer qual é a leitura justa |
| 4 | Onde | estados em barras (público) com a ocupação; destaque para o que a Notícia contou (ex.: o estado onde o filme foi rodado) | até 10 estados |
| 5 | O que vem | a próxima semana a acompanhar, com a régua dela e a data provável da ANCINE | fecha com pergunta e @cinedata.br |

Selo: `<span class="selo">CineData <i>|</i> Acompanhamento</span>`.

## Regras específicas

- Publicar até 3 dias depois da atualização da ANCINE que fechou a semana; depois disso, juntar com a semana seguinte.
- Não especular a carreira: "o que vem" é a régua do passado e a data do próximo dado.
- Toda promessa de semana seguinte vira pauta "Acompanhamento" na cartela e no painel; a série termina quando o filme
  sai das salas ou quando a Notícia original deixa de ser o assunto (ex.: depois do Oscar).

## Passo a passo

1. Ler a Notícia original e a pauta; conferir que a semana está completa (`max(data_exibicao)` ≥ a quarta da semana).
2. Levantar os dados (itens 1–4); escolher a leitura de capa.
3. Criar `slides-acompanhamento-<filme>-<semana>.ts` a partir do exemplo mais recente; rota
   `marca/acompanhamento-<filme>-<semana>`; exportar para `docs/posts/acompanhamento-<filme>-<semana>/`.
4. Legenda (`legenda.md`) com tabela de números, SQL e fatos de fora; matéria `<filme>-semana-<n>-<assunto>.md` com o
   trailer e a tabela do dia a dia.
5. Pauta da semana seguinte na cartela e no painel; aceite, registro, commit.

## Aceite (além do comum)

- [ ] A semana está completa na ANCINE (ou a parte parcial está marcada como parcial).
- [ ] Ocupação ao lado da média do país; régua comparada por sessão, não só pelo total.
- [ ] Pauta da próxima semana registrada.

## Exemplos

[acompanhamento-feito-pipa-semana-1](../../posts/acompanhamento-feito-pipa-semana-1/legenda.md)
