using MultiVendorECommerce.Core.Models;
using System.Collections.Generic;

namespace MultiVendorECommerce.Repositories.Interfaces
{
    public interface IProductRepository
    {
        void AddProduct(Product product);
        List<Product> GetProductsByVendor(int vendorId);
        List<Product> GetAllProducts(int page, int pageSize, string search, decimal? minPrice, decimal? maxPrice);
        void UpdateProduct(Product product);
        void DeleteProduct(int productId, int vendorId);
        Product GetProductById(int productId);


    }
}
