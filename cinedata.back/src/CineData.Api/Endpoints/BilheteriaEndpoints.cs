using CineData.Application.Consultas;

namespace CineData.Api.Endpoints;

internal static class BilheteriaEndpoints
{
    public static IEndpointRouteBuilder MapBilheteria(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api/v1").WithTags("Bilheteria");

        api.MapGet("/semanas", (ServicoConsultas s, CancellationToken ct) => s.ListarSemanasAsync(ct))
            .WithSummary("Semanas cinematográficas (quinta a quarta) disponíveis, da mais recente para a mais antiga.");

        api.MapGet("/periodos", (ServicoConsultas s, string? periodo, CancellationToken ct) => s.ListarPeriodosAsync(periodo, ct))
            .WithSummary("Períodos disponíveis numa granularidade (periodo=semana|mes|trimestre|semestre|ano), do mais recente para o mais antigo.");

        api.MapGet("/painel", (ServicoConsultas s, string? periodo, DateOnly? data, int? top, CancellationToken ct) =>
                s.ObterPainelAsync(periodo, data, top ?? 10, ct))
            .WithSummary("Tudo de um período: resumo, ranking, origem, áudio e UFs. 'periodo' = semana (padrão), mes, trimestre, " +
                "semestre ou ano; sem 'data', usa o último período completo.");

        api.MapGet("/ranking", (ServicoConsultas s, string? periodo, DateOnly? data, int? top, CancellationToken ct) =>
                s.ObterRankingAsync(periodo, data, top ?? 10, ct))
            .WithSummary("Ranking de obras por público no período (semana por padrão) que contém 'data'.");

        api.MapGet("/ufs", (ServicoConsultas s, string? periodo, DateOnly? data, CancellationToken ct) =>
                s.ObterPorUfAsync(periodo, data, ct))
            .WithSummary("Público por UF, filme líder e % de público dublado entre estrangeiros no período.");

        api.MapGet("/ufs/{uf}/serie", (ServicoConsultas s, string uf, string? periodo, CancellationToken ct) =>
                s.ObterSerieUfAsync(uf, periodo, ct))
            .WithSummary("Uma UF em todos os períodos da granularidade (semana por padrão): público, parcela do Brasil, " +
                "posição entre os estados e filme líder.");

        api.MapGet("/obras", (ServicoConsultas s, string? busca, CancellationToken ct) => s.BuscarObrasAsync(busca, ct))
            .WithSummary("Busca obras pelo título (original ou no Brasil).");

        api.MapGet("/obras/{codigo}/curva", (ServicoConsultas s, string codigo, CancellationToken ct) =>
                s.ObterCurvaObraAsync(codigo, ct))
            .WithSummary("Dados da obra e público diário: a curva de vida em cartaz.");

        return app;
    }
}
