using DeepAgenix.Common.Extensions;

namespace DeepAgenix.Common.Authentication;

public interface IUserContext
{
    long GetUserId();
    void SetUserId(long userId);
}

public class UserContext : IUserContext
{
    private static readonly AsyncLocal<long?> _userId = new();
    public long GetUserId() => (long)_userId.Value.AssertNotNull("无法鉴别用户身份");
    public void SetUserId(long userId) => _userId.Value = userId;
}