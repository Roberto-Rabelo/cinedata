using CineData.Domain.Common;
using CineData.Domain.Obras;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CineData.Infrastructure.Persistence.Configuracoes;

internal static class Conversores
{
    public static readonly ValueConverter<CodigoObra, string> CodigoObra =
        new(c => c.Valor, v => Domain.Obras.CodigoObra.Criar(v));

    public static readonly ValueConverter<Uf, string> Uf =
        new(u => u.Sigla, v => Domain.Common.Uf.Criar(v));
}
