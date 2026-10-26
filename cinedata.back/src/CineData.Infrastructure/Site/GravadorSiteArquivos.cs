using System.Text.Encodings.Web;
using System.Text.Json;
using CineData.Application.Exportacao;

namespace CineData.Infrastructure.Site;

/// <summary>
/// Grava o export numa pasta irmã (<c>dados.novo</c>) e só no fim troca pela pasta de destino. A pasta de destino é
/// apagada na troca, então precisa estar vazia ou ser um export anterior (com <c>indice.json</c>).
/// </summary>
public sealed class GravadorSiteArquivos(string pasta) : IGravadorSite
{
    public const string Marca = "indice.json";

    /// <summary>A mesma serialização da API (camelCase, datas AAAA-MM-DD), com acentos legíveis no arquivo.</summary>
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
    };

    private readonly string _destino = Path.GetFullPath(pasta);
    private string Temporaria => _destino + ".novo";
    private string Anterior => _destino + ".anterior";

    public Task IniciarAsync(CancellationToken ct)
    {
        VerificarDestino();
        if (Directory.Exists(Temporaria)) Directory.Delete(Temporaria, recursive: true);
        Directory.CreateDirectory(Temporaria);
        return Task.CompletedTask;
    }

    public async Task<long> GravarAsync<T>(string caminho, T conteudo, CancellationToken ct)
    {
        var arquivo = Path.GetFullPath(Path.Combine(Temporaria, caminho));
        if (!arquivo.StartsWith(Temporaria + Path.DirectorySeparatorChar, StringComparison.Ordinal))
            throw new ArgumentException($"Caminho fora do export: {caminho}", nameof(caminho));

        Directory.CreateDirectory(Path.GetDirectoryName(arquivo)!);
        var bytes = JsonSerializer.SerializeToUtf8Bytes(conteudo, Json);
        await File.WriteAllBytesAsync(arquivo, bytes, ct);
        return bytes.Length;
    }

    public Task ConcluirAsync(CancellationToken ct)
    {
        VerificarDestino();
        if (Directory.Exists(Anterior)) Directory.Delete(Anterior, recursive: true);
        if (Directory.Exists(_destino)) Directory.Move(_destino, Anterior);
        Directory.Move(Temporaria, _destino);
        if (Directory.Exists(Anterior)) Directory.Delete(Anterior, recursive: true);
        return Task.CompletedTask;
    }

    private void VerificarDestino()
    {
        if (!Directory.Exists(_destino) || !Directory.EnumerateFileSystemEntries(_destino).Any()) return;
        if (!File.Exists(Path.Combine(_destino, Marca)))
            throw new InvalidOperationException(
                $"A pasta {_destino} não está vazia e não é um export do CineData (falta {Marca}). " +
                "O export substitui a pasta inteira; escolha uma pasta vazia ou a de um export anterior.");
    }
}
