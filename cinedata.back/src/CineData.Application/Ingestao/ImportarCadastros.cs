using CineData.Application.Abstractions;
using CineData.Domain.Common;
using CineData.Domain.Importacao;
using CineData.Domain.Lancamentos;
using CineData.Domain.Obras;
using CineData.Domain.Salas;
using Microsoft.Extensions.Logging;

namespace CineData.Application.Ingestao;

/// <summary>
/// Importa os cadastros pequenos (lançamentos comerciais e salas). São CSVs de poucos MB
/// publicados inteiros, então a carga é sempre completa.
/// </summary>
public sealed class ImportarCadastros(
    IFonteDadosAncine fonte,
    ILeitorCsvAncine leitor,
    IRepositorioCadastros cadastros,
    ILogger<ImportarCadastros> logger)
{
    public async Task<(int Importados, int Rejeitados)> ImportarLancamentosAsync(CancellationToken ct)
    {
        await using var conteudo = await fonte.AbrirCsvAsync(FonteDados.Lancamentos, ct);
        var lancamentos = new List<Lancamento>();
        var rejeitados = 0;

        await foreach (var l in leitor.LerLancamentosAsync(conteudo, ct))
        {
            if (!CodigoObra.TryCriar(l.CodigoObra, out var codigo)
                || l is not { DataLancamento: { } data, PublicoTotal: >= 0 and var publico, RendaTotal: >= 0 and var renda })
            {
                rejeitados++;
                continue;
            }

            lancamentos.Add(Lancamento.Criar(codigo, l.TituloOriginal, data, l.TipoObra, l.PaisObra,
                publico, renda, l.Distribuidora, l.CnpjDistribuidora));
        }

        await cadastros.SubstituirLancamentosAsync(lancamentos, ct);
        logger.LogInformation("Lançamentos: {Importados} importados, {Rejeitados} rejeitados", lancamentos.Count, rejeitados);
        return (lancamentos.Count, rejeitados);
    }

    public async Task<(int Importados, int Rejeitados)> ImportarSalasAsync(CancellationToken ct)
    {
        await using var conteudo = await fonte.AbrirCsvAsync(FonteDados.Salas, ct);
        var salas = new Dictionary<int, Sala>();
        var rejeitados = 0;

        await foreach (var l in leitor.LerSalasAsync(conteudo, ct))
        {
            if (l is not { RegistroSala: > 0 and var registro, RegistroExibidor: { } registroExibidor }
                || !Uf.TryCriar(l.Uf, out var uf)
                || string.IsNullOrWhiteSpace(l.NomeSala))
            {
                rejeitados++;
                continue;
            }

            var exibidor = new Exibidor(registroExibidor, l.NomeExibidor.Trim(), l.CnpjExibidor.Trim(), null);
            var sala = Sala.Criar(registro, l.NomeSala, l.RegistroComplexo ?? 0, l.Municipio, uf, exibidor);
            sala.DefinirAssentos(l.Assentos);
            salas[registro] = sala;
        }

        await cadastros.AtualizarSalasAsync(salas.Values, ct);
        logger.LogInformation("Salas: {Importados} importadas, {Rejeitados} rejeitadas", salas.Count, rejeitados);
        return (salas.Count, rejeitados);
    }
}
