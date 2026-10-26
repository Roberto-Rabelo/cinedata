namespace CineData.Application.Exportacao;

/// <summary>Destino do export estático: uma pasta de JSON que o front lê no lugar da API.</summary>
public interface IGravadorSite
{
    /// <summary>Começa um export novo, separado do anterior até <see cref="ConcluirAsync"/>.</summary>
    Task IniciarAsync(CancellationToken ct);

    /// <summary>Grava <paramref name="conteudo"/> em JSON (a mesma forma da API) e devolve o tamanho em bytes.</summary>
    Task<long> GravarAsync<T>(string caminho, T conteudo, CancellationToken ct);

    /// <summary>
    /// Troca o export anterior pelo novo de uma vez: obras e períodos que saíram não ficam para trás, e um export
    /// interrompido não deixa o site pela metade.
    /// </summary>
    Task ConcluirAsync(CancellationToken ct);
}
