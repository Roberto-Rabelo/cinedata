using CineData.Application.Abstractions;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;

namespace CineData.Infrastructure.Persistence.Repositorios;

internal sealed class RepositorioBilheteria(CineDataDbContext db) : IRepositorioBilheteria
{
    public async Task SalvarLoteAsync(LoteBilheteria lote, CancellationToken ct)
    {
        await using var transacao = await db.Database.BeginTransactionAsync(ct);

        if (db.Entry(lote.Arquivo).State == EntityState.Detached)
            db.ArquivosImportados.Add(lote.Arquivo);
        await db.SaveChangesAsync(ct);

        await Upserts.ObrasAsync(db, lote.Obras, ct);
        await Upserts.SalasAsync(db, lote.Salas, ct);

        // Recarga idempotente: um arquivo retificado substitui por completo o que ele trouxe antes.
        await db.Database.ExecuteSqlAsync($"DELETE FROM sessoes WHERE arquivo_id = {lote.Arquivo.Id}", ct);

        var conexao = (NpgsqlConnection)db.Database.GetDbConnection();
        await using (var copia = await conexao.BeginBinaryImportAsync("""
            COPY sessoes (codigo_obra, registro_sala, data_exibicao, inicio, publico, audio, legendada, arquivo_id)
            FROM STDIN (FORMAT BINARY)
            """, ct))
        {
            foreach (var s in lote.Sessoes)
            {
                await copia.StartRowAsync(ct);
                await copia.WriteAsync(s.CodigoObra.Valor, NpgsqlDbType.Varchar, ct);
                await copia.WriteAsync(s.RegistroSala, NpgsqlDbType.Integer, ct);
                await copia.WriteAsync(s.DataExibicao, NpgsqlDbType.Date, ct);
                await copia.WriteAsync(s.Inicio, NpgsqlDbType.Timestamp, ct);
                await copia.WriteAsync(s.Publico, NpgsqlDbType.Integer, ct);
                await copia.WriteAsync((short)s.Audio, NpgsqlDbType.Smallint, ct);
                await copia.WriteAsync(s.Legendada, NpgsqlDbType.Boolean, ct);
                await copia.WriteAsync(lote.Arquivo.Id, NpgsqlDbType.Integer, ct);
            }
            await copia.CompleteAsync(ct);
        }

        await transacao.CommitAsync(ct);
    }
}
