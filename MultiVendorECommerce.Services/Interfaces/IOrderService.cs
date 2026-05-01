using MultiVendorECommerce.Core.DTOs;
using System.Collections.Generic;

namespace MultiVendorECommerce.Services.Interfaces
{
    public interface IOrderService
    {
        void PlaceOrder(PlaceOrderRequestDto dto);
        List<OrderResponseDto> GetOrdersByUserId(int userId);
        AdminDashboardDto GetAdminDashboard();

    }
}
