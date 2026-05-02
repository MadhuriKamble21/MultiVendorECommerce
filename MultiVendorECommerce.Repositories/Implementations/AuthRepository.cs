using MultiVendorECommerce.Core.Models;
using MultiVendorECommerce.Repositories.DBHelper;
using MultiVendorECommerce.Repositories.Interfaces;
using MySql.Data.MySqlClient;
using System.Data;

namespace MultiVendorECommerce.Repositories.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DbHelper _dbHelper;

        public AuthRepository(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public void Register(User user)
        {
            using (MySqlConnection conn = _dbHelper.GetConnection())
            {
                string query = @"INSERT INTO Users (Name, Email, PasswordHash, Role, CreatedAt)
                                 VALUES (@Name, @Email, @PasswordHash, @Role, NOW())";

                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Name", user.Name);
                    cmd.Parameters.AddWithValue("@Email", user.Email);
                    cmd.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
                    cmd.Parameters.AddWithValue("@Role", user.Role);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public User GetUserByEmail(string email)
        {
            using (MySqlConnection conn = _dbHelper.GetConnection())
            {
                string query = "SELECT * FROM Users WHERE Email = @Email";

                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);

                    conn.Open();

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new User
                            {
                                UserId = Convert.ToInt32(reader["UserId"]),
                                Name = reader["Name"].ToString(),
                                Email = reader["Email"].ToString(),
                                PasswordHash = reader["PasswordHash"].ToString(),
                                Role = reader["Role"].ToString()
                            };
                        }
                    }
                }
            }

            return null;
        }
    }
}
