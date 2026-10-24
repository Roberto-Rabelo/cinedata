using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CineData.Infrastructure.Persistence.Migrations
{
    /// <summary>
    /// Agregados de calendário (mês, trimestre, semestre, ano) recortados pela data de exibição, e views
    /// <c>agregado_periodo*</c> que os juntam aos semanais para o painel ler qualquer granularidade com o mesmo SQL.
    /// Salas, municípios e obras distintos não somam entre semanas nem entre meses, por isso cada período é recontado
    /// a partir de uma base mês × obra × sala (ADR 0005). A função antiga vira <c>atualizar_agregados_semana</c> e
    /// <c>atualizar_agregados_bilheteria</c> passa a chamar as duas: quem já a chamava (ingestão, cadastro de salas)
    /// mantém tudo em dia sem mudar.
    /// </summary>
    public partial class PeriodosCalendario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE agregado_calendario (
                    granularidade text NOT NULL CHECK (granularidade IN ('mes', 'trimestre', 'semestre', 'ano')),
                    inicio date NOT NULL,
                    publico bigint NOT NULL,
                    sessoes integer NOT NULL,
                    obras integer NOT NULL,
                    salas integer NOT NULL,
                    municipios integer NOT NULL,
                    PRIMARY KEY (granularidade, inicio)
                );

                CREATE TABLE agregado_calendario_obra (
                    granularidade text NOT NULL,
                    inicio date NOT NULL,
                    codigo_obra character varying(14) NOT NULL,
                    publico bigint NOT NULL,
                    sessoes integer NOT NULL,
                    salas integer NOT NULL,
                    publico_com_assentos bigint NOT NULL,
                    assentos bigint NOT NULL,
                    publico_dublado bigint NOT NULL,
                    publico_original bigint NOT NULL,
                    PRIMARY KEY (granularidade, inicio, codigo_obra)
                );

                CREATE TABLE agregado_calendario_uf (
                    granularidade text NOT NULL,
                    inicio date NOT NULL,
                    uf character(2) NOT NULL,
                    publico bigint NOT NULL,
                    sessoes integer NOT NULL,
                    publico_estrangeiro bigint NOT NULL,
                    publico_estrangeiro_dublado bigint NOT NULL,
                    lider_codigo character varying(14),
                    lider_publico bigint NOT NULL,
                    PRIMARY KEY (granularidade, inicio, uf)
                );

                -- Semana e calendário com a mesma forma. O filtro por granularidade descarta o outro ramo no plano.
                CREATE VIEW agregado_periodo AS
                    SELECT 'semana'::text AS granularidade, semana AS inicio, publico, sessoes, obras, salas, municipios
                    FROM agregado_semana
                    UNION ALL
                    SELECT granularidade, inicio, publico, sessoes, obras, salas, municipios
                    FROM agregado_calendario;

                CREATE VIEW agregado_periodo_obra AS
                    SELECT 'semana'::text AS granularidade, semana AS inicio, codigo_obra, publico, sessoes, salas,
                           publico_com_assentos, assentos, publico_dublado, publico_original
                    FROM agregado_semana_obra
                    UNION ALL
                    SELECT granularidade, inicio, codigo_obra, publico, sessoes, salas,
                           publico_com_assentos, assentos, publico_dublado, publico_original
                    FROM agregado_calendario_obra;

                CREATE VIEW agregado_periodo_uf AS
                    SELECT 'semana'::text AS granularidade, semana AS inicio, uf, publico, sessoes, publico_estrangeiro,
                           publico_estrangeiro_dublado, lider_codigo, lider_publico
                    FROM agregado_semana_uf
                    UNION ALL
                    SELECT granularidade, inicio, uf, publico, sessoes, publico_estrangeiro,
                           publico_estrangeiro_dublado, lider_codigo, lider_publico
                    FROM agregado_calendario_uf;

                -- Sem período: recalcula todo o histórico. Sempre anos inteiros, que contêm todos os outros recortes.
                CREATE FUNCTION atualizar_agregados_calendario(p_inicio date DEFAULT NULL, p_fim date DEFAULT NULL)
                RETURNS void LANGUAGE plpgsql SET work_mem = '256MB' AS $$
                DECLARE
                    v_inicio date := coalesce(p_inicio, (SELECT min(data_exibicao) FROM sessoes));
                    v_fim date := coalesce(p_fim, (SELECT max(data_exibicao) FROM sessoes));
                BEGIN
                    IF v_inicio IS NULL OR v_fim IS NULL THEN RETURN; END IF;

                    v_inicio := make_date(extract(year FROM v_inicio)::int, 1, 1);
                    v_fim := make_date(extract(year FROM v_fim)::int, 12, 31);

                    -- Base mês × obra × sala (~40 mil linhas por mês): público e sessões somam entre meses, e as
                    -- salas, obras e municípios distintos de um trimestre, semestre ou ano são recontados daqui.
                    DROP TABLE IF EXISTS pg_temp.calendario_base, pg_temp.calendario_periodo;
                    CREATE TEMP TABLE calendario_base ON COMMIT DROP AS
                    SELECT s.data_exibicao - extract(day FROM s.data_exibicao)::int + 1 AS mes,
                           s.codigo_obra, s.registro_sala,
                           sum(s.publico)::bigint AS publico, count(*)::int AS sessoes,
                           coalesce(sum(s.publico) FILTER (WHERE s.audio = 1), 0)::bigint AS publico_dublado,
                           coalesce(sum(s.publico) FILTER (WHERE s.audio = 0), 0)::bigint AS publico_original
                    FROM sessoes s
                    WHERE s.data_exibicao BETWEEN v_inicio AND v_fim
                    GROUP BY 1, 2, 3;

                    -- Cada mês pertence a um período de cada granularidade.
                    CREATE TEMP TABLE calendario_periodo ON COMMIT DROP AS
                    SELECT m.mes, p.granularidade, p.inicio
                    FROM (SELECT DISTINCT mes FROM calendario_base) m
                    CROSS JOIN LATERAL (VALUES
                        ('mes', m.mes),
                        ('trimestre', make_date(extract(year FROM m.mes)::int, (extract(month FROM m.mes)::int - 1) / 3 * 3 + 1, 1)),
                        ('semestre', make_date(extract(year FROM m.mes)::int, (extract(month FROM m.mes)::int - 1) / 6 * 6 + 1, 1)),
                        ('ano', make_date(extract(year FROM m.mes)::int, 1, 1))
                    ) p(granularidade, inicio);

                    ANALYZE calendario_base;
                    ANALYZE calendario_periodo;

                    DELETE FROM agregado_calendario WHERE inicio BETWEEN v_inicio AND v_fim;
                    INSERT INTO agregado_calendario (granularidade, inicio, publico, sessoes, obras, salas, municipios)
                    SELECT p.granularidade, p.inicio, sum(b.publico), sum(b.sessoes), count(DISTINCT b.codigo_obra),
                           count(DISTINCT b.registro_sala), count(DISTINCT (sa.uf, sa.municipio))
                    FROM calendario_base b
                    JOIN calendario_periodo p ON p.mes = b.mes
                    JOIN salas sa ON sa.registro = b.registro_sala
                    GROUP BY 1, 2;

                    DELETE FROM agregado_calendario_obra WHERE inicio BETWEEN v_inicio AND v_fim;
                    INSERT INTO agregado_calendario_obra (granularidade, inicio, codigo_obra, publico, sessoes, salas,
                        publico_com_assentos, assentos, publico_dublado, publico_original)
                    SELECT p.granularidade, p.inicio, b.codigo_obra, sum(b.publico), sum(b.sessoes),
                           count(DISTINCT b.registro_sala),
                           coalesce(sum(b.publico) FILTER (WHERE sa.assentos > 0), 0),
                           coalesce(sum(b.sessoes::bigint * sa.assentos) FILTER (WHERE sa.assentos > 0), 0),
                           sum(b.publico_dublado), sum(b.publico_original)
                    FROM calendario_base b
                    JOIN calendario_periodo p ON p.mes = b.mes
                    JOIN salas sa ON sa.registro = b.registro_sala
                    GROUP BY 1, 2, 3;

                    DELETE FROM agregado_calendario_uf WHERE inicio BETWEEN v_inicio AND v_fim;
                    WITH por_obra AS (
                        SELECT p.granularidade, p.inicio, sa.uf, b.codigo_obra,
                               sum(b.publico) AS publico, sum(b.sessoes) AS sessoes, sum(b.publico_dublado) AS dublado,
                               row_number() OVER (PARTITION BY p.granularidade, p.inicio, sa.uf
                                                  ORDER BY sum(b.publico) DESC, b.codigo_obra) AS posicao
                        FROM calendario_base b
                        JOIN calendario_periodo p ON p.mes = b.mes
                        JOIN salas sa ON sa.registro = b.registro_sala
                        GROUP BY p.granularidade, p.inicio, sa.uf, b.codigo_obra
                    )
                    INSERT INTO agregado_calendario_uf (granularidade, inicio, uf, publico, sessoes, publico_estrangeiro,
                        publico_estrangeiro_dublado, lider_codigo, lider_publico)
                    SELECT granularidade, inicio, uf, sum(publico), sum(sessoes),
                           coalesce(sum(publico) FILTER (WHERE codigo_obra LIKE 'E%'), 0),
                           coalesce(sum(dublado) FILTER (WHERE codigo_obra LIKE 'E%'), 0),
                           max(codigo_obra) FILTER (WHERE posicao = 1),
                           coalesce(max(publico) FILTER (WHERE posicao = 1), 0)
                    FROM por_obra
                    GROUP BY granularidade, inicio, uf;

                    DROP TABLE calendario_base, calendario_periodo;
                END
                $$;

                ALTER FUNCTION atualizar_agregados_bilheteria(date, date) RENAME TO atualizar_agregados_semana;

                CREATE FUNCTION atualizar_agregados_bilheteria(p_inicio date DEFAULT NULL, p_fim date DEFAULT NULL)
                RETURNS void LANGUAGE plpgsql AS $$
                BEGIN
                    PERFORM atualizar_agregados_semana(p_inicio, p_fim);
                    PERFORM atualizar_agregados_calendario(p_inicio, p_fim);
                END
                $$;

                SELECT atualizar_agregados_calendario();
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP FUNCTION atualizar_agregados_bilheteria(date, date);
                ALTER FUNCTION atualizar_agregados_semana(date, date) RENAME TO atualizar_agregados_bilheteria;
                DROP FUNCTION atualizar_agregados_calendario(date, date);
                DROP VIEW agregado_periodo_uf;
                DROP VIEW agregado_periodo_obra;
                DROP VIEW agregado_periodo;
                DROP TABLE agregado_calendario_uf;
                DROP TABLE agregado_calendario_obra;
                DROP TABLE agregado_calendario;
                """);
        }
    }
}
