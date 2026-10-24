# Backlog

O que o POC provou e o que vem a seguir. Cada item vira uma issue no GitHub.

## Feito no POC (out/2026)

- [x] Ingestão incremental por CRC via HTTP Range (amostra de 8 semanas em ~15 s)
- [x] Domínio: obra, sala, sessão, lançamento, semana cinematográfica, UF/região
- [x] API: painel semanal, ranking, UFs, busca de obras, curva de público
- [x] Regras de qualidade: dias consolidados, pré-estreia, títulos nacionais
- [x] Front: painel, página de obra, identidade visual, prévia de post 1080×1350
- [x] 43 testes no back, CI no GitHub Actions

## Etapa 1 — Dados completos

- [x] Carga do histórico completo (desde 2014) e medição de tempo/volume — 19 min, 38,5 mi de sessões, 5,1 GB
- [x] Agregados materializados (`semana × obra`, `semana × UF`) para não varrer `sessoes` a cada consulta — painel de 27 s para 13 ms
- [x] Mediana de salas por janela móvel no critério de dia consolidado (ADR 0004)
- [x] Filtros de período no painel: semana, mês, trimestre, semestre e ano (ADR 0005), todos em ~10 ms
- [ ] Agendamento semanal da ingestão (worker com Quartz/Hangfire ou cron do host) + alerta em falha
- [ ] Verificar CRC32 do conteúdo baixado (integridade)
- [ ] Dimensão de município com código IBGE (mapas por cidade)

## Etapa 2 — Métricas para conteúdo

- [ ] Ocupação média por filme/sala ("o filme que mais lota salas")
- [ ] Curva de vida: semanas em cartaz e queda média semana a semana
- [ ] Ranking de exibidoras e distribuidoras
- [ ] Cidades sem cinema / desertos de cinema (cruzar salas × IBGE)
- [ ] "Neste dia" (efemérides do histórico)
- [ ] Comparar com o mesmo período do ano anterior (out/2026 × out/2025), além do período imediatamente anterior
- [ ] Período parcial comparável: variação contra os mesmos dias do período anterior (1 a 19/10 × 1 a 19/09)
- [ ] Fomento × público (FSA e renúncia fiscal) — com cuidado editorial

## Etapa 3 — cinedata.conteudo

- [ ] Projeto de render: Playwright for .NET abre o template e exporta PNG 1080×1350 e 1080×1920
- [ ] Templates: Top 5 da semana (pronto no front), mapa por UF, dublado × legendado, curva de um filme
- [ ] Fila de revisão no backoffice antes de publicar
- [ ] Vídeo curto (sequência de frames + FFmpeg) para Reels/TikTok
- [ ] Publicação via Instagram Graph API (TikTok depende de auditoria do app)

## Etapa 4 — Produto

- [ ] Validar 4–6 semanas de posts antes de automatizar tudo (métrica: alcance e salvamentos por formato)
- [ ] Portal público: páginas de obra e UF indexáveis (SSR) para link na bio
- [ ] Enriquecimento com TMDB (pôster, gênero) — checar termos de uso comercial
- [ ] Deploy: container (API + worker) + PostgreSQL gerenciado
- [ ] Verificar marca, @ e domínio "CineData"
