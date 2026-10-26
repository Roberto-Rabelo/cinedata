using System.Globalization;
using CineData.Application.Consultas;
using CineData.Domain.Common;

namespace CineData.Application.Exportacao;

/// <summary>
/// Chave de um período no site estático: nome do arquivo JSON e segmento da URL (<c>/semana/2026-10-08</c>).
/// O front tem a mesma conversão em <c>shared/periodo.ts</c>; as duas precisam continuar iguais.
/// </summary>
public static class ChavePeriodo
{
    /// <summary>"2026-10-08" (quinta de início), "2026-10", "2025-t3", "2026-s1", "2025".</summary>
    public static string De(Periodo periodo) => periodo.Granularidade switch
    {
        Granularidade.Semana => periodo.Inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
        Granularidade.Mes => periodo.Inicio.ToString("yyyy-MM", CultureInfo.InvariantCulture),
        Granularidade.Trimestre => $"{periodo.Inicio.Year}-t{(periodo.Inicio.Month - 1) / 3 + 1}",
        Granularidade.Semestre => $"{periodo.Inicio.Year}-s{(periodo.Inicio.Month - 1) / 6 + 1}",
        Granularidade.Ano => periodo.Inicio.Year.ToString(CultureInfo.InvariantCulture),
        _ => throw new ArgumentOutOfRangeException(nameof(periodo), periodo.Granularidade, null),
    };

    /// <summary>Caminho do JSON do período dentro do export: <c>semana/2026-10-08.json</c>.</summary>
    public static string Arquivo(Periodo periodo) => $"{Granularidades.Nome(periodo.Granularidade)}/{De(periodo)}.json";
}
