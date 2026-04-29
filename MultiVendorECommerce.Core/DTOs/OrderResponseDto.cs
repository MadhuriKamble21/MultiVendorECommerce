using System;

namespace MultiVendorECommerce.Core.DTOs
{
    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
    }
}
