using CineData.Domain.Bilheteria;

namespace CineData.Domain.Tests;

public class DiasConsolidadosTests
{
    private static readonly DateOnly Inicio = new(2026, 8, 1);

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

    [Theory]
    [InlineData(new[] { 5 }, 5.0)]
    [InlineData(new[] { 3, 1, 2 }, 2.0)]
    [InlineData(new[] { 4, 1, 3, 2 }, 2.5)]
    public void Mediana_igual_ao_percentile_cont(int[] valores, double esperada) =>
        Assert.Equal(esperada, DiasConsolidados.Mediana([.. valores]));

    private static IEnumerable<CoberturaDia> Dias(IEnumerable<int> salas) =>
        salas.Select((s, i) => new CoberturaDia(Inicio.AddDays(i), s));
}
