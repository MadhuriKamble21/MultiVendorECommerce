using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Core.Models;
using System.Collections.Generic;

namespace MultiVendorECommerce.Services.Interfaces
{
    public interface IProductService
    {
        void AddProduct(int vendorId, ProductDto dto);
        List<Product> GetMyProducts(int vendorId);
        List<Product> GetAllProducts(int page, int pageSize, string search, decimal? minPrice, decimal? maxPrice);


        void UpdateProduct(int vendorId, int productId, ProductDto dto);

        void DeleteProduct(int vendorId, int productId);
    }
}
