using CineData.Domain.Salas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CineData.Infrastructure.Persistence.Configuracoes;

internal sealed class SalaConfiguracao : IEntityTypeConfiguration<Sala>
{
    public void Configure(EntityTypeBuilder<Sala> b)
    {
        b.ToTable("salas");
        b.HasKey(s => s.Id);
        b.Property(s => s.Id).HasColumnName("registro").ValueGeneratedNever();
        b.Property(s => s.Nome).HasMaxLength(200).IsRequired();
        b.Property(s => s.Municipio).HasMaxLength(120).IsRequired();
        b.Property(s => s.Uf).HasConversion(Conversores.Uf).HasMaxLength(2).IsFixedLength();
        b.OwnsOne(s => s.Exibidor, e =>
        {
            e.Property(x => x.Registro).HasColumnName("exibidor_registro");
            e.Property(x => x.RazaoSocial).HasColumnName("exibidor_razao_social").HasMaxLength(200);
            e.Property(x => x.Cnpj).HasColumnName("exibidor_cnpj").HasMaxLength(18);
            e.Property(x => x.RegistroGrupo).HasColumnName("exibidor_registro_grupo");
        });
        b.Navigation(s => s.Exibidor).IsRequired();
        b.HasIndex(s => s.Uf);
    }
}
