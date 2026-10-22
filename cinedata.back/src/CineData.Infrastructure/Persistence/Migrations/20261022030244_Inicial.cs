using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CineData.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "arquivos_importados",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fonte = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    crc32 = table.Column<long>(type: "bigint", nullable: false),
                    tamanho = table.Column<long>(type: "bigint", nullable: false),
                    linhas = table.Column<int>(type: "integer", nullable: false),
                    linhas_rejeitadas = table.Column<int>(type: "integer", nullable: false),
                    importado_em = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_arquivos_importados", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "lancamentos",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    codigo_obra = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    titulo = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    data_lancamento = table.Column<DateOnly>(type: "date", nullable: false),
                    tipo_obra = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    pais_obra = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    publico_total = table.Column<long>(type: "bigint", nullable: false),
                    renda_total = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    distribuidora = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    cnpj_distribuidora = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lancamentos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "obras",
                columns: table => new
                {
                    codigo = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    titulo_original = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    titulo_brasil = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    pais = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_obras", x => x.codigo);
                });

            migrationBuilder.CreateTable(
                name: "salas",
                columns: table => new
                {
                    registro = table.Column<int>(type: "integer", nullable: false),
                    nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    registro_complexo = table.Column<int>(type: "integer", nullable: false),
                    municipio = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    uf = table.Column<string>(type: "character(2)", fixedLength: true, maxLength: 2, nullable: false),
                    exibidor_registro = table.Column<int>(type: "integer", nullable: false),
                    exibidor_razao_social = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    exibidor_cnpj = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    exibidor_registro_grupo = table.Column<int>(type: "integer", nullable: true),
                    assentos = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_salas", x => x.registro);
                });

            migrationBuilder.CreateTable(
                name: "sessoes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    codigo_obra = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    registro_sala = table.Column<int>(type: "integer", nullable: false),
                    data_exibicao = table.Column<DateOnly>(type: "date", nullable: false),
                    inicio = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    publico = table.Column<int>(type: "integer", nullable: false),
                    audio = table.Column<short>(type: "smallint", nullable: false),
                    legendada = table.Column<bool>(type: "boolean", nullable: false),
                    arquivo_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sessoes", x => x.id);
                    table.ForeignKey(
                        name: "fk_sessoes_arquivos_importados_arquivo_id",
                        column: x => x.arquivo_id,
                        principalTable: "arquivos_importados",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sessoes_obras_codigo_obra",
                        column: x => x.codigo_obra,
                        principalTable: "obras",
                        principalColumn: "codigo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sessoes_salas_registro_sala",
                        column: x => x.registro_sala,
                        principalTable: "salas",
                        principalColumn: "registro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_arquivos_importados_fonte_nome",
                table: "arquivos_importados",
                columns: new[] { "fonte", "nome" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_lancamentos_codigo_obra",
                table: "lancamentos",
                column: "codigo_obra");

            migrationBuilder.CreateIndex(
                name: "ix_salas_uf",
                table: "salas",
                column: "uf");

            migrationBuilder.CreateIndex(
                name: "ix_sessoes_arquivo_id",
                table: "sessoes",
                column: "arquivo_id");

            migrationBuilder.CreateIndex(
                name: "ix_sessoes_codigo_obra_data_exibicao",
                table: "sessoes",
                columns: new[] { "codigo_obra", "data_exibicao" });

            migrationBuilder.CreateIndex(
                name: "ix_sessoes_data_exibicao",
                table: "sessoes",
                column: "data_exibicao");

            migrationBuilder.CreateIndex(
                name: "ix_sessoes_registro_sala",
                table: "sessoes",
                column: "registro_sala");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "lancamentos");

            migrationBuilder.DropTable(
                name: "sessoes");

            migrationBuilder.DropTable(
                name: "arquivos_importados");

            migrationBuilder.DropTable(
                name: "obras");

            migrationBuilder.DropTable(
                name: "salas");
        }
    }
}
