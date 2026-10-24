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
    bool Estreia);

public sealed record UfDto(
    string Uf,
    string Regiao,
    long Publico,
    int Sessoes,
    double PublicoMedioPorSessao,
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
    string Codigo, string Titulo, string TituloOriginal, string? Pais, string Origem, LancamentoDto? Lancamento);

public sealed record ObraResumoDto(string Codigo, string Titulo, string Origem, long Publico);

/// <param name="Parcial">O dia ainda não está consolidado na ANCINE: exibidores continuam enviando dados.</param>
public sealed record PontoCurvaDto(DateOnly Data, long Publico, int Sessoes, int Salas, bool Parcial);

public sealed record CurvaObraDto(ObraDto Obra, long PublicoNoPeriodo, IReadOnlyList<PontoCurvaDto> Dias);
