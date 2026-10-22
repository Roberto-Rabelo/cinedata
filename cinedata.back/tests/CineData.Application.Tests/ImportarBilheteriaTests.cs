using System.Runtime.CompilerServices;
using CineData.Application.Abstractions;
using CineData.Application.Ingestao;
using CineData.Domain.Bilheteria;
using CineData.Domain.Importacao;
using Microsoft.Extensions.Logging.Abstractions;

namespace CineData.Application.Tests;

public class ImportarBilheteriaTests
{
    private readonly FonteFalsa _fonte = new();
    private readonly LeitorFalso _leitor = new();
    private readonly RepositoriosFalsos _repos = new();

    private ImportarBilheteria CriarCaso() =>
        new(_fonte, _leitor, _repos, _repos, TimeProvider.System, NullLogger<ImportarBilheteria>.Instance);

    [Fact]
    public async Task Amostra_importa_apenas_as_semanas_mais_recentes()
    {
        _fonte.Arquivos.AddRange([Arquivo("2026-09-s05", 1), Arquivo("2026-10-s01", 2), Arquivo("2026-10-s02", 3)]);

        var resultado = await CriarCaso().ExecutarAsync(new ImportarBilheteriaComando(UltimasSemanas: 2), default);

        Assert.Equal(2, resultado.ArquivosImportados);
        Assert.Equal(["bilheteria-2026-10-s01.csv", "bilheteria-2026-10-s02.csv"], _repos.Lotes.Select(l => l.Arquivo.Nome));
    }

    [Fact]
    public async Task Arquivo_com_mesmo_crc_nao_e_baixado_de_novo()
    {
        _fonte.Arquivos.Add(Arquivo("2026-10-s01", 42));
        _repos.Existentes["bilheteria-2026-10-s01.csv"] =
            ArquivoImportado.Novo(FonteDados.BilheteriaExibidoras, "bilheteria-2026-10-s01.csv", 42, 10, DateTimeOffset.UtcNow);

        var resultado = await CriarCaso().ExecutarAsync(new ImportarBilheteriaComando(null), default);

        Assert.Equal(1, resultado.ArquivosSemMudanca);
        Assert.Empty(_repos.Lotes);
        Assert.Equal(0, _fonte.Aberturas);
    }

    [Fact]
    public async Task Arquivo_retificado_e_reimportado_reaproveitando_o_registro()
    {
        _fonte.Arquivos.Add(Arquivo("2026-10-s01", 99));
        var existente = ArquivoImportado.Novo(FonteDados.BilheteriaExibidoras, "bilheteria-2026-10-s01.csv", 42, 10, DateTimeOffset.UtcNow);
        _repos.Existentes[existente.Nome] = existente;

        await CriarCaso().ExecutarAsync(new ImportarBilheteriaComando(null), default);

        var lote = Assert.Single(_repos.Lotes);
        Assert.Same(existente, lote.Arquivo);
        Assert.Equal(99u, existente.Crc32);
    }

    [Fact]
    public async Task Linhas_invalidas_sao_contadas_e_descartadas()
    {
        _fonte.Arquivos.Add(Arquivo("2026-10-s01", 1));
        _leitor.Linhas.AddRange([
            Linha(),
            Linha() with { Uf = "XX" },
            Linha() with { CodigoObra = "INVALIDO" },
            Linha() with { Publico = null },
            Linha() with { RegistroSala = 0 },
        ]);

        var resultado = await CriarCaso().ExecutarAsync(new ImportarBilheteriaComando(null), default);

        Assert.Equal(1, resultado.Linhas);
        Assert.Equal(4, resultado.LinhasRejeitadas);
        var lote = Assert.Single(_repos.Lotes);
        Assert.Single(lote.Sessoes);
        Assert.Single(lote.Obras);
        Assert.Single(lote.Salas);
    }

    [Fact]
    public async Task Semanas_precisa_ser_positivo() =>
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() =>
            CriarCaso().ExecutarAsync(new ImportarBilheteriaComando(0), default));

    private static ArquivoRemoto Arquivo(string periodo, uint crc) => new($"bilheteria-{periodo}.csv", crc, 100);

    private static LinhaBilheteria Linha() => new(
        new DateOnly(2026, 10, 8), new DateTime(2026, 10, 8, 14, 0, 0), "NOAH", "NOÉ", "E1402510400000",
        TipoAudio.Dublado, false, "ESTADOS UNIDOS", 5004483, "ARAPIRACA BRA 01", 87, 6000027, 22546, 26037,
        "ARAPIRACA", "AL", "REDECINE BRA CINEMATOGRÁFICA S.A.", "15.422.993/0001-67");

    private sealed class FonteFalsa : IFonteDadosAncine
    {
        public List<ArquivoRemoto> Arquivos { get; } = [];
        public int Aberturas { get; private set; }

        public Task<IReadOnlyList<ArquivoRemoto>> ListarArquivosBilheteriaAsync(CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<ArquivoRemoto>>(Arquivos);

        public Task<Stream> AbrirArquivoBilheteriaAsync(ArquivoRemoto arquivo, CancellationToken ct)
        {
            Aberturas++;
            return Task.FromResult<Stream>(new MemoryStream());
        }

        public Task<Stream> AbrirCsvAsync(FonteDados fonte, CancellationToken ct) => throw new NotSupportedException();
    }

    private sealed class LeitorFalso : ILeitorCsvAncine
    {
        public List<LinhaBilheteria> Linhas { get; } = [];

        public async IAsyncEnumerable<LinhaBilheteria> LerBilheteriaAsync(Stream conteudo, [EnumeratorCancellation] CancellationToken ct)
        {
            foreach (var linha in Linhas)
            {
                await Task.Yield();
                yield return linha;
            }
        }

        public IAsyncEnumerable<LinhaLancamento> LerLancamentosAsync(Stream conteudo, CancellationToken ct) => throw new NotSupportedException();
        public IAsyncEnumerable<LinhaSala> LerSalasAsync(Stream conteudo, CancellationToken ct) => throw new NotSupportedException();
    }

    private sealed class RepositoriosFalsos : IRepositorioImportacao, IRepositorioBilheteria
    {
        public Dictionary<string, ArquivoImportado> Existentes { get; } = [];
        public List<LoteBilheteria> Lotes { get; } = [];

        public Task<IReadOnlyDictionary<string, ArquivoImportado>> ObterPorFonteAsync(FonteDados fonte, CancellationToken ct) =>
            Task.FromResult<IReadOnlyDictionary<string, ArquivoImportado>>(Existentes);

        public Task SalvarLoteAsync(LoteBilheteria lote, CancellationToken ct)
        {
            Lotes.Add(lote);
            return Task.CompletedTask;
        }
    }
}
