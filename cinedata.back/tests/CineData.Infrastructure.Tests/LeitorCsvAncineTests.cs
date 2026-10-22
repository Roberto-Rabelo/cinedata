using System.Text;
using CineData.Domain.Bilheteria;
using CineData.Infrastructure.Csv;

namespace CineData.Infrastructure.Tests;

public class LeitorCsvAncineTests
{
    // Linha real do arquivo bilheteria-diaria-obras-por-exibidoras-2026-10-s02.csv.
    private const string Bilheteria = """
        DATA_EXIBICAO;SESSAO;TITULO_ORIGINAL;TITULO_BRASIL;CPB_ROE;AUDIO;LEGENDADA;PAIS_OBRA;REGISTRO_SALA;NOME_SALA;PUBLICO;REGISTRO_GRUPO_EXIBIDOR;REGISTRO_EXIBIDOR;REGISTRO_COMPLEXO;MUNICIPIO_SALA_COMPLEXO;UF_SALA_COMPLEXO;RAZAO_SOCIAL_EXIBIDORA;CNPJ_EXIBIDORA
        08/10/2026;08/10/2026 08:00:00;GALINHA PINTADINHA, O FILME;;B2600281500000;ORIGINAL;NÃO;BRASIL;5002400;CINEVIP RONDON PLAZA SHOPPING SALA 01;117;;14781;14782;RONDONÓPOLIS;MT;GIOVANNI ZEM RODRIGUES;10.443.079/0001-89
        """;

    [Fact]
    public async Task Le_linha_de_bilheteria_com_tipos_corretos()
    {
        var linhas = await Ler(new LeitorCsvAncine().LerBilheteriaAsync(Stream(Bilheteria), default));

        var l = Assert.Single(linhas);
        Assert.Equal(new DateOnly(2026, 10, 8), l.DataExibicao);
        Assert.Equal(new DateTime(2026, 10, 8, 8, 0, 0), l.InicioSessao);
        Assert.Equal("GALINHA PINTADINHA, O FILME", l.TituloOriginal);
        Assert.Equal(TipoAudio.Original, l.Audio);
        Assert.False(l.Legendada);
        Assert.Equal(117, l.Publico);
        Assert.Null(l.RegistroGrupoExibidor);
        Assert.Equal("RONDONÓPOLIS", l.Municipio);
    }

    [Theory]
    [InlineData("R$ 65.671,62", 65671.62)]
    [InlineData("R$ 0,00", 0)]
    [InlineData("1.234.567,89", 1234567.89)]
    public void Converte_moeda_brasileira(string texto, double esperado) =>
        Assert.Equal((decimal)esperado, LeitorCsvAncine.Moeda(texto));

    [Theory]
    [InlineData("31/02/2026")]
    [InlineData("2026-10-08")]
    [InlineData("")]
    public void Data_invalida_vira_nulo(string texto) => Assert.Null(LeitorCsvAncine.Data(texto));

    private static MemoryStream Stream(string texto) => new(Encoding.UTF8.GetBytes(texto));

    private static async Task<List<T>> Ler<T>(IAsyncEnumerable<T> itens)
    {
        var lista = new List<T>();
        await foreach (var item in itens) lista.Add(item);
        return lista;
    }
}
