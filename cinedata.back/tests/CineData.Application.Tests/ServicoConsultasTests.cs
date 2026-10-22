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
        _consultas.Semanas.AddRange([
            Semana("2026-10-15", dias: 3), // semana corrente, ainda parcial
            Semana("2026-10-08", dias: 7),
            Semana("2026-10-01", dias: 7),
        ]);

        await new ServicoConsultas(_consultas).ObterRankingAsync(null, 10, default);

        Assert.Equal(new DateOnly(2026, 10, 8), _consultas.SemanaConsultada?.Inicio);
    }

    [Fact]
    public async Task Data_informada_e_convertida_na_semana_que_a_contem()
    {
        await new ServicoConsultas(_consultas).ObterRankingAsync(new DateOnly(2026, 10, 12), 10, default);
        Assert.Equal(new DateOnly(2026, 10, 8), _consultas.SemanaConsultada?.Inicio);
    }

    [Fact]
    public async Task Sem_dados_importados_retorna_nao_encontrado() =>
        await Assert.ThrowsAsync<RecursoNaoEncontradoException>(() =>
            new ServicoConsultas(_consultas).ObterRankingAsync(null, 10, default));

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    public async Task Top_fora_do_limite_e_invalido(int top) =>
        await Assert.ThrowsAsync<ValidacaoException>(() =>
            new ServicoConsultas(_consultas).ObterRankingAsync(new DateOnly(2026, 10, 8), top, default));

    [Fact]
    public async Task Curva_com_codigo_invalido_e_invalida() =>
        await Assert.ThrowsAsync<ValidacaoException>(() =>
            new ServicoConsultas(_consultas).ObterCurvaObraAsync("abc", default));

    private static SemanaDto Semana(string inicio, int dias)
    {
        var d = DateOnly.Parse(inicio);
        return new SemanaDto(d, d.AddDays(6), dias, 1000, 10);
    }

    private sealed class ConsultasFalsas : IConsultasBilheteria
    {
        public List<SemanaDto> Semanas { get; } = [];
        public SemanaCinematografica? SemanaConsultada { get; private set; }

        public Task<IReadOnlyList<SemanaDto>> ListarSemanasAsync(CancellationToken ct) => Task.FromResult<IReadOnlyList<SemanaDto>>(Semanas);

        public Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(SemanaCinematografica semana, int top, CancellationToken ct)
        {
            SemanaConsultada = semana;
            return Task.FromResult<IReadOnlyList<ItemRankingDto>>([]);
        }

        public Task<ResumoSemanaDto> ObterResumoAsync(SemanaCinematografica semana, CancellationToken ct) => throw new NotSupportedException();
        public Task<IReadOnlyList<UfDto>> ObterPorUfAsync(SemanaCinematografica semana, CancellationToken ct) => throw new NotSupportedException();
        public Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(SemanaCinematografica semana, CancellationToken ct) => throw new NotSupportedException();
        public Task<AudioDto> ObterAudioAsync(SemanaCinematografica semana, CancellationToken ct) => throw new NotSupportedException();
        public Task<ObraDto?> ObterObraAsync(CodigoObra codigo, CancellationToken ct) => throw new NotSupportedException();
        public Task<IReadOnlyList<PontoCurvaDto>> ObterCurvaAsync(CodigoObra codigo, CancellationToken ct) => throw new NotSupportedException();
        public Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct) => throw new NotSupportedException();
    }
}
