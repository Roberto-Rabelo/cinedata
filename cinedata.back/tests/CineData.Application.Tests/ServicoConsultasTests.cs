using CineData.Application.Common;
using CineData.Application.Consultas;
using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Application.Tests;

public class ServicoConsultasTests
{
    private readonly ConsultasFalsas _consultas = new();

    [Fact]
    public async Task Sem_data_usa_a_ultima_semana_completa_e_nao_a_parcial()
    {
        // A semana de 15/10 tem só quinta, sexta e sábado publicados.
        _consultas.Cobrir("2026-08-01", "2026-10-17");

        await new ServicoConsultas(_consultas).ObterRankingAsync(null, null, 10, default);

        Assert.Equal(Periodo.Contendo(Granularidade.Semana, new DateOnly(2026, 10, 8)), _consultas.PeriodoConsultado);
    }

    [Fact]
    public async Task Data_informada_e_convertida_na_semana_que_a_contem()
    {
        await new ServicoConsultas(_consultas).ObterRankingAsync(null, new DateOnly(2026, 10, 12), 10, default);
        Assert.Equal(new DateOnly(2026, 10, 8), _consultas.PeriodoConsultado?.Inicio);
        Assert.Equal(Granularidade.Semana, _consultas.PeriodoConsultado?.Granularidade);
    }

    [Theory]
    [InlineData("mes", "2026-09-01")]
    [InlineData("trimestre", "2026-07-01")]
    [InlineData("semestre", "2026-01-01")]
    [InlineData("ano", "2026-01-01")] // nenhum ano completo: usa o mais recente
    public async Task Sem_data_usa_o_ultimo_periodo_completo_de_cada_granularidade(string periodo, string inicio)
    {
        _consultas.Cobrir("2026-01-01", "2026-10-17");

        await new ServicoConsultas(_consultas).ObterRankingAsync(periodo, null, 10, default);

        Assert.Equal(DateOnly.Parse(inicio), _consultas.PeriodoConsultado?.Inicio);
    }

    [Fact]
    public async Task Mes_que_termina_na_cauda_nao_consolidada_e_parcial()
    {
        // Os dois últimos dias publicados chegam com poucas salas: setembro ainda não fechou.
        _consultas.Cobrir("2026-06-01", "2026-09-28");
        _consultas.Cobrir("2026-09-29", "2026-09-30", salas: 200);

        await new ServicoConsultas(_consultas).ObterRankingAsync("mes", null, 10, default);

        Assert.Equal(new DateOnly(2026, 8, 1), _consultas.PeriodoConsultado?.Inicio);
    }

    [Fact]
    public async Task Lista_periodos_do_mais_recente_ao_mais_antigo_com_rotulo_e_completude()
    {
        _consultas.Cobrir("2025-11-15", "2026-02-10");
        _consultas.Cobrir("2025-12-24", "2025-12-25", salas: 300); // Natal: salas fechadas de verdade

        var meses = await new ServicoConsultas(_consultas).ListarPeriodosAsync("mes", default);

        Assert.Equal(["fev/2026", "jan/2026", "dez/2025", "nov/2025"], meses.Select(m => m.Rotulo));
        Assert.Equal([false, true, true, false], meses.Select(m => m.Completo)); // nov/2025 começa no dia 15
        Assert.Equal(29, meses[2].DiasConsolidados);
        Assert.Equal(31, meses[2].Dias);
        Assert.All(meses, m => Assert.Equal("mes", m.Granularidade));
    }

    [Fact]
    public async Task Painel_descreve_o_periodo_pedido_mesmo_parcial()
    {
        _consultas.Cobrir("2026-01-01", "2026-10-17");

        var painel = await new ServicoConsultas(_consultas).ObterPainelAsync("trimestre", new DateOnly(2026, 10, 5), 10, default);

        Assert.Equal("4º tri 2026", painel.Periodo.Rotulo);
        Assert.False(painel.Periodo.Completo);
        Assert.Equal(new DateOnly(2026, 12, 31), painel.Periodo.Fim);
        Assert.Equal(17, painel.Periodo.DiasConsolidados);
    }

    [Fact]
    public async Task Semanas_continuam_disponiveis_no_formato_antigo()
    {
        _consultas.Cobrir("2026-10-01", "2026-10-17");

        var semanas = await new ServicoConsultas(_consultas).ListarSemanasAsync(default);

        Assert.Equal([new DateOnly(2026, 10, 15), new DateOnly(2026, 10, 8), new DateOnly(2026, 10, 1)], semanas.Select(s => s.Inicio));
        Assert.Equal([3, 7, 7], semanas.Select(s => s.DiasComDados));
        Assert.Equal([false, true, true], semanas.Select(s => s.Completa));
    }

    [Theory]
    [InlineData("MES", Granularidade.Mes)]
    [InlineData("mês", Granularidade.Mes)]
    [InlineData(" ano ", Granularidade.Ano)]
    [InlineData(null, Granularidade.Semana)]
    [InlineData("", Granularidade.Semana)]
    public void Granularidade_aceita_variacoes_de_escrita(string? valor, Granularidade esperada) =>
        Assert.Equal(esperada, Granularidades.Ler(valor));

    [Theory]
    [InlineData("mensal")]
    [InlineData("quinzena")]
    public async Task Periodo_desconhecido_e_invalido(string periodo) =>
        await Assert.ThrowsAsync<ValidacaoException>(() =>
            new ServicoConsultas(_consultas).ObterPainelAsync(periodo, null, 10, default));

    [Fact]
    public async Task Sem_dados_importados_retorna_nao_encontrado() =>
        await Assert.ThrowsAsync<RecursoNaoEncontradoException>(() =>
            new ServicoConsultas(_consultas).ObterRankingAsync("mes", null, 10, default));

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public async Task Top_fora_do_limite_e_invalido(int top) =>
        await Assert.ThrowsAsync<ValidacaoException>(() =>
            new ServicoConsultas(_consultas).ObterRankingAsync(null, new DateOnly(2026, 10, 8), top, default));

    [Fact]
    public async Task Serie_da_uf_aceita_sigla_minuscula_e_traz_regiao_e_granularidade()
    {
        var serie = await new ServicoConsultas(_consultas).ObterSerieUfAsync(" pe ", "mes", default);

        Assert.Equal(("PE", "Nordeste", "mes"), (serie.Uf, serie.Regiao, serie.Granularidade));
        Assert.Equal(Granularidade.Mes, _consultas.GranularidadeDaSerie);
        Assert.Single(serie.Pontos);
    }

    [Theory]
    [InlineData("XX")]
    [InlineData("São Paulo")]
    public async Task Serie_de_uf_inexistente_e_invalida(string uf) =>
        await Assert.ThrowsAsync<ValidacaoException>(() => new ServicoConsultas(_consultas).ObterSerieUfAsync(uf, null, default));

    [Fact]
    public async Task Curva_com_codigo_invalido_e_invalida() =>
        await Assert.ThrowsAsync<ValidacaoException>(() =>
            new ServicoConsultas(_consultas).ObterCurvaObraAsync("abc", default));

    private sealed class ConsultasFalsas : IConsultasBilheteria
    {
        private readonly SortedDictionary<DateOnly, DiaBilheteriaDto> _dias = [];
        public Periodo? PeriodoConsultado { get; private set; }

        /// <summary>Dias de <paramref name="inicio"/> a <paramref name="fim"/> com o mesmo número de salas (substitui os que já existiam).</summary>
        public void Cobrir(string inicio, string fim, int salas = 3000)
        {
            for (var d = DateOnly.Parse(inicio); d <= DateOnly.Parse(fim); d = d.AddDays(1))
                _dias[d] = new DiaBilheteriaDto(d, salas, salas * 4, salas * 40);
        }

        public Task<IReadOnlyList<DiaBilheteriaDto>> ObterCoberturaAsync(CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<DiaBilheteriaDto>>(_dias.Values.ToList());

        public Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(Periodo periodo, int top, CancellationToken ct)
        {
            PeriodoConsultado = periodo;
            return Task.FromResult<IReadOnlyList<ItemRankingDto>>([]);
        }

        public Granularidade? GranularidadeDaSerie { get; private set; }

        public Task<IReadOnlyList<PontoUfDto>> ObterSerieUfAsync(Granularidade granularidade, Uf uf, CancellationToken ct)
        {
            GranularidadeDaSerie = granularidade;
            return Task.FromResult<IReadOnlyList<PontoUfDto>>([new PontoUfDto(new DateOnly(2026, 9, 1), 100, 4, 30, 1, null, null, 0, null)]);
        }

        public Task<ResumoDto> ObterResumoAsync(Periodo periodo, CancellationToken ct) =>
            Task.FromResult(new ResumoDto(periodo.Inicio, periodo.Fim, 0, 0, 0, 0, 0, 0, null, null));

        public Task<IReadOnlyList<UfDto>> ObterPorUfAsync(Periodo periodo, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<UfDto>>([]);

        public Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(Periodo periodo, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<OrigemDto>>([]);

        public Task<AudioDto> ObterAudioAsync(Periodo periodo, CancellationToken ct) => Task.FromResult(new AudioDto(0, 0, 0));
        public Task<ObraDto?> ObterObraAsync(CodigoObra codigo, CancellationToken ct) => throw new NotSupportedException();
        public Task<IReadOnlyList<PontoCurvaDto>> ObterCurvaAsync(CodigoObra codigo, CancellationToken ct) => throw new NotSupportedException();
        public Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct) => throw new NotSupportedException();
    }
}
