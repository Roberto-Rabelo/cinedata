# Trend · Esse é o meu filme nacional favorito (Dia do Cinema Brasileiro, 06/11/2026)

Carrossel de 12 slides 1080×1350 e matéria no site. Pedido do usuário em 06/11: entrar no trend do Dia do Cinema
Brasileiro ("esse é o meu filme nacional favorito", ref. @manueladavila: 17 mil curtidas, 2,1 mil compartilhamentos).
O molde do trend (duas cenas do filme e a frase no meio) com o dado do CineData: os 10 brasileiros mais vistos desde
2009, do 10º ao 1º. Publicar o quanto antes (o trend é de 05/11), com o story da matéria.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: faixas com cenas de 5 filmes; "Esse é o filme nacional favorito do Brasil?" |
| 2–11 | `slide-02.png` … `slide-11.png` | do 10º (Minha Vida em Marte) ao 1º (Nada a Perder): duas cenas, a frase do trend, o nome e os ingressos |
| 12 | `slide-12.png` | "Ingresso vendido não é o mesmo que filme favorito": 84,8 mi (29%), os clássicos antes de 2009 e a pergunta |

Os slides 10 (Os Dez Mandamentos) e 11 (Nada a Perder) trazem uma nota sobre os ingressos que passaram pela Igreja
Universal, com a resposta da igreja. Nada a Perder 2 ficou sem nota: o relato de salas vazias na estreia só tem uma
fonte (texto do Estadão republicado por IstoÉ e Gazeta do Povo).

Story: `docs/posts/stories/filmes-brasileiros-mais-vistos-desde-2009.png`.

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/trend-filme-nacional-favorito ../docs/posts/trend-filme-nacional-favorito http://localhost:4331
node scripts/exportar-story.mjs filmes-brasileiros-mais-vistos-desde-2009 ../docs/posts/stories http://localhost:4331
```

Dados do carrossel: `cinedata.front/src/app/features/marca/trend-filme-nacional-favorito.json`.

## Legenda

Contagem: ~1.050 caracteres (limite do Instagram: 2.200). Música: um áudio em alta do trend no Instagram, escolhido na
hora de publicar.

```text
Esse é o filme nacional favorito do Brasil? 🇧🇷🎬 Ontem foi o Dia do Cinema Brasileiro e a gente entrou no trend com a pergunta ao contrário: e se a medida for o ingresso vendido?

Os 10 brasileiros mais vistos nos cinemas desde 2009, segundo a ANCINE:
10º Minha Vida em Marte · 5,2 mi
9º Ainda Estou Aqui · 5,9 mi
8º Se Eu Fosse Você 2 · 6,1 mi
7º Nada a Perder 2 · 6,2 mi
6º Chico Xavier · 6,5 mi
5º Minha Mãe é uma Peça 2 · 9,2 mi
4º Minha Mãe é uma Peça 3 · 10,9 mi
3º Tropa de Elite 2 · 11,1 mi
2º Os Dez Mandamentos · 11,3 mi
1º Nada a Perder · 12,2 mi

Só que ingresso vendido não é o mesmo que filme favorito: nos dois primeiros, parte dos ingressos passou pela Igreja Universal (a história está nos slides). E Cidade de Deus e Central do Brasil nem entram: são de antes de 2009.

Qual é o SEU filme nacional favorito? Conta aqui. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos), lançamentos comerciais desde 2009. Imagens: TMDB/divulgação.

#diadocinemabrasileiro #cinemabrasileiro #filmenacional #cinema #dadosabertos
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/filmes-brasileiros-mais-vistos-desde-2009?utm_source=instagram&utm_medium=post&utm_campaign=trend-filme-nacional-favorito`

## Números e como conferir

Banco local, conferido em 06/11/2026. Filmes com país da obra contendo Brasil (inclui coproduções), lançados desde 2009.

| Número | Valor | Fonte |
| --- | --- | --- |
| 1º Nada a Perder (`B1800110100000`) | 12.173.228, lançado em 29/03/2018 | `lancamentos` |
| 2º Os Dez Mandamentos: O Filme (`B1600036400000`) | 11.305.479, 28/01/2016 | idem |
| 3º Tropa de Elite 2 (`B1001296000000`) | 11.147.238, 08/10/2010 | idem |
| 4º Minha Mãe é uma Peça 3 (`B1900576900000`) | 10.938.240, 26/12/2019 | idem |
| 5º Minha Mãe é uma Peça 2 (`B1600716500000`) | 9.235.788, 22/12/2016 | idem |
| 6º Chico Xavier (`B1001148600000`) | 6.540.455, 02/04/2010 | idem |
| 7º Nada a Perder 2 (`B1900354300000`) | 6.189.465, 15/08/2019 | idem |
| 8º Se Eu Fosse Você 2 (`B0800958700000`) | 6.143.081, 02/01/2009 | idem |
| 9º Ainda Estou Aqui (`B2400324700000`) | 5.857.612, 19/09/2024 | idem |
| 10º Minha Vida em Marte (`B1800539000000`) | 5.234.820, 13/11/2018 | idem |
| Soma do top 10 | 84.765.406 = 28,9% de 293.197.878 | soma |
| Brasileiros desde 2009 | 2.238 obras; 70 com mais de 1 milhão | `lancamentos` |
| Fora do top 10 | Minha Mãe é uma Peça (2013) 12º, 4.605.742; O Auto da Compadecida 2 13º, 4.442.196 | idem |

```sql
with b as (
  select codigo_obra, max(titulo) t, sum(publico_total) pub, min(data_lancamento) ini
  from lancamentos where pais_obra ilike '%brasil%' group by codigo_obra)
select rank() over (order by pub desc), codigo_obra, t, pub, ini from b order by pub desc limit 16;

select count(*) from (select codigo_obra from lancamentos where pais_obra ilike '%brasil%'
  group by 1 having sum(publico_total) >= 1000000) x;
```

## Fatos de fora da ANCINE (conferidos em 06/11/2026)

| Fato | Fontes |
| --- | --- |
| Nada a Perder (2018): sessões vendidas como esgotadas quase vazias (15 pessoas numa sala de 189 lugares); ingressos distribuídos a fiéis | [Metrópoles (09/04/2018)](https://www.metropoles.com/entretenimento/cinema/nada-a-perder-filme-sobre-edir-macedo-e-um-sucesso-de-salas-vazias), [Bahia Notícias, com O Globo (31/03/2018)](https://www.bahianoticias.com.br/cultura/noticia/31233-filme-nada-a-perder-de-edir-macedo-tem-ingressos-esgotados-e-salas-vazias) |
| A Igreja Universal chamou a acusação de "vergonhosa" e negou ter comprado ingressos | [Bahia Notícias (31/03/2018)](https://www.bahianoticias.com.br/cultura/noticia/31233-filme-nada-a-perder-de-edir-macedo-tem-ingressos-esgotados-e-salas-vazias) (resposta da própria igreja) |
| Os Dez Mandamentos (2016): a Universal arrecadou dinheiro nos cultos para comprar ingressos antecipados; pastores disseram que iriam para fiéis que não podiam pagar; a igreja disse apoiar ações de acesso ao filme | [AdoroCinema, com Notícias da TV (19/01/2016)](https://www.adorocinema.com/noticias/filmes/noticia-118741/), [Gazeta do Povo (20/01/2016)](https://www.gazetadopovo.com.br/caderno-g/cinema/os-dez-mandamentos-chega-a-2-milhoes-de-ingressos-com-ajuda-de-fieis-9zwray6n1fy85qstfoz387tgw) |

**Ficou de fora:** a nota sobre salas vazias na estreia de Nada a Perder 2 (uma fonte só: o texto do Estadão Conteúdo
republicado por [IstoÉ](https://istoe.com.br/nada-a-perder-2-sala-vazia-e-desta-vez-sem-o-patrocinio/) e
[Gazeta do Povo](https://www.gazetadopovo.com.br/cultura/filme-sobre-edir-macedo-bate-recorde-de-bilheteria-com-salas-vazias/)).
