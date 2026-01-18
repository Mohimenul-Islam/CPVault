using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CPVault.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "healthy" });
    }

    [Authorize]
    [HttpGet("auth")]
    public IActionResult GetAuth()
    {
        return Ok(new { status = "authorized" });
    }
}
