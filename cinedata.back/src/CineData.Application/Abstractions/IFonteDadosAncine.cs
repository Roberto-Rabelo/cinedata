using CineData.Domain.Importacao;

namespace CineData.Application.Abstractions;

/// <summary>Arquivo interno de um ZIP publicado pela ANCINE, com o CRC32 que identifica sua versão.</summary>
public sealed record ArquivoRemoto(string Nome, uint Crc32, long Tamanho);

/// <summary>Acesso aos arquivos de dados abertos da ANCINE.</summary>
public interface IFonteDadosAncine
{
    /// <summary>Lista os CSVs semanais de bilheteria por exibidoras sem baixar o ZIP inteiro.</summary>
    Task<IReadOnlyList<ArquivoRemoto>> ListarArquivosBilheteriaAsync(CancellationToken ct);

    Task<Stream> AbrirArquivoBilheteriaAsync(ArquivoRemoto arquivo, CancellationToken ct);

    /// <summary>Abre um CSV avulso (lançamentos, salas), publicado fora de ZIP.</summary>
    Task<Stream> AbrirCsvAsync(FonteDados fonte, CancellationToken ct);
}
