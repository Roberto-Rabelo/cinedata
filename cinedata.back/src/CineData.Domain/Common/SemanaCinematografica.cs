namespace CineData.Domain.Common;

/// <summary>
/// Semana do mercado de exibição: começa na quinta-feira (dia de estreias) e termina na quarta.
/// Os arquivos semanais da ANCINE (sufixo sNN) seguem esse recorte.
/// </summary>
public readonly record struct SemanaCinematografica
{
    public DateOnly Inicio { get; }
    public DateOnly Fim => Inicio.AddDays(6);

    private SemanaCinematografica(DateOnly inicio) => Inicio = inicio;

    public static SemanaCinematografica Contendo(DateOnly data)
    {
        var deslocamento = ((int)data.DayOfWeek - (int)DayOfWeek.Thursday + 7) % 7;
        return new SemanaCinematografica(data.AddDays(-deslocamento));
    }

    public bool Contem(DateOnly data) => data >= Inicio && data <= Fim;

    public SemanaCinematografica Anterior() => new(Inicio.AddDays(-7));

    public override string ToString() => $"{Inicio:dd/MM} a {Fim:dd/MM/yyyy}";
}
