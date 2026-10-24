using CineData.Domain.Common;

namespace CineData.Domain.Tests;

public class PeriodoTests
{
    [Theory]
    [InlineData("2025-01-01", "2025-01-01", "2025-03-31")]
    [InlineData("2025-03-31", "2025-01-01", "2025-03-31")] // último dia do 1º tri
    [InlineData("2025-04-01", "2025-04-01", "2025-06-30")] // primeiro dia do 2º tri
    [InlineData("2025-08-15", "2025-07-01", "2025-09-30")]
    [InlineData("2025-12-31", "2025-10-01", "2025-12-31")]
    public void Trimestre_vai_de_jan_abr_jul_ou_out_ao_fim_do_terceiro_mes(string data, string inicio, string fim)
    {
        var trimestre = Periodo.Contendo(Granularidade.Trimestre, DateOnly.Parse(data));

        Assert.Equal(DateOnly.Parse(inicio), trimestre.Inicio);
        Assert.Equal(DateOnly.Parse(fim), trimestre.Fim);
    }

    [Theory]
    [InlineData("2026-06-30", "2026-01-01", "2026-06-30", 181)]
    [InlineData("2026-07-01", "2026-07-01", "2026-12-31", 184)]
    [InlineData("2024-02-29", "2024-01-01", "2024-06-30", 182)] // ano bissexto
    public void Semestre_corta_em_30_de_junho(string data, string inicio, string fim, int dias)
    {
        var semestre = Periodo.Contendo(Granularidade.Semestre, DateOnly.Parse(data));

        Assert.Equal(DateOnly.Parse(inicio), semestre.Inicio);
        Assert.Equal(DateOnly.Parse(fim), semestre.Fim);
        Assert.Equal(dias, semestre.Dias);
    }

    [Theory]
    [InlineData("2024-02-10", "2024-02-29")]
    [InlineData("2025-02-10", "2025-02-28")]
    [InlineData("2026-10-31", "2026-10-31")]
    public void Mes_termina_no_ultimo_dia_do_mes(string data, string fim) =>
        Assert.Equal(DateOnly.Parse(fim), Periodo.Contendo(Granularidade.Mes, DateOnly.Parse(data)).Fim);

    [Fact]
    public void Semana_continua_de_quinta_a_quarta_e_atravessa_o_mes()
    {
        var semana = Periodo.Contendo(Granularidade.Semana, new DateOnly(2026, 11, 2));

        Assert.Equal(new DateOnly(2026, 10, 29), semana.Inicio);
        Assert.Equal(new DateOnly(2026, 11, 4), semana.Fim);
        Assert.Equal(SemanaCinematografica.Contendo(new DateOnly(2026, 11, 2)).Inicio, semana.Inicio);
    }

    [Theory]
    [InlineData(Granularidade.Semana, "2026-01-01", "2025-12-25")]
    [InlineData(Granularidade.Mes, "2026-01-15", "2025-12-01")] // vira o ano
    [InlineData(Granularidade.Mes, "2026-03-31", "2026-02-01")]
    [InlineData(Granularidade.Trimestre, "2026-02-01", "2025-10-01")]
    [InlineData(Granularidade.Semestre, "2026-03-01", "2025-07-01")]
    [InlineData(Granularidade.Semestre, "2026-09-01", "2026-01-01")]
    [InlineData(Granularidade.Ano, "2026-06-01", "2025-01-01")]
    public void Anterior_e_o_periodo_equivalente_imediatamente_antes(Granularidade granularidade, string data, string inicioAnterior)
    {
        var periodo = Periodo.Contendo(granularidade, DateOnly.Parse(data));
        var anterior = periodo.Anterior();

        Assert.Equal(DateOnly.Parse(inicioAnterior), anterior.Inicio);
        Assert.Equal(granularidade, anterior.Granularidade);
        Assert.Equal(periodo.Inicio.AddDays(-1), anterior.Fim);
    }

    [Theory]
    [InlineData(Granularidade.Semana, "2026-10-12", "08/10 a 14/10/2026")]
    [InlineData(Granularidade.Mes, "2026-10-12", "out/2026")]
    [InlineData(Granularidade.Trimestre, "2025-08-01", "3º tri 2025")]
    [InlineData(Granularidade.Semestre, "2026-02-01", "1º sem 2026")]
    [InlineData(Granularidade.Ano, "2025-08-01", "2025")]
    public void Rotulo_em_portugues(Granularidade granularidade, string data, string rotulo) =>
        Assert.Equal(rotulo, Periodo.Contendo(granularidade, DateOnly.Parse(data)).ToString());
}
