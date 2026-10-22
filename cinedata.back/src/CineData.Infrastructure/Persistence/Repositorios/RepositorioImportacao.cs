using CineData.Application.Abstractions;
using CineData.Domain.Importacao;
using Microsoft.EntityFrameworkCore;

namespace CineData.Infrastructure.Persistence.Repositorios;

internal sealed class RepositorioImportacao(CineDataDbContext db) : IRepositorioImportacao
{
    public async Task<IReadOnlyDictionary<string, ArquivoImportado>> ObterPorFonteAsync(FonteDados fonte, CancellationToken ct) =>
        await db.ArquivosImportados.Where(a => a.Fonte == fonte).ToDictionaryAsync(a => a.Nome, StringComparer.Ordinal, ct);
}
