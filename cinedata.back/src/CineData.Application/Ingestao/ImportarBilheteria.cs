using System.Diagnostics;
using CineData.Application.Abstractions;
using CineData.Domain.Bilheteria;
using CineData.Domain.Common;
using CineData.Domain.Importacao;
using CineData.Domain.Obras;
using CineData.Domain.Salas;
using Microsoft.Extensions.Logging;

namespace CineData.Application.Ingestao;

/// <param name="UltimasSemanas">Limita a carga aos N arquivos semanais mais recentes (amostra). Nulo = histórico completo.</param>
/// <param name="Forcar">Reimporta mesmo que o CRC do arquivo não tenha mudado.</param>
public sealed record ImportarBilheteriaComando(int? UltimasSemanas, bool Forcar = false);

/// <summary>
/// Importa a bilheteria diária por exibidoras de forma incremental: só baixa os arquivos semanais
/// novos ou cujo CRC32 mudou desde a última carga.
/// </summary>
public sealed class ImportarBilheteria(
    IFonteDadosAncine fonte,
    ILeitorCsvAncine leitor,
    IRepositorioImportacao importacoes,
    IRepositorioBilheteria bilheteria,
    TimeProvider relogio,
    ILogger<ImportarBilheteria> logger)
{
    public async Task<ResultadoImportacao> ExecutarAsync(ImportarBilheteriaComando comando, CancellationToken ct)
    {
        if (comando.UltimasSemanas is <= 0)
            throw new ArgumentOutOfRangeException(nameof(comando), "UltimasSemanas deve ser positivo.");

        var cronometro = Stopwatch.StartNew();
        var remotos = await fonte.ListarArquivosBilheteriaAsync(ct);

        // Os nomes seguem AAAA-MM-sNN, então a ordem alfabética é a ordem cronológica.
        var alvo = remotos
            .OrderByDescending(a => a.Nome, StringComparer.Ordinal)
            .Take(comando.UltimasSemanas ?? int.MaxValue)
            .OrderBy(a => a.Nome, StringComparer.Ordinal)
            .ToList();

        var existentes = await importacoes.ObterPorFonteAsync(FonteDados.BilheteriaExibidoras, ct);
        int importados = 0, semMudanca = 0, linhas = 0, rejeitadas = 0;

        foreach (var remoto in alvo)
        {
            existentes.TryGetValue(remoto.Nome, out var arquivo);
            if (!comando.Forcar && arquivo is not null && arquivo.MesmaVersao(remoto.Crc32))
            {
                semMudanca++;
                continue;
            }

            var agora = relogio.GetUtcNow();
            if (arquivo is null)
                arquivo = ArquivoImportado.Novo(FonteDados.BilheteriaExibidoras, remoto.Nome, remoto.Crc32, remoto.Tamanho, agora);
            else
                arquivo.NovaVersao(remoto.Crc32, remoto.Tamanho, agora);

            await using var conteudo = await fonte.AbrirArquivoBilheteriaAsync(remoto, ct);
            var lote = await MontarLoteAsync(arquivo, conteudo, ct);
            await bilheteria.SalvarLoteAsync(lote, ct);

            importados++;
            linhas += arquivo.Linhas;
            rejeitadas += arquivo.LinhasRejeitadas;
            logger.LogInformation("{Arquivo}: {Linhas} sessões, {Rejeitadas} rejeitadas",
                remoto.Nome, arquivo.Linhas, arquivo.LinhasRejeitadas);
        }

        return new ResultadoImportacao(alvo.Count, importados, semMudanca, linhas, rejeitadas, cronometro.Elapsed);
    }

    private async Task<LoteBilheteria> MontarLoteAsync(ArquivoImportado arquivo, Stream conteudo, CancellationToken ct)
    {
        var obras = new Dictionary<CodigoObra, Obra>();
        var salas = new Dictionary<int, Sala>();
        var sessoes = new List<Sessao>();
        var rejeitadas = 0;

        await foreach (var linha in leitor.LerBilheteriaAsync(conteudo, ct))
        {
            if (!TentarConverter(linha, out var obra, out var sala, out var sessao))
            {
                rejeitadas++;
                continue;
            }

            obras[obra.Id] = obra;
            salas[sala.Id] = sala;
            sessoes.Add(sessao);
        }

        arquivo.Concluir(sessoes.Count, rejeitadas);
        return new LoteBilheteria(arquivo, obras.Values, salas.Values, sessoes);
    }

    private static bool TentarConverter(LinhaBilheteria l, out Obra obra, out Sala sala, out Sessao sessao)
    {
        obra = null!;
        sala = null!;
        sessao = null!;

        if (!CodigoObra.TryCriar(l.CodigoObra, out var codigo)
            || !Uf.TryCriar(l.Uf, out var uf)
            || l is not
            {
                DataExibicao: { } data, InicioSessao: { } inicio, Publico: { } publico,
                RegistroSala: > 0 and var registroSala, RegistroExibidor: { } registroExibidor,
                Audio: { } audio, Legendada: { } legendada,
            }
            || string.IsNullOrWhiteSpace(l.TituloOriginal)
            || publico < 0)
        {
            return false;
        }

        obra = Obra.Criar(codigo, l.TituloOriginal, l.TituloBrasil, l.PaisObra);
        var exibidor = new Exibidor(registroExibidor, l.RazaoSocialExibidora.Trim(), l.CnpjExibidora.Trim(), l.RegistroGrupoExibidor);
        sala = Sala.Criar(registroSala, l.NomeSala, l.RegistroComplexo ?? 0, l.Municipio, uf, exibidor);
        sessao = Sessao.Criar(codigo, registroSala, data, inicio, publico, audio, legendada);
        return true;
    }
}
