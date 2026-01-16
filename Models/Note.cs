namespace CPVault.Models;

public class Note
{
    public int Id { get; set; }

    public int DeckId { get; set; }
    public Deck Deck { get; set; } = null!;

    public string ProblemName { get; set; } = null!;

    public string? ProblemLink { get; set; }

    public string KeyTakeaway { get; set; } = null!;

    public string? ErrorLog { get; set; }

    public string Solution { get; set; } = null!;

    public string? AlternativeSolution { get; set; }
}
