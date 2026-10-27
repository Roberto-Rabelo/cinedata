using System.Globalization;
using System.Text;

namespace CineData.Application.Posteres;

/// <summary>Obra do site que precisa de pôster.</summary>
/// <param name="AnoReferencia">Ano do lançamento no Brasil (consolidado da ANCINE) ou, sem ele, da semana de maior público.
/// Não é a primeira sessão: a base tem sessões isoladas fora de época (Os Últimos Jedi, de 2017, com uma em 2015).</param>
public sealed record ObraParaPoster(string Codigo, string TituloOriginal, string? TituloBrasil, int AnoReferencia);

/// <summary>Filme devolvido pela busca do TMDB.</summary>
/// <param name="Titulo">Título em português (busca com language=pt-BR).</param>
/// <param name="Poster">Caminho do pôster no TMDB ("/abc.jpg"), em português quando houver.</param>
/// <param name="Votos">Avaliações no TMDB: mede se o filme é conhecido (relançamentos são clássicos).</param>
public sealed record CandidatoTmdb(int Id, string Titulo, string TituloOriginal, int? Ano, string? Poster, double Popularidade, int Votos = 0);

/// <summary>
/// Escolhe o filme do TMDB que corresponde a uma obra da ANCINE. Título parecido não basta ("Ainda Estou Aqui" também é o
/// nome no Brasil de um filme americano de 2022): o título tem de bater (original ou em português, sem acento nem
/// pontuação) e o ano não pode ser depois da primeira sessão no Brasil. Filmes antigos relançados (Carros, de 2006, nos
/// cinemas em 2026) passam se o título original bater exatamente e o filme for conhecido no TMDB: um "Parasite" de 1982
/// com 89 votos não é o Parasita de 2019.
/// </summary>
public static class CorrespondenciaTmdb
{
    public const double PontuacaoMinima = 3;
    public const int VotosMinimosRelancamento = 300;

    public static CandidatoTmdb? Escolher(ObraParaPoster obra, IEnumerable<CandidatoTmdb> candidatos) =>
        candidatos
            .Select(c => (Candidato: c, Pontos: Pontuar(obra, c)))
            .Where(c => c.Pontos >= PontuacaoMinima)
            .OrderByDescending(c => c.Pontos)
            .ThenByDescending(c => c.Candidato.Popularidade)
            .Select(c => c.Candidato)
            .FirstOrDefault();

    public static double Pontuar(ObraParaPoster obra, CandidatoTmdb candidato)
    {
        var original = Normalizar(obra.TituloOriginal);
        var brasil = string.IsNullOrWhiteSpace(obra.TituloBrasil) ? null : Normalizar(obra.TituloBrasil);
        var tmdbOriginal = Normalizar(candidato.TituloOriginal);
        var tmdbTitulo = Normalizar(candidato.Titulo);

        double titulo;
        if (tmdbOriginal == original) titulo = 3;
        else if (tmdbTitulo == original || (brasil is not null && (tmdbTitulo == brasil || tmdbOriginal == brasil))) titulo = 2;
        else if (Principal(candidato.TituloOriginal) == Principal(obra.TituloOriginal)
                 || Principal(candidato.Titulo) == Principal(obra.TituloBrasil ?? obra.TituloOriginal)) titulo = 1;
        else return 0;

        if (candidato.Ano is not { } ano) return titulo;
        var diferenca = obra.AnoReferencia - ano;
        return diferenca switch
        {
            < -1 => 0,                     // lançado depois de passar no Brasil: outro filme
            >= -1 and <= 1 => titulo + 2,  // o mesmo ano (a estreia no Brasil pode cair no ano seguinte)
            <= 3 => titulo == 3 ? titulo + 1 : 0, // estreou em festival anos antes do circuito (comum no nacional)
            _ => titulo == 3 && candidato.Votos >= VotosMinimosRelancamento ? titulo + 0.5 : 0, // relançamento de clássico
        };
    }

    /// <summary>
    /// "VINGADORES: ULTIMATO" e "Vingadores - Ultimato" viram "vingadores ultimato"; "VICTORIA AND ABDUL" e
    /// "Victoria &amp; Abdul" viram "victoria abdul" (a conjunção cai).
    /// </summary>
    public static string Normalizar(string texto)
    {
        var semAcento = new StringBuilder();
        foreach (var c in texto.Normalize(NormalizationForm.FormD))
        {
            var categoria = CharUnicodeInfo.GetUnicodeCategory(c);
            if (categoria == UnicodeCategory.NonSpacingMark) continue;
            semAcento.Append(char.IsLetterOrDigit(c) ? char.ToLowerInvariant(c) : ' ');
        }
        return string.Join(' ', semAcento.ToString().Split(' ', StringSplitOptions.RemoveEmptyEntries).Where(p => p is not ("and" or "e")));
    }

    /// <summary>O título sem o subtítulo: "MISSÃO: IMPOSSÍVEL - ACERTO DE CONTAS" vira "missao".</summary>
    private static string Principal(string? texto) =>
        texto is null ? "" : Normalizar(texto.Split([':', '–', '—']).First().Split(" - ").First());
}
