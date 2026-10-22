using CineData.Domain.Common;

namespace CineData.Domain.Obras;

/// <summary>Obra audiovisual exibida em salas de cinema.</summary>
public sealed class Obra : Entity<CodigoObra>
{
    public string TituloOriginal { get; private set; } = string.Empty;
    public string? TituloBrasil { get; private set; }
    public string? PaisOrigem { get; private set; }
    public OrigemObra Origem => Id.Origem;

    /// <summary>Título para exibição: obras nacionais costumam vir sem título no Brasil.</summary>
    public string Titulo => string.IsNullOrWhiteSpace(TituloBrasil) ? TituloOriginal : TituloBrasil;

    private Obra() { }

    public static Obra Criar(CodigoObra codigo, string tituloOriginal, string? tituloBrasil, string? paisOrigem)
    {
        if (string.IsNullOrWhiteSpace(tituloOriginal))
            throw new DomainException($"Obra {codigo} sem título original.");

        return new Obra
        {
            Id = codigo,
            TituloOriginal = tituloOriginal.Trim(),
            TituloBrasil = Normalizar(tituloBrasil),
            PaisOrigem = Normalizar(paisOrigem),
        };
    }

    private static string? Normalizar(string? valor) => string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
}
