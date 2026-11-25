# CineData | Notícia · Robert Pattinson é o novo 007

A Amazon MGM anunciou em 16/11/2026 que Robert Pattinson vai viver James Bond no 26º filme da série, dirigido por Denis
Villeneuve. O post mostra como ele chega nos cinemas do Brasil e faz uma sátira: o "currículo" de Pattinson, com todos os papéis
que ele pegou, e Anne Hathaway com o que sobrou (cinco filmes em 2026). Carrossel de 6 slides 1080×1350. Publicar
na quarta, 25/11; o meme ainda está circulando.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: Pattinson de smoking (O Drama); "Pattinson é o novo 007"; o anúncio de 16/11 |
| 2 | `slide-02.png` | o anúncio: 7º ator na série oficial; 26º filme, sem título; Villeneuve, Steven Knight, Amy Pascal e David Heyman; sem data |
| 3 | `slide-03.png` | os 10 filmes dele com mais público no Brasil desde 2009: a saga Crepúsculo no topo; fora dela, Batman (5,90 mi) |
| 4 | `slide-04.png` | a régua do 007: Batman 2,3× Skyfall; os três 007 de Daniel Craig desde 2009 (2,55 / 2,10 / 1,09 mi) |
| 5 | `slide-05.png` | sátira: "Vagas preenchidas", o currículo de Pattinson (007, Batman, vilão em Arrakis, pretendente da rainha de Ítaca, noivo da Zendaya, funcionário descartável em série); o que sobrou, Hathaway pegou; os dois com 1 em cada 8 ingressos de 2026 |
| 6 | `slide-06.png` | o que vem: Duna: Parte Três (17/12, como Scytale), The Batman Parte II (fev. 2028), o 26º Bond sem data; "Pattinson é um bom 007? E qual vaga ele pega depois dessa?" |

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/noticia-pattinson-007 ../docs/posts/noticia-pattinson-007 http://localhost:4331
```

## Legenda

Contagem: 1.111 caracteres (limite do Instagram: 2.200).

```text
Robert Pattinson é o novo James Bond. 🍸🎬

A Amazon MGM anunciou em 16/11: ele será o 7º ator a viver o 007 na série oficial, no 26º filme, com direção de Denis Villeneuve e roteiro de Steven Knight. Ainda não há data de estreia.

E nos cinemas do Brasil, como ele chega? Fora da saga Crepúsculo, o maior público dele aqui foi como Batman: 5,9 milhões de pessoas, em 2022. É mais que o dobro de qualquer 007 de Daniel Craig desde 2009: Skyfall fez 2,6 milhões.

Atualizamos o currículo dele. Vagas preenchidas: agente secreto britânico, vigilante noturno em Gotham, vilão em Arrakis (Duna: Parte Três, 17/12), pretendente da rainha de Ítaca, noivo da Zendaya e funcionário descartável, em série. Disponibilidade: nenhuma.

O que sobrou, Anne Hathaway pegou: cinco filmes em 2026. Os filmes de um ou de outro levaram 15,4 milhões de pessoas aos cinemas do Brasil este ano, 1 em cada 8 ingressos.

Pattinson é um bom 007? E qual vaga ele pega depois dessa? 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos). Imagens: TMDB/divulgação.

#RobertPattinson #JamesBond #007 #AnneHathaway #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/robert-pattinson-novo-007-numeros-no-brasil?utm_source=instagram&utm_medium=post&utm_campaign=noticia-pattinson-007`

## Números e como conferir

Consolidado de lançamentos da ANCINE (desde 2009, arquivo de 12/11/2026) e bilheteria por sala para os filmes de
2026 (soma das sessões até 22/11/2026, publicação de 23/11). Conferido em 24/11/2026.

| Número | Valor | Fonte |
| --- | --- | --- |
| Carreira de Pattinson no Brasil (top 10 desde 2009) | Amanhecer – Parte 2 9.631.252; Amanhecer – Parte 1 7.205.878; Eclipse 6.218.629; Lua Nova 6.135.360; Batman 5.902.969; A Odisseia 5.322.954 (sessões); O Drama 702.781 (sessões); Lembranças 428.999; Mickey 17 427.779; Tenet 334.144 | 1ª e 3ª consultas |
| 007 de Daniel Craig desde 2009 | Skyfall 2.553.352 (2012); 007 Contra Spectre 2.101.350 (2015); Sem Tempo para Morrer 1.091.342 (2021) | 2ª consulta |
| Batman ÷ Skyfall | 5.902.969 ÷ 2.553.352 = 2,3 | — |
| Filmes de 2026 com Pattinson ou Hathaway | O Diabo Veste Prada 2 6.900.246; A Odisseia 5.322.954; Verity 2.089.770; O Drama 702.781; O Fim da Rua 348.373 = 15.364.124 | 3ª consulta |
| Total de 2026 | 121.280.537 ingressos de 01/01 a 22/11; 15.364.124 = 12,7% (1 em 8) | 4ª consulta |

Crepúsculo (2008) e Harry Potter e o Cálice de Fogo (2005) ficam de fora: o consolidado da ANCINE começa em 2009.
Mother Mary, o 5º filme de Hathaway em 2026, não passou nos cinemas do Brasil (foi direto para o streaming).

```sql
-- 1. Carreira (consolidado)
select codigo_obra, titulo, min(data_lancamento), sum(publico_total) from lancamentos
where titulo in ('THE TWILIGHT SAGA: NEW MOON', 'THE TWILIGHT SAGA: ECLIPSE', 'THE TWILIGHT SAGA: BREAKING DAWN PART 1',
                 'THE TWILIGHT SAGA: BREAKING DAWN PART 2', 'THE BATMAN', 'REMEMBER ME', 'MICKEY 17', 'TENET')
group by 1, 2 order by 4 desc;

-- 2. Os 007
select codigo_obra, titulo, min(data_lancamento), sum(publico_total) from lancamentos
where titulo in ('SKYFALL', 'SPECTRE', 'NO TIME TO DIE') group by 1, 2;

-- 3. Filmes de 2026 (sessões)
select o.titulo_brasil, sum(s.publico) from sessoes s join obras o on o.codigo = s.codigo_obra
where s.codigo_obra in ('E2600030000000', 'E2600038300000', 'E2600183000000', 'E2600022200000', 'E2600151300000')
group by 1 order by 2 desc;

-- 4. Total de 2026
select sum(publico) from sessoes where data_exibicao between '2026-01-01' and '2026-11-22';
```

## Fatos de fora da ANCINE (conferidos em 24/11/2026)

| Fato | Fontes |
| --- | --- |
| Anúncio em 16/11/2026 pela Amazon MGM Studios; direção de Denis Villeneuve; roteiro de Steven Knight; produção de Amy Pascal e David Heyman | [Amazon (16/11/2026)](https://www.aboutamazon.com/news/entertainment/james-bond-robert-pattinson-cast-amazon-mgm-film), [TheWrap (16/11/2026)](https://www.thewrap.com/creative-content/movies/robert-pattinson-james-bond-actor/), [Omelete (16/11/2026)](https://www.omelete.com.br/filmes/007-robert-pattinson-e-confirmado-como-novo-james-bond), [Variety](https://variety.com/2026/film/global/robert-pattinson-new-james-bond-007-1236946655/) |
| 7º ator na série oficial (Eon); 26º filme, sem título; sem data de estreia | [Wikipedia: Robert Pattinson](https://en.wikipedia.org/wiki/Robert_Pattinson), [Time Out (16/11/2026)](https://www.timeout.com/news/its-official-robert-pattinson-is-the-new-james-bond-111626), [Showmetech (16/11/2026)](https://showmetech.com.br/robert-pattinson-novo-james-bond/) |
| Os papéis da sátira: Mickey Barnes (Mickey 17, o funcionário "descartável" que é recriado), Charlie, noivo de Emma/Zendaya (O Drama), Antínoo, pretendente de Penélope (A Odisseia), Scytale (Duna: Parte Três) | [Wikipedia: filmografia de Robert Pattinson](https://en.wikipedia.org/wiki/Robert_Pattinson_filmography), [Wikipedia: The Drama](https://en.wikipedia.org/wiki/The_Drama_(film)), [Wikipedia: The Odyssey (2026)](https://en.wikipedia.org/wiki/The_Odyssey_(2026_film)), Nerdist e TheWrap (Scytale) |
| Anne Hathaway com cinco filmes em 2026 (Mother Mary, O Diabo Veste Prada 2, A Odisseia, O Fim da Rua, Verity) | [Rolling Stone Brasil (14/04/2026)](https://rollingstone.com.br/cinema/os-5-filmes-estrelados-por-anne-hathaway-que-estreiam-em-2026/), [Exame (10/08/2026)](https://exame.com/pop/cinco-filmes-e-um-bebe-por-que-2026-e-o-ano-de-anne-hathaway/) |
| Pattinson e Hathaway juntos só em A Odisseia (Antínoo e Penélope) | [Wikipedia: The Odyssey (2026)](https://en.wikipedia.org/wiki/The_Odyssey_(2026_film)), Exame (acima) |
| Pattinson em O Drama, com Zendaya | [Wikipedia: The Drama](https://en.wikipedia.org/wiki/The_Drama_(film)), [Ingresso.com](https://www.ingresso.com/noticias/filme-the-drama-ganha-data-de-estreia-no-brasil) |
| Duna: Parte Três em 17/12 no Brasil, com Pattinson como Scytale | [ABCdoABC](https://www.abcdoabc.com.br/duna-parte-tres-tera-sessoes-antecipadas/), Ingresso.com (pré-venda); papel: Nerdist e TheWrap |
| The Batman Parte II adiado para 18/02/2028 | [Variety (07/2026)](https://au.variety.com/2026/film/news/the-batman-2-release-date-2028-first-footage-robert-pattinson-38605/), TheWrap (07/2026) |

Ficaram de fora: "8º ator" (só contando David Niven, de 1967, fora da série oficial); 2028 como ano do Bond (projeção
da imprensa); o meme da internet ("Pattinson pega todos os empregos"): a pedido do usuário, o post faz a própria
sátira em vez de citar a piada. A sátira só usa papéis reais, conferidos.

## Imagens (TMDB)

- Capa: O Drama (1325734), backdrop `vc7TeZyKhBeVA4YI3z1KAeIXqGV.jpg` (Pattinson de smoking).
- Slide 4: Batman (414906), backdrop `IYUD7rAIXzBM91TT3Z5fILUS7n.jpg`.
- Slide 5: Mickey 17 (696506), backdrop `9PRKAdrDvAdCfg3EcApLTfzGsEt.jpg` (Mickey e o elenco).
