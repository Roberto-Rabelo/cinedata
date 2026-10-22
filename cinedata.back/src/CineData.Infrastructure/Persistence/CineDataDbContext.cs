using CineData.Domain.Bilheteria;
using CineData.Domain.Importacao;
using CineData.Domain.Lancamentos;
using CineData.Domain.Obras;
using CineData.Domain.Salas;
using Microsoft.EntityFrameworkCore;

namespace CineData.Infrastructure.Persistence;

public sealed class CineDataDbContext(DbContextOptions<CineDataDbContext> options) : DbContext(options)
{
    public DbSet<Obra> Obras => Set<Obra>();
    public DbSet<Sala> Salas => Set<Sala>();
    public DbSet<Sessao> Sessoes => Set<Sessao>();
    public DbSet<Lancamento> Lancamentos => Set<Lancamento>();
    public DbSet<ArquivoImportado> ArquivosImportados => Set<ArquivoImportado>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CineDataDbContext).Assembly);
}
