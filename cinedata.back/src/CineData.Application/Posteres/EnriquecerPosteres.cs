using System.Collections.Concurrent;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace CineData.Application.Posteres;

/// <summary>Busca no catálogo do TMDB (filmes, em português).</summary>
public interface ICatalogoTmdb
{
    Task<IReadOnlyList<CandidatoTmdb>> BuscarAsync(string termo, CancellationToken ct);
    Task<CandidatoTmdb?> ObterAsync(int id, CancellationToken ct);
}

/// <param name="TmdbId">Nulo quando nenhum candidato passou na correspondência (a obra é consultada de novo depois).</param>
public sealed record PosterObra(string Codigo, int? TmdbId, string? Poster, string? TituloTmdb, int? AnoTmdb);

public interface IRepositorioPosteres
{
    /// <summary>
    /// Obras com página no site (top 10 de algum período ou líder de UF desde <paramref name="desde"/>) que ainda não
    /// têm correspondência, ou que ficaram sem pôster numa consulta anterior a <paramref name="reconsultarAntesDe"/>.
    /// Correções manuais nunca voltam.
    /// </summary>
    Task<IReadOnlyList<ObraParaPoster>> ObterPendentesAsync(DateOnly desde, DateTimeOffset reconsultarAntesDe, CancellationToken ct);

    Task SalvarAsync(IReadOnlyCollection<PosterObra> posteres, DateTimeOffset consultadoEm, CancellationToken ct);

    /// <summary>Correção à mão (cadastro ambíguo na ANCINE): grava e marca para a busca automática não mexer mais.</summary>
    Task DefinirManualAsync(PosterObra poster, DateTimeOffset em, CancellationToken ct);
}

/// <param name="Desde">Mesmo corte do export do site (ago/2016).</param>
/// <param name="ReconsultarAposDias">Obras sem correspondência voltam a ser buscadas depois desse prazo (o TMDB cresce).</param>
public sealed record EnriquecerPosteresComando(DateOnly Desde, int ReconsultarAposDias = 30, int Paralelismo = 4);

public sealed record ResultadoPosteres(int Consultadas, int ComPoster, int SemCorrespondencia, TimeSpan Duracao)
{
    public override string ToString() =>
        $"{Consultadas:N0} obras consultadas no TMDB: {ComPoster:N0} com pôster, {SemCorrespondencia:N0} sem correspondência ({Duracao.TotalSeconds:N0} s)";
}

/// <summary>
/// Liga as obras do site aos filmes do TMDB para mostrar o pôster. Incremental: só consulta quem ainda não tem
/// correspondência, então a carga semanal busca apenas os filmes novos nos rankings.
/// </summary>
public sealed class EnriquecerPosteres(ICatalogoTmdb catalogo, IRepositorioPosteres repositorio, TimeProvider relogio, ILogger<EnriquecerPosteres> logger)
{
    public async Task<ResultadoPosteres> ExecutarAsync(EnriquecerPosteresComando comando, CancellationToken ct)
    {
        var cronometro = Stopwatch.StartNew();
        var agora = relogio.GetUtcNow();
        var pendentes = await repositorio.ObterPendentesAsync(comando.Desde, agora.AddDays(-comando.ReconsultarAposDias), ct);
        logger.LogInformation("{Pendentes} obras sem pôster para buscar no TMDB", pendentes.Count);

        var resultados = new ConcurrentBag<PosterObra>();
        var opcoes = new ParallelOptions { MaxDegreeOfParallelism = comando.Paralelismo, CancellationToken = ct };
        await Parallel.ForEachAsync(pendentes, opcoes, async (obra, ctObra) =>
        {
            var escolhido = await BuscarAsync(obra, ctObra);
            resultados.Add(new PosterObra(obra.Codigo, escolhido?.Id, escolhido?.Poster, escolhido?.Titulo, escolhido?.Ano));
        });

        await repositorio.SalvarAsync(resultados.ToList(), agora, ct);
        var comPoster = resultados.Count(r => r.Poster is not null);
        return new ResultadoPosteres(resultados.Count, comPoster, resultados.Count(r => r.TmdbId is null), cronometro.Elapsed);
    }

    /// <summary>
    /// Corrige à mão a correspondência de uma obra: <paramref name="tmdbId"/> nulo deixa a obra sem pôster de vez
    /// (ex.: "HOMEM ARANHA" com código nacional e sessões de 2019 a 2022, sem como saber qual filme é).
    /// </summary>
    public async Task<PosterObra> DefinirAsync(string codigo, int? tmdbId, CancellationToken ct)
    {
        var filme = tmdbId is { } id
            ? await catalogo.ObterAsync(id, ct) ?? throw new InvalidOperationException($"Filme {id} não existe no TMDB.")
            : null;
        var poster = new PosterObra(codigo, filme?.Id, filme?.Poster, filme?.Titulo, filme?.Ano);
        await repositorio.DefinirManualAsync(poster, relogio.GetUtcNow(), ct);
        return poster;
    }

    /// <summary>
    /// Busca pelo título original e pelo título no Brasil e escolhe entre todos os resultados: o título original sozinho
    /// pode achar um homônimo antigo ("Parasite", 1982) e só a busca em português traz o filme certo (기생충, 2019).
    /// </summary>
    private async Task<CandidatoTmdb?> BuscarAsync(ObraParaPoster obra, CancellationToken ct)
    {
        var termos = new[] { obra.TituloOriginal, obra.TituloBrasil }
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase);
        var candidatos = new List<CandidatoTmdb>();
        foreach (var termo in termos) candidatos.AddRange(await catalogo.BuscarAsync(termo!, ct));
        return CorrespondenciaTmdb.Escolher(obra, candidatos.DistinctBy(c => c.Id));
    }
}
