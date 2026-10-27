using CineData.Domain.Bilheteria;

namespace CineData.Domain.Tests;

public class TempoEmCartazTests
{
    private static PublicoSemana S(string semana, long publico) => new(DateOnly.Parse(semana), publico);

    [Fact]
    public void Conta_as_semanas_da_estreia_ate_a_data_pedida()
    {
        var semanas = new[] { S("2026-09-24", 300_000), S("2026-10-01", 750_000), S("2026-10-08", 620_000), S("2026-10-15", 480_000) };

        Assert.Equal(new Temporada(new(2026, 9, 24), new(2026, 10, 8), 3), TempoEmCartaz.Calcular(semanas, new DateOnly(2026, 10, 8)));
        Assert.Equal(4, TempoEmCartaz.Calcular(semanas, new DateOnly(2026, 10, 20))?.Semanas);
    }

    [Fact]
    public void Semana_de_pre_estreia_nao_conta_como_estreia()
    {
        // Ainda Estou Aqui: 2.625 e 474 pessoas em pré-estreias, estreia de verdade em 07/11/2024.
        var semanas = new[] { S("2024-10-24", 2_625), S("2024-10-31", 474), S("2024-11-07", 579_064), S("2024-11-14", 797_813) };

        var temporada = TempoEmCartaz.Calcular(semanas, new DateOnly(2024, 11, 14));

        Assert.Equal(new DateOnly(2024, 11, 7), temporada?.Estreia);
        Assert.Equal(2, temporada?.Semanas);
    }

    [Fact]
    public void Relancamento_depois_de_um_intervalo_comeca_uma_temporada_nova()
    {
        var semanas = new[] { S("2016-01-07", 900_000), S("2016-01-14", 600_000), S("2026-10-08", 225_000), S("2026-10-15", 150_000) };

        var temporada = TempoEmCartaz.Calcular(semanas, new DateOnly(2026, 10, 15));

        Assert.Equal(new DateOnly(2026, 10, 8), temporada?.Estreia);
        Assert.Equal(2, temporada?.Semanas);
    }

    [Fact]
    public void Sem_sessoes_ate_a_data_nao_ha_temporada() =>
        Assert.Null(TempoEmCartaz.Calcular([S("2026-10-15", 100)], new DateOnly(2026, 10, 8)));
}
