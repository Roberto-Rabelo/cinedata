# CineData | No festival · Se a Maré Te Trouxe, Fica

Primeiro post do formato [No festival](../../conteudo/formatos/festival.md). O curta baiano de Gabriel Fonseca, filmado
em Cachoeira (BA), passou pelo 34º Festival MixBrasil, em São Paulo, com sessões em 12 e 20/11/2026. Revisado em 24/11,
depois das sessões: o post fala do festival no passado. O filme não tem
bilheteria na ANCINE (curta em festival); o número do post é o da cidade: Cachoeira tem 1 sala no cadastro, sem
sessões informadas. Carrossel de 4 slides 1080×1350. Publicar quando houver vaga na semana.

| Slide | Arquivo | Conteúdo |
| --- | --- | --- |
| 1 | `slide-01.png` | capa: os Caretas no barco; "Se a Maré Te Trouxe, Fica"; passou pelo 34º Festival MixBrasil em duas sessões |
| 2 | `slide-02.png` | o filme: sinopse, pôster; direção e roteiro, elenco, filmado em Cachoeira (BA), 19 minutos, Lei Paulo Gustavo; o que são os Caretas |
| 3 | `slide-03.png` | Cachoeira nos dados: 1 sala no cadastro (Cine Theatro Cachoeirano, da prefeitura, 180 lugares, não comercial, sem sessões); Bahia: 141 salas em 24 municípios, Salvador com 56% dos ingressos de 2026 |
| 4 | `slide-04.png` | no festival: 12/11 e 20/11, 15h30, Sala Paulo Emílio do Centro Cultural São Paulo; seleção oficial; "Que curta brasileiro você queria ver na sala de cinema da sua cidade?" |

Os PNGs vêm da rota `/marca/festival-se-a-mare` (`cinedata.front/src/app/features/marca/slides-festival-se-a-mare.ts`):

```bash
cd cinedata.front
node scripts/exportar-slides.mjs /marca/festival-se-a-mare ../docs/posts/festival-se-a-mare-te-trouxe-fica http://localhost:4331
```

## Legenda

Contagem: 1.108 caracteres (limite do Instagram: 2.200).

```text
Se a Maré Te Trouxe, Fica 🌊🎭

O curta baiano de Gabriel Fonseca passou pelo 34º Festival MixBrasil, em São Paulo, com duas sessões em novembro.

No último Carnaval como Careta antes de deixar a cidade, Samuel (Lucas Leto) se apaixona por Beto (Rafa Martins), um estranho de beleza sobrenatural. A festa termina no rio. Os Caretas são os mascarados do Carnaval de cidades do interior da Bahia.

O filme foi rodado em Cachoeira, no Recôncavo. E a cidade nos dados da ANCINE? Tem 1 sala de cinema no cadastro: o Cine Theatro Cachoeirano, da prefeitura, com 180 lugares. É uma sala não comercial, e nenhuma sessão dela aparece na bilheteria da ANCINE.

Na Bahia, são 141 salas em funcionamento, em 24 municípios. Dos 4,5 milhões de ingressos vendidos no estado em 2026, 56% foram em Salvador.

Que curta brasileiro você queria ver na sala de cinema da sua cidade? 👇

A matéria completa está no link da bio.

Fonte: ANCINE (dados abertos), cadastro de salas e bilheteria até 15/11/2026. Sessões: Festival MixBrasil. Imagens: TMDB/divulgação.

#SeAMareTeTrouxeFica #MixBrasil #CinemaBaiano #CurtaMetragem #CineData
```

Link da matéria (bio ou story):
`https://cinedatabr.tech/materias/se-a-mare-te-trouxe-fica-mixbrasil?utm_source=instagram&utm_medium=post&utm_campaign=festival-se-a-mare-te-trouxe-fica`

## Números e como conferir

Base: cadastro de salas da ANCINE (`salas-de-exibicao-e-complexos.csv`, atualizado em 06/11/2026, baixado em 18/11) e
bilheteria por sala (`sessoes`, publicação de 16/11/2026, dados até 15/11). O curta não está na base da ANCINE
(nenhuma obra com esse título em `obras`). Conferido em 18/11/2026.

| Número | Valor | Fonte |
| --- | --- | --- |
| Salas em Cachoeira | 1: Cine Theatro Cachoeirano (registro 5006065), 180 lugares, situação "em funcionamento" desde 25/06/2014, operação "não comercial", exibidor Município de Cachoeira | cadastro (CSV) |
| Sessões do Cine Theatro Cachoeirano | nenhuma em `sessoes` (a bilheteria por sala começa em 2014) | 1ª consulta |
| Salas na Bahia | 141 em funcionamento, em 24 municípios (3 não comerciais) | cadastro (CSV) |
| Bahia em 2026 | 4.505.991 ingressos de 01/01 a 15/11, em 21 municípios com sessão; Salvador 2.531.641 (56,2%) | 2ª consulta |

```sql
-- 1. A sala de Cachoeira e as sessões dela
SELECT sa.registro, sa.nome, sa.assentos, count(s.id) AS sessoes
FROM salas sa LEFT JOIN sessoes s ON s.registro_sala = sa.registro
WHERE sa.municipio = 'CACHOEIRA' AND sa.uf = 'BA' GROUP BY 1, 2, 3;

-- 2. Bahia em 2026
SELECT count(DISTINCT sa.municipio), sum(s.publico), sum(s.publico) FILTER (WHERE sa.municipio = 'SALVADOR')
FROM sessoes s JOIN salas sa ON sa.registro = s.registro_sala
WHERE sa.uf = 'BA' AND s.data_exibicao BETWEEN '2026-01-01' AND '2026-11-15';
```

Salas em funcionamento e operação vêm do CSV de cadastro (colunas `SITUACAO_SALA` e `OPERACAO_USUAL`), que a tabela
`salas` do banco não guarda.

## Fatos de fora da ANCINE (conferidos em 18/11/2026)

| Fato | Fontes |
| --- | --- |
| Direção e roteiro de Gabriel Fonseca; Lucas Leto (Samuel), Rafa Martins (Beto), Bruna Seli e Luciana Souza | [MixBrasil (06/11/2026)](https://2026.mixbrasil.org.br/curtas-mixbrasil/se-a-mare-te-trouxe-fica/) (direção), [Oxente Pipoca (11/11/2026)](https://www.oxentepipoca.com.br/post/curta-metragem-baiano-protagonizado-por-lucas-leto-estreia-no-34%C2%BA-festivalmixbrasil), [Uran Rodrigues (14/11/2026)](https://www.uranrodrigues.com/curta-baiano-com-lucas-leto-estreia-no-festival-mixbrasil-e-mistura-romance-lgbtqia-fantasia-e-tradicoes-do-reconcavo/) |
| Sinopse (Carnaval, Careta, Beto, o rio) | MixBrasil, Oxente Pipoca, Uran Rodrigues (o final no rio só no MixBrasil e no TMDB) |
| Filmado em Cachoeira, Recôncavo Baiano | Oxente Pipoca, Uran Rodrigues; o MixBrasil traz "Cachoeira-BA" |
| 19 minutos, 2026 | MixBrasil ("19") e [FilmFreeway](https://filmfreeway.com/WheretheRiverTakesYou); o TMDB diz 20 |
| Sessões: qui 12/11 e sex 20/11, 15h30, Spcine CCSP, Sala Paulo Emílio, Centro Cultural São Paulo, mostra Curtas MixBrasil | MixBrasil, Oxente Pipoca, Uran Rodrigues |
| Entrada gratuita, ingressos na bilheteria uma hora antes, sujeitos à lotação | Oxente Pipoca, Uran Rodrigues |
| 34º Festival MixBrasil, 11 a 22/11/2026, São Paulo | Oxente Pipoca, Uran Rodrigues, [Cinevitor (21/10/2026)](https://www.cinevitor.com.br/festival-mix-brasil-2026-conheca-os-longas-e-curtas-brasileiros-selecionados/) |
| Recursos da Lei Paulo Gustavo (apoio do Governo da Bahia e do Governo Federal) | Oxente Pipoca, Uran Rodrigues |
| Caretas: personagens mascarados do Carnaval de cidades do interior da Bahia | Oxente Pipoca, Uran Rodrigues |

Ficaram de fora: "estreia mundial" em 12/11 (só no Oxente Pipoca); a seleção de "84 filmes brasileiros" (o Cinevitor
diz 84, mas as listas dele somam 83); o TMDB ainda marca o filme como "em produção".

## Imagens (TMDB 1506980)

- Capa e slide 3: backdrop `j3v6X31G84DPKjeMBbPjddcRUar.jpg` (os Caretas num barco no rio).
- Slide 2: pôster `dnboj8XkMsGZzGOBjOskYGkU6D8.jpg` (com o selo da seleção oficial do MixBrasil).
