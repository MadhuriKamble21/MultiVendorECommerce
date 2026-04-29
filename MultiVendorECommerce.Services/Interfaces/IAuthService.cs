using MultiVendorECommerce.Core.DTOs;

namespace MultiVendorECommerce.Services.Interfaces
{
    public interface IAuthService
    {
        void Register(RegisterRequestDto dto);
        string Login(LoginRequestDto dto);
    }
}
