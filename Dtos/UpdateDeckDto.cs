using System.ComponentModel.DataAnnotations;

namespace CPVault.Dtos;

public class UpdateDeckDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    public bool IsPublic { get; set; }
}
