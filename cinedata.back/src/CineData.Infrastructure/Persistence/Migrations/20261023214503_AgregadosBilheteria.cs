using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CineData.Infrastructure.Persistence.Migrations
{
    /// <summary>
    /// Agregados de leitura (dia, semana, semana × obra, semana × UF) para o painel não varrer <c>sessoes</c>.
    /// São modelo de leitura, fora do modelo do EF: a função <c>atualizar_agregados_bilheteria</c> recalcula as
    /// semanas cinematográficas inteiras de um período e é chamada ao fim de cada carga (períodos de <c>agregado_pendente</c>)
    /// e após o cadastro de salas.
    /// </summary>
    public partial class AgregadosBilheteria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE agregado_dia (
                    data date PRIMARY KEY,
                    salas integer NOT NULL,
                    sessoes integer NOT NULL,
                    publico bigint NOT NULL
                );

                CREATE TABLE agregado_semana (
                    semana date PRIMARY KEY,
                    publico bigint NOT NULL,
                    sessoes integer NOT NULL,
                    obras integer NOT NULL,
                    salas integer NOT NULL,
                    municipios integer NOT NULL
                );

                CREATE TABLE agregado_semana_obra (
                    semana date NOT NULL,
                    codigo_obra character varying(14) NOT NULL,
                    publico bigint NOT NULL,
                    sessoes integer NOT NULL,
                    salas integer NOT NULL,
                    publico_com_assentos bigint NOT NULL,
                    assentos bigint NOT NULL,
                    publico_dublado bigint NOT NULL,
                    publico_original bigint NOT NULL,
                    PRIMARY KEY (semana, codigo_obra)
                );
                CREATE INDEX ix_agregado_semana_obra_codigo_obra ON agregado_semana_obra (codigo_obra);

                CREATE TABLE agregado_semana_uf (
                    semana date NOT NULL,
                    uf character(2) NOT NULL,
                    publico bigint NOT NULL,
                    sessoes integer NOT NULL,
                    publico_estrangeiro bigint NOT NULL,
                    publico_estrangeiro_dublado bigint NOT NULL,
                    lider_codigo character varying(14),
                    lider_publico bigint NOT NULL,
                    PRIMARY KEY (semana, uf)
                );

                -- Períodos gravados pela ingestão e ainda não recalculados (processados ao fim de cada carga).
                CREATE TABLE agregado_pendente (
                    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    inicio date NOT NULL,
                    fim date NOT NULL
                );

                -- Sem período: recalcula todo o histórico.
                CREATE FUNCTION atualizar_agregados_bilheteria(p_inicio date DEFAULT NULL, p_fim date DEFAULT NULL)
                RETURNS void LANGUAGE plpgsql SET work_mem = '256MB' AS $$
                DECLARE
                    v_inicio date := coalesce(p_inicio, (SELECT min(data_exibicao) FROM sessoes));
                    v_fim date := coalesce(p_fim, (SELECT max(data_exibicao) FROM sessoes));
                BEGIN
                    IF v_inicio IS NULL OR v_fim IS NULL THEN RETURN; END IF;

                    -- Sempre semanas cinematográficas inteiras: quinta (isodow 4) a quarta.
                    v_inicio := v_inicio - (extract(isodow FROM v_inicio)::int + 3) % 7;
                    v_fim := v_fim - (extract(isodow FROM v_fim)::int + 3) % 7 + 6;

                    DELETE FROM agregado_dia WHERE data BETWEEN v_inicio AND v_fim;
                    INSERT INTO agregado_dia (data, salas, sessoes, publico)
                    SELECT data_exibicao, count(DISTINCT registro_sala), count(*), sum(publico)
                    FROM sessoes
                    WHERE data_exibicao BETWEEN v_inicio AND v_fim
                    GROUP BY data_exibicao;

                    DELETE FROM agregado_semana WHERE semana BETWEEN v_inicio AND v_fim;
                    INSERT INTO agregado_semana (semana, publico, sessoes, obras, salas, municipios)
                    SELECT s.data_exibicao - (extract(isodow FROM s.data_exibicao)::int + 3) % 7,
                           sum(s.publico), count(*), count(DISTINCT s.codigo_obra), count(DISTINCT s.registro_sala),
                           count(DISTINCT (sa.uf, sa.municipio))
                    FROM sessoes s
                    JOIN salas sa ON sa.registro = s.registro_sala
                    WHERE s.data_exibicao BETWEEN v_inicio AND v_fim
                    GROUP BY 1;

                    DELETE FROM agregado_semana_obra WHERE semana BETWEEN v_inicio AND v_fim;
                    INSERT INTO agregado_semana_obra (semana, codigo_obra, publico, sessoes, salas,
                        publico_com_assentos, assentos, publico_dublado, publico_original)
                    SELECT s.data_exibicao - (extract(isodow FROM s.data_exibicao)::int + 3) % 7, s.codigo_obra,
                           sum(s.publico), count(*), count(DISTINCT s.registro_sala),
                           coalesce(sum(s.publico) FILTER (WHERE sa.assentos > 0), 0),
                           coalesce(sum(sa.assentos) FILTER (WHERE sa.assentos > 0), 0),
                           coalesce(sum(s.publico) FILTER (WHERE s.audio = 1), 0),
                           coalesce(sum(s.publico) FILTER (WHERE s.audio = 0), 0)
                    FROM sessoes s
                    JOIN salas sa ON sa.registro = s.registro_sala
                    WHERE s.data_exibicao BETWEEN v_inicio AND v_fim
                    GROUP BY 1, 2;

                    DELETE FROM agregado_semana_uf WHERE semana BETWEEN v_inicio AND v_fim;
                    WITH base AS (
                        SELECT s.data_exibicao - (extract(isodow FROM s.data_exibicao)::int + 3) % 7 AS semana,
                               sa.uf, s.codigo_obra, s.publico, s.audio
                        FROM sessoes s
                        JOIN salas sa ON sa.registro = s.registro_sala
                        WHERE s.data_exibicao BETWEEN v_inicio AND v_fim
                    ),
                    por_obra AS (
                        SELECT semana, uf, codigo_obra, sum(publico) AS publico, count(*) AS sessoes,
                               coalesce(sum(publico) FILTER (WHERE audio = 1), 0) AS dublado,
                               row_number() OVER (PARTITION BY semana, uf ORDER BY sum(publico) DESC, codigo_obra) AS posicao
                        FROM base
                        GROUP BY semana, uf, codigo_obra
                    )
                    INSERT INTO agregado_semana_uf (semana, uf, publico, sessoes, publico_estrangeiro,
                        publico_estrangeiro_dublado, lider_codigo, lider_publico)
                    SELECT semana, uf, sum(publico), sum(sessoes),
                           coalesce(sum(publico) FILTER (WHERE codigo_obra LIKE 'E%'), 0),
                           coalesce(sum(dublado) FILTER (WHERE codigo_obra LIKE 'E%'), 0),
                           max(codigo_obra) FILTER (WHERE posicao = 1),
                           coalesce(max(publico) FILTER (WHERE posicao = 1), 0)
                    FROM por_obra
                    GROUP BY semana, uf;
                END
                $$;

                SELECT atualizar_agregados_bilheteria();
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP FUNCTION atualizar_agregados_bilheteria(date, date);
                DROP TABLE agregado_pendente;
                DROP TABLE agregado_semana_uf;
                DROP TABLE agregado_semana_obra;
                DROP TABLE agregado_semana;
                DROP TABLE agregado_dia;
                """);
        }
    }
}
