using CineData.Domain.Bilheteria;
using CineData.Domain.Importacao;
using CineData.Domain.Lancamentos;
using CineData.Domain.Obras;
using CineData.Domain.Salas;

namespace CineData.Application.Abstractions;

/// <summary>Tudo o que um arquivo de bilheteria produz; é gravado de forma atômica.</summary>
public sealed record LoteBilheteria(
    ArquivoImportado Arquivo,
    IReadOnlyCollection<Obra> Obras,
    IReadOnlyCollection<Sala> Salas,
    IReadOnlyCollection<Sessao> Sessoes);

public interface IRepositorioImportacao
{
    Task<IReadOnlyDictionary<string, ArquivoImportado>> ObterPorFonteAsync(FonteDados fonte, CancellationToken ct);
}

public interface IRepositorioBilheteria
{
    /// <summary>Grava o lote substituindo as sessões que o mesmo arquivo trouxe antes (idempotente).</summary>
    Task SalvarLoteAsync(LoteBilheteria lote, CancellationToken ct);
}

public interface IRepositorioCadastros
{
    Task SubstituirLancamentosAsync(IReadOnlyCollection<Lancamento> lancamentos, CancellationToken ct);

    /// <summary>Insere ou atualiza salas vindas do cadastro oficial (inclui capacidade).</summary>
    Task AtualizarSalasAsync(IReadOnlyCollection<Sala> salas, CancellationToken ct);
}
