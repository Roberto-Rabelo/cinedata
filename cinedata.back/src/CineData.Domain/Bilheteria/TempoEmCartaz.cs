namespace CineData.Domain.Bilheteria;

/// <summary>Público de uma obra numa semana cinematográfica (a quinta de início).</summary>
public readonly record struct PublicoSemana(DateOnly Semana, long Publico);

/// <param name="Estreia">Quinta da semana de estreia da temporada.</param>
/// <param name="UltimaSemana">Última semana com sessões até a data pedida.</param>
/// <param name="Semanas">Semanas de exibição, da estreia à última (a "3ª semana" dos boletins de bilheteria).</param>
public readonly record struct Temporada(DateOnly Estreia, DateOnly UltimaSemana, int Semanas);

/// <summary>
/// Há quanto tempo um filme está em cartaz. A temporada é a sequência de semanas seguidas com sessões que termina na
/// última semana até a data pedida: um relançamento anos depois (Carros em 2026) começa uma temporada nova. Dentro dela,
/// semanas de pré-estreia com menos de 5% do público da melhor semana não contam como estreia (a mesma regra que tira
/// a variação absurda das pré-estreias no ranking).
/// </summary>
public static class TempoEmCartaz
{
    public const double LimitePreEstreia = 0.05;

    public static Temporada? Calcular(IEnumerable<PublicoSemana> semanas, DateOnly ate)
    {
        var lista = semanas.Where(s => s.Semana <= ate && s.Publico > 0).OrderBy(s => s.Semana).ToList();
        if (lista.Count == 0) return null;

        var inicio = lista.Count - 1;
        while (inicio > 0 && lista[inicio - 1].Semana == lista[inicio].Semana.AddDays(-7)) inicio--;
        var temporada = lista[inicio..];

        var pico = temporada.Max(s => s.Publico);
        var estreia = temporada.First(s => s.Publico >= pico * LimitePreEstreia).Semana;
        var ultima = temporada[^1].Semana;
        return new Temporada(estreia, ultima, (ultima.DayNumber - estreia.DayNumber) / 7 + 1);
    }
}
