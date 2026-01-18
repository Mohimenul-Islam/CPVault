using System.ComponentModel.DataAnnotations;

namespace CPVault.Dtos;

public class CreateDeckDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    public bool IsPublic { get; set; }
}
