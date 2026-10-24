using CineData.Domain.Bilheteria;
using CineData.Domain.Common;

namespace CineData.Application.Consultas;

/// <summary>
/// Aplica a regra de dias consolidados (domínio) à cobertura diária e descreve os períodos de cada granularidade.
/// Roda em memória sobre ~4.000 linhas de <c>agregado_dia</c>.
/// </summary>
internal sealed class CoberturaPeriodos
{
    private readonly IReadOnlyList<DiaBilheteriaDto> _dias;
    private readonly IReadOnlySet<DateOnly> _consolidados;
    private readonly DateOnly _primeiroDia;
    private readonly DateOnly _ultimoConsolidado;

    public CoberturaPeriodos(IReadOnlyList<DiaBilheteriaDto> dias)
    {
        _dias = dias;
        _consolidados = DiasConsolidados.Calcular(dias.Select(d => new CoberturaDia(d.Data, d.Salas)));
        _primeiroDia = dias.Count == 0 ? DateOnly.MaxValue : dias.Min(d => d.Data);
        _ultimoConsolidado = _consolidados.Count == 0 ? DateOnly.MinValue : _consolidados.Max();
    }

    /// <summary>Períodos com ao menos um dia de dados, do mais recente para o mais antigo.</summary>
    public IReadOnlyList<PeriodoDto> Listar(Granularidade granularidade) => _dias
        .GroupBy(d => Periodo.Contendo(granularidade, d.Data))
        .OrderByDescending(g => g.Key.Inicio)
        .Select(g => Montar(g.Key, g))
        .ToList();

    public PeriodoDto Descrever(Periodo periodo) => Montar(periodo, _dias.Where(d => periodo.Contem(d.Data)));

    private PeriodoDto Montar(Periodo periodo, IEnumerable<DiaBilheteriaDto> diasDoPeriodo)
    {
        var dias = diasDoPeriodo.ToList();
        var consolidados = dias.Count(d => _consolidados.Contains(d.Data));
        return new PeriodoDto(
            Granularidades.Nome(periodo.Granularidade), periodo.Inicio, periodo.Fim, periodo.ToString(), periodo.Dias,
            consolidados, dias.Sum(d => d.Publico), dias.Sum(d => d.Sessoes),
            dias.Count > 0 && DiasConsolidados.PeriodoCompleto(periodo, consolidados, _primeiroDia, _ultimoConsolidado));
    }
}
