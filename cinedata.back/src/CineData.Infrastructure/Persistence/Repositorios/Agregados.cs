using Microsoft.EntityFrameworkCore;

namespace CineData.Infrastructure.Persistence.Repositorios;

/// <summary>
/// Mantém em dia os agregados de leitura (<c>agregado_*</c>, migration AgregadosBilheteria) usados pelo painel.
/// A função do banco recalcula as semanas cinematográficas inteiras que contêm o período.
/// </summary>
internal static class Agregados
{
    internal sealed record Periodo(DateOnly? Inicio, DateOnly? Fim);

    /// <summary>
    /// Registra datas a recalcular na mesma transação do arquivo; o recálculo roda uma vez ao fim da carga
    /// (na carga do histórico, um em vez de 661).
    /// </summary>
    public static Task MarcarPendenteAsync(CineDataDbContext db, DateOnly inicio, DateOnly fim, CancellationToken ct) =>
        db.Database.ExecuteSqlAsync($"INSERT INTO agregado_pendente (inicio, fim) VALUES ({inicio}, {fim})", ct);

    /// <summary>Junta os períodos pendentes que se sobrepõem (ou distam menos de uma semana) e recalcula cada bloco.</summary>
    public static async Task AtualizarPendentesAsync(CineDataDbContext db, CancellationToken ct)
    {
        var pendentes = await db.Database
            .SqlQuery<Periodo>($"DELETE FROM agregado_pendente RETURNING inicio, fim")
            .ToListAsync(ct);

        foreach (var (inicio, fim) in Juntar(pendentes.Select(p => (p.Inicio!.Value, p.Fim!.Value))))
            await AtualizarAsync(db, inicio, fim, ct);
    }

    /// <summary>Sem período, recalcula o histórico inteiro (~2 min): usado quando muda o cadastro de salas.</summary>
    public static async Task AtualizarAsync(CineDataDbContext db, DateOnly? inicio, DateOnly? fim, CancellationToken ct)
    {
        var timeout = db.Database.GetCommandTimeout();
        db.Database.SetCommandTimeout(TimeSpan.FromMinutes(30));
        try
        {
            await db.Database.ExecuteSqlAsync($"SELECT atualizar_agregados_bilheteria({inicio}::date, {fim}::date)", ct);
        }
        finally
        {
            db.Database.SetCommandTimeout(timeout);
        }
    }

    internal static IEnumerable<(DateOnly Inicio, DateOnly Fim)> Juntar(IEnumerable<(DateOnly Inicio, DateOnly Fim)> periodos)
    {
        (DateOnly Inicio, DateOnly Fim)? atual = null;
        foreach (var p in periodos.OrderBy(p => p.Inicio))
        {
            if (atual is { } a && p.Inicio.DayNumber <= a.Fim.DayNumber + 7)
            {
                atual = (a.Inicio, p.Fim > a.Fim ? p.Fim : a.Fim);
                continue;
            }

            if (atual is { } pronto) yield return pronto;
            atual = p;
        }

        if (atual is { } ultimo) yield return ultimo;
    }
}
