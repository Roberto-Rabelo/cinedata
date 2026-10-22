using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Domain.Lancamentos;

/// <summary>Lançamento comercial consolidado por distribuidora: única fonte com renda (R$).</summary>
public sealed class Lancamento : Entity<long>
{
    public CodigoObra CodigoObra { get; private set; }
    public string Titulo { get; private set; } = string.Empty;
    public DateOnly DataLancamento { get; private set; }
    public string TipoObra { get; private set; } = string.Empty;
    public string? PaisObra { get; private set; }
    public long PublicoTotal { get; private set; }
    public decimal RendaTotal { get; private set; }
    public string Distribuidora { get; private set; } = string.Empty;
    public string CnpjDistribuidora { get; private set; } = string.Empty;

    public decimal? TicketMedio => PublicoTotal > 0 ? Math.Round(RendaTotal / PublicoTotal, 2) : null;

    private Lancamento() { }

    public static Lancamento Criar(
        CodigoObra obra, string titulo, DateOnly dataLancamento, string tipoObra, string? paisObra,
        long publicoTotal, decimal rendaTotal, string distribuidora, string cnpjDistribuidora)
    {
        if (publicoTotal < 0) throw new DomainException("Público total não pode ser negativo.");
        if (rendaTotal < 0) throw new DomainException("Renda total não pode ser negativa.");

        return new Lancamento
        {
            CodigoObra = obra,
            Titulo = titulo.Trim(),
            DataLancamento = dataLancamento,
            TipoObra = tipoObra.Trim(),
            PaisObra = string.IsNullOrWhiteSpace(paisObra) ? null : paisObra.Trim(),
            PublicoTotal = publicoTotal,
            RendaTotal = rendaTotal,
            Distribuidora = distribuidora.Trim(),
            CnpjDistribuidora = cnpjDistribuidora.Trim(),
        };
    }
}
