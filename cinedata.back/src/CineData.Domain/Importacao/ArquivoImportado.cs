using CineData.Domain.Common;

namespace CineData.Domain.Importacao;

/// <summary>
/// Controle de versão de cada arquivo importado. A ANCINE regera o ZIP inteiro toda semana;
/// o CRC32 de cada arquivo interno diz se ele mudou desde a última carga.
/// </summary>
public sealed class ArquivoImportado : Entity<int>
{
    public FonteDados Fonte { get; private set; }
    public string Nome { get; private set; } = string.Empty;
    public uint Crc32 { get; private set; }
    public long Tamanho { get; private set; }
    public int Linhas { get; private set; }
    public int LinhasRejeitadas { get; private set; }
    public DateTimeOffset ImportadoEm { get; private set; }

    private ArquivoImportado() { }

    public static ArquivoImportado Novo(FonteDados fonte, string nome, uint crc32, long tamanho, DateTimeOffset agora) =>
        new()
        {
            Fonte = fonte,
            Nome = nome,
            Crc32 = crc32,
            Tamanho = tamanho,
            ImportadoEm = agora,
        };

    public bool MesmaVersao(uint crc32) => Crc32 == crc32;

    public void Concluir(int linhas, int linhasRejeitadas)
    {
        if (linhas < 0 || linhasRejeitadas < 0) throw new DomainException("Contagem de linhas inválida.");
        Linhas = linhas;
        LinhasRejeitadas = linhasRejeitadas;
    }

    /// <summary>Reaproveita o registro quando o arquivo é recarregado (nova versão).</summary>
    public void NovaVersao(uint crc32, long tamanho, DateTimeOffset agora)
    {
        Crc32 = crc32;
        Tamanho = tamanho;
        ImportadoEm = agora;
        Linhas = 0;
        LinhasRejeitadas = 0;
    }
}
