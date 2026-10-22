using CineData.Domain.Bilheteria;

namespace CineData.Application.Abstractions;

/// <summary>
/// Linha crua do CSV, já com tipos primitivos. Campos que não puderam ser lidos chegam nulos;
/// a validação de regra de negócio acontece ao montar as entidades.
/// </summary>
public sealed record LinhaBilheteria(
    DateOnly? DataExibicao,
    DateTime? InicioSessao,
    string TituloOriginal,
    string? TituloBrasil,
    string CodigoObra,
    TipoAudio? Audio,
    bool? Legendada,
    string? PaisObra,
    int? RegistroSala,
    string NomeSala,
    int? Publico,
    int? RegistroGrupoExibidor,
    int? RegistroExibidor,
    int? RegistroComplexo,
    string Municipio,
    string Uf,
    string RazaoSocialExibidora,
    string CnpjExibidora);

public sealed record LinhaLancamento(
    DateOnly? DataLancamento,
    string TituloOriginal,
    string CodigoObra,
    string TipoObra,
    string? PaisObra,
    long? PublicoTotal,
    decimal? RendaTotal,
    string Distribuidora,
    string CnpjDistribuidora);

public sealed record LinhaSala(
    int? RegistroSala,
    string NomeSala,
    int? Assentos,
    int? RegistroComplexo,
    string Municipio,
    string Uf,
    int? RegistroExibidor,
    string NomeExibidor,
    string CnpjExibidor);

public interface ILeitorCsvAncine
{
    IAsyncEnumerable<LinhaBilheteria> LerBilheteriaAsync(Stream conteudo, CancellationToken ct);
    IAsyncEnumerable<LinhaLancamento> LerLancamentosAsync(Stream conteudo, CancellationToken ct);
    IAsyncEnumerable<LinhaSala> LerSalasAsync(Stream conteudo, CancellationToken ct);
}
