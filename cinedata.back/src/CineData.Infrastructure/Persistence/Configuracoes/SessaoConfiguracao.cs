using CineData.Domain.Bilheteria;
using CineData.Domain.Importacao;
using CineData.Domain.Obras;
using CineData.Domain.Salas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CineData.Infrastructure.Persistence.Configuracoes;

internal sealed class SessaoConfiguracao : IEntityTypeConfiguration<Sessao>
{
    /// <summary>Coluna de rastreabilidade: de qual arquivo da ANCINE a sessão veio (não é conceito de domínio).</summary>
    public const string ArquivoId = "ArquivoId";

    public void Configure(EntityTypeBuilder<Sessao> b)
    {
        b.ToTable("sessoes");
        b.HasKey(s => s.Id);
        b.Property(s => s.Id).UseIdentityAlwaysColumn();
        b.Property(s => s.CodigoObra).HasConversion(Conversores.CodigoObra).HasMaxLength(14);
        b.Property(s => s.Inicio).HasColumnType("timestamp without time zone");
        b.Property(s => s.Audio).HasConversion<short>();
        b.Property<int>(ArquivoId);
        b.Ignore(s => s.Semana);

        b.HasOne<Obra>().WithMany().HasForeignKey(s => s.CodigoObra);
        b.HasOne<Sala>().WithMany().HasForeignKey(s => s.RegistroSala);
        b.HasOne<ArquivoImportado>().WithMany().HasForeignKey(ArquivoId).OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(s => s.DataExibicao);
        b.HasIndex(s => new { s.CodigoObra, s.DataExibicao });
        b.HasIndex(ArquivoId);
    }
}
