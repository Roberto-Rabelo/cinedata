using CineData.Application.Consultas;
using CineData.Domain.Common;
using CineData.Domain.Obras;
using Dapper;
using Npgsql;

namespace CineData.Infrastructure.Persistence.Leitura;

/// <summary>
/// Lado de leitura: SQL agregado direto no PostgreSQL (Dapper), sem materializar entidades.
/// Datas vão como DateTime e são convertidas com ::date para evitar ambiguidade de tipo no driver.
/// </summary>
internal sealed class ConsultasBilheteriaSql(NpgsqlDataSource dados) : IConsultasBilheteria
{
    private const double LimitePreEstreia = 0.05;

    // Os exibidores enviam com atraso: os últimos dias publicados chegam com parte das salas.
    // Um dia é consolidado quando reporta ao menos 90% da mediana diária de salas.
    private const string DiasConsolidados = """
        cobertura AS (
            SELECT data_exibicao, count(DISTINCT registro_sala) AS salas FROM sessoes GROUP BY data_exibicao
        ),
        consolidado AS (
            SELECT c.data_exibicao, c.salas >= 0.9 * m.mediana AS ok
            FROM cobertura c
            CROSS JOIN (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY salas) AS mediana FROM cobertura) m
        )
        """;

    // Semana cinematográfica: quinta (isodow 4) a quarta.
    private const string InicioSemana = "(s.data_exibicao - ((extract(isodow from s.data_exibicao)::int + 3) % 7))";

    public async Task<IReadOnlyList<SemanaDto>> ListarSemanasAsync(CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaSemana>(new CommandDefinition($"""
            WITH {DiasConsolidados}
            SELECT {InicioSemana}::timestamp AS inicio,
                   count(DISTINCT s.data_exibicao) FILTER (WHERE c.ok)::int AS dias,
                   sum(s.publico)::bigint AS publico,
                   count(*)::int AS sessoes
            FROM sessoes s
            JOIN consolidado c ON c.data_exibicao = s.data_exibicao
            GROUP BY 1
            ORDER BY 1 DESC
            """, cancellationToken: ct));

        return linhas.Select(l =>
        {
            var inicio = DateOnly.FromDateTime(l.Inicio);
            return new SemanaDto(inicio, inicio.AddDays(6), l.Dias, l.Publico, l.Sessoes);
        }).ToList();
    }

    public async Task<ResumoSemanaDto> ObterResumoAsync(SemanaCinematografica semana, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var anterior = semana.Anterior();
        var l = await conexao.QuerySingleAsync<LinhaResumo>(new CommandDefinition("""
            SELECT coalesce(sum(s.publico), 0)::bigint AS publico,
                   count(*)::int AS sessoes,
                   count(DISTINCT s.codigo_obra)::int AS obras,
                   count(DISTINCT s.registro_sala)::int AS salas,
                   count(DISTINCT (sa.uf, sa.municipio))::int AS municipios,
                   (SELECT sum(publico) FROM sessoes WHERE data_exibicao BETWEEN @iniAnt::date AND @fimAnt::date)::bigint AS publico_anterior
            FROM sessoes s
            JOIN salas sa ON sa.registro = s.registro_sala
            WHERE s.data_exibicao BETWEEN @ini::date AND @fim::date
            """, Parametros(semana, anterior), cancellationToken: ct));

        return new ResumoSemanaDto(
            semana.Inicio, semana.Fim, l.Publico, l.Sessoes, l.Obras, l.Salas, l.Municipios,
            l.Sessoes == 0 ? 0 : Math.Round((double)l.Publico / l.Sessoes, 1),
            l.PublicoAnterior,
            Variacao(l.Publico, l.PublicoAnterior));
    }

    public async Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(SemanaCinematografica semana, int top, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var anterior = semana.Anterior();
        var linhas = await conexao.QueryAsync<LinhaRanking>(new CommandDefinition("""
            WITH atual AS (
                SELECT s.codigo_obra,
                       sum(s.publico)::bigint AS publico,
                       count(*)::int AS sessoes,
                       count(DISTINCT s.registro_sala)::int AS salas,
                       (sum(s.publico) FILTER (WHERE sa.assentos > 0))::float8
                         / nullif(sum(sa.assentos) FILTER (WHERE sa.assentos > 0), 0) * 100 AS ocupacao
                FROM sessoes s
                JOIN salas sa ON sa.registro = s.registro_sala
                WHERE s.data_exibicao BETWEEN @ini::date AND @fim::date
                GROUP BY s.codigo_obra
            ),
            anterior AS (
                SELECT codigo_obra, sum(publico)::bigint AS publico
                FROM sessoes
                WHERE data_exibicao BETWEEN @iniAnt::date AND @fimAnt::date
                GROUP BY codigo_obra
            ),
            total AS (SELECT nullif(sum(publico), 0)::float8 AS t FROM atual),
            tem_anterior AS (SELECT exists(SELECT 1 FROM anterior) AS existe)
            SELECT a.codigo_obra AS codigo,
                   coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo,
                   o.pais,
                   a.publico, a.sessoes, a.salas, a.ocupacao,
                   coalesce(a.publico / total.t * 100, 0) AS participacao,
                   an.publico AS publico_anterior,
                   (tem_anterior.existe AND an.publico IS NULL) AS estreia
            FROM atual a
            JOIN obras o ON o.codigo = a.codigo_obra
            LEFT JOIN anterior an ON an.codigo_obra = a.codigo_obra
            CROSS JOIN total
            CROSS JOIN tem_anterior
            ORDER BY a.publico DESC
            LIMIT @top
            """, new { ini = Dia(semana.Inicio), fim = Dia(semana.Fim), iniAnt = Dia(anterior.Inicio), fimAnt = Dia(anterior.Fim), top },
            cancellationToken: ct));

        return linhas.Select((l, i) =>
        {
            // Pré-estreias deixam um público residual na semana anterior e geram variações absurdas
            // (+300.000%). Abaixo de 5% do público atual, a semana conta como estreia.
            var preEstreia = l.PublicoAnterior is { } anterior && anterior < l.Publico * LimitePreEstreia;
            return new ItemRankingDto(
                i + 1, l.Codigo, l.Titulo, Origem(l.Codigo), l.Pais, l.Publico, l.Sessoes, l.Salas,
                Math.Round((double)l.Publico / l.Sessoes, 1),
                l.Ocupacao is { } o ? Math.Round(o, 1) : null,
                Math.Round(l.Participacao, 1),
                l.PublicoAnterior,
                preEstreia ? null : Variacao(l.Publico, l.PublicoAnterior),
                l.Estreia || preEstreia);
        }).ToList();
    }

    public async Task<IReadOnlyList<UfDto>> ObterPorUfAsync(SemanaCinematografica semana, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaUf>(new CommandDefinition("""
            WITH base AS (
                SELECT sa.uf, s.codigo_obra, s.publico, s.audio, left(s.codigo_obra, 1) AS prefixo
                FROM sessoes s
                JOIN salas sa ON sa.registro = s.registro_sala
                WHERE s.data_exibicao BETWEEN @ini::date AND @fim::date
            ),
            por_uf AS (
                SELECT uf, sum(publico)::bigint AS publico, count(*)::int AS sessoes,
                       (sum(publico) FILTER (WHERE prefixo = 'E' AND audio = 1))::float8
                         / nullif(sum(publico) FILTER (WHERE prefixo = 'E'), 0) * 100 AS dublado
                FROM base GROUP BY uf
            ),
            por_obra AS (
                SELECT uf, codigo_obra, sum(publico)::bigint AS publico,
                       row_number() OVER (PARTITION BY uf ORDER BY sum(publico) DESC) AS posicao
                FROM base GROUP BY uf, codigo_obra
            )
            SELECT u.uf, u.publico, u.sessoes, u.dublado,
                   po.codigo_obra AS lider_codigo,
                   coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS lider_titulo,
                   coalesce(po.publico, 0)::bigint AS lider_publico
            FROM por_uf u
            LEFT JOIN por_obra po ON po.uf = u.uf AND po.posicao = 1
            LEFT JOIN obras o ON o.codigo = po.codigo_obra
            ORDER BY u.publico DESC
            """, new { ini = Dia(semana.Inicio), fim = Dia(semana.Fim) }, cancellationToken: ct));

        return linhas.Select(l => new UfDto(
            l.Uf.Trim(), Uf.Criar(l.Uf).Regiao.ToString(), l.Publico, l.Sessoes,
            Math.Round((double)l.Publico / l.Sessoes, 1),
            l.LiderCodigo, l.LiderTitulo, l.LiderPublico,
            l.Dublado is { } d ? Math.Round(d, 1) : null)).ToList();
    }

    public async Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(SemanaCinematografica semana, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaOrigem>(new CommandDefinition("""
            SELECT left(codigo_obra, 1) AS prefixo,
                   sum(publico)::bigint AS publico,
                   count(DISTINCT codigo_obra)::int AS obras,
                   count(*)::int AS sessoes
            FROM sessoes
            WHERE data_exibicao BETWEEN @ini::date AND @fim::date
            GROUP BY 1
            ORDER BY 2 DESC
            """, new { ini = Dia(semana.Inicio), fim = Dia(semana.Fim) }, cancellationToken: ct));

        var lista = linhas.ToList();
        var total = lista.Sum(l => l.Publico);
        return lista.Select(l => new OrigemDto(
            Origem(l.Prefixo + "0000000000000"), l.Publico, l.Obras, l.Sessoes,
            total == 0 ? 0 : Math.Round(100.0 * l.Publico / total, 1))).ToList();
    }

    public async Task<AudioDto> ObterAudioAsync(SemanaCinematografica semana, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var l = await conexao.QuerySingleAsync<LinhaAudio>(new CommandDefinition("""
            SELECT coalesce(sum(publico) FILTER (WHERE audio = 1), 0)::bigint AS dublado,
                   coalesce(sum(publico) FILTER (WHERE audio = 0), 0)::bigint AS legendado
            FROM sessoes
            WHERE data_exibicao BETWEEN @ini::date AND @fim::date
              AND codigo_obra LIKE 'E%'
            """, new { ini = Dia(semana.Inicio), fim = Dia(semana.Fim) }, cancellationToken: ct));

        var total = l.Dublado + l.Legendado;
        return new AudioDto(l.Dublado, l.Legendado, total == 0 ? 0 : Math.Round(100.0 * l.Dublado / total, 1));
    }

    public async Task<ObraDto?> ObterObraAsync(CodigoObra codigo, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var l = await conexao.QuerySingleOrDefaultAsync<LinhaObra>(new CommandDefinition("""
            SELECT o.codigo, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo,
                   o.titulo_original, o.pais,
                   la.data_lancamento::timestamp AS data_lancamento, la.distribuidora, la.tipo_obra,
                   la.publico_total, la.renda_total
            FROM obras o
            LEFT JOIN LATERAL (
                SELECT * FROM lancamentos l WHERE l.codigo_obra = o.codigo
                ORDER BY l.publico_total DESC LIMIT 1
            ) la ON true
            WHERE o.codigo = @codigo
            """, new { codigo = codigo.Valor }, cancellationToken: ct));

        if (l is null) return null;

        var lancamento = l.DataLancamento is { } data
            ? new LancamentoDto(DateOnly.FromDateTime(data), l.Distribuidora!, l.TipoObra!, l.PublicoTotal ?? 0,
                l.RendaTotal ?? 0, l.PublicoTotal > 0 ? Math.Round((l.RendaTotal ?? 0) / l.PublicoTotal.Value, 2) : null)
            : null;
        return new ObraDto(l.Codigo, l.Titulo, l.TituloOriginal, l.Pais, Origem(l.Codigo), lancamento);
    }

    public async Task<IReadOnlyList<PontoCurvaDto>> ObterCurvaAsync(CodigoObra codigo, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaCurva>(new CommandDefinition($"""
            WITH {DiasConsolidados}
            SELECT s.data_exibicao::timestamp AS data, sum(s.publico)::bigint AS publico,
                   count(*)::int AS sessoes, count(DISTINCT s.registro_sala)::int AS salas,
                   NOT bool_and(c.ok) AS parcial
            FROM sessoes s
            JOIN consolidado c ON c.data_exibicao = s.data_exibicao
            WHERE s.codigo_obra = @codigo
            GROUP BY s.data_exibicao
            ORDER BY s.data_exibicao
            """, new { codigo = codigo.Valor }, cancellationToken: ct));

        return linhas.Select(l => new PontoCurvaDto(DateOnly.FromDateTime(l.Data), l.Publico, l.Sessoes, l.Salas, l.Parcial)).ToList();
    }

    public async Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaBusca>(new CommandDefinition("""
            SELECT o.codigo, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo,
                   coalesce(sum(s.publico), 0)::bigint AS publico
            FROM obras o
            LEFT JOIN sessoes s ON s.codigo_obra = o.codigo
            WHERE o.titulo_original ILIKE @padrao OR o.titulo_brasil ILIKE @padrao
            GROUP BY o.codigo
            ORDER BY publico DESC
            LIMIT @limite
            """, new { padrao = $"%{termo}%", limite }, cancellationToken: ct));

        return linhas.Select(l => new ObraResumoDto(l.Codigo, l.Titulo, Origem(l.Codigo), l.Publico)).ToList();
    }

    private static object Parametros(SemanaCinematografica semana, SemanaCinematografica anterior) => new
    {
        ini = Dia(semana.Inicio), fim = Dia(semana.Fim), iniAnt = Dia(anterior.Inicio), fimAnt = Dia(anterior.Fim),
    };

    private static DateTime Dia(DateOnly data) => data.ToDateTime(TimeOnly.MinValue);

    private static string Origem(string codigo) => CodigoObra.Criar(codigo).Origem.ToString();

    private static double? Variacao(long atual, long? anterior) =>
        anterior is > 0 ? Math.Round(100.0 * (atual - anterior.Value) / anterior.Value, 1) : null;

    // Linhas cruas do Dapper (colunas snake_case mapeadas via MatchNamesWithUnderscores).
    private sealed record LinhaSemana(DateTime Inicio, int Dias, long Publico, int Sessoes);
    private sealed record LinhaResumo(long Publico, int Sessoes, int Obras, int Salas, int Municipios, long? PublicoAnterior);
    private sealed record LinhaRanking(string Codigo, string Titulo, string? Pais, long Publico, int Sessoes, int Salas,
        double? Ocupacao, double Participacao, long? PublicoAnterior, bool Estreia);
    private sealed record LinhaUf(string Uf, long Publico, int Sessoes, double? Dublado, string? LiderCodigo,
        string? LiderTitulo, long LiderPublico);
    private sealed record LinhaOrigem(string Prefixo, long Publico, int Obras, int Sessoes);
    private sealed record LinhaAudio(long Dublado, long Legendado);
    private sealed record LinhaObra(string Codigo, string Titulo, string TituloOriginal, string? Pais, DateTime? DataLancamento,
        string? Distribuidora, string? TipoObra, long? PublicoTotal, decimal? RendaTotal);
    private sealed record LinhaCurva(DateTime Data, long Publico, int Sessoes, int Salas, bool Parcial);
    private sealed record LinhaBusca(string Codigo, string Titulo, long Publico);
}
