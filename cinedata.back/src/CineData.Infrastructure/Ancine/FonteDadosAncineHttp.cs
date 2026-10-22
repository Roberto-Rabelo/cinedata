using CineData.Application.Abstractions;
using CineData.Domain.Importacao;
using Microsoft.Extensions.Options;

namespace CineData.Infrastructure.Ancine;

internal sealed class FonteDadosAncineHttp(HttpClient http, IOptions<AncineOptions> opcoes) : IFonteDadosAncine
{
    private readonly AncineOptions _opcoes = opcoes.Value;
    private ZipRemoto? _zip;
    private Dictionary<string, ZipRemoto.Entrada>? _entradas;

    public async Task<IReadOnlyList<ArquivoRemoto>> ListarArquivosBilheteriaAsync(CancellationToken ct)
    {
        var entradas = await CarregarDiretorioAsync(ct);
        return entradas.Values
            .Where(e => e.Nome.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            .Select(e => new ArquivoRemoto(e.Nome, e.Crc32, e.Tamanho))
            .ToList();
    }

    public async Task<Stream> AbrirArquivoBilheteriaAsync(ArquivoRemoto arquivo, CancellationToken ct)
    {
        var entradas = await CarregarDiretorioAsync(ct);
        if (!entradas.TryGetValue(arquivo.Nome, out var entrada))
            throw new FileNotFoundException($"{arquivo.Nome} não existe mais no ZIP da ANCINE.");
        return await _zip!.AbrirAsync(entrada, ct);
    }

    public async Task<Stream> AbrirCsvAsync(FonteDados fonte, CancellationToken ct)
    {
        var nome = fonte switch
        {
            FonteDados.Lancamentos => _opcoes.ArquivoLancamentos,
            FonteDados.Salas => _opcoes.ArquivoSalas,
            _ => throw new ArgumentOutOfRangeException(nameof(fonte), fonte, "Fonte não é um CSV avulso."),
        };

        var resposta = await http.GetAsync(new Uri(_opcoes.BaseUrl, nome), HttpCompletionOption.ResponseHeadersRead, ct);
        resposta.EnsureSuccessStatusCode();
        return await resposta.Content.ReadAsStreamAsync(ct);
    }

    private async Task<Dictionary<string, ZipRemoto.Entrada>> CarregarDiretorioAsync(CancellationToken ct)
    {
        if (_entradas is not null) return _entradas;

        _zip = new ZipRemoto(http, new Uri(_opcoes.BaseUrl, _opcoes.ArquivoBilheteria));
        var entradas = await _zip.LerDiretorioAsync(ct);
        _entradas = entradas.ToDictionary(e => e.Nome, StringComparer.Ordinal);
        return _entradas;
    }
}
