namespace CineData.Domain.Salas;

/// <summary>Empresa que opera as salas (value object embutido na sala).</summary>
public sealed record Exibidor(int Registro, string RazaoSocial, string Cnpj, int? RegistroGrupo);
