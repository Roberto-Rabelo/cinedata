using CineData.Application.Posteres;
using Dapper;
using Npgsql;

namespace CineData.Infrastructure.Persistence.Repositorios;

internal sealed class RepositorioPosteres(NpgsqlDataSource dados) : IRepositorioPosteres
{
    public async Task<IReadOnlyList<ObraParaPoster>> ObterPendentesAsync(DateOnly desde, DateTimeOffset reconsultarAntesDe, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        // O mesmo conjunto de obras do export do site: top 10 de cada período e líderes de UF desde o corte.
        var linhas = await conexao.QueryAsync<LinhaPendente>(new CommandDefinition("""
            WITH site AS (
                SELECT codigo_obra FROM (
                    SELECT codigo_obra, row_number() OVER (PARTITION BY granularidade, inicio ORDER BY publico DESC, codigo_obra) AS posicao
                    FROM agregado_periodo_obra WHERE inicio >= @desde::date
                ) r WHERE posicao <= 10
                UNION
                SELECT lider_codigo FROM agregado_periodo_uf WHERE inicio >= @desde::date AND lider_codigo IS NOT NULL
            )
            SELECT o.codigo, o.titulo_original, nullif(o.titulo_brasil, '') AS titulo_brasil,
                   coalesce(
                       (SELECT extract(year FROM min(l.data_lancamento)) FROM lancamentos l WHERE l.codigo_obra = o.codigo),
                       (SELECT extract(year FROM a.semana) FROM agregado_semana_obra a WHERE a.codigo_obra = o.codigo
                        ORDER BY a.publico DESC LIMIT 1)
                   )::int AS ano_referencia
            FROM site s
            JOIN obras o ON o.codigo = s.codigo_obra
            LEFT JOIN obras_tmdb t ON t.codigo_obra = o.codigo
            WHERE o.codigo NOT LIKE 'G%'
              AND (t.codigo_obra IS NULL OR (t.tmdb_id IS NULL AND NOT t.manual AND t.consultado_em < @reconsultar))
            ORDER BY o.codigo
            """, new { desde = desde.ToDateTime(TimeOnly.MinValue), reconsultar = reconsultarAntesDe.UtcDateTime }, cancellationToken: ct));
        return linhas.Select(l => new ObraParaPoster(l.Codigo, l.TituloOriginal, l.TituloBrasil, l.AnoReferencia)).ToList();
    }

    public async Task SalvarAsync(IReadOnlyCollection<PosterObra> posteres, DateTimeOffset consultadoEm, CancellationToken ct)
    {
        if (posteres.Count == 0) return;
        await using var conexao = await dados.OpenConnectionAsync(ct);
        await conexao.ExecuteAsync(new CommandDefinition("""
            INSERT INTO obras_tmdb (codigo_obra, tmdb_id, poster, titulo_tmdb, ano_tmdb, consultado_em)
            SELECT c, i, p, t, a, @quando FROM unnest(@codigos, @ids, @posteres, @titulos, @anos) AS x(c, i, p, t, a)
            ON CONFLICT (codigo_obra) DO UPDATE
            SET tmdb_id = excluded.tmdb_id, poster = excluded.poster, titulo_tmdb = excluded.titulo_tmdb,
                ano_tmdb = excluded.ano_tmdb, consultado_em = excluded.consultado_em
            WHERE NOT obras_tmdb.manual
            """, new
            {
                codigos = posteres.Select(p => p.Codigo).ToArray(),
                ids = posteres.Select(p => p.TmdbId).ToArray(),
                posteres = posteres.Select(p => p.Poster).ToArray(),
                titulos = posteres.Select(p => p.TituloTmdb).ToArray(),
                anos = posteres.Select(p => p.AnoTmdb).ToArray(),
                quando = consultadoEm.UtcDateTime,
            }, cancellationToken: ct));
    }

    public async Task DefinirManualAsync(PosterObra poster, DateTimeOffset em, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        await conexao.ExecuteAsync(new CommandDefinition("""
            INSERT INTO obras_tmdb (codigo_obra, tmdb_id, poster, titulo_tmdb, ano_tmdb, manual, consultado_em)
            VALUES (@Codigo, @TmdbId, @Poster, @TituloTmdb, @AnoTmdb, true, @em)
            ON CONFLICT (codigo_obra) DO UPDATE
            SET tmdb_id = excluded.tmdb_id, poster = excluded.poster, titulo_tmdb = excluded.titulo_tmdb,
                ano_tmdb = excluded.ano_tmdb, manual = true, consultado_em = excluded.consultado_em
            """, new { poster.Codigo, poster.TmdbId, poster.Poster, poster.TituloTmdb, poster.AnoTmdb, em = em.UtcDateTime },
            cancellationToken: ct));
    }

    private sealed record LinhaPendente(string Codigo, string TituloOriginal, string? TituloBrasil, int AnoReferencia);
}
