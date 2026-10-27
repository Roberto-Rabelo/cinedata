using CineData.Application.Common;
using CineData.Domain.Bilheteria;
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
            await RankingComTempoEmCartazAsync(p, top, ct),
            await consultas.ObterPorOrigemAsync(p, ct),
            await consultas.ObterAudioAsync(p, ct),
            await consultas.ObterPorUfAsync(p, ct));
    }

    public async Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(string? periodo, DateOnly? data, int top, CancellationToken ct)
    {
        ValidarTop(top);
        var (p, _) = await ResolverPeriodoAsync(periodo, data, ct);
        return await RankingComTempoEmCartazAsync(p, top, ct);
    }

    public async Task<IReadOnlyList<UfDto>> ObterPorUfAsync(string? periodo, DateOnly? data, CancellationToken ct)
    {
        var (p, _) = await ResolverPeriodoAsync(periodo, data, ct);
        return await consultas.ObterPorUfAsync(p, ct);
    }

    /// <summary>Uma UF ao longo do tempo: público, parcela do Brasil, posição entre os estados e filme líder por período.</summary>
    public async Task<SerieUfDto> ObterSerieUfAsync(string uf, string? periodo, CancellationToken ct)
    {
        if (!Uf.TryCriar(uf, out var estado))
            throw new ValidacaoException($"UF inválida: '{uf}'. Use a sigla, ex.: SP.");

        var granularidade = Granularidades.Ler(periodo);
        var pontos = await consultas.ObterSerieUfAsync(granularidade, estado, ct);
        return new SerieUfDto(estado.Sigla, estado.Regiao.ToString(), Granularidades.Nome(granularidade), pontos);
    }

    public async Task<CurvaObraDto> ObterCurvaObraAsync(string codigo, CancellationToken ct)
    {
        if (!CodigoObra.TryCriar(codigo, out var codigoObra))
            throw new ValidacaoException($"Código de obra inválido: '{codigo}'. Use o CPB/ROE, ex.: B2600281500000.");

        var obra = await consultas.ObterObraAsync(codigoObra, ct)
            ?? throw new RecursoNaoEncontradoException($"Obra {codigoObra} não encontrada.");
        var dias = await consultas.ObterCurvaAsync(codigoObra, ct);
        var semanas = dias
            .GroupBy(d => SemanaCinematografica.Contendo(d.Data).Inicio)
            .Select(g => new PublicoSemana(g.Key, g.Sum(d => d.Publico)));
        // Em cartaz: sessões na semana dos últimos dados publicados ou na anterior (a última chega parcial).
        var cobertura = await consultas.ObterCoberturaAsync(ct);
        var semanaDosDados = cobertura.Count == 0 ? DateOnly.MinValue : SemanaCinematografica.Contendo(cobertura.Max(d => d.Data)).Inicio;
        var principal = TempoEmCartaz.Principal(semanas, semanaDosDados);

        return new CurvaObraDto(obra, dias.Sum(d => d.Publico), dias,
            principal?.Temporada.Estreia, principal?.Temporada.Semanas, principal?.EmCartaz ?? false);
    }

    /// <summary>Ranking com há quantas semanas cada filme está em cartaz, até a última semana que começa no período.</summary>
    private async Task<IReadOnlyList<ItemRankingDto>> RankingComTempoEmCartazAsync(Periodo periodo, int top, CancellationToken ct)
    {
        var ranking = await consultas.ObterRankingAsync(periodo, top, ct);
        if (ranking.Count == 0) return ranking;

        var semanas = (await consultas.ObterSemanasDasObrasAsync(ranking.Select(r => r.CodigoObra).ToList(), ct))
            .ToLookup(s => s.CodigoObra, s => new PublicoSemana(s.Semana, s.Publico));
        var ate = SemanaCinematografica.Contendo(periodo.Fim).Inicio;
        return ranking
            .Select(r => TempoEmCartaz.Calcular(semanas[r.CodigoObra], ate) is { } t
                ? r with { EmCartazDesde = t.Estreia, SemanasEmCartaz = t.Semanas }
                : r)
            .ToList();
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
