# ADR 0004 — Dias consolidados

**Status:** aceita · 2026-10-22 · revisada em 2026-10-23 (janela móvel)

**Contexto.** Os últimos dias publicados chegam com parte das salas (18/10/2026: 209 de ~3.200). Comparar uma semana
incompleta com uma completa gera quedas falsas, e um post com esse número estaria errado.

**Decisão.** Um dia é consolidado quando reporta ao menos 90% da mediana de salas da **janela móvel de 8 semanas
(56 dias de calendário) que termina nele**. Semana "completa" = 7 dias consolidados. Sem data informada, a API usa a
última semana completa. A curva marca dias parciais.

A regra fica no domínio (`DiasConsolidados`) e roda em memória sobre `agregado_dia` (uma linha por dia, ~4.000 no
histórico), então é testável sem banco e não varre `sessoes`.

**Por que janela móvel.** Com o histórico desde 2014, a mediana global mistura épocas: o parque exibidor muda de
tamanho, e em 2020–2021 as salas fecharam e reabriram aos poucos. Com a mediana global, todos os dias da pandemia
ficavam "parciais" (e também o 2º semestre de 2016, quando o envio ainda crescia) e a semana padrão do painel poderia ser escolhida errado. A janela de 8 semanas acompanha o
patamar de cada época e continua imune à cauda incompleta (os 3–4 últimos dias são minoria na janela).

**Efeito medido** (histórico até 22/10/2026): semanas parciais caem de 171 para 62 das 579. Sobram os dois primeiros
anos quase vazios (2014–2016), fechamentos reais da pandemia (mar–abr/2020, mar–abr/2021), Natal e Ano-Novo
(as salas fecham de fato) e a cauda da publicação. Ver `docs/dados-ancine.md`.

**Consequências.**
- Uma queda real e brusca de salas (ex.: fechamento de março/2020) aparece como "parcial" até que a nova realidade
  ocupe mais da metade da janela (~4 semanas). Isso afeta só a marcação dos dias no histórico, não os números.
- Dias parciais podem aparecer no meio do histórico, não só na cauda. O front (`curva-linha.ts`) hoje traceja a
  curva a partir do *primeiro* dia parcial; para filmes que cruzam março/2020 precisa tracejar só os trechos parciais.
- Dias sem nenhuma sessão não existem em `agregado_dia`; a janela é por calendário, não por contagem de dias.
- No começo do histórico (junho/2014) a janela tem menos dias; a mediana usa os que existem.
