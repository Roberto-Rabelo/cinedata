namespace CineData.Application.Ingestao;

public sealed record ResultadoImportacao(
    int ArquivosConsiderados,
    int ArquivosImportados,
    int ArquivosSemMudanca,
    int Linhas,
    int LinhasRejeitadas,
    TimeSpan Duracao);
