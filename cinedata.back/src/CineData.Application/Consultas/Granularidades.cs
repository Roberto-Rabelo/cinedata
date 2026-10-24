using CineData.Application.Common;
using CineData.Domain.Common;

namespace CineData.Application.Consultas;

/// <summary>Nome da granularidade na API (parâmetro <c>periodo</c>) e nos agregados do banco.</summary>
public static class Granularidades
{
    public static string Nome(Granularidade granularidade) => granularidade switch
    {
        Granularidade.Semana => "semana",
        Granularidade.Mes => "mes",
        Granularidade.Trimestre => "trimestre",
        Granularidade.Semestre => "semestre",
        Granularidade.Ano => "ano",
        _ => throw new ArgumentOutOfRangeException(nameof(granularidade), granularidade, null),
    };

    /// <summary>Sem valor, semana: o comportamento original do painel.</summary>
    public static Granularidade Ler(string? valor) => valor?.Trim().ToLowerInvariant() switch
    {
        null or "" or "semana" => Granularidade.Semana,
        "mes" or "mês" => Granularidade.Mes,
        "trimestre" => Granularidade.Trimestre,
        "semestre" => Granularidade.Semestre,
        "ano" => Granularidade.Ano,
        _ => throw new ValidacaoException($"'periodo' deve ser semana, mes, trimestre, semestre ou ano (recebido: '{valor}')."),
    };
}
