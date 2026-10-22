# ADR 0001 — Monorepo com três pastas

**Status:** aceita · 2026-10-22

**Contexto.** O projeto tem back (.NET), front (Angular) e geração de conteúdo. Um único desenvolvedor.

**Decisão.** Um repositório com `cinedata.back`, `cinedata.front` e `cinedata.conteudo`.

**Consequências.** Uma mudança de métrica atravessa API, front e templates num único commit/PR. CI único com jobs por
pasta. Se o conteúdo virar serviço independente, pode ser extraído depois.
