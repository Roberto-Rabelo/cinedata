using CineData.Domain.Obras;
using CineData.Domain.Salas;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace CineData.Infrastructure.Persistence.Repositorios;

/// <summary>
/// Upserts em lote via unnest(): um único comando para milhares de linhas,
/// em vez de um SELECT + INSERT/UPDATE por entidade no change tracker.
/// </summary>
internal static class Upserts
{
    public static Task ObrasAsync(CineDataDbContext db, IReadOnlyCollection<Obra> obras, CancellationToken ct) =>
        db.Database.ExecuteSqlRawAsync("""
            INSERT INTO obras (codigo, titulo_original, titulo_brasil, pais)
            SELECT * FROM unnest(@codigos, @titulos, @titulos_brasil, @paises)
            ON CONFLICT (codigo) DO UPDATE SET
                titulo_original = EXCLUDED.titulo_original,
                titulo_brasil = COALESCE(EXCLUDED.titulo_brasil, obras.titulo_brasil),
                pais = COALESCE(EXCLUDED.pais, obras.pais)
            """,
            [
                new NpgsqlParameter("codigos", obras.Select(o => o.Id.Valor).ToArray()),
                new NpgsqlParameter("titulos", obras.Select(o => o.TituloOriginal).ToArray()),
                new NpgsqlParameter("titulos_brasil", obras.Select(o => o.TituloBrasil).ToArray()),
                new NpgsqlParameter("paises", obras.Select(o => o.PaisOrigem).ToArray()),
            ],
            ct);

    /// <summary>A bilheteria não traz capacidade (assentos nulos); o COALESCE preserva o que veio do cadastro de salas.</summary>
    public static Task SalasAsync(CineDataDbContext db, IReadOnlyCollection<Sala> salas, CancellationToken ct) =>
        db.Database.ExecuteSqlRawAsync("""
            INSERT INTO salas (registro, nome, registro_complexo, municipio, uf, assentos,
                exibidor_registro, exibidor_razao_social, exibidor_cnpj, exibidor_registro_grupo)
            SELECT * FROM unnest(@registros, @nomes, @complexos, @municipios, @ufs, @assentos,
                @exibidores, @razoes, @cnpjs, @grupos)
            ON CONFLICT (registro) DO UPDATE SET
                nome = EXCLUDED.nome,
                registro_complexo = EXCLUDED.registro_complexo,
                municipio = EXCLUDED.municipio,
                uf = EXCLUDED.uf,
                assentos = COALESCE(EXCLUDED.assentos, salas.assentos),
                exibidor_registro = EXCLUDED.exibidor_registro,
                exibidor_razao_social = EXCLUDED.exibidor_razao_social,
                exibidor_cnpj = EXCLUDED.exibidor_cnpj,
                exibidor_registro_grupo = COALESCE(EXCLUDED.exibidor_registro_grupo, salas.exibidor_registro_grupo)
            """,
            [
                new NpgsqlParameter("registros", salas.Select(s => s.Id).ToArray()),
                new NpgsqlParameter("nomes", salas.Select(s => s.Nome).ToArray()),
                new NpgsqlParameter("complexos", salas.Select(s => s.RegistroComplexo).ToArray()),
                new NpgsqlParameter("municipios", salas.Select(s => s.Municipio).ToArray()),
                new NpgsqlParameter("ufs", salas.Select(s => s.Uf.Sigla).ToArray()),
                new NpgsqlParameter("assentos", salas.Select(s => s.Assentos).ToArray()),
                new NpgsqlParameter("exibidores", salas.Select(s => s.Exibidor.Registro).ToArray()),
                new NpgsqlParameter("razoes", salas.Select(s => s.Exibidor.RazaoSocial).ToArray()),
                new NpgsqlParameter("cnpjs", salas.Select(s => s.Exibidor.Cnpj).ToArray()),
                new NpgsqlParameter("grupos", salas.Select(s => s.Exibidor.RegistroGrupo).ToArray()),
            ],
            ct);
}
