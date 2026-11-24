# Top 5 da semana · 05 a 11/11/2026

Carrossel de 6 slides 1080×1350, nesta ordem. Mesmo modelo dos Top 5 anteriores (pôsteres do TMDB, comparação com a
semana anterior). O slide 2 cumpre a promessa da [Notícia de Os Farofeiros 3](../noticia-farofeiros-3/legenda.md): a
estreia comparada com a dos dois primeiros filmes. Feito com atraso, com a semana revisada na publicação da ANCINE de
23/11. Publicar antes do Top 5 de 12 a 18/11.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa do nº 1: Os Farofeiros 3 (pôster), 390.515 ingressos em 1.136 salas; "Estreou com mais que o dobro do 2º" |
| 2 | `slide-02.png` | a franquia na estreia: Os Farofeiros 785.040 (727 salas), 2 639.239 (1.072), 3 390.515 (1.136); 38,9% abaixo do 2 |
| 3 | `slide-03.png` | ranking do Top 5 com pôsteres e a posição da semana anterior |
| 4 | `slide-04.png` | o que mudou: O Gatola da Cartola do 12º para o 3º (▲ 168%); Feito Pipa estreia em 7º (62.323); saíram As Dez Vantagens (3º → 9º) e Minha Melhor Amiga (4º → 18º) |
| 5 | `slide-05.png` | a semana em números: 1,36 milhão (▼ 24,3%, depois de Halloween, Finados e ingresso a R$ 12); Top 5 com 66,1%; nacionais com 39,7% |
| 6 | `slide-06.png` | os 5 pôsteres em leque e "Qual desses você viu?" |

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/top5-2026-11-05 ../docs/posts/top5-2026-11-05 http://localhost:4331
```

Semana completa: os 7 dias consolidados. Números da publicação da ANCINE de 23/11/2026 (dados até 22/11), que revisou a
semana: na de 16/11, O Bosque Selvagem estava 16 ingressos à frente de O Gatola da Cartola; agora o Gatola passou.

## Legenda

Contagem: 1.098 caracteres (limite do Instagram: 2.200).

```text
Os Farofeiros 3 estreou em 1º, com mais que o dobro do 2º colocado: 390.515 ingressos. 🏖️🇧🇷

O Top 5 de 05 a 11/11 (quinta a quarta), com a posição da semana anterior:
1. Os Farofeiros 3 🇧🇷: 390.515 (estreia)
2. Godzilla Minus Zero: 170.157 (estreia)
3. O Gatola da Cartola: 115.806 (era 12º, ▲ 167,8%)
4. O Bosque Selvagem: 114.410 (era 1º, ▼ 52,6%)
5. Cara-de-Barro: 108.945 (era 2º, ▼ 52,6%)

Prometemos mostrar a estreia do 3 ao lado dos outros dois: Os Farofeiros fez 785 mil na 1ª semana e o 2, 639 mil. O 3 estreou em mais salas (1.136) e ficou 38,9% abaixo do 2.

O Gatola da Cartola pulou do 12º para o 3º na 2ª semana. Feito Pipa, o candidato do Brasil ao Oscar, estreou em 7º (62.323).

Foram 1,36 milhão de ingressos, 24% menos que na semana de Halloween, Finados e ingresso a R$ 12. Mesmo assim, os filmes brasileiros ficaram com 39,7% do público, a maior fatia desde setembro.

Qual desses você viu? Conta aqui nos comentários. 👇
A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos). Pôsteres: TMDB.

#cinemabrasileiro #bilheteria #cinema #dadosabertos #osfarofeiros
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/top-5-semana-2026-11-05?utm_source=instagram&utm_medium=post&utm_campaign=top5-2026-11-05`

## Números e como conferir

Export do site (`cinedata.front/dados`, gerado em 23/11/2026 com a publicação da ANCINE até 22/11) e banco local.

| Número | Valor | Fonte |
| --- | --- | --- |
| Top 5 de 05 a 11/11 | 390.515 / 170.157 / 115.806 / 114.410 / 108.945 | `dados/semana/2026-11-05.json`, `ranking` |
| Posições e variações sobre 29/10 a 04/11 | O Bosque Selvagem 1º (▼ 52,6%), Cara-de-Barro 2º (▼ 52,6%), O Gatola da Cartola 12º (▲ 167,8%, de 606 para 1.066 salas) | `variacaoPct`; posição 12º no banco (sem os códigos genéricos) |
| 1º ÷ 2º | 390.515 ÷ 170.157 = 2,29 | `ranking` |
| 3º − 4º | 115.806 − 114.410 = 1.396 (na publicação de 16/11 eram 112.537 e 112.521, com o Bosque à frente) | `ranking` |
| Saíram do Top 5 | As Dez Vantagens de Morrer Depois de Você 3º → 9º (32.137, ▼ 75,7%); Minha Melhor Amiga 4º → 18º (7.158, na Netflix desde 02/11); BTS (transmissão de show, sem sessões) | os dois arquivos e o banco |
| Feito Pipa | 7º, 62.323 em 409 salas | `ranking` |
| Público da semana | 1.362.251 (▼ 24,3% sobre 1.799.408) | `periodo.publico`, `resumo.publicoPeriodoAnterior` |
| Melhor dia | sábado, 07/11: 426.118 | `sum(publico)` de `sessoes` por dia |
| Top 5 | 899.833 de 1.362.251 = 66,1%, entre 131 filmes | `ranking` e `resumo.obras` |
| Nacionais | 39,7% (540.396); 25,5% na semana anterior; a última semana com fatia maior foi a de 17 a 23/09 (47,3%) | `origem` dos dois arquivos; 3ª consulta |
| Régua dos Farofeiros (1ª semana) | Os Farofeiros 785.040 (727 salas, 08 a 14/03/2018); Os Farofeiros 2 639.239 (1.072 salas, 07 a 13/03/2024); Os Farofeiros 3 390.515 (1.136 salas): −38,9% sobre o 2 | Notícia de 05/11 (`docs/posts/noticia-farofeiros-3/legenda.md`) e `agregado_semana_obra` |

```sql
-- 1. Posições fora do Top 10 (sem os códigos genéricos)
with r as (select semana, codigo_obra, publico, rank() over (partition by semana order by publico desc) pos
           from agregado_semana_obra where semana in ('2026-10-29', '2026-11-05') and codigo_obra not like 'G%')
select * from r where codigo_obra in ('E2600226500000', 'B2600253800000', 'B2600181900000');

-- 2. Dia a dia
select data_exibicao, sum(publico) from sessoes
where data_exibicao between '2026-11-05' and '2026-11-11' group by 1 order by 1;

-- 3. Fatia nacional por semana em 2026
select semana, round(100.0 * sum(publico) filter (where codigo_obra like 'B%') / sum(publico), 1)
from agregado_semana_obra where semana between '2026-01-01' and '2026-11-05' group by 1 order by 2 desc limit 5;
```

**O Gatola da Cartola:** estreou em 29/10 em 606 salas (43.240, 12º) e foi para 1.066 salas na 2ª semana; não é
pré-estreia (mais de 5% da semana atual), por isso aparece como "era 12º".

**Números revistos:** as publicações de 16/11 e 23/11 reprocessaram o histórico. A semana de 29/10 a 04/11 tem hoje
1.799.408 ingressos (O Bosque Selvagem 241.446); o post daquela semana usou 1.794.092 e 241.312.

## Fatos de fora da ANCINE

Nenhum fato novo de fora: Halloween, Finados e o Festival do Cinema Brasileiro (ingresso a R$ 12 de 29/10 a 04/11)
foram conferidos no Top 5 de 29/10; Minha Melhor Amiga na Netflix desde 02/11, na Notícia de 14/11.
