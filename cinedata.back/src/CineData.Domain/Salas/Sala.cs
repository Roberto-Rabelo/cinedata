using CineData.Domain.Common;

namespace CineData.Domain.Salas;

/// <summary>Sala de exibição, com o complexo, a localização e o exibidor que a opera.</summary>
public sealed class Sala : Entity<int>
{
    public string Nome { get; private set; } = string.Empty;
    public int RegistroComplexo { get; private set; }
    public string Municipio { get; private set; } = string.Empty;
    public Uf Uf { get; private set; }
    public Exibidor Exibidor { get; private set; } = null!;

    /// <summary>Capacidade da sala; vem do cadastro de salas, não da bilheteria.</summary>
    public int? Assentos { get; private set; }

    private Sala() { }

    public static Sala Criar(int registro, string nome, int registroComplexo, string municipio, Uf uf, Exibidor exibidor)
    {
        if (registro <= 0) throw new DomainException("Registro de sala deve ser positivo.");
        if (string.IsNullOrWhiteSpace(nome)) throw new DomainException($"Sala {registro} sem nome.");

        return new Sala
        {
            Id = registro,
            Nome = nome.Trim(),
            RegistroComplexo = registroComplexo,
            Municipio = municipio.Trim(),
            Uf = uf,
            Exibidor = exibidor,
        };
    }

    public void DefinirAssentos(int? assentos)
    {
        if (assentos is < 0) throw new DomainException("Assentos não podem ser negativos.");
        Assentos = assentos;
    }
}
