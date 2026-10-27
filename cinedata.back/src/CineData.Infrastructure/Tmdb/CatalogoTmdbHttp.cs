using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using CineData.Application.Posteres;
using Microsoft.Extensions.Options;

namespace CineData.Infrastructure.Tmdb;

/// <summary>Busca de filmes no TMDB em português (título e pôster em pt-BR quando houver).</summary>
internal sealed class CatalogoTmdbHttp(HttpClient http, IOptions<TmdbOptions> opcoes) : ICatalogoTmdb
{
    public async Task<IReadOnlyList<CandidatoTmdb>> BuscarAsync(string termo, CancellationToken ct)
    {
        var busca = await ObterJsonAsync<Busca>($"search/movie?query={Uri.EscapeDataString(termo)}&language=pt-BR&include_adult=false", ct);
        return (busca?.Results ?? []).Select(Candidato).ToList();
    }

    public async Task<CandidatoTmdb?> ObterAsync(int id, CancellationToken ct)
    {
        var filme = await ObterJsonAsync<Resultado>($"movie/{id}?language=pt-BR", ct);
        return filme is null ? null : Candidato(filme);
    }

    private async Task<T?> ObterJsonAsync<T>(string caminho, CancellationToken ct)
    {
        var token = opcoes.Value.Token;
        if (string.IsNullOrWhiteSpace(token))
            throw new InvalidOperationException("Token do TMDB não configurado: dotnet user-secrets set Tmdb:Token <token> --project src/CineData.Ingestion");

        using var pedido = new HttpRequestMessage(HttpMethod.Get, new Uri(opcoes.Value.BaseUrl, caminho));
        pedido.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        using var resposta = await http.SendAsync(pedido, ct);
        if (resposta.StatusCode == System.Net.HttpStatusCode.NotFound) return default;
        resposta.EnsureSuccessStatusCode();
        return await resposta.Content.ReadFromJsonAsync<T>(ct);
    }

    private static CandidatoTmdb Candidato(Resultado r) =>
        new(r.Id, r.Title ?? "", r.OriginalTitle ?? "", Ano(r.ReleaseDate), r.PosterPath, r.Popularity, r.VoteCount);

    private static int? Ano(string? data) =>
        DateOnly.TryParseExact(data, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d) ? d.Year : null;

    private sealed record Busca([property: JsonPropertyName("results")] IReadOnlyList<Resultado>? Results);

    private sealed record Resultado(
        [property: JsonPropertyName("id")] int Id,
        [property: JsonPropertyName("title")] string? Title,
        [property: JsonPropertyName("original_title")] string? OriginalTitle,
        [property: JsonPropertyName("release_date")] string? ReleaseDate,
        [property: JsonPropertyName("poster_path")] string? PosterPath,
        [property: JsonPropertyName("popularity")] double Popularity,
        [property: JsonPropertyName("vote_count")] int VoteCount);
}
