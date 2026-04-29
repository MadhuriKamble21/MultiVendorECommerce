using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Repositories.Interfaces;
using MultiVendorECommerce.Services.Interfaces;

namespace MultiVendorECommerce.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;

        public OrderService(IOrderRepository repo)
        {
            _repo = repo;
        }

        public void PlaceOrder(PlaceOrderRequestDto dto)
        {
            _repo.PlaceOrder(dto);
        }
    }
}
