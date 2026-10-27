using System.Globalization;
using CineData.Application;
using CineData.Application.Exportacao;
using CineData.Application.Ingestao;
using CineData.Application.Posteres;
using CineData.Infrastructure;
using CineData.Infrastructure.Persistence;
using CineData.Infrastructure.Site;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Uso:
//   dotnet run -- amostra [semanas]   migra o banco e importa as N semanas mais recentes (padrão 8) + cadastros
//   dotnet run -- bilheteria [semanas] importa só a bilheteria (sem número = histórico completo)
//   dotnet run -- cadastros            importa lançamentos e salas
//   dotnet run -- migrar               só aplica as migrations
//   dotnet run -- posteres             liga as obras do site aos filmes do TMDB (pôster); só as que faltam
//   dotnet run -- posteres definir <codigo> <tmdb_id|nenhum>
//                                      corrige uma obra à mão (a busca automática não sobrescreve mais)
//   dotnet run -- exportar <pasta> [desde AAAA-MM-DD]
//                                      grava o site estático em JSON (só lê o banco; padrão desde 2016-08-01)
// Content root na pasta do executável: o appsettings.json é encontrado de qualquer diretório.
var builder = Host.CreateApplicationBuilder(new HostApplicationBuilderSettings
{
    Args = args,
    ContentRootPath = AppContext.BaseDirectory,
});
// Token do TMDB fora do repositório (dotnet user-secrets), também em produção.
builder.Configuration.AddUserSecrets<Program>(optional: true);
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

if (comando == "exportar")
{
    if (args.Length < 2) return Erro("Uso: exportar <pasta> [desde AAAA-MM-DD]");
    var desde = args.Length > 2
        ? DateOnly.ParseExact(args[2], "yyyy-MM-dd", CultureInfo.InvariantCulture)
        : ExportarSiteComando.InicioRepresentativo;
    var exportar = ActivatorUtilities.CreateInstance<ExportarSite>(servicos, new GravadorSiteArquivos(args[1]));
    var exportado = await exportar.ExecutarAsync(new ExportarSiteComando(desde), ct);
    Console.WriteLine($"Export em {Path.GetFullPath(args[1])}: {exportado}");
    return 0;
}

var db = servicos.GetRequiredService<CineDataDbContext>();
db.Database.SetCommandTimeout(TimeSpan.FromMinutes(30)); // migrations que criam agregados varrem o histórico
await db.Database.MigrateAsync(ct);
db.Database.SetCommandTimeout(null);
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

if (comando == "posteres" && args.Length >= 4 && args[1] == "definir")
{
    int? tmdbId = args[3] == "nenhum" ? null : int.Parse(args[3], CultureInfo.InvariantCulture);
    var definido = await servicos.GetRequiredService<EnriquecerPosteres>().DefinirAsync(args[2], tmdbId, ct);
    Console.WriteLine(definido.TmdbId is null ? $"{definido.Codigo}: sem pôster" : $"{definido.Codigo}: {definido.TituloTmdb} ({definido.AnoTmdb}), {definido.Poster}");
}
else if (comando == "posteres")
{
    var posteres = await servicos.GetRequiredService<EnriquecerPosteres>()
        .ExecutarAsync(new EnriquecerPosteresComando(ExportarSiteComando.InicioRepresentativo), ct);
    Console.WriteLine(posteres);
}

return comando is "amostra" or "bilheteria" or "cadastros" or "posteres" ? 0 : Erro($"Comando desconhecido: {comando}");

static int Erro(string mensagem)
{
    Console.Error.WriteLine(mensagem);
    return 1;
}
