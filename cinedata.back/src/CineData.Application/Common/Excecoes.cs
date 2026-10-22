namespace CineData.Application.Common;

/// <summary>Recurso inexistente (vira 404 na API).</summary>
public sealed class RecursoNaoEncontradoException(string message) : Exception(message);

/// <summary>Entrada inválida do cliente (vira 400 na API).</summary>
public sealed class ValidacaoException(string message) : Exception(message);
