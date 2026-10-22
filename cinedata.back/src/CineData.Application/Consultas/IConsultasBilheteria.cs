using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Application.Consultas;

/// <summary>Modelo de leitura (lado Q do CQRS): agregações prontas, sem passar pelas entidades.</summary>
public interface IConsultasBilheteria
{
    Task<IReadOnlyList<SemanaDto>> ListarSemanasAsync(CancellationToken ct);
    Task<ResumoSemanaDto> ObterResumoAsync(SemanaCinematografica semana, CancellationToken ct);
    Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(SemanaCinematografica semana, int top, CancellationToken ct);
    Task<IReadOnlyList<UfDto>> ObterPorUfAsync(SemanaCinematografica semana, CancellationToken ct);
    Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(SemanaCinematografica semana, CancellationToken ct);
    Task<AudioDto> ObterAudioAsync(SemanaCinematografica semana, CancellationToken ct);
    Task<ObraDto?> ObterObraAsync(CodigoObra codigo, CancellationToken ct);
    Task<IReadOnlyList<PontoCurvaDto>> ObterCurvaAsync(CodigoObra codigo, CancellationToken ct);
    Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct);
}
