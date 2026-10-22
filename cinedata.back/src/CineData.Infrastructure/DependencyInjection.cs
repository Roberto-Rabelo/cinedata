using CineData.Application.Abstractions;
using CineData.Application.Consultas;
using CineData.Infrastructure.Ancine;
using CineData.Infrastructure.Csv;
using CineData.Infrastructure.Persistence;
using CineData.Infrastructure.Persistence.Leitura;
using CineData.Infrastructure.Persistence.Repositorios;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace CineData.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("CineData")
            ?? throw new InvalidOperationException("ConnectionStrings:CineData não configurada.");

        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

        services.AddNpgsqlDataSource(connectionString);
        services.AddDbContext<CineDataDbContext>((sp, options) => options
            .UseNpgsql(sp.GetRequiredService<NpgsqlDataSource>())
            .UseSnakeCaseNamingConvention());

        services.AddScoped<IRepositorioImportacao, RepositorioImportacao>();
        services.AddScoped<IRepositorioBilheteria, RepositorioBilheteria>();
        services.AddScoped<IRepositorioCadastros, RepositorioCadastros>();
        services.AddScoped<IConsultasBilheteria, ConsultasBilheteriaSql>();
        services.AddSingleton<ILeitorCsvAncine, LeitorCsvAncine>();

        services.Configure<AncineOptions>(configuration.GetSection(AncineOptions.Secao));
        services.AddHttpClient<IFonteDadosAncine, FonteDadosAncineHttp>(http =>
            {
                http.Timeout = Timeout.InfiniteTimeSpan; // downloads longos; o limite fica na resiliência
                http.DefaultRequestHeaders.UserAgent.ParseAdd("CineData/0.1 (+https://github.com)");
            })
            .AddStandardResilienceHandler(o =>
            {
                o.AttemptTimeout.Timeout = TimeSpan.FromMinutes(2);
                o.TotalRequestTimeout.Timeout = TimeSpan.FromMinutes(10);
                o.CircuitBreaker.SamplingDuration = TimeSpan.FromMinutes(5);
            });

        return services;
    }
}
