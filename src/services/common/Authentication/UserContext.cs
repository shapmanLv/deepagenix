namespace DeepAgenix.Common.Authentication;

public interface IUserContext
{
    long? UserId { get; set; }
}

public class UserContext : IUserContext
{
    private static readonly AsyncLocal<long?> _userId = new();

    public long? UserId
    {
        get => _userId.Value;
        set => _userId.Value = value;
    }
}