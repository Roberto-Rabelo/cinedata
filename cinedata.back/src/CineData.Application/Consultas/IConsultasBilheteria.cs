using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Application.Consultas;

/// <summary>Modelo de leitura (lado Q do CQRS): agregações prontas, sem passar pelas entidades.</summary>
public interface IConsultasBilheteria
{
    /// <summary>Uma linha por dia com sessões, do mais antigo ao mais recente.</summary>
    Task<IReadOnlyList<DiaBilheteriaDto>> ObterCoberturaAsync(CancellationToken ct);
    Task<ResumoDto> ObterResumoAsync(Periodo periodo, CancellationToken ct);
    Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(Periodo periodo, int top, CancellationToken ct);
    Task<IReadOnlyList<UfDto>> ObterPorUfAsync(Periodo periodo, CancellationToken ct);
    Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(Periodo periodo, CancellationToken ct);
    Task<AudioDto> ObterAudioAsync(Periodo periodo, CancellationToken ct);
    Task<ObraDto?> ObterObraAsync(CodigoObra codigo, CancellationToken ct);
    Task<IReadOnlyList<PontoCurvaDto>> ObterCurvaAsync(CodigoObra codigo, CancellationToken ct);
    Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct);
}
