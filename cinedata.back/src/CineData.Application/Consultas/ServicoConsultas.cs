using CineData.Application.Common;
using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Application.Consultas;

/// <summary>
/// Casos de uso de leitura. Concentra as regras que não são SQL: qual período usar por padrão,
/// quais períodos estão completos, limites de paginação e validação de entrada.
/// </summary>
public sealed class ServicoConsultas(IConsultasBilheteria consultas)
{
    public const int TopMaximo = 50;

    public async Task<IReadOnlyList<SemanaDto>> ListarSemanasAsync(CancellationToken ct) =>
        (await CoberturaAsync(ct)).Listar(Granularidade.Semana)
            .Select(p => new SemanaDto(p.Inicio, p.Fim, p.DiasConsolidados, p.Publico, p.Sessoes))
            .ToList();

    public async Task<IReadOnlyList<PeriodoDto>> ListarPeriodosAsync(string? periodo, CancellationToken ct)
    {
        var granularidade = Granularidades.Ler(periodo);
        return (await CoberturaAsync(ct)).Listar(granularidade);
    }

    public async Task<PainelDto> ObterPainelAsync(string? periodo, DateOnly? data, int top, CancellationToken ct)
    {
        ValidarTop(top);
        var (p, descricao) = await ResolverPeriodoAsync(periodo, data, ct);

        return new PainelDto(
            descricao,
            await consultas.ObterResumoAsync(p, ct),
            await consultas.ObterRankingAsync(p, top, ct),
            await consultas.ObterPorOrigemAsync(p, ct),
            await consultas.ObterAudioAsync(p, ct),
            await consultas.ObterPorUfAsync(p, ct));
    }

    public async Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(string? periodo, DateOnly? data, int top, CancellationToken ct)
    {
        ValidarTop(top);
        var (p, _) = await ResolverPeriodoAsync(periodo, data, ct);
        return await consultas.ObterRankingAsync(p, top, ct);
    }

    public async Task<IReadOnlyList<UfDto>> ObterPorUfAsync(string? periodo, DateOnly? data, CancellationToken ct)
    {
        var (p, _) = await ResolverPeriodoAsync(periodo, data, ct);
        return await consultas.ObterPorUfAsync(p, ct);
    }

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
    /// Sem data, usa o período completo mais recente da granularidade: a ANCINE publica o período corrente parcial,
    /// e comparar uma semana de 3 dias com uma de 7 (ou um mês pela metade com um inteiro) geraria uma "queda" falsa.
    /// </summary>
    private async Task<(Periodo Periodo, PeriodoDto Descricao)> ResolverPeriodoAsync(string? periodo, DateOnly? data, CancellationToken ct)
    {
        var granularidade = Granularidades.Ler(periodo);
        var cobertura = await CoberturaAsync(ct);

        if (data is { } d)
        {
            var contendo = Periodo.Contendo(granularidade, d);
            return (contendo, cobertura.Descrever(contendo));
        }

        var periodos = cobertura.Listar(granularidade);
        var escolhido = periodos.FirstOrDefault(p => p.Completo) ?? periodos.FirstOrDefault()
            ?? throw new RecursoNaoEncontradoException("Nenhum dado de bilheteria importado ainda. Rode a ingestão.");
        return (Periodo.Contendo(granularidade, escolhido.Inicio), escolhido);
    }

    private async Task<CoberturaPeriodos> CoberturaAsync(CancellationToken ct) =>
        new(await consultas.ObterCoberturaAsync(ct));

    private static void ValidarTop(int top)
    {
        if (top is < 1 or > TopMaximo)
            throw new ValidacaoException($"'top' deve estar entre 1 e {TopMaximo}.");
    }
}
