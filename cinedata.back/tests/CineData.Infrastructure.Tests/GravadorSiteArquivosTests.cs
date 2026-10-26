using CineData.Infrastructure.Site;

namespace CineData.Infrastructure.Tests;

public sealed class GravadorSiteArquivosTests : IDisposable
{
    private readonly string _raiz = Directory.CreateTempSubdirectory("cinedata-site-").FullName;
    private string Destino => Path.Combine(_raiz, "dados");

    [Fact]
    public async Task Grava_json_como_a_api_e_troca_o_export_anterior_inteiro()
    {
        Directory.CreateDirectory(Path.Combine(Destino, "obras"));
        File.WriteAllText(Path.Combine(Destino, "indice.json"), "{}");
        File.WriteAllText(Path.Combine(Destino, "obras", "B0000000000001.json"), "{}"); // obra que saiu do site

        var gravador = new GravadorSiteArquivos(Destino);
        await gravador.IniciarAsync(default);
        var bytes = await gravador.GravarAsync("semana/2026-10-08.json", new { Inicio = new DateOnly(2026, 10, 8), Titulo = "Ainda Estou Aqui" }, default);
        await gravador.GravarAsync("indice.json", new { }, default);
        await gravador.ConcluirAsync(default);

        var json = File.ReadAllText(Path.Combine(Destino, "semana", "2026-10-08.json"));
        Assert.Equal("""{"inicio":"2026-10-08","titulo":"Ainda Estou Aqui"}""", json);
        Assert.Equal(json.Length, bytes);
        Assert.False(File.Exists(Path.Combine(Destino, "obras", "B0000000000001.json")));
        Assert.Equal(["dados"], Directory.GetFileSystemEntries(_raiz).Select(Path.GetFileName)); // sem .novo nem .anterior
    }

    [Fact]
    public async Task Recusa_pasta_com_conteudo_que_nao_e_um_export()
    {
        Directory.CreateDirectory(Destino);
        File.WriteAllText(Path.Combine(Destino, "notas.txt"), "não apague");

        var erro = await Assert.ThrowsAsync<InvalidOperationException>(() => new GravadorSiteArquivos(Destino).IniciarAsync(default));

        Assert.Contains("indice.json", erro.Message);
        Assert.True(File.Exists(Path.Combine(Destino, "notas.txt")));
    }

    [Fact]
    public async Task Recusa_caminho_fora_do_export()
    {
        var gravador = new GravadorSiteArquivos(Destino);
        await gravador.IniciarAsync(default);

        await Assert.ThrowsAsync<ArgumentException>(() => gravador.GravarAsync("../fora.json", 1, default));
    }

    public void Dispose() => Directory.Delete(_raiz, recursive: true);
}
