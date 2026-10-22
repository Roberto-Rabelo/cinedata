using System.Text.RegularExpressions;
using CineData.Domain.Common;

namespace CineData.Domain.Obras;

/// <summary>Identificador de obra na ANCINE: CPB (nacional), ROE (estrangeira) ou genérico.</summary>
public readonly partial record struct CodigoObra
{
    public string Valor { get; }

    private CodigoObra(string valor) => Valor = valor;

    public OrigemObra Origem => Valor[0] switch
    {
        'B' => OrigemObra.Nacional,
        'E' => OrigemObra.Estrangeira,
        _ => OrigemObra.Generica,
    };

    public static bool TryCriar(string? valor, out CodigoObra codigo)
    {
        var normalizado = valor?.Trim().ToUpperInvariant();
        if (normalizado is not null && Formato().IsMatch(normalizado))
        {
            codigo = new CodigoObra(normalizado);
            return true;
        }

        codigo = default;
        return false;
    }

    public static CodigoObra Criar(string valor) =>
        TryCriar(valor, out var codigo) ? codigo : throw new DomainException($"Código de obra inválido: '{valor}'.");

    public override string ToString() => Valor;

    [GeneratedRegex("^[BEG][0-9]{13}$")]
    private static partial Regex Formato();
}
