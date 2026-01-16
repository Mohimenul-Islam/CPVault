using Microsoft.AspNetCore.Mvc;

namespace CPVault.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("CPVault API is running");
    }
}
