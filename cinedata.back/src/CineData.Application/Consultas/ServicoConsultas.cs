using CineData.Application.Common;
using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Application.Consultas;

/// <summary>
/// Casos de uso de leitura. Concentra as regras que não são SQL: qual semana usar por padrão,
/// limites de paginação e validação de entrada.
/// </summary>
public sealed class ServicoConsultas(IConsultasBilheteria consultas)
{
    public const int TopMaximo = 50;

    public Task<IReadOnlyList<SemanaDto>> ListarSemanasAsync(CancellationToken ct) => consultas.ListarSemanasAsync(ct);

    public async Task<PainelSemanaDto> ObterPainelAsync(DateOnly? data, int top, CancellationToken ct)
    {
        var semana = await ResolverSemanaAsync(data, ct);
        ValidarTop(top);

        return new PainelSemanaDto(
            await consultas.ObterResumoAsync(semana, ct),
            await consultas.ObterRankingAsync(semana, top, ct),
            await consultas.ObterPorOrigemAsync(semana, ct),
            await consultas.ObterAudioAsync(semana, ct),
            await consultas.ObterPorUfAsync(semana, ct));
    }

    public async Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(DateOnly? data, int top, CancellationToken ct)
    {
        ValidarTop(top);
        return await consultas.ObterRankingAsync(await ResolverSemanaAsync(data, ct), top, ct);
    }

    public async Task<IReadOnlyList<UfDto>> ObterPorUfAsync(DateOnly? data, CancellationToken ct) =>
        await consultas.ObterPorUfAsync(await ResolverSemanaAsync(data, ct), ct);

    public async Task<CurvaObraDto> ObterCurvaObraAsync(string codigo, CancellationToken ct)
    {
        if (!CodigoObra.TryCriar(codigo, out var codigoObra))
            throw new ValidacaoException($"Código de obra inválido: '{codigo}'. Use o CPB/ROE, ex.: B2600281500000.");

        var obra = await consultas.ObterObraAsync(codigoObra, ct)
            ?? throw new RecursoNaoEncontradoException($"Obra {codigoObra} não encontrada.");
        var dias = await consultas.ObterCurvaAsync(codigoObra, ct);
        return new CurvaObraDto(obra, dias.Sum(d => d.Publico), dias);
    }

    public Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string? termo, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(termo) || termo.Trim().Length < 2)
            throw new ValidacaoException("Informe ao menos 2 caracteres para a busca.");
        return consultas.BuscarObrasAsync(termo.Trim(), 20, ct);
    }

    /// <summary>
    /// Sem data, usa a semana completa mais recente: a ANCINE publica a semana corrente parcial,
    /// e comparar uma semana de 3 dias com uma de 7 geraria uma "queda" falsa.
    /// </summary>
    private async Task<SemanaCinematografica> ResolverSemanaAsync(DateOnly? data, CancellationToken ct)
    {
        if (data is { } d) return SemanaCinematografica.Contendo(d);

        var semanas = await consultas.ListarSemanasAsync(ct);
        var escolhida = semanas.Where(s => s.Completa).MaxBy(s => s.Inicio) ?? semanas.MaxBy(s => s.Inicio)
            ?? throw new RecursoNaoEncontradoException("Nenhuma semana importada ainda. Rode a ingestão.");
        return SemanaCinematografica.Contendo(escolhida.Inicio);
    }

    private static void ValidarTop(int top)
    {
        if (top is < 1 or > TopMaximo)
            throw new ValidacaoException($"'top' deve estar entre 1 e {TopMaximo}.");
    }
}
