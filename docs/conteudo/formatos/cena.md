# Spec · Cena (post coringa)

## Objetivo

Post leve e pronto de antemão, para os dias sem pauta: uma **fala marcante de filme** em duas cenas, com a legenda
embaixo como no cinema, e o número daquele filme nos cinemas do Brasil. Prioridade para **filmes brasileiros** (fala em
português); filmes em outra língua entram com a legenda traduzida e a fala original no slide 2. Sai como carrossel de
2 slides e como Reels de 16 s, do mesmo dado.

## Gatilhos

"post coringa", "cena", "frase de filme", "post para dia vazio", e a rotina automática a cada 15 dias.

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| Filme e fala | escolha minha: filme com dado na base (desde 2009), fala conhecida, de preferência brasileiro | não; o usuário pode sugerir |
| Fala exata | 2 fontes abertas (matéria que cita a fala, Wikiquote, crítica, roteiro publicado) | só se as fontes divergirem |
| Duas cenas | TMDB `/3/movie/{id}/images`, backdrops **sem texto**, vistas no tamanho usado (w1280) | não |
| Número | `lancamentos` (carreira) e, se houver, relançamentos em `agregado_semana_obra` | não |

## Regras

- **Só fala de diálogo.** Nunca letra de música; nunca fala inventada ou "adaptada". Fala em uma fonte só fica de fora.
- Filme em outra língua: a legenda do slide 1 é **tradução nossa** (dito no slide 2 e na legenda); a fala original
  aparece no slide 2.
- As cenas são de divulgação e não precisam ser o quadro exato da fala, mas têm de combinar com ela (personagem,
  lugar, clima). Conferir a imagem no tamanho final: no TMDB, a miniatura (w300) de um arquivo às vezes é outra imagem.
- O número segue os [princípios](../principios.md): consolidado de lançamentos para a carreira; relançamento à parte.
- Não há matéria: o link da bio vai para a página do filme, `https://cinedatabr.tech/obras/<cpb>?utm_source=instagram&utm_medium=post&utm_campaign=cena-<slug>`.
- Equilíbrio do estoque: pelo menos 2 de cada 3 coringas com filme brasileiro.

## Estrutura

| Peça | Conteúdo |
| --- | --- |
| Slide 1 | as duas cenas empilhadas de ponta a ponta, cada uma com metade da fala em legenda branca; faixa embaixo com o logo, o título (ano), "Imagens: divulgação" e o perfil |
| Slide 2 | a fala inteira (ou a original), quem diz e em que filme, uma frase de contexto, o número grande, o que ele significa, um fato do dado e a pergunta para os comentários |
| Reels (16 s) | 0–4,8 s cena 1 com a legenda; 4,8–9,8 s cena 2 com a legenda; 9,8–13,6 s o número; 13,6–16 s a pergunta, o logo e o site |

## Passo a passo

1. Escolher o filme e conferir a fala em 2 fontes; anotar as fontes.
2. Números: `lancamentos` (soma por `codigo_obra`), posição entre os brasileiros desde 2009 ou no ano, relançamentos.
3. Cenas: listar os backdrops sem texto do TMDB, baixar em w1280 e montar um mosaico com ordem garantida (uma
   linha por vez, com `hstack`/`vstack`; o filtro `tile` do ffmpeg embaralha a ordem). Escolher duas.
4. Acrescentar a cena em `cinedata.front/src/app/features/marca/cenas.json` (slug, título, ano, idioma, quem, falas
   com imagem e `posicao`, `original`, contexto, número, fato, pergunta, obra, tmdb).
5. Carrossel: com `ng serve --port 4300`, `node scripts/exportar-slides.mjs /marca/cena/<slug> ../docs/posts/cena-<slug> http://localhost:4300`.
   Se estourar, encurtar `contexto` e `fato`, nunca a fala.
6. Reels: `node scripts/gerar-video-cena.mjs <slug> ../docs/posts/cena-<slug>` (prévia: `VIDEO_PREVIA=3,8,11.5,15`).
7. `legenda.md` no padrão dos princípios (sem a seção de matéria), com as fontes da fala. A legenda do Instagram é
   mais curta que a dos outros formatos (500–800 caracteres): a fala, o contexto, o número, a pergunta.
8. Cartão no painel Pauta CineData: formato `Cena`, etapa `pronto`, `quando: "coringa: qualquer dia sem pauta"`,
   `pasta` preenchida. Linha no [registro](../registro.md).

## Aceite (além do comum)

- [ ] Fala conferida em 2 fontes, sem letra de música; tradução marcada como nossa.
- [ ] As duas cenas vistas no PNG final, combinando com a fala.
- [ ] Reels 1080×1920, 30 fps, 16 s; nada importante nos 250 px do topo e da base.
- [ ] Cartão `pronto` no painel.

## Exemplos

[Ainda Estou Aqui](../../posts/cena-ainda-estou-aqui/legenda.md) ·
[O Auto da Compadecida 2](../../posts/cena-auto-da-compadecida-2/legenda.md) ·
[Interestelar](../../posts/cena-interestelar/legenda.md)
