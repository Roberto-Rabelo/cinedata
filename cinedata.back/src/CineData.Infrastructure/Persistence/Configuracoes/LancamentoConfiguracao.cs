using CineData.Domain.Lancamentos;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CineData.Infrastructure.Persistence.Configuracoes;

internal sealed class LancamentoConfiguracao : IEntityTypeConfiguration<Lancamento>
{
    public void Configure(EntityTypeBuilder<Lancamento> b)
    {
        b.ToTable("lancamentos");
        b.HasKey(l => l.Id);
        b.Property(l => l.Id).UseIdentityAlwaysColumn();
        b.Property(l => l.CodigoObra).HasConversion(Conversores.CodigoObra).HasMaxLength(14);
        b.Property(l => l.Titulo).HasMaxLength(300);
        b.Property(l => l.TipoObra).HasMaxLength(60);
        b.Property(l => l.PaisObra).HasMaxLength(120);
        b.Property(l => l.RendaTotal).HasPrecision(14, 2);
        b.Property(l => l.Distribuidora).HasMaxLength(200);
        b.Property(l => l.CnpjDistribuidora).HasMaxLength(18);
        b.Ignore(l => l.TicketMedio);
        b.HasIndex(l => l.CodigoObra);
    }
}
