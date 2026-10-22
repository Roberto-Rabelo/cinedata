# ADR 0003 — Clean Architecture com CQRS leve

**Status:** aceita · 2026-10-22

**Decisão.** Domain → Application → Infrastructure → Api/Ingestion. Escrita pelas entidades do domínio (validação e
invariantes), gravação em lote com `unnest` + `COPY`; leitura com SQL agregado (Dapper) direto para DTOs.
Sem MediatR: casos de uso são classes simples injetadas.

**Motivos.** O volume (≈100 mil sessões por semana, milhões no histórico) inviabiliza o change tracker do EF para fatos e
agregações por entidade. As regras que não são SQL (semana padrão, limites, validação de código) ficam na Application e
são testadas sem banco.

**Consequências.** Duas formas de acesso a dados (EF + Dapper) na Infrastructure. Os nomes de colunas são
snake_case e o SQL de leitura depende deles: mudanças de schema exigem revisar `ConsultasBilheteriaSql`.
