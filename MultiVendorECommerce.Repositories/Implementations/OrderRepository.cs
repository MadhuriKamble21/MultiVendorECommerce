using MySql.Data.MySqlClient;
using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Core.Models;
using MultiVendorECommerce.Repositories.DBHelper;
using MultiVendorECommerce.Repositories.Interfaces;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace MultiVendorECommerce.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DbHelper _dbHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public OrderRepository(DbHelper dbHelper , IHttpContextAccessor httpContextAccessor)
        {
            _dbHelper = dbHelper;
            _httpContextAccessor = httpContextAccessor;
        }

        public void PlaceOrder(PlaceOrderRequestDto dto)
        {
            using (var conn = _dbHelper.GetConnection())
            {
                conn.Open();

                using (var transaction = conn.BeginTransaction())
                {
                    try
                    {
                        decimal totalAmount = 0;

                        
                        foreach (var item in dto.Items)
                        {
                            var stockCmd = new MySqlCommand (
                                "SELECT Price, Stock FROM Products WHERE ProductId = @ProductId",
                                conn, transaction);

                            stockCmd.Parameters.AddWithValue("@ProductId", item.ProductId);

                            using (var reader = stockCmd.ExecuteReader())
                            {
                                if (!reader.Read())
                                    throw new Exception("Product not found");

                                decimal price = (decimal)reader["Price"];
                                int stock = (int)reader["Stock"];

                                if (stock < item.Quantity)
                                    throw new Exception("Insufficient stock");

                                totalAmount += price * item.Quantity;
                            }
                        }

                        
                                            var orderCmd = new MySqlCommand(
                        @"INSERT INTO Orders(UserId, TotalAmount, OrderDate)
                          VALUES(@UserId, @TotalAmount, NOW());
                          SELECT LAST_INSERT_ID();",
                        conn, transaction);

                        

                        var userId = int.Parse(
                            _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value
                        );

                        orderCmd.Parameters.AddWithValue("@UserId", userId);

                        //orderCmd.Parameters.AddWithValue("@UserId", dto.UserId);
                        orderCmd.Parameters.AddWithValue("@TotalAmount", totalAmount);

                        int orderId = Convert.ToInt32(orderCmd.ExecuteScalar());



                        foreach (var item in dto.Items)
                        {
                            var priceCmd = new MySqlCommand (
                                "SELECT Price FROM Products WHERE ProductId=@ProductId",
                                conn, transaction);

                            priceCmd.Parameters.AddWithValue("@ProductId", item.ProductId);
                            decimal price = (decimal)priceCmd.ExecuteScalar();

                            // Insert OrderItem
                            var itemCmd = new MySqlCommand (
                                @"INSERT INTO OrderItems(OrderId, ProductId, Quantity, Price)
                          VALUES(@OrderId, @ProductId, @Quantity, @Price)",
                                conn, transaction);

                            itemCmd.Parameters.AddWithValue("@OrderId", orderId);
                            itemCmd.Parameters.AddWithValue("@ProductId", item.ProductId);
                            itemCmd.Parameters.AddWithValue("@Quantity", item.Quantity);
                            itemCmd.Parameters.AddWithValue("@Price", price);

                            itemCmd.ExecuteNonQuery();

                            // Deduct stock
                            var updateStockCmd = new MySqlCommand (
                                "UPDATE Products SET Stock = Stock - @Qty WHERE ProductId=@ProductId",
                                conn, transaction);

                            updateStockCmd.Parameters.AddWithValue("@Qty", item.Quantity);
                            updateStockCmd.Parameters.AddWithValue("@ProductId", item.ProductId);

                            updateStockCmd.ExecuteNonQuery();
                        }

                        
                        var paymentCmd = new MySqlCommand (
                            @"INSERT INTO Payments(OrderId, Amount, PaymentStatus)
                      VALUES(@OrderId, @Amount, 'SUCCESS')",
                            conn, transaction);

                        paymentCmd.Parameters.AddWithValue("@OrderId", orderId);
                        paymentCmd.Parameters.AddWithValue("@Amount", totalAmount);

                        paymentCmd.ExecuteNonQuery();

                        
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }
        public List<OrderResponseDto> GetOrdersByUserId(int userId)
        {
            var orders = new List<OrderResponseDto>();

            using (var conn = _dbHelper.GetConnection())
            {
                var cmd = new MySqlCommand (
                    "SELECT OrderId, TotalAmount, OrderDate FROM Orders WHERE UserId = @UserId ORDER BY OrderDate DESC",
                    conn);

                cmd.Parameters.AddWithValue("@UserId", userId);

                conn.Open();

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        orders.Add(new OrderResponseDto
                        {
                            OrderId = (int)reader["OrderId"],
                            TotalAmount = (decimal)reader["TotalAmount"],
                            OrderDate = (DateTime)reader["OrderDate"]
                        });
                    }
                }
            }

            return orders;
        }

        public AdminDashboardDto GetAdminDashboard()
        {
            var dashboard = new AdminDashboardDto();

            using (var conn = _dbHelper.GetConnection())
            {
                conn.Open();

                // Total Orders
                var orderCmd = new MySqlCommand ("SELECT COUNT(*) FROM Orders", conn);
                dashboard.TotalOrders = (int)orderCmd.ExecuteScalar();

                // Total Sales
                var salesCmd = new MySqlCommand ("SELECT ISNULL(SUM(TotalAmount), 0) FROM Orders", conn);
                dashboard.TotalSales = (decimal)salesCmd.ExecuteScalar();
            }

            return dashboard;
        }




    }
}
