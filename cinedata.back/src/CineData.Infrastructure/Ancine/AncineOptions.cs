namespace CineData.Infrastructure.Ancine;

public sealed class AncineOptions
{
    public const string Secao = "Ancine";

    public Uri BaseUrl { get; set; } = new("https://dados.ancine.gov.br/dados-abertos/");
    public string ArquivoBilheteria { get; set; } = "bilheteria-diaria-obras-por-exibidoras-csv.zip";
    public string ArquivoLancamentos { get; set; } = "lancamentos-comerciais-por-distribuidoras.csv";
    public string ArquivoSalas { get; set; } = "salas-de-exibicao-e-complexos.csv";
}
