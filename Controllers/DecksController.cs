using CPVault.Data;
using CPVault.Dtos;
using CPVault.Extensions;
using CPVault.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CPVault.Controllers;

[ApiController]
[Route("api/decks")]
public class DecksController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public DecksController(ApplicationDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateDeckDto dto)
    {
        var userId = User.GetUserId();

        var deck = new Deck
        {
            Name = dto.Name,
            IsPublic = dto.IsPublic,
            OwnerUserId = userId
        };

        _db.Decks.Add(deck);
        await _db.SaveChangesAsync();

        return Ok(MapToDto(deck, userId));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var deck = await _db.Decks.FindAsync(id);
        if (deck == null)
            return NotFound();

        var userId = GetCurrentUserIdOrNull();

        if (!deck.IsPublic && deck.OwnerUserId != userId)
            return Forbid();

        return Ok(MapToDto(deck, userId));
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var userId = User.GetUserId();

        var decks = await _db.Decks
            .Where(d => d.OwnerUserId == userId)
            .ToListAsync();

        return Ok(decks.Select(d => MapToDto(d, userId)));
    }

    [HttpGet("public")]
    public async Task<IActionResult> GetPublic()
    {
        var userId = GetCurrentUserIdOrNull();

        var decks = await _db.Decks
            .Where(d => d.IsPublic)
            .ToListAsync();

        return Ok(decks.Select(d => MapToDto(d, userId)));
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateDeckDto dto)
    {
        var userId = User.GetUserId();

        var deck = await _db.Decks.FindAsync(id);
        if (deck == null)
            return NotFound();

        if (deck.OwnerUserId != userId)
            return Forbid();

        deck.Name = dto.Name;
        deck.IsPublic = dto.IsPublic;

        await _db.SaveChangesAsync();

        return Ok(MapToDto(deck, userId));
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var deck = await _db.Decks.FindAsync(id);
        if (deck == null)
            return NotFound();

        if (deck.OwnerUserId != userId)
            return Forbid();

        _db.Decks.Remove(deck);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private int? GetCurrentUserIdOrNull()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim) : null;
    }

    private static DeckResponseDto MapToDto(Deck deck, int? currentUserId)
    {
        return new DeckResponseDto
        {
            Id = deck.Id,
            Name = deck.Name,
            IsPublic = deck.IsPublic,
            IsOwner = deck.OwnerUserId == currentUserId
        };
    }
}
