using CineData.Domain.Common;

namespace CineData.Domain.Tests;

public class SemanaCinematograficaTests
{
    [Theory]
    [InlineData("2026-10-08", "2026-10-08")] // quinta: abre a semana
    [InlineData("2026-10-11", "2026-10-08")] // domingo
    [InlineData("2026-10-14", "2026-10-08")] // quarta: fecha a semana
    [InlineData("2026-10-15", "2026-10-15")] // quinta seguinte: nova semana
    public void Semana_vai_de_quinta_a_quarta(string data, string inicioEsperado)
    {
        var semana = SemanaCinematografica.Contendo(DateOnly.Parse(data));

        Assert.Equal(DateOnly.Parse(inicioEsperado), semana.Inicio);
        Assert.Equal(DayOfWeek.Thursday, semana.Inicio.DayOfWeek);
        Assert.Equal(DayOfWeek.Wednesday, semana.Fim.DayOfWeek);
        Assert.True(semana.Contem(DateOnly.Parse(data)));
    }

    [Fact]
    public void Anterior_recua_sete_dias()
    {
        var semana = SemanaCinematografica.Contendo(new DateOnly(2026, 10, 8));
        Assert.Equal(new DateOnly(2026, 10, 1), semana.Anterior().Inicio);
    }
}
