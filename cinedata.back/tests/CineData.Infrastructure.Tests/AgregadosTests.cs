using CineData.Infrastructure.Persistence.Repositorios;

namespace CineData.Infrastructure.Tests;

public class AgregadosTests
{
    [Fact]
    public void Periodos_da_carga_do_historico_viram_um_unico_recalculo()
    {
        // Arquivos consecutivos (blocos do mês civil) chegam em qualquer ordem e se encostam.
        var periodos = new[] { P("2016-08-08", "2016-08-14"), P("2016-08-01", "2016-08-07"), P("2016-08-15", "2016-08-21") };

        Assert.Equal([P("2016-08-01", "2016-08-21")], Agregados.Juntar(periodos));
    }

    [Fact]
    public void Retificacao_antiga_e_semanas_novas_ficam_em_blocos_separados()
    {
        // Evita recalcular 2019 a 2026 inteiro só porque um arquivo de 2019 foi retificado.
        var periodos = new[] { P("2026-10-15", "2026-10-21"), P("2019-04-22", "2019-04-28"), P("2026-10-22", "2026-10-22") };

        Assert.Equal([P("2019-04-22", "2019-04-28"), P("2026-10-15", "2026-10-22")], Agregados.Juntar(periodos));
    }

    [Fact]
    public void Periodo_contido_em_outro_nao_encolhe_o_bloco() =>
        Assert.Equal([P("2026-10-01", "2026-10-31")], Agregados.Juntar([P("2026-10-01", "2026-10-31"), P("2026-10-08", "2026-10-14")]));

    [Fact]
    public void Sem_pendentes_nao_ha_recalculo() => Assert.Empty(Agregados.Juntar([]));

    private static (DateOnly, DateOnly) P(string inicio, string fim) => (DateOnly.Parse(inicio), DateOnly.Parse(fim));
}
