using CineData.Application.Consultas;
using CineData.Application.Exportacao;
using CineData.Domain.Common;
using CineData.Domain.Obras;
using Microsoft.Extensions.Logging.Abstractions;

namespace CineData.Application.Tests;

public class ExportarSiteTests
{
    private readonly ConsultasFalsas _consultas = new();
    private readonly GravadorEmMemoria _gravador = new();

    [Theory]
    [InlineData(Granularidade.Semana, "2026-10-12", "2026-10-08")]
    [InlineData(Granularidade.Mes, "2026-09-15", "2026-09")]
    [InlineData(Granularidade.Trimestre, "2025-08-20", "2025-t3")]
    [InlineData(Granularidade.Semestre, "2026-03-01", "2026-s1")]
    [InlineData(Granularidade.Ano, "2025-12-31", "2025")]
    public void Chave_do_periodo_e_curta_e_legivel_na_url(Granularidade granularidade, string data, string chave)
    {
        var periodo = Periodo.Contendo(granularidade, DateOnly.Parse(data));
        Assert.Equal(chave, ChavePeriodo.De(periodo));
        Assert.Equal($"{Granularidades.Nome(granularidade)}/{chave}.json", ChavePeriodo.Arquivo(periodo));
    }

    [Fact]
    public async Task Grava_um_arquivo_por_periodo_a_partir_da_data_de_corte()
    {
        _consultas.Cobrir("2026-01-01", "2026-10-17");

        await Exportar(desde: "2026-08-01");

        // A semana de 30/07 e o 3º trimestre começam antes do corte; nenhum semestre ou ano começa depois dele.
        Assert.Contains("semana/2026-08-06.json", _gravador.Arquivos.Keys);
        Assert.Contains("semana/2026-10-15.json", _gravador.Arquivos.Keys); // parcial, mas publicado
        Assert.DoesNotContain("semana/2026-07-30.json", _gravador.Arquivos.Keys);
        Assert.Equal(["mes/2026-08.json", "mes/2026-09.json", "mes/2026-10.json"],
            _gravador.Arquivos.Keys.Where(k => k.StartsWith("mes/2026-")).Order());
        Assert.Contains("trimestre/2026-t4.json", _gravador.Arquivos.Keys);
        Assert.DoesNotContain("trimestre/2026-t3.json", _gravador.Arquivos.Keys);
        Assert.DoesNotContain(_gravador.Arquivos.Keys, k => k.StartsWith("semestre/") || k.StartsWith("ano/"));

        var semanas = Assert.IsAssignableFrom<IReadOnlyList<PeriodoDto>>(_gravador.Arquivos["semana/periodos.json"]);
        Assert.Equal(11, semanas.Count);
        Assert.Equal(new DateOnly(2026, 10, 15), semanas[0].Inicio); // do mais recente ao mais antigo, como a API
    }

    [Fact]
    public async Task Indice_aponta_o_ultimo_periodo_completo_de_cada_granularidade()
    {
        _consultas.Cobrir("2026-01-01", "2026-10-17");

        var resultado = await Exportar(desde: "2026-01-01");

        var indice = Assert.IsType<IndiceSiteDto>(_gravador.Arquivos["indice.json"]);
        Assert.Equal(new DateOnly(2026, 10, 17), indice.DadosAte);
        Assert.Equal(new GranularidadeSiteDto(new(2026, 10, 8), new(2026, 1, 1), new(2026, 10, 15), 42), indice.Granularidades["semana"]);
        Assert.Equal(new DateOnly(2026, 9, 1), indice.Granularidades["mes"].Padrao);
        Assert.Equal(new DateOnly(2026, 1, 1), indice.Granularidades["ano"].Padrao); // nenhum ano completo: o mais recente
        Assert.Equal(ExportarSite.Fonte, indice.Fonte);

        var padrao = Assert.IsType<PainelDto>(_gravador.Arquivos["semana/padrao.json"]);
        Assert.Equal(new DateOnly(2026, 10, 8), padrao.Periodo.Inicio);
        Assert.True(_gravador.Concluido);
        Assert.Equal(_gravador.Arquivos.Count, resultado.Arquivos);
    }

    [Fact]
    public async Task Obras_dos_rankings_e_lideres_de_uf_ganham_pagina_e_entram_na_busca_uma_vez()
    {
        _consultas.Cobrir("2026-09-01", "2026-10-17");
        _consultas.Ranking = ["E2600183000000", "B2600281500000"];
        _consultas.LiderUf = "B2500111100000"; // filme regional: lidera um estado sem entrar no top nacional

        var resultado = await Exportar(desde: "2026-09-01");

        Assert.Equal(3, resultado.Obras);
        Assert.Equal(
            ["obras/B2500111100000.json", "obras/B2600281500000.json", "obras/E2600183000000.json"],
            _gravador.Arquivos.Keys.Where(k => k.StartsWith("obras/")).Order());

        var busca = Assert.IsAssignableFrom<IReadOnlyList<ObraBuscaDto>>(_gravador.Arquivos["busca.json"]);
        Assert.Equal(["E2600183000000", "B2600281500000", "B2500111100000"], busca.Select(b => b.Codigo)); // por público
        Assert.Equal("Original de E2600183000000", busca[0].TituloOriginal);
        Assert.Null(busca[1].TituloOriginal); // igual ao título no Brasil: fica fora do índice
        Assert.Equal("Nacional", busca[1].Origem);
    }

    [Fact]
    public async Task Cada_uf_ganha_a_serie_de_cada_granularidade_so_com_os_periodos_exportados()
    {
        _consultas.Cobrir("2026-09-01", "2026-10-17");

        await Exportar(desde: "2026-09-01");

        Assert.Equal(27, _gravador.Arquivos.Keys.Count(k => k.StartsWith("ufs/") && k.EndsWith("/semana.json")));
        var serie = Assert.IsType<SerieUfDto>(_gravador.Arquivos["ufs/SP/mes.json"]);
        Assert.Equal([new DateOnly(2026, 9, 3)], serie.Pontos.Select(p => p.Inicio));
        Assert.Equal("Sudeste", serie.Regiao);
    }

    private Task<ResultadoExportacao> Exportar(string desde) =>
        new ExportarSite(new ServicoConsultas(_consultas), _consultas, _gravador, TimeProvider.System, NullLogger<ExportarSite>.Instance)
            .ExecutarAsync(new ExportarSiteComando(DateOnly.Parse(desde), Paralelismo: 2), default);

    private sealed class GravadorEmMemoria : IGravadorSite
    {
        private readonly Dictionary<string, object?> _arquivos = [];
        public IReadOnlyDictionary<string, object?> Arquivos => _arquivos;
        public bool Concluido { get; private set; }

        public Task IniciarAsync(CancellationToken ct) => Task.CompletedTask;

        public Task<long> GravarAsync<T>(string caminho, T conteudo, CancellationToken ct)
        {
            lock (_arquivos) _arquivos[caminho] = conteudo;
            return Task.FromResult(100L);
        }

        public Task ConcluirAsync(CancellationToken ct)
        {
            Concluido = true;
            return Task.CompletedTask;
        }
    }

    private sealed class ConsultasFalsas : IConsultasBilheteria
    {
        private readonly SortedDictionary<DateOnly, DiaBilheteriaDto> _dias = [];
        public string[] Ranking { get; set; } = [];
        public string? LiderUf { get; set; }

        public void Cobrir(string inicio, string fim)
        {
            for (var d = DateOnly.Parse(inicio); d <= DateOnly.Parse(fim); d = d.AddDays(1))
                _dias[d] = new DiaBilheteriaDto(d, 3000, 12000, 120000);
        }

        public Task<IReadOnlyList<DiaBilheteriaDto>> ObterCoberturaAsync(CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<DiaBilheteriaDto>>(_dias.Values.ToList());

        public Task<IReadOnlyList<ItemRankingDto>> ObterRankingAsync(Periodo periodo, int top, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<ItemRankingDto>>(Ranking
                .Select((codigo, i) => new ItemRankingDto(i + 1, codigo, codigo, "Estrangeira", null, 1000 - i, 10, 5, 100, null, 50, null, null, false))
                .ToList());

        public Task<IReadOnlyList<UfDto>> ObterPorUfAsync(Periodo periodo, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<UfDto>>(
            [
                new UfDto("SP", "Sudeste", 500, 10, 50, Ranking.FirstOrDefault(), null, 300, null),
                new UfDto("PE", "Nordeste", 100, 4, 25, LiderUf, null, 60, null),
                new UfDto("AC", "Norte", 0, 0, 0, null, null, 0, null),
            ]);

        // Uma semana antes e outra depois do corte de 2026-09-01.
        public Task<IReadOnlyList<PontoUfDto>> ObterSerieUfAsync(Granularidade granularidade, Uf uf, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<PontoUfDto>>(
            [
                new PontoUfDto(new DateOnly(2026, 8, 27), 10, 1, 5, 2, null, null, 0, null),
                new PontoUfDto(new DateOnly(2026, 9, 3), 20, 2, 6, 1, LiderUf, null, 15, null),
            ]);

        public Task<ResumoDto> ObterResumoAsync(Periodo periodo, CancellationToken ct) =>
            Task.FromResult(new ResumoDto(periodo.Inicio, periodo.Fim, 0, 0, 0, 0, 0, 0, null, null));

        public Task<IReadOnlyList<OrigemDto>> ObterPorOrigemAsync(Periodo periodo, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<OrigemDto>>([]);

        public Task<AudioDto> ObterAudioAsync(Periodo periodo, CancellationToken ct) => Task.FromResult(new AudioDto(0, 0, 0));

        public Task<ObraDto?> ObterObraAsync(CodigoObra codigo, CancellationToken ct) =>
            Task.FromResult<ObraDto?>(new ObraDto(
                codigo.Valor, codigo.Valor, codigo.Origem == OrigemObra.Nacional ? codigo.Valor : $"Original de {codigo.Valor}",
                null, codigo.Origem.ToString(), null));

        // Público da curva decide a ordem da busca: a estrangeira é a maior, a líder regional a menor.
        public Task<IReadOnlyList<PontoCurvaDto>> ObterCurvaAsync(CodigoObra codigo, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<PontoCurvaDto>>(
                [new PontoCurvaDto(new DateOnly(2026, 10, 8), codigo.Valor[0] == 'E' ? 900 : codigo.Valor[2] == '6' ? 500 : 100, 10, 5, false)]);

        public Task<IReadOnlyList<ObraResumoDto>> BuscarObrasAsync(string termo, int limite, CancellationToken ct) => throw new NotSupportedException();
    }
}
