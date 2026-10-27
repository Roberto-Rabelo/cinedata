using CineData.Application.Consultas;
using CineData.Application.Ingestao;
using CineData.Application.Posteres;
using Microsoft.Extensions.DependencyInjection;

namespace CineData.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<ImportarBilheteria>();
        services.AddScoped<ImportarCadastros>();
        services.AddScoped<ServicoConsultas>();
        services.AddScoped<EnriquecerPosteres>();
        return services;
    }
}
