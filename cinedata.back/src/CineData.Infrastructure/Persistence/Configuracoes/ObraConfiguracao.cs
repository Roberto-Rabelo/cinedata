using CineData.Domain.Obras;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CineData.Infrastructure.Persistence.Configuracoes;

internal sealed class ObraConfiguracao : IEntityTypeConfiguration<Obra>
{
    public void Configure(EntityTypeBuilder<Obra> b)
    {
        b.ToTable("obras");
        b.HasKey(o => o.Id);
        b.Property(o => o.Id).HasColumnName("codigo").HasConversion(Conversores.CodigoObra).HasMaxLength(14);
        b.Property(o => o.TituloOriginal).HasMaxLength(300).IsRequired();
        b.Property(o => o.TituloBrasil).HasMaxLength(300);
        b.Property(o => o.PaisOrigem).HasColumnName("pais").HasMaxLength(120);
        b.Ignore(o => o.Titulo);
        b.Ignore(o => o.Origem);
    }
}
