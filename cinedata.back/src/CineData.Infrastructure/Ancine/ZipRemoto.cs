using System.Buffers.Binary;
using System.IO.Compression;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace CineData.Infrastructure.Ancine;

/// <summary>
/// Lê um ZIP hospedado em HTTP sem baixá-lo inteiro: busca o diretório central no fim do arquivo
/// e depois só os bytes de cada entrada pedida, via requisições Range.
/// </summary>
internal sealed class ZipRemoto(HttpClient http, Uri url)
{
    private const uint AssinaturaFimDiretorio = 0x06054b50;
    private const uint AssinaturaDiretorio = 0x02014b50;
    private const uint AssinaturaCabecalhoLocal = 0x04034b50;
    private const int TamanhoFimDiretorio = 22;
    private const int MaximoComentario = ushort.MaxValue;

    public sealed record Entrada(string Nome, uint Crc32, long TamanhoCompactado, long Tamanho, long Offset, ushort Metodo);

    public async Task<IReadOnlyList<Entrada>> LerDiretorioAsync(CancellationToken ct)
    {
        // O registro de fim de diretório fica nos últimos 22 bytes + comentário opcional.
        var cauda = await LerSufixoAsync(TamanhoFimDiretorio + MaximoComentario, ct);
        var fim = LocalizarFimDiretorio(cauda)
            ?? throw new InvalidDataException($"{url} não parece ser um ZIP (fim do diretório não encontrado).");

        var tamanhoDiretorio = BinaryPrimitives.ReadUInt32LittleEndian(cauda.AsSpan(fim + 12));
        var offsetDiretorio = BinaryPrimitives.ReadUInt32LittleEndian(cauda.AsSpan(fim + 16));
        if (offsetDiretorio == uint.MaxValue || tamanhoDiretorio == uint.MaxValue)
            throw new NotSupportedException($"{url} usa ZIP64, ainda não suportado.");

        var diretorio = await LerFaixaAsync(offsetDiretorio, tamanhoDiretorio, ct);
        return LerEntradas(diretorio);
    }

    public async Task<Stream> AbrirAsync(Entrada entrada, CancellationToken ct)
    {
        // O cabeçalho local tem nome e campo extra próprios; o tamanho deles define onde os dados começam.
        var cabecalho = await LerFaixaAsync(entrada.Offset, 30, ct);
        if (BinaryPrimitives.ReadUInt32LittleEndian(cabecalho) != AssinaturaCabecalhoLocal)
            throw new InvalidDataException($"Cabeçalho local inválido para {entrada.Nome}.");

        var tamanhoNome = BinaryPrimitives.ReadUInt16LittleEndian(cabecalho.AsSpan(26));
        var tamanhoExtra = BinaryPrimitives.ReadUInt16LittleEndian(cabecalho.AsSpan(28));
        var inicioDados = entrada.Offset + 30 + tamanhoNome + tamanhoExtra;

        var resposta = await EnviarFaixaAsync(inicioDados, entrada.TamanhoCompactado, ct);
        var dados = await resposta.Content.ReadAsStreamAsync(ct);

        Stream conteudo = entrada.Metodo switch
        {
            0 => dados,
            8 => new DeflateStream(dados, CompressionMode.Decompress),
            _ => throw new NotSupportedException($"Método de compressão {entrada.Metodo} não suportado ({entrada.Nome})."),
        };
        return new StreamComDono(conteudo, resposta);
    }

    internal static int? LocalizarFimDiretorio(ReadOnlySpan<byte> cauda)
    {
        for (var i = cauda.Length - TamanhoFimDiretorio; i >= 0; i--)
        {
            if (BinaryPrimitives.ReadUInt32LittleEndian(cauda[i..]) == AssinaturaFimDiretorio)
                return i;
        }
        return null;
    }

    internal static IReadOnlyList<Entrada> LerEntradas(ReadOnlySpan<byte> diretorio)
    {
        var entradas = new List<Entrada>();
        var pos = 0;
        while (pos + 46 <= diretorio.Length
               && BinaryPrimitives.ReadUInt32LittleEndian(diretorio[pos..]) == AssinaturaDiretorio)
        {
            var registro = diretorio[pos..];
            var flags = BinaryPrimitives.ReadUInt16LittleEndian(registro[8..]);
            var metodo = BinaryPrimitives.ReadUInt16LittleEndian(registro[10..]);
            var crc = BinaryPrimitives.ReadUInt32LittleEndian(registro[16..]);
            var compactado = BinaryPrimitives.ReadUInt32LittleEndian(registro[20..]);
            var tamanho = BinaryPrimitives.ReadUInt32LittleEndian(registro[24..]);
            var tamanhoNome = BinaryPrimitives.ReadUInt16LittleEndian(registro[28..]);
            var tamanhoExtra = BinaryPrimitives.ReadUInt16LittleEndian(registro[30..]);
            var tamanhoComentario = BinaryPrimitives.ReadUInt16LittleEndian(registro[32..]);
            var offset = BinaryPrimitives.ReadUInt32LittleEndian(registro[42..]);

            // Bit 11 indica nome em UTF-8; senão é CP437, que para nomes ASCII é igual a Latin1.
            var codificacao = (flags & 0x800) != 0 ? Encoding.UTF8 : Encoding.Latin1;
            var nome = codificacao.GetString(registro.Slice(46, tamanhoNome));

            entradas.Add(new Entrada(nome, crc, compactado, tamanho, offset, metodo));
            pos += 46 + tamanhoNome + tamanhoExtra + tamanhoComentario;
        }
        return entradas;
    }

    private async Task<byte[]> LerSufixoAsync(long bytes, CancellationToken ct)
    {
        using var requisicao = new HttpRequestMessage(HttpMethod.Get, url);
        requisicao.Headers.Range = new RangeHeaderValue(null, bytes);
        using var resposta = await http.SendAsync(requisicao, HttpCompletionOption.ResponseHeadersRead, ct);
        GarantirParcial(resposta);
        return await resposta.Content.ReadAsByteArrayAsync(ct);
    }

    private async Task<byte[]> LerFaixaAsync(long inicio, long tamanho, CancellationToken ct)
    {
        using var resposta = await EnviarFaixaAsync(inicio, tamanho, ct);
        return await resposta.Content.ReadAsByteArrayAsync(ct);
    }

    private async Task<HttpResponseMessage> EnviarFaixaAsync(long inicio, long tamanho, CancellationToken ct)
    {
        var requisicao = new HttpRequestMessage(HttpMethod.Get, url);
        requisicao.Headers.Range = new RangeHeaderValue(inicio, inicio + tamanho - 1);
        var resposta = await http.SendAsync(requisicao, HttpCompletionOption.ResponseHeadersRead, ct);
        GarantirParcial(resposta);
        return resposta;
    }

    private void GarantirParcial(HttpResponseMessage resposta)
    {
        resposta.EnsureSuccessStatusCode();
        if (resposta.StatusCode != HttpStatusCode.PartialContent)
            throw new InvalidOperationException($"{url} não respondeu à requisição Range (HTTP {(int)resposta.StatusCode}).");
    }

    /// <summary>Garante que a resposta HTTP seja liberada junto com o stream de dados.</summary>
    private sealed class StreamComDono(Stream interno, IDisposable dono) : Stream
    {
        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => throw new NotSupportedException();
        public override long Position { get => throw new NotSupportedException(); set => throw new NotSupportedException(); }
        public override int Read(byte[] buffer, int offset, int count) => interno.Read(buffer, offset, count);
        public override ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken ct = default) => interno.ReadAsync(buffer, ct);
        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken ct) => interno.ReadAsync(buffer, offset, count, ct);
        public override void Flush() { }
        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
        public override void SetLength(long value) => throw new NotSupportedException();
        public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                interno.Dispose();
                dono.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
