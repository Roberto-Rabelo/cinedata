using CineData.Application.Posteres;
using Microsoft.Extensions.Logging.Abstractions;

namespace CineData.Application.Tests;

public class PosteresTests
{
    private static CandidatoTmdb C(int id, string titulo, string original, int? ano, double popularidade = 1, int votos = 1000) =>
        new(id, titulo, original, ano, $"/{id}.jpg", popularidade, votos);

    [Fact]
    public void Titulo_igual_no_Brasil_nao_basta_o_original_e_o_ano_decidem()
    {
        var obra = new ObraParaPoster("B2400324700000", "AINDA ESTOU AQUI", null, 2024);
        var candidatos = new[]
        {
            C(818750, "Ainda Estou Aqui", "The In Between", 2022, popularidade: 30), // outro filme, mais popular
            C(1000837, "Ainda Estou Aqui", "Ainda Estou Aqui", 2024),
            C(43939, "Eu Ainda Estou Aqui", "I'm Still Here", 2010),
        };

        Assert.Equal(1000837, CorrespondenciaTmdb.Escolher(obra, candidatos)?.Id);
    }

    [Fact]
    public void Titulo_original_em_caixa_alta_e_com_pontuacao_bate_com_o_do_TMDB()
    {
        var obra = new ObraParaPoster("E1900107800000", "AVENGERS: ENDGAME", "VINGADORES: ULTIMATO", 2019);

        Assert.Equal(299534, CorrespondenciaTmdb.Escolher(obra, [C(299534, "Vingadores: Ultimato", "Avengers: Endgame", 2019)])?.Id);
    }

    [Fact]
    public void Relancamento_de_filme_antigo_passa_so_com_o_titulo_original_exato()
    {
        var carros = new ObraParaPoster("E1500588000000", "CARS", "CARROS", 2026);

        Assert.Equal(920, CorrespondenciaTmdb.Escolher(carros, [C(920, "Carros", "Cars", 2006)])?.Id);
        Assert.Null(CorrespondenciaTmdb.Escolher(carros, [C(1, "Carros: A Origem", "Cars Begin", 2006)]));
    }

    [Fact]
    public void Homonimo_antigo_e_pouco_conhecido_nao_vence_o_filme_certo_achado_pelo_titulo_no_Brasil()
    {
        var parasita = new ObraParaPoster("E1900", "PARASITE", "PARASITA", 2019);
        var candidatos = new[] { C(48311, "Parasita", "Parasite", 1982, votos: 89), C(496243, "Parasita", "기생충", 2019, votos: 21585) };

        Assert.Equal(496243, CorrespondenciaTmdb.Escolher(parasita, candidatos)?.Id);
        Assert.Null(CorrespondenciaTmdb.Escolher(parasita, [candidatos[0]]));
    }

    [Fact]
    public void Filme_de_festival_lancado_no_circuito_anos_depois_passa_pelo_titulo_original() =>
        Assert.Equal(7, CorrespondenciaTmdb.Escolher(new ObraParaPoster("B1", "VAGA CARNE", null, 2021), [C(7, "Vaga Carne", "Vaga Carne", 2019, votos: 3)])?.Id);

    [Fact]
    public void E_comercial_e_conjuncao_nao_atrapalham() =>
        Assert.Equal(423899, CorrespondenciaTmdb.Escolher(
            new ObraParaPoster("E1700346900000", "VICTORIA AND ABDUL", "VICTORIA E ABDUL - O CONFIDENTE DA RAINHA", 2017),
            [C(423899, "O Confidente da Rainha", "Victoria & Abdul", 2017)])?.Id);

    [Fact]
    public void Filme_lancado_depois_de_passar_no_Brasil_e_outro_filme()
    {
        var obra = new ObraParaPoster("E1700363900000", "IT", "IT: A COISA", 2017);

        Assert.Equal(346364, CorrespondenciaTmdb.Escolher(obra, [C(474350, "It: Capítulo Dois", "It Chapter Two", 2019), C(346364, "It: A Coisa", "It", 2017)])?.Id);
        Assert.Null(CorrespondenciaTmdb.Escolher(obra, [C(474350, "It", "It", 2019)]));
    }

    [Fact]
    public void Sem_titulo_parecido_nao_ha_correspondencia() =>
        Assert.Null(CorrespondenciaTmdb.Escolher(new ObraParaPoster("B1", "O RASTRO", null, 2017), [C(1, "A Trilha", "The Trail", 2017)]));

    [Fact]
    public async Task Busca_pelo_titulo_original_e_pelo_titulo_no_Brasil_e_grava_quem_ficou_sem()
    {
        var catalogo = new CatalogoFalso
        {
            ["INSIDE OUT 2"] = [C(1, "Inside Out 2: Bastidores", "Inside Out 2: Behind the Scenes", 2025)],
            ["DIVERTIDA MENTE 2"] = [C(1022789, "Divertida Mente 2", "Inside Out 2", 2024)],
            ["FILME SEM PAR"] = [],
        };
        var repositorio = new RepositorioFalso
        {
            Pendentes =
            [
                new ObraParaPoster("E2400179900000", "INSIDE OUT 2", "DIVERTIDA MENTE 2", 2024),
                new ObraParaPoster("B9", "FILME SEM PAR", null, 2020),
            ],
        };

        var resultado = await new EnriquecerPosteres(catalogo, repositorio, TimeProvider.System, NullLogger<EnriquecerPosteres>.Instance)
            .ExecutarAsync(new EnriquecerPosteresComando(new DateOnly(2016, 8, 1)), default);

        Assert.Equal((2, 1, 1), (resultado.Consultadas, resultado.ComPoster, resultado.SemCorrespondencia));
        Assert.Equal(1022789, repositorio.Salvos.Single(p => p.Codigo == "E2400179900000").TmdbId);
        Assert.Null(repositorio.Salvos.Single(p => p.Codigo == "B9").TmdbId);
        Assert.Equal(["DIVERTIDA MENTE 2", "FILME SEM PAR", "INSIDE OUT 2"], catalogo.Termos.Order(StringComparer.Ordinal));
    }

    private sealed class CatalogoFalso : Dictionary<string, CandidatoTmdb[]>, ICatalogoTmdb
    {
        public List<string> Termos { get; } = [];

        public Task<IReadOnlyList<CandidatoTmdb>> BuscarAsync(string termo, CancellationToken ct)
        {
            lock (Termos) Termos.Add(termo);
            return Task.FromResult<IReadOnlyList<CandidatoTmdb>>(this[termo]);
        }

        public Task<CandidatoTmdb?> ObterAsync(int id, CancellationToken ct) =>
            Task.FromResult(Values.SelectMany(v => v).FirstOrDefault(c => c.Id == id));
    }

    private sealed class RepositorioFalso : IRepositorioPosteres
    {
        public IReadOnlyList<ObraParaPoster> Pendentes { get; init; } = [];
        public List<PosterObra> Salvos { get; } = [];

        public Task<IReadOnlyList<ObraParaPoster>> ObterPendentesAsync(DateOnly desde, DateTimeOffset reconsultarAntesDe, CancellationToken ct) =>
            Task.FromResult(Pendentes);

        public Task SalvarAsync(IReadOnlyCollection<PosterObra> posteres, DateTimeOffset consultadoEm, CancellationToken ct)
        {
            Salvos.AddRange(posteres);
            return Task.CompletedTask;
        }

        public Task DefinirManualAsync(PosterObra poster, DateTimeOffset em, CancellationToken ct)
        {
            Salvos.Add(poster);
            return Task.CompletedTask;
        }
    }
}
