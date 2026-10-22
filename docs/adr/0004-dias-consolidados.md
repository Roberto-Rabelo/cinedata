# ADR 0004 — Dias consolidados

**Status:** aceita · 2026-10-22

**Contexto.** Os últimos dias publicados chegam com parte das salas (18/10/2026: 209 de ~3.200). Comparar uma semana
incompleta com uma completa gera quedas falsas, e um post com esse número estaria errado.

**Decisão.** Um dia é consolidado quando reporta ao menos 90% da mediana diária de salas. Semana "completa" = 7 dias
consolidados. Sem data informada, a API usa a última semana completa. A curva marca dias parciais.

**Revisar** quando houver histórico completo: a mediana pode ser calculada por janela móvel (ex.: 8 semanas) para
acompanhar abertura e fechamento de salas.
