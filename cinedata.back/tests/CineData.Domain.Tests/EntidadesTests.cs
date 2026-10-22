using CineData.Domain.Bilheteria;
using CineData.Domain.Common;
using CineData.Domain.Lancamentos;
using CineData.Domain.Obras;

namespace CineData.Domain.Tests;

public class EntidadesTests
{
    private static readonly CodigoObra Nacional = CodigoObra.Criar("B2600281500000");

    [Fact]
    public void Obra_nacional_sem_titulo_no_brasil_usa_o_original()
    {
        var obra = Obra.Criar(Nacional, "GALINHA PINTADINHA, O FILME", tituloBrasil: "  ", paisOrigem: "BRASIL");
        Assert.Equal("GALINHA PINTADINHA, O FILME", obra.Titulo);
        Assert.Null(obra.TituloBrasil);
    }

    [Fact]
    public void Obra_estrangeira_usa_o_titulo_no_brasil()
    {
        var obra = Obra.Criar(CodigoObra.Criar("E1402510400000"), "NOAH", "NOÉ", "ESTADOS UNIDOS");
        Assert.Equal("NOÉ", obra.Titulo);
        Assert.Equal(OrigemObra.Estrangeira, obra.Origem);
    }

    [Fact]
    public void Sessao_nao_aceita_publico_negativo() =>
        Assert.Throws<DomainException>(() =>
            Sessao.Criar(Nacional, 5002400, new DateOnly(2026, 10, 8), new DateTime(2026, 10, 8, 14, 0, 0), -1, TipoAudio.Original, false));

    [Fact]
    public void Ticket_medio_e_renda_sobre_publico()
    {
        var lancamento = Lancamento.Criar(Nacional, "ARCO", new DateOnly(2026, 12, 19), "ANIMAÇÃO", "FRANCA",
            4078, 65_671.62m, "RJ DISTRIBUIDORA", "00.146.442/0001-40");
        Assert.Equal(16.10m, lancamento.TicketMedio);
    }

    [Theory]
    [InlineData("sp", Regiao.Sudeste)]
    [InlineData("AM", Regiao.Norte)]
    [InlineData("DF", Regiao.CentroOeste)]
    public void Uf_conhece_sua_regiao(string sigla, Regiao regiao) => Assert.Equal(regiao, Uf.Criar(sigla).Regiao);

    [Fact]
    public void Uf_invalida_e_rejeitada() => Assert.False(Uf.TryCriar("XX", out _));
}
