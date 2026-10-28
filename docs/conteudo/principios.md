# Princípios de todo post

Valem para qualquer formato da [cartela](README.md). A spec do formato só acrescenta ou especializa.

## Voz

1. **O número primeiro.** A manchete é o dado ("Verity levou 621 mil pessoas ao cinema"), nunca "confira os números".
2. **Contexto, não opinião.** Comparar com a semana anterior, outro filme, o histórico, a média do país.
3. **Sempre com fonte.** Rodapé de todo slide: "Fonte: ANCINE (dados abertos)"; na legenda, também a fonte de fatos de
   fora da ANCINE e das imagens.
4. **Brasileiro e regional.** Estado, cidade, sala: o leitor quer se ver no mapa.
5. Português do Brasil, frases curtas, sem jargão ("ingressos" ou "pessoas", não "admissões").

## Dados

- Fonte primária: o banco local (`docker exec -it cinedata-postgres psql -U cinedata -d cinedata`) ou os JSON do site
  em `cinedata.front/dados/` (`semana/`, `mes/`, `ano/`, `obras/`). Os dois têm os mesmos números.
- **Semana cinematográfica** = quinta a quarta. Só publicar semana com os 7 dias consolidados
  ([ADR 0004](../adr/0004-dias-consolidados.md)).
- **Pré-estreias**: público da semana anterior abaixo de 5% do atual conta como estreia, sem variação percentual.
- **Público total de um filme** (carreira inteira): consolidado de lançamentos (`lancamentos.publico_total`, soma das
  distribuidoras). Público de um período: soma de `sessoes`.
- Antes de 2016 a bilheteria por sala não cobre o país: recortes históricos começam em 2016 (ou avisam).
- Renda em valores da época (sem inflação), e isso vai escrito.
- Todo número do post aparece na `legenda.md` com a consulta SQL ou o caminho do JSON que o gera
  ([como conferir](../verificacao.md)).

## Fatos de fora da ANCINE

Datas de estreia, prêmios, Oscar, elenco, sinopse:

- Conferir em **pelo menos duas fontes**, de preferência uma oficial (distribuidora, festival, Academia) e uma de
  imprensa recente. Abrir a página, não confiar em resumo de busca.
- Divergência (de data, de prêmio) é **avisada ao usuário** antes de produzir, com o que cada fonte diz.
- O que não der para confirmar fica fora do post (e anotado na legenda.md).
- Links das fontes na legenda.md, com a data da conferência.

## Imagens

- Cenas e pôsteres de divulgação do TMDB (token em `dotnet user-secrets`, projeto `CineData.Ingestion`;
  `GET /3/search/movie`, `/3/movie/{id}/images`). Crédito "Imagem: divulgação" no slide e "Imagens: TMDB/divulgação"
  na legenda.
- Ver a imagem antes de usar (rosto, recorte 4:5, área livre para texto). Foto clara sob muito texto: `[escurecer]="true"`.
- Nunca pôster como fundo de texto longo; nunca imagem de fora do TMDB/divulgação oficial.

## Identidade visual

Tokens e regras em [identidade-visual.md](../identidade-visual.md): fundo sala, texto tela, âmbar do projetor só como
acento; cores de dados `--cd-dado-*`; Bricolage Grotesque para manchetes e números, Inter para texto. Perfil
`@cinedata.br`, site `cinedatabr.tech`.

## Pipeline técnico

| Peça | Como se faz |
| --- | --- |
| Carrossel 1080×1350 | componente `cinedata.front/src/app/features/marca/slides-<slug>.ts` com `<cd-slide>` por slide e `styleUrl: './slides-comum.css'`; rota `marca/<slug>` em `app.routes.ts` (bloco `marca`) |
| PNGs | `ng serve --port <porta>` em `cinedata.front`, depois `node scripts/exportar-slides.mjs /marca/<slug> ../docs/posts/<slug> http://localhost:<porta>`. O script **falha** se o conteúdo passar do quadro: encurtar texto, não diminuir a margem |
| Vídeo 9:16 | página de composição com `window.render(t)` gravada por `scripts/quadros.mjs` (ver [reels-especial.md](formatos/reels-especial.md)) |
| Dados compartilhados | carrossel e vídeo do mesmo post leem o mesmo JSON (`features/marca/<slug>.json`) |
| Saída | `docs/posts/<slug>/`: `slide-NN.png` (ou `reels.mp4` + `capa*.png`) e `legenda.md` |

`<slug>`: `top5-AAAA-MM-DD` (início da semana), `noticia-<assunto>`, `<tema>-<recorte>`, `reels-<assunto>`.

## Legenda (`legenda.md`)

Estrutura fixa, nesta ordem:

1. Título `# <Formato> · <assunto>` e 1–2 linhas sobre o post (inclusive quando publicar).
2. Tabela **Slide | Arquivo | Conteúdo**.
3. Comando para regerar os arquivos.
4. **Legenda** num bloco ```text```, com a contagem de caracteres (limite do Instagram 2.200; mirar 800–1.300): gancho
   com o número na 1ª linha, o conteúdo, uma pergunta para comentários, "link na bio" quando fizer sentido, fonte,
   3–6 hashtags.
5. **Números e como conferir**: cada número com valor e SQL/JSON.
6. **Fatos de fora da ANCINE** (quando houver), com links e data da conferência.

## Aceite (todo post)

- [ ] Todos os números conferidos e documentados na legenda.md.
- [ ] Fatos externos em 2 fontes; divergências avisadas.
- [ ] Exportação sem erro de estouro; cada PNG aberto e olhado (contraste, cortes, palavra solta no fim da linha).
- [ ] Rodapé com fonte e perfil em todo slide; crédito de imagem quando houver foto.
- [ ] Legenda dentro do limite, com fonte.
- [ ] `ng build` e `ng test` passando no front.
- [ ] Linha nova no [registro](registro.md); pauta correspondente retirada da cartela.
- [ ] Commit local só com os arquivos do post, **sem linha de coautoria**. Push só se o usuário pedir.
