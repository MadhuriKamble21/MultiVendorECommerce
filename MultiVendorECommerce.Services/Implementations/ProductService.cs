using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Core.Models;
using MultiVendorECommerce.Repositories.Interfaces;
using MultiVendorECommerce.Services.Interfaces;
using System.Collections.Generic;

namespace MultiVendorECommerce.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public void AddProduct(int vendorId, ProductDto dto)
        {
            if (dto.Price <= 0)
                throw new Exception("Price must be greater than zero");

            if (dto.Stock < 0)
                throw new Exception("Stock cannot be negative");

            if (string.IsNullOrEmpty(dto.Name))
                throw new Exception("Product name is required");

            var product = new Product
            {
                VendorId = vendorId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock
            };

            _repo.AddProduct(product);
        }


        public List<Product> GetMyProducts(int vendorId)
        {
            return _repo.GetProductsByVendor(vendorId);
        }

        public List<Product> GetAllProducts()
        {
             return _repo.GetAllProducts();
        }

        public void UpdateProduct(int vendorId, int productId, ProductDto dto)
        {
            var existing = _repo.GetProductById(productId);

            if (existing == null)
                throw new Exception("Product not found");

            if (existing.VendorId != vendorId)
                throw new Exception("Unauthorized");

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.Price = dto.Price;
            existing.Stock = dto.Stock;

            _repo.UpdateProduct(existing);
        }

        public void DeleteProduct(int vendorId, int productId)
        {
            var existing = _repo.GetProductById(productId);

            if (existing == null)
                throw new Exception("Product not found");

            if (existing.VendorId != vendorId)
                throw new Exception("Unauthorized");

            _repo.DeleteProduct(productId, vendorId);
        }


    }
}
