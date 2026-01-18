using System.ComponentModel.DataAnnotations;

namespace CPVault.Dtos;

public class UpdateNoteDto
{
    [Required]
    [MaxLength(200)]
    public string ProblemName { get; set; } = null!;

    public string? ProblemLink { get; set; }

    [Required]
    public string KeyTakeaway { get; set; } = null!;

    public string? ErrorLog { get; set; }

    [Required]
    public string Solution { get; set; } = null!;

    public string? AlternativeSolution { get; set; }
}
