using CineData.Domain.Common;

namespace CineData.Domain.Bilheteria;

/// <summary>Quantas salas reportaram sessões num dia.</summary>
public readonly record struct CoberturaDia(DateOnly Data, int Salas);

/// <summary>
/// Os exibidores enviam com atraso: os últimos dias publicados chegam com parte das salas.
/// Um dia é consolidado quando reporta ao menos 90% da mediana de salas da janela móvel de 8 semanas
/// que termina nele. A janela acompanha a abertura e o fechamento de salas ao longo dos anos,
/// o que uma mediana global do histórico não faz (ADR 0004).
/// </summary>
public static class DiasConsolidados
{
    public const double Limite = 0.9;
    public const int JanelaEmDias = 56;

    public static IReadOnlySet<DateOnly> Calcular(IEnumerable<CoberturaDia> cobertura)
    {
        var dias = cobertura.OrderBy(c => c.Data).ToArray();
        var consolidados = new HashSet<DateOnly>();
        var janela = new List<int>(JanelaEmDias);
        var inicio = 0;

        for (var i = 0; i < dias.Length; i++)
        {
            // Dias sem nenhuma sessão não existem na cobertura; a janela é por calendário, não por contagem.
            while (dias[inicio].Data.DayNumber <= dias[i].Data.DayNumber - JanelaEmDias) inicio++;

            janela.Clear();
            for (var j = inicio; j <= i; j++) janela.Add(dias[j].Salas);

            if (dias[i].Salas >= Limite * Mediana(janela)) consolidados.Add(dias[i].Data);
        }

        return consolidados;
    }

    /// <summary>
    /// Semana: os 7 dias consolidados (ADR 0004). Mês, trimestre, semestre e ano: a série publicada cobre o período
    /// inteiro, do início ao fim, e o fim não passa do último dia consolidado (ADR 0005). Dias parciais no meio de um
    /// período de calendário são fechamentos reais (Natal, Ano-Novo, pandemia), não dado atrasado; com a regra da
    /// semana nenhum dezembro e nenhum ano seriam completos.
    /// </summary>
    public static bool PeriodoCompleto(Periodo periodo, int diasConsolidados, DateOnly primeiroDiaComDados, DateOnly ultimoConsolidado) =>
        periodo.Granularidade == Granularidade.Semana
            ? diasConsolidados == 7
            : periodo.Inicio >= primeiroDiaComDados && periodo.Fim <= ultimoConsolidado;

    /// <summary>Mesma definição do percentile_cont(0.5) do PostgreSQL: média dos dois centrais em quantidade par.</summary>
    internal static double Mediana(List<int> valores)
    {
        valores.Sort();
        var meio = valores.Count / 2;
        return valores.Count % 2 == 1 ? valores[meio] : (valores[meio - 1] + valores[meio]) / 2.0;
    }
}
