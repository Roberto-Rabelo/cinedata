# cinedata.conteudo

Geração de posts (Instagram, TikTok) a partir da CineData API. **Planejado** — ver [backlog](../docs/backlog.md#etapa-3--cinedataconteudo).

## Abordagem

1. Template em HTML/CSS com os tokens da [identidade visual](../docs/identidade-visual.md), desenhado em unidades do
   próprio quadro (`cqw`) para escalar sem distorcer.
2. Playwright for .NET abre o template com os dados da semana e exporta PNG 1080×1350 (feed) e 1080×1920 (Reels/Stories).
3. Vídeo: sequência de frames + FFmpeg.
4. Revisão humana antes de publicar.

O primeiro template já existe como protótipo no front: `cinedata.front/src/app/features/marca/post-ranking.ts`
(visível em `http://localhost:4300/marca`).
