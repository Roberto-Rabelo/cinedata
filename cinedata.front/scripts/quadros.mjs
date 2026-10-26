// Grava uma composição HTML como vídeo, quadro a quadro: a página expõe window.render(t) (t em segundos) e cada
// quadro é uma foto do Chrome. Texto e movimento saem nítidos e o tempo é exato, sem gravação de tela.
// Usado por gerar-reels.mjs e gerar-video-halloween.mjs.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * @param pagina página do Playwright já com a composição carregada (fontes e imagens prontas).
 * @param opcoes.seletor elemento fotografado (o quadro de 1080×1920).
 * @param opcoes.saida pasta de saída; o vídeo é gravado lá com o nome opcoes.nome.
 * @param opcoes.capa segundo usado para a capa (opcional), gravada como opcoes.nomeCapa (padrão capa.png).
 * @param opcoes.previa lista de segundos: grava só previa-<t>.png e não gera vídeo (para ajustar o layout).
 */
export async function gravarVideo(pagina, { seletor = '#q', fps = 30, duracao, saida, nome, capa, nomeCapa = 'capa.png', previa }) {
  const quadro = pagina.locator(seletor);
  await mkdir(saida, { recursive: true });
  const fotografar = async (t, caminho, tipo = 'png') => {
    await pagina.evaluate(t => window.render(t), t);
    await quadro.screenshot({ path: caminho, type: tipo, ...(tipo === 'jpeg' ? { quality: 92 } : {}) });
  };

  if (previa) {
    for (const t of previa) await fotografar(t, join(saida, `previa-${t}.png`));
    return;
  }

  const pasta = await mkdtemp(join(tmpdir(), 'cd-quadros-'));
  try {
    const total = Math.round(fps * duracao);
    for (let i = 0; i < total; i++) {
      await fotografar(i / fps, join(pasta, `${String(i).padStart(4, '0')}.jpg`), 'jpeg');
      if (i % 150 === 0) console.log(`quadro ${i}/${total}`);
    }
    if (capa !== undefined) await fotografar(capa, join(saida, nomeCapa));
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-framerate', String(fps), '-i', join(pasta, '%04d.jpg'),
      // Quadros JPEG vêm em faixa de cor cheia; o Instagram espera yuv420p em faixa de TV.
      '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high',
      '-movflags', '+faststart', join(saida, nome),
    ]);
  } finally {
    await rm(pasta, { recursive: true, force: true });
  }
}
