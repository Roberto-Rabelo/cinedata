# Especial · Dia do Cinema Brasileiro: 3 falas, 3 Brasis (05/11/2026)

Carrossel de 6 slides 1080×1350 e matéria no site. Publicar no próprio dia 05/11/2026, com o story da matéria.
Pedido do usuário no dia: filmes nacionais icônicos, com as falas e o paralelo do contexto de cada filme com a vida real.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: as três cenas com as falas em legenda; "Dia do Cinema Brasileiro: 3 falas, 3 Brasis"; 12,8 milhões somados |
| 2 | `slide-02.png` | por que hoje: 19/06/1898 (Afonso Segreto) e 05/11/1983 (morte de Humberto Mauro); 293 milhões de ingressos para 2.238 filmes brasileiros desde 2009 |
| 3 | `slide-03.png` | Ainda Estou Aqui · Rio, 1971 · "Nós vamos sorrir. Sorriam!" · certidão de Rubens Paiva corrigida em 2025 · 5,9 mi (9º) |
| 4 | `slide-04.png` | O Agente Secreto · Recife, 1977 · "Raparigou ou não raparigou?" · Seu Alexandre existiu (projecionista do Cine Art-Palácio) · 2,5 mi |
| 5 | `slide-05.png` | O Auto da Compadecida 2 · Taperoá · "Não sei… só sei que foi assim." · a cidade da infância de Suassuna · 4,4 mi (13º) |
| 6 | `slide-06.png` | o paralelo: 8,3 milhões em dois anos para dois filmes sobre a ditadura; pergunta |

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/dia-cinema-brasileiro-2026 ../docs/posts/dia-cinema-brasileiro-2026 http://localhost:4300
node scripts/exportar-story.mjs dia-do-cinema-brasileiro-3-falas-3-brasis ../docs/posts/stories http://localhost:4300
```

Dados do carrossel: `cinedata.front/src/app/features/marca/dia-cinema-brasileiro-2026.json`.

## Critério

Filmes brasileiros com dado na base (lançados desde 2009), uma fala conhecida **conferida em duas fontes** e um
paralelo verificável entre o Brasil do filme e a vida real. Ficaram de fora:

- **Tropa de Elite 2** (11,1 mi, 3º brasileiro desde 2009): "o sistema é f…" só aparece atribuída à cena final numa
  fonte (Know Your Meme); "policial não puxa o gatilho sozinho", só no Correio Braziliense (2010). Entra se acharmos
  a 2ª fonte (legenda oficial ou roteiro publicado).
- **Minha Mãe é uma Peça** (a trilogia passa de 24 mi): nenhuma fala de Dona Hermínia com fonte citável.
- **Bacurau**: "Se for, vá na paz" é a placa da estrada, não diálogo, e um artigo liga a frase a uma letra de música
  (regra: nunca letra).
- **Que Horas Ela Volta?**: o tema do "lugar" é muito citado, mas nenhuma fala exata em duas fontes.
- **Clássicos antes de 2009** (Cidade de Deus, Central do Brasil, Tropa de Elite, O Auto da Compadecida de 2000):
  fora da série aberta da ANCINE que usamos (lançamentos desde 2009).

## Legenda

Contagem: ~1.150 caracteres (limite do Instagram: 2.200).

```text
Hoje, 5 de novembro, é o Dia Nacional do Cinema Brasileiro. 🇧🇷🎬 Para comemorar, três falas que o público levou do cinema para casa, e o Brasil que cada filme mostra:

🎞️ “Nós vamos sorrir. Sorriam!” · Ainda Estou Aqui, Rio de 1971. Em 2025, a certidão de óbito de Rubens Paiva foi corrigida: morte violenta, causada pelo Estado. 5,9 milhões de espectadores.

🎞️ “Raparigou ou não raparigou?” · O Agente Secreto, Recife de 1977. Seu Alexandre existiu: foi projecionista do Cine Art-Palácio, no Recife. 2,5 milhões.

🎞️ “Não sei… só sei que foi assim.” · O Auto da Compadecida 2, Taperoá, a cidade do sertão onde Ariano Suassuna passou a infância. 4,4 milhões.

Juntos, 12,8 milhões de pessoas. E dois filmes sobre a ditadura somaram 8,3 milhões de ingressos em dois anos: o público foi ver o próprio país.

Por que 5/11? É o dia em que morreu Humberto Mauro (1983), pioneiro do nosso cinema. A outra data é 19 de junho, quando Afonso Segreto filmou a Baía de Guanabara, em 1898.

Qual fala do cinema brasileiro você mais repete? Conta aqui. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos), lançamentos comerciais. Imagens: TMDB/divulgação.

#diadocinemabrasileiro #cinemabrasileiro #aindaestouaqui #oagentesecreto #autodacompadecida #cinema #dadosabertos
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/dia-do-cinema-brasileiro-3-falas-3-brasis?utm_source=instagram&utm_medium=post&utm_campaign=dia-cinema-brasileiro-2026`

## Números e como conferir

Banco local, conferido em 05/11/2026.

| Número | Valor | Fonte |
| --- | --- | --- |
| Ainda Estou Aqui (`B2400324700000`) | 5.857.612, lançado em 19/09/2024; 9º brasileiro desde 2009 | `lancamentos` |
| O Auto da Compadecida 2 (`B2400470400000`) | 4.442.196, lançado em 26/12/2024; 13º | `lancamentos` |
| O Agente Secreto (`B2500325300000`) | 2.476.469, lançado em 18/09/2025; 33º | `lancamentos` |
| Soma dos três | 12.776.277 → 12,8 mi | soma |
| Os dois da ditadura | 8.334.081 → 8,3 mi | soma |
| Brasileiros desde 2009 | 2.238 obras, 293.197.878 ingressos (país da obra contém Brasil, inclui coproduções) | `lancamentos` |

```sql
with b as (
  select codigo_obra, sum(publico_total) pub, min(data_lancamento) ini
  from lancamentos where pais_obra ilike '%brasil%' group by codigo_obra)
select codigo_obra, pub, ini, rank() over (order by pub desc) from b order by pub desc;

select count(distinct codigo_obra), sum(publico_total) from lancamentos where pais_obra ilike '%brasil%';
```

## Fatos de fora da ANCINE (2 fontes cada, conferidos em 05/11/2026)

| Fato | Fonte 1 | Fonte 2 |
| --- | --- | --- |
| 19/06/1898: Afonso Segreto filma a Baía de Guanabara de um navio | https://www.politize.com.br/dia-do-cinema-brasileiro/ | https://www.al.sp.gov.br/noticia/?id=414730 |
| Humberto Mauro morreu em 05/11/1983; *Ganga Bruta* é a obra mais conhecida | https://www.adorocinema.com/personalidades/personalidade-28976/biografia/ | https://en.wikipedia.org/wiki/Humberto_Mauro |
| 5/11 e 19/6 são as duas datas do cinema brasileiro | https://www.al.sp.gov.br/noticia/?id=414730 | https://www.adorocinema.com/personalidades/personalidade-28976/biografia/ |
| "Nós vamos sorrir. Sorriam!" (Eunice, Ainda Estou Aqui) | https://www.omelete.com.br/filmes/ainda-estou-aqui-fernanda-torres-comemora-oscar-com-frase-do-filme | https://www.metropoles.com/brasil/nos-vamos-sorrir-sorriam-diz-fernanda-torres-apos-oscar |
| Certidão de Rubens Paiva corrigida (jan/2025): morte violenta, causada pelo Estado | https://www.poder360.com.br/poder-brasil/morte-de-rubens-paiva-foi-causada-pelo-estado-diz-nova-certidao/ | https://sbtnews.sbt.com.br/noticia/brasil/morte-violenta-e-causada-pelo-estado-brasileiro-diz-nova-certidao-de-obito-de-rubens-paiva |
| "Raparigou ou não raparigou?" (Seu Alexandre a Marcelo, sobre Fátima) | https://www.omelete.com.br/filmes/o-agente-secreto-livro-revela-wagner-moura-raparigou | https://rollingstone.com.br/cinema/raparigou-ou-nao-raparigou-grande-misterio-de-o-agente-secreto-e-finalmente-resolvido/ |
| Seu Alexandre foi inspirado em Alexandre Moura, projecionista do Cine Art-Palácio (Recife) | https://www.omelete.com.br/filmes/o-agente-secreto-historia-real | https://jornaldaparaiba.com.br/cultura/silvio-osias/o-agente-secreto-resgata-o-recife-dos-meus-afetos |
| "Não sei, só sei que foi assim" (Chicó, O Auto da Compadecida 2) | https://www.adorocinema.com/filmes/filme-314577/criticas-adorocinema/ | https://mais.opovo.com.br/colunistas/flavio-paiva/2024/12/30/so-sei-que-foi-assim-2.html |
| Suassuna passou a infância em Taperoá, sertão da Paraíba | https://www.ebiografia.com/ariano_suassuna/ | https://www.adorocinema.com/noticias/filmes/noticia-1000029586/ |

Divergências anotadas:
- Algumas matérias dizem que o 5/11 lembra a primeira exibição de cinema no Brasil, em 1896, na Rua do Ouvidor
  (Alesp); o Diário do Rio dá 8 de julho de 1896 para essa sessão. Por isso o post não usa essa explicação e fica com
  a morte de Humberto Mauro, que tem duas fontes.
- Na vida real, Alexandre Moura trabalhava no Art-Palácio; no filme, o personagem é projecionista de outro cinema
  (uma fonte cita o São Luiz). O post só diz que ele existiu e onde trabalhava.

## Para 2027

Data fixa no calendário: 05/11 (Dia Nacional do Cinema Brasileiro) e 19/06 (Dia do Cinema Brasileiro). Para preparar
com antecedência: Reels com as cenas, uma fala de Tropa de Elite 2 com duas fontes, os brasileiros do ano (2027) e
a comparação com a semana do Festival do Cinema Brasileiro (ingresso a R$ 12, quando houver).
