
using MultiVendorECommerce.Core.DTOs;

namespace MultiVendorECommerce.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        void PlaceOrder(PlaceOrderRequestDto dto);
        List<OrderResponseDto> GetOrdersByUserId(int userId);

    }
}

