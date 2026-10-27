using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CineData.Infrastructure.Persistence.Migrations
{
    /// <summary>
    /// Correspondência entre obras da ANCINE e filmes do TMDB (pôster no site). Fora do modelo do EF, como os agregados:
    /// é gravada pelo comando <c>posteres</c> da CLI e lida pelo SQL de consultas. Só aditiva: nenhuma tabela existente muda.
    /// </summary>
    public partial class ObrasTmdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE obras_tmdb (
                    codigo_obra varchar(14) PRIMARY KEY REFERENCES obras (codigo),
                    tmdb_id integer,           -- nulo: nenhum filme do TMDB passou na correspondência
                    poster text,               -- caminho no TMDB ("/abc.jpg"), em português quando houver
                    titulo_tmdb text,
                    ano_tmdb integer,
                    manual boolean NOT NULL DEFAULT false, -- corrigido à mão: a busca automática não sobrescreve
                    consultado_em timestamptz NOT NULL
                );
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE obras_tmdb;");
        }
    }
}
