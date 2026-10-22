using CineData.Domain.Common;
using CineData.Domain.Obras;

namespace CineData.Domain.Bilheteria;

/// <summary>Uma sessão exibida: a menor unidade de bilheteria informada pelos exibidores.</summary>
public sealed class Sessao : Entity<long>
{
    public CodigoObra CodigoObra { get; private set; }
    public int RegistroSala { get; private set; }
    public DateOnly DataExibicao { get; private set; }
    public DateTime Inicio { get; private set; }
    public int Publico { get; private set; }
    public TipoAudio Audio { get; private set; }
    public bool Legendada { get; private set; }

    public SemanaCinematografica Semana => SemanaCinematografica.Contendo(DataExibicao);

    private Sessao() { }

    public static Sessao Criar(
        CodigoObra obra, int registroSala, DateOnly dataExibicao, DateTime inicio,
        int publico, TipoAudio audio, bool legendada)
    {
        if (publico < 0) throw new DomainException("Público não pode ser negativo.");
        if (registroSala <= 0) throw new DomainException("Sessão sem sala válida.");

        return new Sessao
        {
            CodigoObra = obra,
            RegistroSala = registroSala,
            DataExibicao = dataExibicao,
            Inicio = inicio,
            Publico = publico,
            Audio = audio,
            Legendada = legendada,
        };
    }
}
