using CPVault.Data;
using CPVault.Dtos;
using CPVault.Extensions;
using CPVault.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CPVault.Controllers;

[ApiController]
public class NotesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public NotesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpPost("api/decks/{deckId:int}/notes")]
    public async Task<IActionResult> Create(int deckId, CreateNoteDto dto)
    {
        var userId = User.GetUserId();

        var deck = await _db.Decks.FindAsync(deckId);
        if (deck == null)
            return NotFound();

        if (deck.OwnerUserId != userId)
            return Forbid();

        var note = new Note
        {
            DeckId = deckId,
            ProblemName = dto.ProblemName,
            ProblemLink = dto.ProblemLink,
            KeyTakeaway = dto.KeyTakeaway,
            ErrorLog = dto.ErrorLog,
            Solution = dto.Solution,
            AlternativeSolution = dto.AlternativeSolution
        };

        _db.Notes.Add(note);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = note.Id }, ToDto(note));
    }

    [HttpGet("api/decks/{deckId:int}/notes")]
    public async Task<IActionResult> GetByDeck(int deckId)
    {
        var deck = await _db.Decks.FindAsync(deckId);
        if (deck == null)
            return NotFound();

        if (!deck.IsPublic)
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Forbid();

            var userId = User.GetUserId();
            if (deck.OwnerUserId != userId)
                return Forbid();
        }

        var notes = await _db.Notes
            .Where(n => n.DeckId == deckId)
            .Select(n => ToDto(n))
            .ToListAsync();

        return Ok(notes);
    }

    [HttpGet("api/notes/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var note = await _db.Notes
            .Include(n => n.Deck)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (note == null)
            return NotFound();

        if (!note.Deck.IsPublic)
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Forbid();

            var userId = User.GetUserId();
            if (note.Deck.OwnerUserId != userId)
                return Forbid();
        }

        return Ok(ToDto(note));
    }

    [Authorize]
    [HttpPut("api/notes/{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateNoteDto dto)
    {
        var userId = User.GetUserId();

        var note = await _db.Notes
            .Include(n => n.Deck)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (note == null)
            return NotFound();

        if (note.Deck.OwnerUserId != userId)
            return Forbid();

        note.ProblemName = dto.ProblemName;
        note.ProblemLink = dto.ProblemLink;
        note.KeyTakeaway = dto.KeyTakeaway;
        note.ErrorLog = dto.ErrorLog;
        note.Solution = dto.Solution;
        note.AlternativeSolution = dto.AlternativeSolution;

        await _db.SaveChangesAsync();

        return Ok(ToDto(note));
    }

    [Authorize]
    [HttpDelete("api/notes/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetUserId();

        var note = await _db.Notes
            .Include(n => n.Deck)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (note == null)
            return NotFound();

        if (note.Deck.OwnerUserId != userId)
            return Forbid();

        _db.Notes.Remove(note);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static NoteResponseDto ToDto(Note note)
    {
        return new NoteResponseDto
        {
            Id = note.Id,
            ProblemName = note.ProblemName,
            ProblemLink = note.ProblemLink,
            KeyTakeaway = note.KeyTakeaway,
            ErrorLog = note.ErrorLog,
            Solution = note.Solution,
            AlternativeSolution = note.AlternativeSolution
        };
    }
}
