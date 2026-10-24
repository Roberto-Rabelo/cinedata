using CineData.Domain.Bilheteria;
using CineData.Domain.Common;

namespace CineData.Domain.Tests;

public class DiasConsolidadosTests
{
    private static readonly DateOnly Inicio = new(2026, 8, 1);
    private static readonly DateOnly SerieDesde2014 = new(2014, 6, 1);

    [Fact]
    public void Ultimos_dias_com_poucas_salas_nao_sao_consolidados()
    {
        // 60 dias normais e a cauda publicada pela ANCINE: 85% e depois só 7% das salas.
        var cobertura = Dias(Enumerable.Repeat(3200, 60).Concat([2720, 2720, 209]));

        var consolidados = DiasConsolidados.Calcular(cobertura);

        Assert.Equal(60, consolidados.Count);
        Assert.DoesNotContain(Inicio.AddDays(60), consolidados);
        Assert.DoesNotContain(Inicio.AddDays(62), consolidados);
    }

    [Fact]
    public void Patamar_novo_de_salas_vira_referencia_depois_de_meia_janela()
    {
        // Mercado encolhe de 3.000 para 1.500 salas (ex.: março de 2020) e fica nesse patamar.
        var cobertura = Dias(Enumerable.Repeat(3000, 100).Concat(Enumerable.Repeat(1500, 100)));

        var consolidados = DiasConsolidados.Calcular(cobertura);

        // Logo após a queda, a mediana ainda é do patamar antigo: dia não consolidado.
        Assert.DoesNotContain(Inicio.AddDays(100), consolidados);
        // Com mais da metade da janela no patamar novo, a mediana acompanha e os dias voltam a contar.
        Assert.Contains(Inicio.AddDays(100 + DiasConsolidados.JanelaEmDias / 2), consolidados);
        Assert.Contains(Inicio.AddDays(199), consolidados);
    }

    [Fact]
    public void Mercado_que_cresce_nao_e_penalizado_pelo_passado()
    {
        // Com mediana global, os anos com menos salas ficariam todos abaixo de 90%.
        var cobertura = Dias(Enumerable.Range(0, 400).Select(i => 2000 + 5 * i));

        Assert.Equal(400, DiasConsolidados.Calcular(cobertura).Count);
    }

    [Fact]
    public void Janela_e_por_calendario_e_ignora_dias_ausentes()
    {
        // Um ano sem dados entre dois períodos: o patamar antigo não contamina o novo.
        var antes = Enumerable.Range(0, 30).Select(i => new CoberturaDia(Inicio.AddDays(i), 3000));
        var depois = Enumerable.Range(400, 10).Select(i => new CoberturaDia(Inicio.AddDays(i), 500));

        var consolidados = DiasConsolidados.Calcular(antes.Concat(depois));

        Assert.Equal(40, consolidados.Count);
    }

    [Fact]
    public void Ordem_de_entrada_nao_importa() =>
        Assert.Equal(
            DiasConsolidados.Calcular(Dias([3000, 3000, 3000, 100])),
            DiasConsolidados.Calcular(Dias([3000, 3000, 3000, 100]).Reverse()));

    [Fact]
    public void Semana_completa_exige_os_sete_dias_consolidados()
    {
        var semana = Periodo.Contendo(Granularidade.Semana, new DateOnly(2025, 12, 25));

        Assert.True(DiasConsolidados.PeriodoCompleto(semana, 7, SerieDesde2014, new DateOnly(2026, 10, 20)));
        Assert.False(DiasConsolidados.PeriodoCompleto(semana, 5, SerieDesde2014, new DateOnly(2026, 10, 20)));
    }

    [Fact]
    public void Natal_parcial_nao_impede_dezembro_nem_o_ano_de_serem_completos()
    {
        // 24, 25 e 31/12 têm poucas salas de verdade: são fechamentos, não dado atrasado.
        var ultimoConsolidado = new DateOnly(2026, 10, 20);

        Assert.True(DiasConsolidados.PeriodoCompleto(Periodo.Contendo(Granularidade.Mes, new DateOnly(2025, 12, 1)), 28, SerieDesde2014, ultimoConsolidado));
        Assert.True(DiasConsolidados.PeriodoCompleto(Periodo.Contendo(Granularidade.Ano, new DateOnly(2025, 1, 1)), 361, SerieDesde2014, ultimoConsolidado));
    }

    [Theory]
    [InlineData(Granularidade.Mes, "2026-09-01", true)]
    [InlineData(Granularidade.Mes, "2026-10-01", false)]       // a cauda ainda chega da ANCINE
    [InlineData(Granularidade.Trimestre, "2026-07-01", true)]
    [InlineData(Granularidade.Trimestre, "2026-10-01", false)]
    [InlineData(Granularidade.Semestre, "2026-07-01", false)]
    [InlineData(Granularidade.Ano, "2026-01-01", false)]
    [InlineData(Granularidade.Ano, "2014-01-01", false)]       // a série começa em junho/2014
    [InlineData(Granularidade.Semestre, "2014-07-01", true)]
    public void Calendario_completo_quando_a_serie_cobre_o_periodo_e_consolidou_o_fim(Granularidade granularidade, string inicio, bool completo)
    {
        var periodo = Periodo.Contendo(granularidade, DateOnly.Parse(inicio));

        Assert.Equal(completo, DiasConsolidados.PeriodoCompleto(periodo, 0, SerieDesde2014, new DateOnly(2026, 10, 20)));
    }

    [Theory]
    [InlineData(new[] { 5 }, 5.0)]
    [InlineData(new[] { 3, 1, 2 }, 2.0)]
    [InlineData(new[] { 4, 1, 3, 2 }, 2.5)]
    public void Mediana_igual_ao_percentile_cont(int[] valores, double esperada) =>
        Assert.Equal(esperada, DiasConsolidados.Mediana([.. valores]));

    private static IEnumerable<CoberturaDia> Dias(IEnumerable<int> salas) =>
        salas.Select((s, i) => new CoberturaDia(Inicio.AddDays(i), s));
}
