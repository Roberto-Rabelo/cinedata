using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CineData.Infrastructure.Persistence;

/// <summary>Usado só pelo `dotnet ef` para gerar migrations.</summary>
internal sealed class CineDataDbContextFactory : IDesignTimeDbContextFactory<CineDataDbContext>
{
    public CineDataDbContext CreateDbContext(string[] args)
    {
        var opcoes = new DbContextOptionsBuilder<CineDataDbContext>()
            .UseNpgsql("Host=localhost;Database=cinedata;Username=cinedata;Password=cinedata")
            .UseSnakeCaseNamingConvention()
            .Options;
        return new CineDataDbContext(opcoes);
    }
}
