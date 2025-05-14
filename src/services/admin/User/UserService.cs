using DeepAgenix.Common;
using DeepAgenix.Common.Authentication;
using DeepAgenix.Common.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SqlSugar;

namespace DeepAgenix.Admin.User;
public class UserService(IOptions<JwtTokenOption> options, SqlSugarClient sqlSugarClient, IUserContext userContext)
{
    public async Task<TokenVo> LoginAsync(long? userId = null, bool? isAnonymousUser = false)
    {
        var userIdTemp = userId ?? SnowflakeIdGenerator.Instanse.NextId();
        (var accessToken, var expires) = JwtTokenGenerator.GenerateToken(userIdTemp, options.Value, isAnonymousUser is true ? options.Value.AnonymousUserTokenExpireMonths * 30 * 24 * 60 : null);
        var refreshToken = Guid.NewGuid().ToString("N");
        await sqlSugarClient.Insertable(new RefreshToken(refreshToken, expires.AddDays(options.Value.RefreshTokenExpireDays), userIdTemp)).ExecuteCommandAsync();
        return new TokenVo(accessToken, refreshToken, expires);
    }

    public async Task<TokenVo> RefreshAsync(string refreshToken)
    {
        var data = await sqlSugarClient.Queryable<RefreshToken>()
            .LeftJoin<Users>((r, u) => r.UserId == u.Id)
            .Where((r, u) =>
                r.Token == refreshToken.Trim()
                && r.Enable == true
                && r.ExpiresAt > DateTime.UtcNow
                && r.Deleted == false)
            .Select((r, u) => new
            {
                r.Id,
                r.UserId,
                IsAnonymousUser = u.Username == null,
            })
            .FirstAsync()
            .AssertNotNull("Refresh token expired or invalid. Please log in again", statusCode: 401);
        sqlSugarClient.BeginTran();
        try
        {
            await sqlSugarClient.Updateable<RefreshToken>()
                .SetColumns(_ => _.Enable == false)
                .Where(_ => _.Id == data.Id)
                .ExecuteCommandAsync();
            var result = await LoginAsync(userId: data.UserId, isAnonymousUser: data.IsAnonymousUser);
            sqlSugarClient.CommitTran();
            return result;
        }
        catch
        {
            sqlSugarClient.RollbackTran();
            throw;
        }
    }

    public async Task<TokenVo> RegisterAsync(string username, string password, long? userId = null)
    {
        await sqlSugarClient.Queryable<Users>()
            .AnyAsync(_ => _.Deleted == false && _.Username.Equals(username.Trim(), StringComparison.CurrentCultureIgnoreCase))
            .AssertFalse("The username is already taken. Please choose a different one.");
        password = new PasswordHasher<string>().HashPassword(username, password);
        sqlSugarClient.BeginTran();
        try
        {
            var user = new Users(username, password);
            if (userId is not null)
                user.Id = (long)userId;
            await sqlSugarClient.Insertable(user).ExecuteCommandAsync();
            var result = await LoginAsync(userId: user.Id, isAnonymousUser: false);
            sqlSugarClient.CommitTran();
            return result;
        }
        catch
        {
            sqlSugarClient.RollbackTran();
            throw;
        }
    }

    public async Task<TokenVo> LoginAsync(string username, string password)
    {
        var user = await sqlSugarClient.Queryable<Users>()
            .FirstAsync(_ => _.Deleted == false && _.Username.Equals(username.Trim(), StringComparison.CurrentCultureIgnoreCase))
            .AssertNotNull("The user does not exist. Please check your username or register for a new account.");
        (new PasswordHasher<string>().VerifyHashedPassword(user.Username, user.Password, password) is PasswordVerificationResult.Success)
        .AssertTrue("Incorrect password. Please try again.");
        return await LoginAsync(userId: user.Id, isAnonymousUser: false);
    }
    
    public async Task<TokenVo> AnonymousRegisterAsync(string username, string password)
    {
        userContext.UserId.AssertNotNull("Unable to identify the current anonymous user. Please try again or start a new session.");
        return await RegisterAsync(username, password, userContext.UserId);
    }
}