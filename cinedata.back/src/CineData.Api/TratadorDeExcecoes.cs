using CineData.Application.Common;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CineData.Api;

/// <summary>Traduz exceções da Application em respostas ProblemDetails (RFC 9457).</summary>
internal sealed class TratadorDeExcecoes(IProblemDetailsService problemDetails) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext http, Exception excecao, CancellationToken ct)
    {
        (int status, string titulo)? mapeado = excecao switch
        {
            ValidacaoException => (StatusCodes.Status400BadRequest, "Requisição inválida"),
            RecursoNaoEncontradoException => (StatusCodes.Status404NotFound, "Não encontrado"),
            _ => null,
        };
        if (mapeado is not { } m) return false;

        http.Response.StatusCode = m.status;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = http,
            ProblemDetails = new ProblemDetails { Status = m.status, Title = m.titulo, Detail = excecao.Message },
        });
    }
}
