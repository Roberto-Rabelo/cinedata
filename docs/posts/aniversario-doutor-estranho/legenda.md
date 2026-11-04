# Aniversário · Doutor Estranho faz 10 anos

Carrossel de 7 slides 1080×1350 e matéria no site. Publicar na sexta, 06/11/2026, 18h–19h, com o story da matéria no
mesmo dia. O aniversário no Brasil foi 03/11 (data oficial de lançamento); o filme entrou em cartaz em 02/11/2016.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: "Doutor Estranho faz 10 anos", 4,8 milhões no Brasil, 459 mil só no feriado de Finados |
| 2 | `slide-02.png` | linha do tempo: Hong Kong (13/10/16), Brasil (02/11/16), EUA (04/11/16), Oscar (24/01/17), sequência (05/05/22), 10 anos |
| 3 | `slide-03.png` | a frase: “Dormammu, vim negociar.” |
| 4 | `slide-04.png` | semanas em cartaz em 2016: a 2ª (1,47 mi) maior que a 1ª (1,38 mi), as duas em 1º |
| 5 | `slide-05.png` | quem viu: 66% dublado; São Paulo 654 mil, Rio 396 mil (23%) |
| 6 | `slide-06.png` | os seis filmes de herói de 2016 (41,2 mi): Doutor Estranho em 5º |
| 7 | `slide-07.png` | a sequência (8,5 mi em 2022): 4,0 mi na 1ª semana; o 1º voltou a 63 salas e fez mais 56 mil |

Story: `docs/posts/stories/doutor-estranho-faz-10-anos-publico-no-brasil.png` (spec
[story-materia](../../conteudo/formatos/story-materia.md)).

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/aniversario-doutor-estranho ../docs/posts/aniversario-doutor-estranho http://localhost:4331
node scripts/exportar-story.mjs doutor-estranho-faz-10-anos-publico-no-brasil ../docs/posts/stories http://localhost:4331
```

## Legenda

Contagem: ~1.100 caracteres (limite do Instagram: 2.200).

```text
Doutor Estranho faz 10 anos. No Brasil, 4,8 milhões de pessoas viram o filme nos cinemas, e ele abriu num feriado: 459 mil só no Dia de Finados de 2016. 🌀

O que os números da ANCINE contam:
• A 2ª semana foi maior que a 1ª: 1,47 milhão contra 1,38 milhão, as duas em 1º lugar.
• 66% do público viu dublado.
• Só a cidade de São Paulo somou 654 mil espectadores.
• Em 2016, o ano dos heróis, foi o 5º de seis filmes de super-herói, atrás de Guerra Civil, Batman vs Superman, Esquadrão Suicida e Deadpool.
• A sequência, Multiverso da Loucura (2022), quase dobrou: 8,5 milhões.

E a frase que ficou: “Dormammu, vim negociar.”

Qual dos dois você viu no cinema? Conta aqui. 👇
A matéria completa, com as semanas em cartaz, está no link da bio.

Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#doutorestranho #marvel #cinema #bilheteria #dadosabertos
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/doutor-estranho-faz-10-anos-publico-no-brasil?utm_source=instagram&utm_medium=post&utm_campaign=aniversario-doutor-estranho`

## Números e como conferir

Banco local, conferido em 04/11/2026. Códigos: Doutor Estranho `E1600482800000`; Multiverso da Loucura `E2200135700000`.

| Número | Valor | Fonte |
| --- | --- | --- |
| Carreira | 4.797.907 espectadores, R$ 74.736.773,77 (valores da época), lançamento oficial 03/11/2016, Disney | `lancamentos` |
| Feriado de Finados | 458.673 em 1.143 salas em 02/11/2016 (o maior dia do filme); antes, só pré-estreias (máx. 2.196 em 01/11) | `sessoes` por dia |
| Semanas em 2016 | 27/10: 461.810 (2º) · 03/11: 1.383.175 (1º) · 10/11: 1.466.206 (1º) · 17/11: 561.388 (2º) · 24/11: 311.398 (2º) · 01/12: 191.489 (4º) · 08/12: 93.840 (9º) · 15/12: 32.423 (12º) | `agregado_semana_obra` + `rank()` |
| Quem tirou o 1º lugar | Animais Fantásticos e Onde Habitam, em 17/11 (1.737.758) | idem |
| Dublado | 3.009.711 de 4.568.724 nas sessões = 65,9% | `sessoes.audio = 1` (Dublado) |
| Cidades | São Paulo 654.144; Rio de Janeiro 396.113; juntas 23,0% | `sessoes` × `salas.municipio` |
| Heróis de 2016 | Guerra Civil 9.617.668 · Batman vs Superman 8.565.462 · Esquadrão Suicida 7.828.026 · Deadpool 6.044.324 · Doutor Estranho 4.797.907 · X-Men: Apocalipse 4.374.189 = 41.227.576 | `lancamentos` |
| 9º de 2016 | entre todos os lançados em 2016, por público | `lancamentos` |
| Sequência | 8.489.568, R$ 169.430.379,36; 1ª semana (05/05/2022) 4.001.017 em 2.540 salas | `lancamentos`, `agregado_semana_obra` |
| A volta do 1º em 2022 | 55.768 de 28/04 a 23/06/2022, em até 63 salas (29.053 na semana da estreia da sequência) | `agregado_semana_obra` |

O consolidado (4,80 mi) é maior que a soma das sessões (4,57 mi): a bilheteria por sala só cobre o país inteiro a
partir de ago/2016, e o consolidado soma tudo o que a distribuidora declarou. Carreira = consolidado; semanas, áudio e
cidades = sessões.

```sql
-- Carreira e a sequência
SELECT codigo_obra, max(titulo), min(data_lancamento), sum(publico_total), sum(renda_total)
FROM lancamentos WHERE codigo_obra IN ('E1600482800000', 'E2200135700000') GROUP BY 1;

-- Os dias da abertura
SELECT data_exibicao, sum(publico), count(DISTINCT registro_sala)
FROM sessoes WHERE codigo_obra = 'E1600482800000' AND data_exibicao BETWEEN '2016-10-26' AND '2016-11-06'
GROUP BY 1 ORDER BY 1;

-- Semanas e posição no ranking
SELECT semana, publico, salas, rk FROM (
  SELECT codigo_obra, semana, publico, salas, rank() OVER (PARTITION BY semana ORDER BY publico DESC) rk
  FROM agregado_semana_obra WHERE semana BETWEEN '2016-10-27' AND '2017-01-11') x
WHERE codigo_obra = 'E1600482800000' ORDER BY semana;

-- Dublado × original (audio: 0 original, 1 dublado)
SELECT audio, sum(publico) FROM sessoes WHERE codigo_obra = 'E1600482800000' GROUP BY 1;

-- Cidades
SELECT sa.municipio, sa.uf, sum(s.publico) FROM sessoes s JOIN salas sa ON sa.registro = s.registro_sala
WHERE s.codigo_obra = 'E1600482800000' GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 5;

-- Lançamentos de 2016 por público
SELECT codigo_obra, max(titulo), sum(publico_total) FROM lancamentos GROUP BY codigo_obra
HAVING extract(year FROM min(data_lancamento)) = 2016 ORDER BY 3 DESC LIMIT 12;
```

## Fatos de fora da ANCINE

Conferidos em 04/11/2026.

| Fato | Fontes |
| --- | --- |
| Pré-estreia mundial em Hong Kong, 13/10/2016 | [SCMP](https://www.scmp.com/news/hong-kong/economy/article/2027735/actor-benedict-cumberbatch-kicks-global-promotion-film-doctor), [The Kathmandu Post](https://kathmandupost.com/art-entertainment/2016/10/16/dr-strange-premiers-in-hk) |
| Estreia nos EUA, 04/11/2016 | [TMDB (datas de lançamento)](https://themoviedb.org/movie/284052-doctor-strange/releases), mesmas fontes acima |
| Indicado ao Oscar de efeitos visuais; venceu Mogli: O Menino Lobo | [Legião dos Heróis (indicados)](https://www.legiaodosherois.com.br/2017/esquadrao-suicida-e-doutor-estranho-sao-indicados-ao-oscar.html), [Legião dos Heróis (vencedores)](https://www.legiaodosherois.com.br/2017/oscar-2017-confira-lista-com-todos-os-vencedores-da-premiacao.html) |
| A frase “Dormammu, I've come to bargain”, de Strange para Dormammu, no laço de tempo | [Looper](https://looper.com/737782/most-memorable-doctor-strange-quotes-in-the-mcu), [Know Your Meme](https://knowyourmeme.com/memes/dormammu-ive-come-to-bargain); tradução nossa |

**Ficou de fora:** o gancho com *Vingadores: Doutor Destino* (dezembro). As fontes se contradizem sobre a volta de
Benedict Cumberbatch: ele disse à Variety que o Doutor Estranho não estaria no filme e depois voltou atrás
([Omelete](https://www.omelete.com.br/marvel-cinema/vingadores-doomsday-nao-tera-doutor-estranho),
[Jovem Nerd](https://jovemnerd.com.br/noticias/filmes/benedict-cumberbatch-estara-vingadores-5)). Retomar na pauta de
dezembro, se confirmado.
