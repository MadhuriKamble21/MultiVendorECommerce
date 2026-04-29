using Microsoft.AspNetCore.Mvc;
using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Services.Interfaces;

namespace MultiVendorECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequestDto dto)
        {
            _service.Register(dto);
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequestDto dto)
        {
            var token = _service.Login(dto);
            return Ok(new { Token = token });
        }
    }
}
