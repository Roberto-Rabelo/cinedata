using CineData.Application.Abstractions;
using CineData.Domain.Lancamentos;
using CineData.Domain.Salas;
using Microsoft.EntityFrameworkCore;

namespace CineData.Infrastructure.Persistence.Repositorios;

internal sealed class RepositorioCadastros(CineDataDbContext db) : IRepositorioCadastros
{
    public async Task SubstituirLancamentosAsync(IReadOnlyCollection<Lancamento> lancamentos, CancellationToken ct)
    {
        await using var transacao = await db.Database.BeginTransactionAsync(ct);
        await db.Lancamentos.ExecuteDeleteAsync(ct);
        db.Lancamentos.AddRange(lancamentos);
        await db.SaveChangesAsync(ct);
        await transacao.CommitAsync(ct);
        db.ChangeTracker.Clear();
    }

    /// <summary>UF, município e capacidade entram nos agregados de todo o histórico: recalcula tudo.</summary>
    public async Task AtualizarSalasAsync(IReadOnlyCollection<Sala> salas, CancellationToken ct)
    {
        await Upserts.SalasAsync(db, salas, ct);
        await Agregados.AtualizarAsync(db, null, null, ct);
    }
}
