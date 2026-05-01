using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Repositories.Interfaces;
using MultiVendorECommerce.Services.Interfaces;
using System.Collections.Generic;

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

        public List<OrderResponseDto> GetOrdersByUserId(int userId)
        {
            return _repo.GetOrdersByUserId(userId);
        }

        public AdminDashboardDto GetAdminDashboard()
        {
            return _repo.GetAdminDashboard();
        }


    }
}
