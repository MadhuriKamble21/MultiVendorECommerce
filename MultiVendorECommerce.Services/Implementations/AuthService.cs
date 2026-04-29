using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MultiVendorECommerce.Core.DTOs;
using MultiVendorECommerce.Core.Models;
//using MultiVendorECommerce.Repositories.DBHelper;
using MultiVendorECommerce.Repositories.Interfaces;
//using MultiVendorECommerce.

using MultiVendorECommerce.Services.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
//using IConfiguration = MultiVendorECommerce.Repositories.DBHelper.IConfiguration;

namespace MultiVendorECommerce.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;


        public AuthService(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        public void Register(RegisterRequestDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            _repo.Register(user);
        }

        public string Login(LoginRequestDto dto)
        {
            var user = _repo.GetUserByEmail(dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToInt32(_config["Jwt:ExpiryMinutes"])),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
