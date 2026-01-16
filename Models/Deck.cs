namespace CPVault.Models;

public class Deck
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsPublic { get; set; } = false;

    public int OwnerUserId { get; set; }
    public User OwnerUser { get; set; } = null!;

    public ICollection<Note> Notes { get; set; } = new List<Note>();
}
