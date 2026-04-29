using MultiVendorECommerce.Core.Models;
using MultiVendorECommerce.Repositories.DBHelper;
using MultiVendorECommerce.Repositories.Interfaces;
using Microsoft.Data.SqlClient;
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
            using (SqlConnection conn = _dbHelper.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_RegisterUser", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

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
            using (SqlConnection conn = _dbHelper.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_LoginUser", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Email", email);

                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
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
