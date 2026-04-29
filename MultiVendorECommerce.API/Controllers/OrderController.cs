using Microsoft.AspNetCore.Mvc;
using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Services.Interfaces;

namespace MultiVendorECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost("place")]
        public IActionResult PlaceOrder([FromBody] PlaceOrderRequestDto dto)
        {
            try
            {
                _service.PlaceOrder(dto);
                return Ok("Order placed successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
