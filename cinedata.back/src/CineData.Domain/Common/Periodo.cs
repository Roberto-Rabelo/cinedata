namespace CineData.Domain.Common;

/// <summary>Recortes de tempo do painel. Semana é a cinematográfica (quinta a quarta); os demais seguem o calendário civil.</summary>
public enum Granularidade
{
    Semana,
    Mes,
    Trimestre,
    Semestre,
    Ano,
}

/// <summary>
/// Período de exibição numa granularidade. Semanas cinematográficas atravessam meses (quinta 30/10 a quarta 05/11),
/// então meses, trimestres, semestres e anos são recortados pela data de exibição, nunca pela soma de semanas.
/// </summary>
public readonly record struct Periodo
{
    private static readonly string[] Meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

    public Granularidade Granularidade { get; }
    public DateOnly Inicio { get; }

    public DateOnly Fim => Granularidade == Granularidade.Semana
        ? Inicio.AddDays(6)
        : Inicio.AddMonths(MesesNoPeriodo).AddDays(-1);

    public int Dias => Fim.DayNumber - Inicio.DayNumber + 1;

    private int MesesNoPeriodo => Granularidade switch
    {
        Granularidade.Mes => 1,
        Granularidade.Trimestre => 3,
        Granularidade.Semestre => 6,
        Granularidade.Ano => 12,
        _ => 0,
    };

    private Periodo(Granularidade granularidade, DateOnly inicio)
    {
        Granularidade = granularidade;
        Inicio = inicio;
    }

    public static Periodo Contendo(Granularidade granularidade, DateOnly data) => granularidade switch
    {
        Granularidade.Semana => new(granularidade, SemanaCinematografica.Contendo(data).Inicio),
        Granularidade.Mes => new(granularidade, new DateOnly(data.Year, data.Month, 1)),
        Granularidade.Trimestre => new(granularidade, new DateOnly(data.Year, (data.Month - 1) / 3 * 3 + 1, 1)),
        Granularidade.Semestre => new(granularidade, new DateOnly(data.Year, (data.Month - 1) / 6 * 6 + 1, 1)),
        Granularidade.Ano => new(granularidade, new DateOnly(data.Year, 1, 1)),
        _ => throw new DomainException($"Granularidade desconhecida: {granularidade}."),
    };

    /// <summary>O período equivalente imediatamente antes: semana, mês, trimestre, semestre ou ano anterior.</summary>
    public Periodo Anterior() => Granularidade == Granularidade.Semana
        ? new(Granularidade, Inicio.AddDays(-7))
        : new(Granularidade, Inicio.AddMonths(-MesesNoPeriodo));

    public bool Contem(DateOnly data) => data >= Inicio && data <= Fim;

    /// <summary>Rótulo curto em português: "08/10 a 14/10/2026", "out/2026", "3º tri 2025", "1º sem 2026", "2025".</summary>
    public override string ToString() => Granularidade switch
    {
        Granularidade.Semana => SemanaCinematografica.Contendo(Inicio).ToString(),
        Granularidade.Mes => $"{Meses[Inicio.Month - 1]}/{Inicio.Year}",
        Granularidade.Trimestre => $"{(Inicio.Month - 1) / 3 + 1}º tri {Inicio.Year}",
        Granularidade.Semestre => $"{(Inicio.Month - 1) / 6 + 1}º sem {Inicio.Year}",
        _ => Inicio.Year.ToString(),
    };
}
