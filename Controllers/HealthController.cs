using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CPVault.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [Authorize]
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Authorized access works");
    }
}
