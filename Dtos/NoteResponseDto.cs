namespace CPVault.Dtos;

public class NoteResponseDto
{
    public int Id { get; set; }
    public string ProblemName { get; set; } = null!;
    public string? ProblemLink { get; set; }
    public string KeyTakeaway { get; set; } = null!;
    public string? ErrorLog { get; set; }
    public string Solution { get; set; } = null!;
    public string? AlternativeSolution { get; set; }
}
