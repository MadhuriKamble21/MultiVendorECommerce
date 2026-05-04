using MultiVendorECommerce.Core.Models;
using MultiVendorECommerce.Repositories.DBHelper;
using MultiVendorECommerce.Repositories.Interfaces;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Data;

namespace MultiVendorECommerce.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly DbHelper _dbHelper;

        public ProductRepository(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public void AddProduct(Product product)
        {
            using (var conn = _dbHelper.GetConnection())
            {
                var cmd = new MySqlCommand ("INSERT INTO Products (VendorId, Name, Description, Price, Stock) VALUES (@VendorId, @Name, @Description, @Price, @Stock)", conn);

                
                cmd.Parameters.AddWithValue("@VendorId",1); //product.VendorId
                cmd.Parameters.AddWithValue("@Name", product.Name);
                cmd.Parameters.AddWithValue("@Description", "");
                cmd.Parameters.AddWithValue("@Price", product.Price);
                cmd.Parameters.AddWithValue("@Stock", product.Stock);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public List<Product> GetProductsByVendor(int vendorId)
        {
            var products = new List<Product>();

            using (var conn = _dbHelper.GetConnection())
            {
                var cmd = new MySqlCommand ("SELECT * FROM Products WHERE VendorId = @VendorId", conn);
                cmd.Parameters.AddWithValue("@VendorId", vendorId);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        products.Add(new Product
                        {
                            ProductId = (int)reader["ProductId"],
                            VendorId = (int)reader["VendorId"],
                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            Price = (decimal)reader["Price"],
                            Stock = (int)reader["Stock"]
                        });
                    }
                }
            }

            return products;
        }


      public List<Product> GetAllProducts(int page, int pageSize, string search, decimal? minPrice, decimal? maxPrice)
{
    var products = new List<Product>();

    using (var conn = _dbHelper.GetConnection())
    {
        var query = "SELECT * FROM Products WHERE 1=1";

        if (!string.IsNullOrEmpty(search))
            query += " AND Name LIKE @Search";

        if (minPrice.HasValue)
            query += " AND Price >= @MinPrice";

        if (maxPrice.HasValue)
            query += " AND Price <= @MaxPrice";

        int offset = (page - 1) * pageSize;

        // ✅ MySQL working pagination
        query += $" ORDER BY ProductId LIMIT {offset}, {pageSize}";

        var cmd = new MySqlCommand(query, conn);

        if (!string.IsNullOrEmpty(search))
            cmd.Parameters.AddWithValue("@Search", "%" + search + "%");

        if (minPrice.HasValue)
            cmd.Parameters.AddWithValue("@MinPrice", minPrice.Value);

        if (maxPrice.HasValue)
            cmd.Parameters.AddWithValue("@MaxPrice", maxPrice.Value);

        conn.Open();

        using (var reader = cmd.ExecuteReader())
        {
            while (reader.Read())
            {
                products.Add(new Product
                {
                    ProductId = Convert.ToInt32(reader["ProductId"]),
                    VendorId = Convert.ToInt32(reader["VendorId"]),
                    Name = reader["Name"]?.ToString(),
                    Description = reader["Description"]?.ToString(),
                    Price = Convert.ToDecimal(reader["Price"]),
                    Stock = Convert.ToInt32(reader["Stock"])
                });
            }
        }
    }

    return products;
}




        public Product GetProductById(int productId)
        {
            using (var conn = _dbHelper.GetConnection())
            {
                var cmd = new MySqlCommand ("SELECT * FROM Products WHERE ProductId=@Id", conn);
                cmd.Parameters.AddWithValue("@Id", productId);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Product
                        {
                            ProductId = (int)reader["ProductId"],
                            VendorId = (int)reader["VendorId"],
                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            Price = (decimal)reader["Price"],
                            Stock = (int)reader["Stock"]
                        };
                    }
                }
            }
            return null;
        }

        public void UpdateProduct(Product product)
        {
            using (var conn = _dbHelper.GetConnection())
            {
                var cmd = new MySqlCommand (@"
            UPDATE Products 
            SET Name=@Name, Description=@Description, Price=@Price, Stock=@Stock 
            WHERE ProductId=@ProductId AND VendorId=@VendorId", conn);

                cmd.Parameters.AddWithValue("@ProductId", product.ProductId);
                cmd.Parameters.AddWithValue("@VendorId", product.VendorId);
                cmd.Parameters.AddWithValue("@Name", product.Name);
                cmd.Parameters.AddWithValue("@Description", product.Description);
                cmd.Parameters.AddWithValue("@Price", product.Price);
                cmd.Parameters.AddWithValue("@Stock", product.Stock);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public void DeleteProduct(int productId, int vendorId)
        {
            using (var conn = _dbHelper.GetConnection())
            {
                var cmd = new MySqlCommand ("DELETE FROM Products WHERE ProductId=@Id AND VendorId=@VendorId", conn);

                cmd.Parameters.AddWithValue("@Id", productId);
                cmd.Parameters.AddWithValue("@VendorId", vendorId);

                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }




    }
}
