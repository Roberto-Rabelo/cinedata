using CineData.Domain.Importacao;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CineData.Infrastructure.Persistence.Configuracoes;

internal sealed class ArquivoImportadoConfiguracao : IEntityTypeConfiguration<ArquivoImportado>
{
    public void Configure(EntityTypeBuilder<ArquivoImportado> b)
    {
        b.ToTable("arquivos_importados");
        b.HasKey(a => a.Id);
        b.Property(a => a.Fonte).HasConversion<string>().HasMaxLength(40);
        b.Property(a => a.Nome).HasMaxLength(200);
        b.Property(a => a.Crc32).HasConversion<long>();
        b.HasIndex(a => new { a.Fonte, a.Nome }).IsUnique();
    }
}
