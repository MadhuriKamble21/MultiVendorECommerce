using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Services.Interfaces;
using System.Security.Claims;

namespace MultiVendorECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Vendor")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult AddProduct(ProductDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            _service.AddProduct(userId, dto);

            return Ok("Product added");
        }

        [HttpGet]
        public IActionResult GetMyProducts()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var products = _service.GetMyProducts(userId);

            return Ok(products);
        }

        [HttpGet("all")]
        public IActionResult GetAllProducts(
    int page = 1,
    int pageSize = 5,
    string search = "",
    decimal? minPrice = null,
    decimal? maxPrice = null)
        {
            var products = _service.GetAllProducts(page, pageSize, search, minPrice, maxPrice);

            return Ok(products);
        }


        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, ProductDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            _service.UpdateProduct(userId, id, dto);

            return Ok("Product updated");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            _service.DeleteProduct(userId, id);

            return Ok("Product deleted");
        }



    }
}
