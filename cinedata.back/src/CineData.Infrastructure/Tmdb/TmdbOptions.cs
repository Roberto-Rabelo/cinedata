namespace CineData.Infrastructure.Tmdb;

public sealed class TmdbOptions
{
    public const string Secao = "Tmdb";

    public Uri BaseUrl { get; set; } = new("https://api.themoviedb.org/3/");

    /// <summary>Token de leitura (API v4). Fora do repositório: <c>dotnet user-secrets set Tmdb:Token …</c> ou a variável Tmdb__Token.</summary>
    public string? Token { get; set; }
}
