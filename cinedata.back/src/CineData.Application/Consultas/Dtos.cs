namespace CineData.Application.Consultas;

/// <param name="DiasComDados">Dias consolidados: com ao menos 90% da mediana de salas da janela de 8 semanas que termina no dia (ADR 0004).</param>
public sealed record SemanaDto(DateOnly Inicio, DateOnly Fim, int DiasComDados, long Publico, int Sessoes)
{
    public bool Completa => DiasComDados == 7;
}

/// <param name="Granularidade">semana, mes, trimestre, semestre ou ano (o mesmo valor do parâmetro <c>periodo</c>).</param>
/// <param name="Rotulo">Rótulo curto em português: "08/10 a 14/10/2026", "out/2026", "3º tri 2025", "1º sem 2026", "2025".</param>
/// <param name="DiasConsolidados">Dias com ao menos 90% da mediana de salas da janela de 8 semanas (ADR 0004).</param>
/// <param name="Completo">Semana: 7 dias consolidados. Calendário: a série cobre o período inteiro e já consolidou o último dia (ADR 0005).</param>
public sealed record PeriodoDto(
    string Granularidade,
    DateOnly Inicio,
    DateOnly Fim,
    string Rotulo,
    int Dias,
    int DiasConsolidados,
    long Publico,
    int Sessoes,
    bool Completo);

/// <summary>Cobertura de um dia (<c>agregado_dia</c>): base dos dias consolidados e da lista de períodos.</summary>
public sealed record DiaBilheteriaDto(DateOnly Data, int Salas, int Sessoes, long Publico);

/// <param name="PublicoPeriodoAnterior">Público do período equivalente anterior (semana, mês, trimestre… anterior).</param>
public sealed record ResumoDto(
    DateOnly Inicio,
    DateOnly Fim,
    long Publico,
    int Sessoes,
    int Obras,
    int Salas,
    int Municipios,
    double PublicoMedioPorSessao,
    long? PublicoPeriodoAnterior,
    double? VariacaoPct);

/// <param name="EmCartazDesde">Quinta da semana de estreia da temporada (sem pré-estreias; ver TempoEmCartaz).</param>
/// <param name="SemanasEmCartaz">Semanas da estreia até o período: na semana, a "3ª semana" dos boletins.</param>
/// <param name="Poster">Caminho do pôster no TMDB ("/abc.jpg"); a imagem vem de image.tmdb.org.</param>
public sealed record ItemRankingDto(
    int Posicao,
    string CodigoObra,
    string Titulo,
    string Origem,
    string? Pais,
    long Publico,
    int Sessoes,
    int Salas,
    double PublicoMedioPorSessao,
    double? OcupacaoPct,
    double ParticipacaoPct,
    long? PublicoPeriodoAnterior,
    double? VariacaoPct,
    bool Estreia,
    DateOnly? EmCartazDesde = null,
    int? SemanasEmCartaz = null,
    string? Poster = null);

public sealed record UfDto(
    string Uf,
    string Regiao,
    long Publico,
    int Sessoes,
    double PublicoMedioPorSessao,
    string? LiderCodigo,
    string? LiderTitulo,
    long LiderPublico,
    double? DubladoPctEstrangeiros,
    string? LiderPoster = null);

/// <summary>Uma UF em cada período de uma granularidade, do mais antigo ao mais recente: a série do mapa.</summary>
/// <param name="Regiao">Norte, Nordeste, CentroOeste, Sudeste ou Sul (como em <see cref="UfDto"/>).</param>
public sealed record SerieUfDto(string Uf, string Regiao, string Granularidade, IReadOnlyList<PontoUfDto> Pontos);

/// <param name="ParticipacaoPct">Parcela do público do Brasil no período.</param>
/// <param name="Posicao">Posição entre as UFs por público no período (1 = a de maior público).</param>
public sealed record PontoUfDto(
    DateOnly Inicio,
    long Publico,
    int Sessoes,
    double ParticipacaoPct,
    int Posicao,
    string? LiderCodigo,
    string? LiderTitulo,
    long LiderPublico,
    double? DubladoPctEstrangeiros);

public sealed record OrigemDto(string Origem, long Publico, int Obras, int Sessoes, double ParticipacaoPct);

/// <summary>Só obras estrangeiras: dublado vs. áudio original (legendado).</summary>
public sealed record AudioDto(long PublicoDublado, long PublicoLegendado, double DubladoPct);

public sealed record PainelDto(
    PeriodoDto Periodo,
    ResumoDto Resumo,
    IReadOnlyList<ItemRankingDto> Ranking,
    IReadOnlyList<OrigemDto> Origem,
    AudioDto Audio,
    IReadOnlyList<UfDto> Ufs);

public sealed record LancamentoDto(
    DateOnly Data, string Distribuidora, string TipoObra, long PublicoTotal, decimal RendaTotal, decimal? TicketMedio);

public sealed record ObraDto(
    string Codigo, string Titulo, string TituloOriginal, string? Pais, string Origem, LancamentoDto? Lancamento, string? Poster = null);

public sealed record ObraResumoDto(string Codigo, string Titulo, string Origem, long Publico, string? Poster = null);

/// <param name="Parcial">O dia ainda não está consolidado na ANCINE: exibidores continuam enviando dados.</param>
public sealed record PontoCurvaDto(DateOnly Data, long Publico, int Sessoes, int Salas, bool Parcial);

/// <param name="EmCartazDesde">Estreia da temporada mais recente (um relançamento começa outra).</param>
/// <param name="SemanasEmCartaz">Semanas da estreia à última semana com sessões.</param>
/// <param name="EmCartaz">Teve sessões na semana dos últimos dados publicados ou na anterior.</param>
public sealed record CurvaObraDto(
    ObraDto Obra,
    long PublicoNoPeriodo,
    IReadOnlyList<PontoCurvaDto> Dias,
    DateOnly? EmCartazDesde = null,
    int? SemanasEmCartaz = null,
    bool EmCartaz = false);

/// <summary>Público de uma obra numa semana cinematográfica: base do tempo em cartaz.</summary>
public sealed record PublicoSemanaObraDto(string CodigoObra, DateOnly Semana, long Publico);
