using MultiVendorECommerce.Core.Models;

namespace MultiVendorECommerce.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        void Register(User user);
        User GetUserByEmail(string email);
    }
}
