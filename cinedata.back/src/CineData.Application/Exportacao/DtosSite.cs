namespace CineData.Application.Exportacao;

/// <summary>
/// <c>indice.json</c>: o que o export tem e qual período o site mostra por padrão em cada granularidade.
/// Datas são o início do período; o front converte para a chave da URL.
/// </summary>
/// <param name="DadosAte">Último dia com sessões publicadas pela ANCINE.</param>
/// <param name="UltimoDiaConsolidado">Último dia com ao menos 90% da mediana de salas (ADR 0004).</param>
/// <param name="Granularidades">Chave = semana, mes, trimestre, semestre ou ano.</param>
public sealed record IndiceSiteDto(
    DateTimeOffset GeradoEm,
    DateOnly Desde,
    DateOnly DadosAte,
    DateOnly UltimoDiaConsolidado,
    IReadOnlyDictionary<string, GranularidadeSiteDto> Granularidades,
    int Obras,
    string Fonte);

/// <param name="Padrao">Início do período da página inicial da granularidade: o último completo (ADR 0004 e 0005).</param>
/// <param name="Primeiro">Início do período exportado mais antigo.</param>
/// <param name="Ultimo">Início do período exportado mais recente (pode ser parcial).</param>
public sealed record GranularidadeSiteDto(DateOnly Padrao, DateOnly Primeiro, DateOnly Ultimo, int Total);

/// <summary>Linha de <c>busca.json</c>: só as obras que têm página no site.</summary>
/// <param name="TituloOriginal">Nulo quando igual ao título no Brasil (índice enxuto).</param>
/// <param name="Publico">Público de todo o histórico importado.</param>
public sealed record ObraBuscaDto(string Codigo, string Titulo, string? TituloOriginal, string Origem, long Publico, string? Poster = null);

public sealed record ResultadoExportacao(int Periodos, int Obras, int Arquivos, long Bytes, TimeSpan Duracao)
{
    public override string ToString() =>
        $"{Arquivos:N0} arquivos, {Bytes / 1024.0 / 1024.0:N1} MB em {Duracao.TotalSeconds:N0} s " +
        $"({Periodos:N0} períodos, {Obras:N0} obras)";
}
