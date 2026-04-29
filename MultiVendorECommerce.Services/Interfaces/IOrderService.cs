using MultiVendorECommerce.Core.DTOs;

namespace MultiVendorECommerce.Services.Interfaces
{
    public interface IOrderService
    {
        void PlaceOrder(PlaceOrderRequestDto dto);
    }
}
