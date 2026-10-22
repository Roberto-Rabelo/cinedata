using CineData.Application;
using CineData.Application.Ingestao;
using CineData.Infrastructure;
using CineData.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Uso:
//   dotnet run -- amostra [semanas]   migra o banco e importa as N semanas mais recentes (padrão 8) + cadastros
//   dotnet run -- bilheteria [semanas] importa só a bilheteria (sem número = histórico completo)
//   dotnet run -- cadastros            importa lançamentos e salas
//   dotnet run -- migrar               só aplica as migrations
// Content root na pasta do executável: o appsettings.json é encontrado de qualquer diretório.
var builder = Host.CreateApplicationBuilder(new HostApplicationBuilderSettings
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,
});
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

using var host = builder.Build();
using var cancelamento = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) => { e.Cancel = true; cancelamento.Cancel(); };
var ct = cancelamento.Token;

var comando = args.FirstOrDefault() ?? "amostra";
int? semanas = args.Length > 1 && int.TryParse(args[1], out var n) ? n : null;

await using var escopo = host.Services.CreateAsyncScope();
var servicos = escopo.ServiceProvider;

await servicos.GetRequiredService<CineDataDbContext>().Database.MigrateAsync(ct);
if (comando == "migrar") return 0;

if (comando is "amostra" or "cadastros")
{
    var cadastros = servicos.GetRequiredService<ImportarCadastros>();
    // Salas primeiro: trazem a capacidade usada no cálculo de ocupação.
    await cadastros.ImportarSalasAsync(ct);
    await cadastros.ImportarLancamentosAsync(ct);
}

if (comando is "amostra" or "bilheteria")
{
    var limite = comando == "amostra" ? semanas ?? 8 : semanas;
    var resultado = await servicos.GetRequiredService<ImportarBilheteria>()
        .ExecutarAsync(new ImportarBilheteriaComando(limite), ct);
    Console.WriteLine(resultado);
}

return comando is "amostra" or "bilheteria" or "cadastros" ? 0 : Erro($"Comando desconhecido: {comando}");

static int Erro(string mensagem)
{
    Console.Error.WriteLine(mensagem);
    return 1;
}
