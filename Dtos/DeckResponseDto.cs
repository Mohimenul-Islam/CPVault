namespace CPVault.Dtos;

public class DeckResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool IsPublic { get; set; }
    public bool IsOwner { get; set; }
}
