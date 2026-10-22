# ADR 0002 — Ingerir CSV, não JSON

**Status:** aceita · 2026-10-22

**Contexto.** A ANCINE publica os mesmos dados em CSV, JSON e XML.

**Decisão.** Ingerir CSV.

**Motivos.** O JSON tem os mesmos campos, todos como string (`"PUBLICO":"0"`, datas `dd/MM/yyyy`), sem ganho de
tipagem; pesa 1,90 GB contra 1,21 GB (21,7 GB contra 8,8 GB descompactado); CSV faz streaming linha a linha com
CsvHelper e casa com `COPY` no PostgreSQL. O JSON que importa é o que a nossa API serve.
