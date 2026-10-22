using CineData.Application.Consultas;

namespace CineData.Api.Endpoints;

internal static class BilheteriaEndpoints
{
    public static IEndpointRouteBuilder MapBilheteria(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api/v1").WithTags("Bilheteria");

        api.MapGet("/semanas", (ServicoConsultas s, CancellationToken ct) => s.ListarSemanasAsync(ct))
            .WithSummary("Semanas cinematográficas (quinta a quarta) disponíveis, da mais recente para a mais antiga.");

        api.MapGet("/painel", (ServicoConsultas s, DateOnly? data, int? top, CancellationToken ct) =>
                s.ObterPainelAsync(data, top ?? 10, ct))
            .WithSummary("Tudo de uma semana: resumo, ranking, origem, áudio e UFs. Sem 'data', usa a última semana completa.");

        api.MapGet("/ranking", (ServicoConsultas s, DateOnly? data, int? top, CancellationToken ct) =>
                s.ObterRankingAsync(data, top ?? 10, ct))
            .WithSummary("Ranking de obras por público na semana que contém 'data'.");

        api.MapGet("/ufs", (ServicoConsultas s, DateOnly? data, CancellationToken ct) => s.ObterPorUfAsync(data, ct))
            .WithSummary("Público por UF, filme líder e % de público dublado entre estrangeiros.");

        api.MapGet("/obras", (ServicoConsultas s, string? busca, CancellationToken ct) => s.BuscarObrasAsync(busca, ct))
            .WithSummary("Busca obras pelo título (original ou no Brasil).");

        api.MapGet("/obras/{codigo}/curva", (ServicoConsultas s, string codigo, CancellationToken ct) =>
                s.ObterCurvaObraAsync(codigo, ct))
            .WithSummary("Dados da obra e público diário: a curva de vida em cartaz.");

        return app;
    }
}
