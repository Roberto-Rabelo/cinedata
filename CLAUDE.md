# CineData

Plataforma de dados e conteúdo sobre cinema no Brasil, a partir dos dados abertos da ANCINE. Monorepo:
`cinedata.back` (.NET 10, Clean Architecture), `cinedata.front` (Angular 22), `cinedata.conteudo` (planejado), `docs/`.

## Comandos

- Banco: `docker compose up -d` (PostgreSQL 17, porta 5432, usuário/senha/banco `cinedata`)
- Ingestão: `cd cinedata.back && dotnet run --project src/CineData.Ingestion -- amostra 8`
- API: `dotnet run --project src/CineData.Api --launch-profile http` → http://localhost:5232, docs em `/scalar`
- Front: `cd cinedata.front && npx ng serve --port 4300` (a porta 4200 costuma estar ocupada nesta máquina)
- Pôsteres (TMDB, incremental): `dotnet run --project src/CineData.Ingestion -- posteres`; token em
  `dotnet user-secrets set Tmdb:Token <token> --project src/CineData.Ingestion` (nunca no repositório, que é público)
- Export do site estático: `dotnet run --project src/CineData.Ingestion -- exportar ../cinedata.front/dados` (só lê o banco)
- Site estático: `cd cinedata.front && npm run build:estatico` → `dist/site/browser`; conferir com `node scripts/servir-estatico.mjs`;
  semana inteira: `scripts/publicar-semana.sh` (ver `docs/publicacao.md`)
- Testes: `dotnet test` (back), `npx ng test --watch=false` (front)
- Migration: `dotnet ef migrations add <Nome> -p src/CineData.Infrastructure -s src/CineData.Infrastructure -o Persistence/Migrations`

## Convenções

- Código, nomes e docs em português (domínio: obra, sala, sessão, semana cinematográfica).
- Dependências apontam para dentro: Domain não referencia nada; Application só Domain.
- Escrita via entidades + `unnest`/`COPY`; leitura via SQL (Dapper) em `ConsultasBilheteriaSql`. Colunas em snake_case.
- `TreatWarningsAsErrors` está ligado no back.
- Regras de dados descobertas estão em `docs/dados-ancine.md`; decisões em `docs/adr/`.
- Cores de gráfico só dos tokens `--cd-dado-*` (paleta validada); o âmbar `--cd-projetor` é só marca.
- Front com dois modos de dados (`environments/ambiente*.ts`): `api` no desenvolvimento, `estatico` no site publicado.
  Componentes leem só via `rotasApi`; a chave de período (`ChavePeriodo` no back, `chavePeriodo` no front) precisa
  ser igual nos dois lados. `cinedata.front/dados` é gerado pelo `exportar` (não editar à mão).

## Conteúdo (posts e vídeos)

Pedidos de post (Top 5, Notícia, especial, Reels) seguem a cartela SDD em `docs/conteudo/` (`README.md` = formatos e
pautas, `principios.md` = regras comuns, `formatos/*.md` = specs, `registro.md` = o que já foi feito). A skill
`.claude/skills/cinedata-midia` é o roteiro. Formato novo vira spec antes de virar post.
