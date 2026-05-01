using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Services.Implementations;
using MultiVendorECommerce.Services.Interfaces;
using System.Security.Claims;

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

        [HttpGet("user/{userId}")]
        public IActionResult GetUserOrders(int userId)
        {
            var orders = _service.GetOrdersByUserId(userId);
            return Ok(orders);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("dashboard")]
        public IActionResult GetAdminDashboard()
        {
            var result = _service.GetAdminDashboard();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("my-orders")]
        public IActionResult GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var orders = _service.GetOrdersByUserId(userId);

            return Ok(orders);
        }



    }
}
