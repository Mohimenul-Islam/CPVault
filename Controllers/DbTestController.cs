using Microsoft.AspNetCore.Mvc;
using CPVault.Data;

namespace CPVault.Controllers;

[ApiController]
[Route("api/db-test")]
public class DbTestController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public DbTestController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult Test()
    {
        return Ok("Database connection works");
    }
}
