using System.Collections.Concurrent;
using System.Diagnostics;
using CineData.Application.Common;
using CineData.Application.Consultas;
using CineData.Domain.Bilheteria;
using CineData.Domain.Common;
using Microsoft.Extensions.Logging;

namespace CineData.Application.Exportacao;

/// <param name="Desde">Períodos que começam antes ficam de fora. Padrão: agosto de 2016, quando a série fica
/// representativa (achado 9 de <c>docs/dados-ancine.md</c>).</param>
/// <param name="Top">Tamanho do ranking de cada período (o mesmo <c>top</c> da API).</param>
/// <param name="Paralelismo">Curvas de obras lidas ao mesmo tempo (cada uma é uma consulta em <c>sessoes</c>).</param>
public sealed record ExportarSiteComando(DateOnly Desde, int Top = 10, int Paralelismo = 4)
{
    public static readonly DateOnly InicioRepresentativo = new(2016, 8, 1);
}

/// <summary>
/// Gera a versão estática do site: os mesmos DTOs da API, gravados em JSON por período e por obra, para publicar
/// sem banco online. Usa os casos de uso de <see cref="ServicoConsultas"/>, então período padrão, completude, estreia
/// e dias parciais seguem as mesmas regras do painel (ADR 0004 e 0005).
/// </summary>
/// <remarks>
/// Layout: <c>indice.json</c>; por granularidade, <c>{g}/periodos.json</c>, <c>{g}/padrao.json</c> e
/// <c>{g}/{chave}.json</c> (<see cref="ChavePeriodo"/>); <c>ufs/{UF}/{g}.json</c> (série do estado);
/// <c>obras/{codigo}.json</c> para cada obra que aparece num
/// ranking ou como líder de UF; <c>busca.json</c> com essas obras.
/// </remarks>
public sealed class ExportarSite(
    ServicoConsultas servico,
    IConsultasBilheteria consultas,
    IGravadorSite gravador,
    TimeProvider relogio,
    ILogger<ExportarSite> logger)
{
    public const string Fonte = "ANCINE (dados abertos)";

    public async Task<ResultadoExportacao> ExecutarAsync(ExportarSiteComando comando, CancellationToken ct)
    {
        if (comando.Paralelismo < 1)
            throw new ArgumentOutOfRangeException(nameof(comando), "Paralelismo deve ser positivo.");

        var cronometro = Stopwatch.StartNew();
        var cobertura = await consultas.ObterCoberturaAsync(ct);
        if (cobertura.Count == 0)
            throw new RecursoNaoEncontradoException("Nenhum dado de bilheteria importado ainda. Rode a ingestão.");

        await gravador.IniciarAsync(ct);
        var saida = new Saida(gravador);
        var obras = new ObrasDoSite();
        var granularidades = new Dictionary<string, GranularidadeSiteDto>();
        var periodosExportados = 0;

        foreach (var granularidade in Enum.GetValues<Granularidade>())
        {
            var nome = Granularidades.Nome(granularidade);
            var periodos = (await servico.ListarPeriodosAsync(nome, ct)).Where(p => p.Inicio >= comando.Desde).ToList();
            if (periodos.Count == 0) continue;

            foreach (var periodo in periodos)
            {
                var painel = await servico.ObterPainelAsync(nome, periodo.Inicio, comando.Top, ct);
                await saida.GravarAsync(ChavePeriodo.Arquivo(Periodo.Contendo(granularidade, periodo.Inicio)), painel, ct);
                obras.Coletar(painel);
            }

            // Sem data, a regra da API: o último período completo da granularidade.
            var padrao = await servico.ObterPainelAsync(nome, null, comando.Top, ct);
            obras.Coletar(padrao);
            await saida.GravarAsync($"{nome}/padrao.json", padrao, ct);
            await saida.GravarAsync($"{nome}/periodos.json", periodos, ct);

            // A série de cada UF (painel do estado no mapa), só com os períodos que têm página.
            foreach (var uf in Uf.Todas.Order(StringComparer.Ordinal))
            {
                var serie = await servico.ObterSerieUfAsync(uf, nome, ct);
                await saida.GravarAsync($"ufs/{uf}/{nome}.json",
                    serie with { Pontos = serie.Pontos.Where(p => p.Inicio >= comando.Desde).ToList() }, ct);
            }

            granularidades[nome] = new GranularidadeSiteDto(padrao.Periodo.Inicio, periodos[^1].Inicio, periodos[0].Inicio, periodos.Count);
            periodosExportados += periodos.Count;
            logger.LogInformation("{Granularidade}: {Periodos} períodos, padrão {Padrao}", nome, periodos.Count, padrao.Periodo.Rotulo);
        }

        var busca = new ConcurrentBag<ObraBuscaDto>();
        var opcoes = new ParallelOptions { MaxDegreeOfParallelism = comando.Paralelismo, CancellationToken = ct };
        await Parallel.ForEachAsync(obras.Codigos, opcoes, async (codigo, ctObra) =>
        {
            var curva = await servico.ObterCurvaObraAsync(codigo, ctObra);
            await saida.GravarAsync($"obras/{codigo}.json", curva, ctObra);
            var o = curva.Obra;
            busca.Add(new ObraBuscaDto(o.Codigo, o.Titulo, o.TituloOriginal == o.Titulo ? null : o.TituloOriginal, o.Origem, curva.PublicoNoPeriodo, o.Poster));
        });
        logger.LogInformation("{Obras} curvas de obras", obras.Codigos.Count);

        await saida.GravarAsync("busca.json",
            busca.OrderByDescending(b => b.Publico).ThenBy(b => b.Codigo, StringComparer.Ordinal).ToList(), ct);

        var consolidados = DiasConsolidados.Calcular(cobertura.Select(d => new CoberturaDia(d.Data, d.Salas)));
        await saida.GravarAsync("indice.json", new IndiceSiteDto(
            relogio.GetUtcNow(), comando.Desde, cobertura.Max(d => d.Data),
            consolidados.Count == 0 ? cobertura.Min(d => d.Data) : consolidados.Max(),
            granularidades, obras.Codigos.Count, Fonte), ct);

        await gravador.ConcluirAsync(ct);
        return new ResultadoExportacao(periodosExportados, obras.Codigos.Count, saida.Arquivos, saida.Bytes, cronometro.Elapsed);
    }

    /// <summary>
    /// Obras com página no site: as dos rankings e as líderes de UF (o mapa linka para elas), na ordem em que
    /// aparecem, sem repetir.
    /// </summary>
    private sealed class ObrasDoSite
    {
        private readonly HashSet<string> _vistas = [];
        private readonly List<string> _codigos = [];
        public IReadOnlyList<string> Codigos => _codigos;

        public void Coletar(PainelDto painel)
        {
            var codigos = painel.Ranking.Select(r => r.CodigoObra).Concat(painel.Ufs.Select(u => u.LiderCodigo).OfType<string>());
            foreach (var codigo in codigos)
                if (_vistas.Add(codigo)) _codigos.Add(codigo);
        }
    }

    /// <summary>Conta arquivos e bytes gravados; as curvas gravam em paralelo.</summary>
    private sealed class Saida(IGravadorSite gravador)
    {
        private int _arquivos;
        private long _bytes;
        public int Arquivos => _arquivos;
        public long Bytes => _bytes;

        public async Task GravarAsync<T>(string caminho, T conteudo, CancellationToken ct)
        {
            var bytes = await gravador.GravarAsync(caminho, conteudo, ct);
            Interlocked.Increment(ref _arquivos);
            Interlocked.Add(ref _bytes, bytes);
        }
    }
}
