using System.Collections.Frozen;

namespace CineData.Domain.Common;

public enum Regiao { Norte, Nordeste, CentroOeste, Sudeste, Sul }

/// <summary>Unidade federativa brasileira (sigla validada) com sua região.</summary>
public readonly record struct Uf
{
    private static readonly FrozenDictionary<string, Regiao> Regioes = new Dictionary<string, Regiao>
    {
        ["AC"] = Regiao.Norte, ["AM"] = Regiao.Norte, ["AP"] = Regiao.Norte, ["PA"] = Regiao.Norte,
        ["RO"] = Regiao.Norte, ["RR"] = Regiao.Norte, ["TO"] = Regiao.Norte,
        ["AL"] = Regiao.Nordeste, ["BA"] = Regiao.Nordeste, ["CE"] = Regiao.Nordeste, ["MA"] = Regiao.Nordeste,
        ["PB"] = Regiao.Nordeste, ["PE"] = Regiao.Nordeste, ["PI"] = Regiao.Nordeste, ["RN"] = Regiao.Nordeste,
        ["SE"] = Regiao.Nordeste,
        ["DF"] = Regiao.CentroOeste, ["GO"] = Regiao.CentroOeste, ["MS"] = Regiao.CentroOeste, ["MT"] = Regiao.CentroOeste,
        ["ES"] = Regiao.Sudeste, ["MG"] = Regiao.Sudeste, ["RJ"] = Regiao.Sudeste, ["SP"] = Regiao.Sudeste,
        ["PR"] = Regiao.Sul, ["RS"] = Regiao.Sul, ["SC"] = Regiao.Sul,
    }.ToFrozenDictionary();

    public string Sigla { get; }
    public Regiao Regiao => Regioes[Sigla];

    private Uf(string sigla) => Sigla = sigla;

    public static IReadOnlyCollection<string> Todas => Regioes.Keys;

    public static bool TryCriar(string? sigla, out Uf uf)
    {
        var normalizada = sigla?.Trim().ToUpperInvariant();
        if (normalizada is not null && Regioes.ContainsKey(normalizada))
        {
            uf = new Uf(normalizada);
            return true;
        }

        uf = default;
        return false;
    }

    public static Uf Criar(string sigla) =>
        TryCriar(sigla, out var uf) ? uf : throw new DomainException($"UF inválida: '{sigla}'.");

    public override string ToString() => Sigla;
}
