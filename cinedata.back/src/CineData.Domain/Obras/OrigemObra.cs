namespace CineData.Domain.Obras;

public enum OrigemObra
{
    /// <summary>Obra brasileira, identificada por CPB (prefixo B).</summary>
    Nacional,

    /// <summary>Obra estrangeira, identificada por ROE (prefixo E).</summary>
    Estrangeira,

    /// <summary>Registro genérico (prefixo G): eventos, programação sem obra específica.</summary>
    Generica,
}
