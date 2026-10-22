using System.IO.Compression;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using CineData.Infrastructure.Ancine;

namespace CineData.Infrastructure.Tests;

public class ZipRemotoTests
{
    private static readonly Uri Url = new("https://exemplo.test/bilheteria.zip");

    [Fact]
    public async Task Lista_entradas_e_le_so_a_pedida_por_range()
    {
        // Segunda entrada incompressível para o ZIP passar da janela de 64 KB lida no fim do arquivo.
        var bytes = new byte[150_000];
        new Random(42).NextBytes(bytes);
        var ruido = Convert.ToBase64String(bytes);
        var zip = CriarZip(("semana-s01.csv", "A;B\n1;2\n"), ("semana-s02.csv", ruido));
        var servidor = new ServidorRange(zip);
        var remoto = new ZipRemoto(new HttpClient(servidor), Url);

        var entradas = await remoto.LerDiretorioAsync(default);
        Assert.Equal(["semana-s01.csv", "semana-s02.csv"], entradas.Select(e => e.Nome));
        Assert.All(entradas, e => Assert.NotEqual(0u, e.Crc32));

        await using var stream = await remoto.AbrirAsync(entradas[0], default);
        using var leitor = new StreamReader(stream);
        Assert.Equal("A;B\n1;2\n", await leitor.ReadToEndAsync());

        // Nenhuma requisição pediu o arquivo inteiro.
        Assert.All(servidor.Faixas, f => Assert.True(f < zip.Length));
    }

    [Fact]
    public async Task Crc_bate_com_o_do_zip_original()
    {
        var zip = CriarZip(("a.csv", "conteudo"));
        using var original = new ZipArchive(new MemoryStream(zip));
        var esperado = original.Entries[0].Crc32;

        var entradas = await new ZipRemoto(new HttpClient(new ServidorRange(zip)), Url).LerDiretorioAsync(default);

        Assert.Equal(esperado, Assert.Single(entradas).Crc32);
    }

    [Fact]
    public async Task Servidor_sem_suporte_a_range_falha_com_mensagem_clara()
    {
        var zip = CriarZip(("a.csv", "x"));
        var remoto = new ZipRemoto(new HttpClient(new ServidorRange(zip, suportaRange: false)), Url);

        var erro = await Assert.ThrowsAsync<InvalidOperationException>(() => remoto.LerDiretorioAsync(default));
        Assert.Contains("Range", erro.Message);
    }

    private static byte[] CriarZip(params (string Nome, string Conteudo)[] arquivos)
    {
        using var memoria = new MemoryStream();
        using (var zip = new ZipArchive(memoria, ZipArchiveMode.Create, leaveOpen: true))
        {
            foreach (var (nome, conteudo) in arquivos)
            {
                using var escrita = zip.CreateEntry(nome, CompressionLevel.Optimal).Open();
                escrita.Write(Encoding.UTF8.GetBytes(conteudo));
            }
        }
        return memoria.ToArray();
    }

    /// <summary>Servidor HTTP em memória que atende Range (inclusive sufixo "bytes=-N"), como o da ANCINE.</summary>
    private sealed class ServidorRange(byte[] arquivo, bool suportaRange = true) : HttpMessageHandler
    {
        public List<long> Faixas { get; } = [];

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage requisicao, CancellationToken ct)
        {
            var faixa = requisicao.Headers.Range?.Ranges.Single();
            if (!suportaRange || faixa is null)
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(arquivo) });

            long inicio, fim;
            if (faixa.From is null)
            {
                inicio = Math.Max(0, arquivo.Length - faixa.To!.Value);
                fim = arquivo.Length - 1;
            }
            else
            {
                inicio = faixa.From.Value;
                fim = Math.Min(faixa.To ?? arquivo.Length - 1, arquivo.Length - 1);
            }

            Faixas.Add(fim - inicio + 1);
            var conteudo = new ByteArrayContent(arquivo[(int)inicio..(int)(fim + 1)]);
            conteudo.Headers.ContentRange = new ContentRangeHeaderValue(inicio, fim, arquivo.Length);
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.PartialContent) { Content = conteudo });
        }
    }
}
