using CineData.Application.Consultas;
using CineData.Domain.Bilheteria;
using CineData.Domain.Common;
using CineData.Domain.Obras;
using Dapper;
using Npgsql;

namespace CineData.Infrastructure.Persistence.Leitura;

/// <summary>
/// Lado de leitura: SQL direto no PostgreSQL (Dapper), sem materializar entidades.
/// Consultas por período leem as views <c>agregado_periodo*</c>, que juntam os agregados semanais e os de calendário
/// (mês, trimestre, semestre, ano; mantidos na ingestão) em vez de varrer <c>sessoes</c>.
/// Datas vão como DateTime e são convertidas com ::date para evitar ambiguidade de tipo no driver.
/// </summary>
internal sealed class ConsultasBilheteriaSql(NpgsqlDataSource dados) : IConsultasBilheteria
{
    private const double LimitePreEstreia = 0.05;

    public async Task<IReadOnlyList<DiaBilheteriaDto>> ObterCoberturaAsync(CancellationToken ct) =>
        (await ObterDiasAsync(ct)).Select(d => new DiaBilheteriaDto(DateOnly.FromDateTime(d.Data), d.Salas, d.Sessoes, d.Publico)).ToList();

    public async Task<ResumoDto> ObterResumoAsync(Periodo periodo, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var l = await conexao.QuerySingleAsync<LinhaResumo>(new CommandDefinition("""
            SELECT coalesce(a.publico, 0)::bigint AS publico,
                   coalesce(a.sessoes, 0) AS sessoes,
                   coalesce(a.obras, 0) AS obras,
                   coalesce(a.salas, 0) AS salas,
                   coalesce(a.municipios, 0) AS municipios,
                   an.publico AS publico_anterior
            FROM (SELECT) x
            LEFT JOIN agregado_periodo a ON a.granularidade = @g AND a.inicio = @ini::date
            LEFT JOIN agregado_periodo an ON an.granularidade = @g AND an.inicio = @iniAnt::date
            """, Parametros(periodo), cancellationToken: ct));

        return new ResumoDto(
            periodo.Inicio, periodo.Fim, l.Publico, l.Sessoes, l.Obras, l.Salas, l.Municipios,
            l.Sessoes == 0 ? 0 : Math.Round((double)l.Publico / l.Sessoes, 1),
            l.PublicoAnterior,
            Variacao(l.Publico, l.PublicoAnterior));
    }

    public async Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(Periodo periodo, int top, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaRanking>(new CommandDefinition("""
            WITH atual AS (
                SELECT codigo_obra, publico, sessoes, salas,
                       publico_com_assentos::float8 / nullif(assentos, 0) * 100 AS ocupacao
                FROM agregado_periodo_obra
                WHERE granularidade = @g AND inicio = @ini::date
            ),
            anterior AS (
                SELECT codigo_obra, publico FROM agregado_periodo_obra WHERE granularidade = @g AND inicio = @iniAnt::date
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
            ORDER BY a.publico DESC, a.codigo_obra
            LIMIT @top
            """, new { g = Granularidades.Nome(periodo.Granularidade), ini = Dia(periodo.Inicio),
                iniAnt = Dia(periodo.Anterior().Inicio), top },
            cancellationToken: ct));

        return linhas.Select((l, i) =>
        {
            // Pré-estreias deixam um público residual no período anterior e geram variações absurdas
            // (+300.000%). Abaixo de 5% do público atual, o período conta como estreia.
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

    public async Task<IReadOnlyList<UfDto>> ObterPorUfAsync(Periodo periodo, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaUf>(new CommandDefinition("""
            SELECT u.uf, u.publico, u.sessoes,
                   u.publico_estrangeiro_dublado::float8 / nullif(u.publico_estrangeiro, 0) * 100 AS dublado,
                   u.lider_codigo,
                   coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS lider_titulo,
                   u.lider_publico
            FROM agregado_periodo_uf u
            LEFT JOIN obras o ON o.codigo = u.lider_codigo
            WHERE u.granularidade = @g AND u.inicio = @ini::date
            ORDER BY u.publico DESC
            """, Parametros(periodo), cancellationToken: ct));

        return linhas.Select(l => new UfDto(
            l.Uf.Trim(), Uf.Criar(l.Uf).Regiao.ToString(), l.Publico, l.Sessoes,
            Math.Round((double)l.Publico / l.Sessoes, 1),
            l.LiderCodigo, l.LiderTitulo, l.LiderPublico,
            l.Dublado is { } d ? Math.Round(d, 1) : null)).ToList();
    }

    public async Task<IReadOnlyList<PontoUfDto>> ObterSerieUfAsync(Granularidade granularidade, Uf uf, CancellationToken ct)
    {
        // Parcela e posição precisam de todas as UFs de cada período; ~27 × 600 linhas por granularidade (~40 ms).
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaSerieUf>(new CommandDefinition("""
            SELECT x.inicio::timestamp AS inicio, x.publico, x.sessoes, coalesce(x.participacao, 0) AS participacao, x.posicao,
                   x.lider_codigo, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS lider_titulo,
                   x.lider_publico, x.dublado
            FROM (
                SELECT u.inicio, u.uf, u.publico, u.sessoes, u.lider_codigo, u.lider_publico,
                       u.publico::float8 / nullif(sum(u.publico) OVER (PARTITION BY u.inicio), 0) * 100 AS participacao,
                       rank() OVER (PARTITION BY u.inicio ORDER BY u.publico DESC)::int AS posicao,
                       u.publico_estrangeiro_dublado::float8 / nullif(u.publico_estrangeiro, 0) * 100 AS dublado
                FROM agregado_periodo_uf u
                WHERE u.granularidade = @g
            ) x
            LEFT JOIN obras o ON o.codigo = x.lider_codigo
            WHERE x.uf = @uf
            ORDER BY x.inicio
            """, new { g = Granularidades.Nome(granularidade), uf = uf.Sigla }, cancellationToken: ct));

        return linhas.Select(l => new PontoUfDto(
            DateOnly.FromDateTime(l.Inicio), l.Publico, l.Sessoes, Math.Round(l.Participacao, 1), l.Posicao,
            l.LiderCodigo, l.LiderTitulo, l.LiderPublico, l.Dublado is { } d ? Math.Round(d, 1) : null)).ToList();
    }

    public async Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(Periodo periodo, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaOrigem>(new CommandDefinition("""
            SELECT left(codigo_obra, 1) AS prefixo,
                   sum(publico)::bigint AS publico,
                   count(*)::int AS obras,
                   sum(sessoes)::int AS sessoes
            FROM agregado_periodo_obra
            WHERE granularidade = @g AND inicio = @ini::date
            GROUP BY 1
            ORDER BY 2 DESC
            """, Parametros(periodo), cancellationToken: ct));

        var lista = linhas.ToList();
        var total = lista.Sum(l => l.Publico);
        return lista.Select(l => new OrigemDto(
            Origem(l.Prefixo + "0000000000000"), l.Publico, l.Obras, l.Sessoes,
            total == 0 ? 0 : Math.Round(100.0 * l.Publico / total, 1))).ToList();
    }

    public async Task<AudioDto> ObterAudioAsync(Periodo periodo, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var l = await conexao.QuerySingleAsync<LinhaAudio>(new CommandDefinition("""
            SELECT coalesce(sum(publico_dublado), 0)::bigint AS dublado,
                   coalesce(sum(publico_original), 0)::bigint AS legendado
            FROM agregado_periodo_obra
            WHERE granularidade = @g AND inicio = @ini::date
              AND codigo_obra LIKE 'E%'
            """, Parametros(periodo), cancellationToken: ct));

        var total = l.Dublado + l.Legendado;
        return new AudioDto(l.Dublado, l.Legendado, total == 0 ? 0 : Math.Round(100.0 * l.Dublado / total, 1));
    }

    public async Task<IReadOnlyList<PublicoSemanaObraDto>> ObterSemanasDasObrasAsync(IReadOnlyCollection<string> codigos, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaSemanaObra>(new CommandDefinition("""
            SELECT codigo_obra, semana::timestamp AS semana, publico
            FROM agregado_semana_obra
            WHERE codigo_obra = ANY(@codigos)
            """, new { codigos = codigos.ToArray() }, cancellationToken: ct));
        return linhas.Select(l => new PublicoSemanaObraDto(l.CodigoObra, DateOnly.FromDateTime(l.Semana), l.Publico)).ToList();
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
        var dias = await ObterDiasAsync(ct);
        var consolidados = DiasConsolidados.Calcular(dias.Select(d => new CoberturaDia(DateOnly.FromDateTime(d.Data), d.Salas)));

        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaCurva>(new CommandDefinition("""
            SELECT data_exibicao::timestamp AS data, sum(publico)::bigint AS publico,
                   count(*)::int AS sessoes, count(DISTINCT registro_sala)::int AS salas
            FROM sessoes
            WHERE codigo_obra = @codigo
            GROUP BY data_exibicao
            ORDER BY data_exibicao
            """, new { codigo = codigo.Valor }, cancellationToken: ct));

        return linhas.Select(l =>
        {
            var data = DateOnly.FromDateTime(l.Data);
            return new PontoCurvaDto(data, l.Publico, l.Sessoes, l.Salas, !consolidados.Contains(data));
        }).ToList();
    }

    public async Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaBusca>(new CommandDefinition("""
            SELECT o.codigo, coalesce(nullif(o.titulo_brasil, ''), o.titulo_original) AS titulo,
                   coalesce(sum(a.publico), 0)::bigint AS publico
            FROM obras o
            LEFT JOIN agregado_semana_obra a ON a.codigo_obra = o.codigo
            WHERE o.titulo_original ILIKE @padrao OR o.titulo_brasil ILIKE @padrao
            GROUP BY o.codigo
            ORDER BY publico DESC
            LIMIT @limite
            """, new { padrao = $"%{termo}%", limite }, cancellationToken: ct));

        return linhas.Select(l => new ObraResumoDto(l.Codigo, l.Titulo, Origem(l.Codigo), l.Publico)).ToList();
    }

    /// <summary>Cobertura diária (salas que reportaram) de todo o histórico: ~4.000 linhas, base dos dias consolidados.</summary>
    private async Task<IReadOnlyList<LinhaDia>> ObterDiasAsync(CancellationToken ct)
    {
        await using var conexao = await dados.OpenConnectionAsync(ct);
        var linhas = await conexao.QueryAsync<LinhaDia>(new CommandDefinition("""
            SELECT data::timestamp AS data, salas, sessoes, publico FROM agregado_dia ORDER BY data
            """, cancellationToken: ct));
        return linhas.AsList();
    }

    private static object Parametros(Periodo periodo) => new
    {
        g = Granularidades.Nome(periodo.Granularidade), ini = Dia(periodo.Inicio), iniAnt = Dia(periodo.Anterior().Inicio),
    };

    private static DateTime Dia(DateOnly data) => data.ToDateTime(TimeOnly.MinValue);

    private static string Origem(string codigo) => CodigoObra.Criar(codigo).Origem.ToString();

    private static double? Variacao(long atual, long? anterior) =>
        anterior is > 0 ? Math.Round(100.0 * (atual - anterior.Value) / anterior.Value, 1) : null;

    // Linhas cruas do Dapper (colunas snake_case mapeadas via MatchNamesWithUnderscores).
    private sealed record LinhaDia(DateTime Data, int Salas, int Sessoes, long Publico);
    private sealed record LinhaResumo(long Publico, int Sessoes, int Obras, int Salas, int Municipios, long? PublicoAnterior);
    private sealed record LinhaRanking(string Codigo, string Titulo, string? Pais, long Publico, int Sessoes, int Salas,
        double? Ocupacao, double Participacao, long? PublicoAnterior, bool Estreia);
    private sealed record LinhaUf(string Uf, long Publico, int Sessoes, double? Dublado, string? LiderCodigo,
        string? LiderTitulo, long LiderPublico);
    private sealed record LinhaSerieUf(DateTime Inicio, long Publico, int Sessoes, double Participacao, int Posicao,
        string? LiderCodigo, string? LiderTitulo, long LiderPublico, double? Dublado);
    private sealed record LinhaSemanaObra(string CodigoObra, DateTime Semana, long Publico);
    private sealed record LinhaOrigem(string Prefixo, long Publico, int Obras, int Sessoes);
    private sealed record LinhaAudio(long Dublado, long Legendado);
    private sealed record LinhaObra(string Codigo, string Titulo, string TituloOriginal, string? Pais, DateTime? DataLancamento,
        string? Distribuidora, string? TipoObra, long? PublicoTotal, decimal? RendaTotal);
    private sealed record LinhaCurva(DateTime Data, long Publico, int Sessoes, int Salas);
    private sealed record LinhaBusca(string Codigo, string Titulo, long Publico);
}
