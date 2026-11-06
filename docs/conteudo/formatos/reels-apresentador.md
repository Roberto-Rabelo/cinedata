# Spec · Reels com apresentador

> **Piloto (novembro/2026).** Os primeiros vídeos servem para acertar luz, som, ritmo e tom. Cada piloto atualiza esta
> spec com o que funcionou (seção "Aprendizados dos pilotos") antes de o formato virar recorrente.

## Objetivo

Dar um rosto à página: alguém do CineData apresenta um assunto falando para a câmera, e o vídeo corta para as artes e
os números que já existem (carrossel, gráfico, mapa). O apresentador é o guia e as artes são a prova. É o mesmo
conteúdo dos outros formatos, contado por uma pessoa, e não um formato de opinião.

## Gatilhos

"Reels comigo", "Reels falado", "vídeo com apresentador", "eu apresentando <assunto>", "piloto de Reels".

## Entradas

| Entrada | De onde | Pergunto ao usuário? |
| --- | --- | --- |
| Assunto | um post pronto (Top 5, Notícia, Aniversário, especial) ou institucional | não, se vier do pedido ou da pauta |
| Roteiro (falas × tela) | proposta minha, a partir da `legenda.md` do post de origem | **sim**: mostro o roteiro antes de ele gravar |
| Artes de corte | PNGs do carrossel de origem (`docs/posts/<slug>/slide-NN.png`) ou quadros do Reels especial | não |
| Gravação bruta | o usuário grava (ver "Captação") | — |
| Música de fundo | escolhida pelo usuário no Instagram, bem baixa sob a voz, ou nenhuma | não |

## Estrutura (30–60 s; mirar ~45 s, ~110 palavras faladas)

| Tempo | Cena | Na tela | Regras |
| --- | --- | --- | --- |
| 0–3 s | **Gancho** | rosto, perto | a 1ª frase é o número ou a surpresa ("Verity levou 621 mil pessoas ao cinema em uma semana"). Nada de "oi, pessoal" |
| 3–10 s | **O fato** | rosto → 1º corte para a arte | o que aconteceu, em uma frase; o número aparece escrito na tela enquanto é falado |
| 10–~40 s | **O contexto** | alternar arte (≥ 60% do tempo) e rosto | 2–3 comparações do post de origem; um corte a cada 3–6 s; cada número falado aparece na tela |
| ~40–50 s | **A virada** | rosto | o detalhe que só o dado mostra (o estado, o legendado × dublado, a sala) |
| últimos 5–8 s | **Fecho** | rosto + logo | pergunta para os comentários, "a matéria completa está no link da bio", assinatura ("Eu sou <nome>, isto é o CineData"), fonte na tela |

**Ritmo:** cortar as pausas e as respirações longas, sem acelerar a voz. Se o roteiro passar de 60 s, ele está longo
demais e o assunto vira dois vídeos.

## Layouts

| Layout | Quando | Como |
| --- | --- | --- |
| **Rosto em tela cheia** | gancho, virada, fecho | 9:16, olhos no terço superior (y ≈ 600–700), legenda queimada no terço central-baixo |
| **Arte em tela cheia + voz** | o contexto | PNG 1080×1350 centralizado num quadro 1080×1920 com fundo Sala `#0D0E12`; zoom lento (≤ 5%) para não ficar parado |
| **Rosto em janela sobre a arte** | quando a arte precisa de explicação longa | círculo de ~360 px, borda Projetor `#FFB547` de 4 px, no canto **superior** direito (a base é coberta pela interface) |

## Captação

**Padrão: iPhone.**

- Câmera **traseira, 1x**, na vertical, 4K a 30 fps (Ajustes → Câmera → Gravar Vídeo). Travar foco e exposição
  (segurar o dedo na tela até aparecer "Bloqueio AE/AF").
- Tripé na altura dos olhos, a ~1 m; enquadrar do peito para cima, com espaço acima da cabeça.
- **Roteiro como teleprompter:** num app de teleprompter no próprio iPhone (lendo pela câmera frontal) ou no Mac
  logo abaixo da câmera traseira. Ler em blocos curtos e olhar para a lente, não para a tela.
- **Som:** microfone de lapela (com fio ou sem fio) a um palmo da boca; ambiente sem eco (cortina, sofá, estante
  ajudam). Sem lapela, o celular a no máximo 1 m e um cômodo silencioso.
- **Luz:** janela ou painel LED de frente ou a 45°, nunca atrás. Mesma luz em todas as tomadas do vídeo.
- **Fundo** com a cara do CineData (pôsteres, estante de filmes, luz âmbar discreta), sempre o mesmo para criar
  identidade.
- Gravar cada bloco do roteiro em uma tomada separada, 2 vezes; o gancho, 3 vezes.
- **Como se ver com a câmera traseira:** enquadrar uma vez (olhando a tela ou com alguém ajudando), marcar com fita a
  posição do tripé e da cadeira e conferir a 1ª tomada antes de seguir. Um espelho atrás do celular mostra o
  enquadramento ao vivo; um Apple Watch (app Câmera Remota), também. Com luz boa, a **câmera frontal** do iPhone 13
  (12 MP, 4K) também serve, e você se vê o tempo todo; desligar o espelhamento (Ajustes → Câmera → Espelhar Câmera
  Frontal) para o texto do fundo não sair invertido.

**Alternativa: Mac.**

- A câmera do MacBook grava em **16:9 1080p**: recortar para 9:16 deixa a imagem com ~600 px de largura, mole no
  Reels. Só serve para o layout **rosto em janela** (o círculo pequeno não precisa de resolução).
- O microfone do MacBook é bom para **voz por cima das artes** (narração sem rosto), num cômodo silencioso.
- Gravação de tela (⌘⇧5) do site `cinedatabr.tech` (mapa, página do filme) rende boas imagens de corte: janela do
  navegador estreita (~600 px) para caber na vertical.

## Edição

- Editor: CapCut (desktop) para os pilotos; DaVinci Resolve ou Final Cut Pro se o formato ficar. Projeto 1080×1920,
  30 fps.
- **Legenda queimada** em todo o vídeo (muita gente assiste sem som): gerar a automática e **revisar palavra por palavra**
  (nomes de filme e números saem errados). Inter semibold, cor Tela `#F3EFE6`, palavra em destaque em Projetor
  `#FFB547`, 2 linhas no máximo, no terço central.
- Áudio: voz normalizada (~−14 LUFS), música, se houver, 20 dB abaixo da voz; sem música de filme nem de trailer.
- Artes: só as que já existem no post de origem (os números já foram conferidos). Arte nova = slide novo no
  componente do post, exportado pelo pipeline normal.
- Cenas em movimento: só spot oficial da distribuidora, com crédito (como em `scripts/emoldurar-video.mjs`); nunca
  trecho de filme ou trailer baixado.
- Exportar H.264, 1080×1920, 30 fps, com áudio AAC.

## Regras específicas

- Valem a voz e as regras de dados dos [princípios](../principios.md): **todo número falado é o número do post de
  origem**, com a mesma fonte. Arredondar na fala ("quase 400 mil"), mas a tela mostra o número do post.
- Falar "pessoas" ou "ingressos", nunca "admissões" ou "público pagante".
- Fato de fora da ANCINE (estreia, prêmio) dito em voz também precisa das 2 fontes na `legenda.md`.
- Opinião sobre o filme, só se for apresentada como opinião, e nunca no gancho.
- Os brutos ficam **fora do repositório** (que é público): pasta local, ex.: `~/Movies/CineData/<slug>/`. No git vão
  só o vídeo final, a capa e a `legenda.md`.

## Saída

`docs/posts/reels-<assunto>/` (ou dentro da pasta do post de origem, em seção "Reels com apresentador" da
`legenda.md`):

- `reels.mp4` (final) e `capa-reels.png` (quadro do rosto + manchete; rosto e texto dentro de 1080×1350 central,
  que é o recorte da grade do perfil).
- `legenda.md`: roteiro em tabela **Tempo | Fala | Na tela**, legenda do Reels (~400–600 caracteres: gancho, pergunta,
  link na bio, fonte, hashtags) e os números com a consulta, como em qualquer post.
- Matéria: aponta para a do post de origem. Reels institucional não tem matéria (como os institucionais atuais) e
  leva para `cinedatabr.tech`.

## Passo a passo

1. Escolher o post de origem e escrever o roteiro (tabela Tempo | Fala | Na tela). Mostrar ao usuário e ajustar.
2. Gerar o roteiro em texto corrido para o teleprompter (blocos curtos, uma frase por linha).
3. O usuário grava (checklist de captação acima) e diz onde estão os brutos.
4. Montar: rosto, cortes para as artes, legenda revisada, áudio, fecho com logo e fonte.
5. Conferir no celular (não só no Mac): legibilidade, nada embaixo da interface do Instagram, som com e sem fone.
6. Aceite, registro (formato "Reels com apresentador"), commit só com final, capa e `legenda.md`.
7. Piloto: anotar em "Aprendizados dos pilotos" o que mudar.

## Aceite (além do comum)

- [ ] 1080×1920, 30 fps, 30–60 s, **com áudio** (`ffprobe`).
- [ ] O gancho diz o número ou a surpresa nos primeiros 3 s.
- [ ] Cada número falado aparece escrito na tela e bate com a `legenda.md` do post de origem.
- [ ] Legenda queimada revisada (nomes de filme, números, acentos).
- [ ] Nenhum texto importante nos 250 px do topo nem nos 350 px da base.
- [ ] Voz limpa (sem eco, sem estalo, sem música por cima da fala); conferido no celular.
- [ ] Fonte "ANCINE (dados abertos)" na tela no fecho; crédito de imagens quando houver cena do TMDB.
- [ ] Brutos fora do git.

## Pilotos (novembro/2026)

| # | Assunto | Post de origem | Por que esse | Quando gravar |
| --- | --- | --- | --- | --- |
| 1 | Quem faz o CineData e por que ler bilheteria | institucional ([apresentacao](../../posts/apresentacao/legenda.md), [como-medimos](../../posts/como-medimos/legenda.md)) | não depende de dado novo; apresenta o rosto | primeira semana |
| 2 | O Top 5 da semana, falado | Top 5 da semana mais recente | testa o formato recorrente com um assunto toda semana | junto com o próximo Top 5 |
| 3 | Feito Pipa na semana de estreia | Acompanhamento (pauta "após 05/11") | assunto quente, com régua clara (O Agente Secreto, Ainda Estou Aqui) | quando a ANCINE fechar a semana |
| 4 (opcional) | Amanhecer Parte 1 faz 15 anos | Aniversário (pauta de 18/11) | testa nostalgia + rosto | até 18/11 |

## Aprendizados dos pilotos

_(preencher a cada piloto: duração final, o que cortou, retenção no Insights, o que mudar na spec)_

## Exemplos

— (primeiro: piloto 1)
