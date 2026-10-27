namespace CineData.Domain.Bilheteria;

/// <summary>Público de uma obra numa semana cinematográfica (a quinta de início).</summary>
public readonly record struct PublicoSemana(DateOnly Semana, long Publico);

/// <param name="Estreia">Quinta da semana de estreia da temporada.</param>
/// <param name="UltimaSemana">Última semana com sessões até a data pedida.</param>
/// <param name="Semanas">Semanas de exibição, da estreia à última (a "3ª semana" dos boletins de bilheteria).</param>
public readonly record struct Temporada(DateOnly Estreia, DateOnly UltimaSemana, int Semanas);

/// <summary>
/// Há quanto tempo um filme está em cartaz. Uma temporada é uma sequência de semanas com sessões em que nenhum
/// intervalo passa de 2 semanas sem sessão; um relançamento anos depois (Carros em 2026) é outra temporada. Dentro
/// dela, semanas de pré-estreia com menos de 5% do público da melhor semana não contam como estreia (a mesma regra que
/// tira a variação absurda das pré-estreias no ranking).
/// </summary>
public static class TempoEmCartaz
{
    public const double LimitePreEstreia = 0.05;
    public const int IntervaloMaximoEmDias = 21;

    /// <summary>A temporada em curso até <paramref name="ate"/>: a do período no ranking ("3ª semana").</summary>
    public static Temporada? Calcular(IEnumerable<PublicoSemana> semanas, DateOnly ate) =>
        Temporadas(semanas.Where(s => s.Semana <= ate)).LastOrDefault() is { Semanas: > 0 } t ? (Temporada)t : null;

    /// <summary>
    /// A temporada que descreve o filme na página dele: a em curso, se ele ainda teve sessões na semana dos últimos dados
    /// (ou na anterior); senão, a de maior público. Sessões avulsas meses depois não viram "estreou em abril, 1 semana".
    /// </summary>
    public static (Temporada Temporada, bool EmCartaz)? Principal(IEnumerable<PublicoSemana> semanas, DateOnly semanaDosDados)
    {
        var temporadas = Temporadas(semanas).ToList();
        if (temporadas.Count == 0) return null;
        var ultima = temporadas[^1];
        if (ultima.UltimaSemana >= semanaDosDados.AddDays(-7)) return (ultima, true);
        return (temporadas.MaxBy(t => t.Publico), false);
    }

    private readonly record struct TemporadaComPublico(DateOnly Estreia, DateOnly UltimaSemana, int Semanas, long Publico)
    {
        public static implicit operator Temporada(TemporadaComPublico t) => new(t.Estreia, t.UltimaSemana, t.Semanas);
    }

    private static IEnumerable<TemporadaComPublico> Temporadas(IEnumerable<PublicoSemana> semanas)
    {
        var lista = semanas.Where(s => s.Publico > 0).OrderBy(s => s.Semana).ToList();
        var inicio = 0;
        for (var i = 1; i <= lista.Count; i++)
        {
            if (i < lista.Count && lista[i].Semana.DayNumber - lista[i - 1].Semana.DayNumber <= IntervaloMaximoEmDias) continue;
            var temporada = lista[inicio..i];
            var pico = temporada.Max(s => s.Publico);
            var estreia = temporada.First(s => s.Publico >= pico * LimitePreEstreia).Semana;
            var ultima = temporada[^1].Semana;
            yield return new TemporadaComPublico(estreia, ultima, (ultima.DayNumber - estreia.DayNumber) / 7 + 1, temporada.Sum(s => s.Publico));
            inicio = i;
        }
    }
}
