using System.Globalization;
using System.Runtime.CompilerServices;
using CineData.Application.Abstractions;
using CineData.Domain.Bilheteria;
using CsvHelper;
using CsvHelper.Configuration;

namespace CineData.Infrastructure.Csv;

/// <summary>
/// Lê os CSVs da ANCINE: separador ';', UTF-8, datas dd/MM/yyyy e números no padrão brasileiro.
/// Valores que não podem ser interpretados viram nulo; quem decide rejeitar a linha é a Application.
/// </summary>
internal sealed class LeitorCsvAncine : ILeitorCsvAncine
{
    private static readonly CultureInfo PtBr = CultureInfo.GetCultureInfo("pt-BR");

    private static readonly CsvConfiguration Configuracao = new(PtBr)
    {
        Delimiter = ";",
        HasHeaderRecord = true,
        BadDataFound = null,
        MissingFieldFound = null,
        TrimOptions = TrimOptions.Trim,
    };

    public async IAsyncEnumerable<LinhaBilheteria> LerBilheteriaAsync(Stream conteudo, [EnumeratorCancellation] CancellationToken ct)
    {
        using var leitor = new StreamReader(conteudo);
        using var csv = new CsvReader(leitor, Configuracao);
        await csv.ReadAsync();
        csv.ReadHeader();

        while (await csv.ReadAsync())
        {
            ct.ThrowIfCancellationRequested();
            yield return new LinhaBilheteria(
                DataExibicao: Data(csv.GetField("DATA_EXIBICAO")),
                InicioSessao: DataHora(csv.GetField("SESSAO")),
                TituloOriginal: Texto(csv.GetField("TITULO_ORIGINAL")),
                TituloBrasil: csv.GetField("TITULO_BRASIL"),
                CodigoObra: Texto(csv.GetField("CPB_ROE")),
                Audio: Audio(csv.GetField("AUDIO")),
                Legendada: SimNao(csv.GetField("LEGENDADA")),
                PaisObra: csv.GetField("PAIS_OBRA"),
                RegistroSala: Inteiro(csv.GetField("REGISTRO_SALA")),
                NomeSala: Texto(csv.GetField("NOME_SALA")),
                Publico: Inteiro(csv.GetField("PUBLICO")),
                RegistroGrupoExibidor: Inteiro(csv.GetField("REGISTRO_GRUPO_EXIBIDOR")),
                RegistroExibidor: Inteiro(csv.GetField("REGISTRO_EXIBIDOR")),
                RegistroComplexo: Inteiro(csv.GetField("REGISTRO_COMPLEXO")),
                Municipio: Texto(csv.GetField("MUNICIPIO_SALA_COMPLEXO")),
                Uf: Texto(csv.GetField("UF_SALA_COMPLEXO")),
                RazaoSocialExibidora: Texto(csv.GetField("RAZAO_SOCIAL_EXIBIDORA")),
                CnpjExibidora: Texto(csv.GetField("CNPJ_EXIBIDORA")));
        }
    }

    public async IAsyncEnumerable<LinhaLancamento> LerLancamentosAsync(Stream conteudo, [EnumeratorCancellation] CancellationToken ct)
    {
        using var leitor = new StreamReader(conteudo);
        using var csv = new CsvReader(leitor, Configuracao);
        await csv.ReadAsync();
        csv.ReadHeader();

        while (await csv.ReadAsync())
        {
            ct.ThrowIfCancellationRequested();
            yield return new LinhaLancamento(
                DataLancamento: Data(csv.GetField("DATA_LANCAMENTO_OBRA")),
                TituloOriginal: Texto(csv.GetField("TITULO_ORIGINAL")),
                CodigoObra: Texto(csv.GetField("CPB_ROE")),
                TipoObra: Texto(csv.GetField("TIPO_OBRA")),
                PaisObra: csv.GetField("PAIS_OBRA"),
                PublicoTotal: Inteiro64(csv.GetField("PUBLICO_TOTAL")),
                RendaTotal: Moeda(csv.GetField("RENDA_TOTAL")),
                Distribuidora: Texto(csv.GetField("RAZAO_SOCIAL_DISTRIBUIDORA")),
                CnpjDistribuidora: Texto(csv.GetField("CNPJ_DISTRIBUIDORA")));
        }
    }

    public async IAsyncEnumerable<LinhaSala> LerSalasAsync(Stream conteudo, [EnumeratorCancellation] CancellationToken ct)
    {
        using var leitor = new StreamReader(conteudo);
        using var csv = new CsvReader(leitor, Configuracao);
        await csv.ReadAsync();
        csv.ReadHeader();

        while (await csv.ReadAsync())
        {
            ct.ThrowIfCancellationRequested();
            yield return new LinhaSala(
                RegistroSala: Inteiro(csv.GetField("REGISTRO_SALA")),
                NomeSala: Texto(csv.GetField("NOME_SALA")),
                Assentos: Inteiro(csv.GetField("ASSENTOS_SALA")),
                RegistroComplexo: Inteiro(csv.GetField("REGISTRO_COMPLEXO")),
                Municipio: Texto(csv.GetField("MUNICIPIO_COMPLEXO")),
                Uf: Texto(csv.GetField("UF_COMPLEXO")),
                RegistroExibidor: Inteiro(csv.GetField("REGISTRO_EXIBIDOR")),
                NomeExibidor: Texto(csv.GetField("NOME_EXIBIDOR")),
                CnpjExibidor: Texto(csv.GetField("CNPJ_EXIBIDOR")));
        }
    }

    internal static string Texto(string? valor) => valor ?? string.Empty;

    internal static DateOnly? Data(string? valor) =>
        DateOnly.TryParseExact(valor, "dd/MM/yyyy", PtBr, DateTimeStyles.None, out var d) ? d : null;

    internal static DateTime? DataHora(string? valor) =>
        DateTime.TryParseExact(valor, "dd/MM/yyyy HH:mm:ss", PtBr, DateTimeStyles.None, out var d) ? d : null;

    internal static int? Inteiro(string? valor) =>
        int.TryParse(valor, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : null;

    internal static long? Inteiro64(string? valor) =>
        long.TryParse(valor, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : null;

    /// <summary>Converte "R$ 65.671,62" em 65671.62.</summary>
    internal static decimal? Moeda(string? valor)
    {
        var limpo = valor?.Replace("R$", string.Empty, StringComparison.Ordinal).Trim();
        return decimal.TryParse(limpo, NumberStyles.Number, PtBr, out var d) ? d : null;
    }

    internal static bool? SimNao(string? valor) => valor?.Trim().ToUpperInvariant() switch
    {
        "SIM" => true,
        "NÃO" or "NAO" => false,
        _ => null,
    };

    internal static TipoAudio? Audio(string? valor) => valor?.Trim().ToUpperInvariant() switch
    {
        "DUBLADO" => TipoAudio.Dublado,
        "ORIGINAL" => TipoAudio.Original,
        _ => null,
    };
}
