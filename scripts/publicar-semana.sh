#!/usr/bin/env bash
# Versão nova do site estático com os dados da semana: ingestão → export → build estático.
# Passo a passo e o que ativar no GitHub/Cloudflare em docs/publicacao.md.
#
#   scripts/publicar-semana.sh [--cadastros] [--sem-ingestao] [--enviar]
#
#   --cadastros     também reimporta salas e lançamentos (recalcula o histórico dos agregados, ~2 min a mais)
#   --sem-ingestao  só exporta e gera o site com o que já está no banco
#   --enviar        commita cinedata.front/dados e faz push; o workflow "Publicar site" publica a partir do push
#
# Variáveis: URL_SITE (endereço público, para og:url, canonical e sitemap; ex.: https://cinedata.com.br).
set -euo pipefail

raiz="$(cd "$(dirname "$0")/.." && pwd)"
cadastros=false; ingestao=true; enviar=false
for arg in "$@"; do
  case "$arg" in
    --cadastros) cadastros=true ;;
    --sem-ingestao) ingestao=false ;;
    --enviar) enviar=true ;;
    *) echo "Opção desconhecida: $arg" >&2; exit 1 ;;
  esac
done

etapa() { printf '\n\033[1;33m▶ %s\033[0m\n' "$*"; }
inicio=$SECONDS

etapa "Banco (docker compose)"
# Projeto fixo "cinedata": rodando de uma worktree, o nome da pasta criaria outro volume (banco vazio).
docker compose -p cinedata -f "$raiz/docker-compose.yml" up -d --wait

cd "$raiz/cinedata.back"
if $ingestao; then
  if $cadastros; then
    etapa "Cadastros de salas e lançamentos"
    dotnet run --project src/CineData.Ingestion -- cadastros
  fi
  etapa "Ingestão incremental da bilheteria (só os arquivos que a ANCINE mudou)"
  dotnet run --project src/CineData.Ingestion -- bilheteria
fi

etapa "Export dos JSON para cinedata.front/dados"
dotnet run --project src/CineData.Ingestion -- exportar ../cinedata.front/dados

etapa "Build estático (prerender de todas as páginas)"
cd "$raiz/cinedata.front"
[ -d node_modules ] || npm ci
npm run build:estatico

dados_ate=$(node -p "require('./dados/indice.json').dadosAte")
mudancas=$(git -C "$raiz" status --porcelain -- cinedata.front/dados | wc -l | tr -d ' ')
etapa "Pronto em $((SECONDS - inicio)) s: dados até $dados_ate, $mudancas arquivos de dados alterados"
echo "Conferir localmente: node cinedata.front/scripts/servir-estatico.mjs  →  http://localhost:4320"

if $enviar; then
  if [ "$mudancas" = 0 ]; then
    echo "Nada novo para enviar."
  else
    etapa "Commit e push dos dados"
    git -C "$raiz" add cinedata.front/dados
    git -C "$raiz" commit -m "Dados: bilheteria até $dados_ate"
    git -C "$raiz" push
  fi
else
  echo "Para publicar: git add cinedata.front/dados && git commit -m \"Dados: bilheteria até $dados_ate\" && git push"
fi
