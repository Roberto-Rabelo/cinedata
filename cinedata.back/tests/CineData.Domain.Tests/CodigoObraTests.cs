using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Domain.Tests;

public class CodigoObraTests
{
    [Theory]
    [InlineData("B2600281500000", OrigemObra.Nacional)]
    [InlineData("E1402510400000", OrigemObra.Estrangeira)]
    [InlineData("G0000000000001", OrigemObra.Generica)]
    [InlineData(" e1402510400000 ", OrigemObra.Estrangeira)]
    public void Prefixo_define_a_origem(string valor, OrigemObra esperada)
    {
        Assert.True(CodigoObra.TryCriar(valor, out var codigo));
        Assert.Equal(esperada, codigo.Origem);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("X2600281500000")]
    [InlineData("B26002815")]
    [InlineData("B260028150000A")]
    public void Rejeita_formatos_invalidos(string? valor)
    {
        Assert.False(CodigoObra.TryCriar(valor, out _));
        Assert.Throws<DomainException>(() => CodigoObra.Criar(valor ?? string.Empty));
    }
}
