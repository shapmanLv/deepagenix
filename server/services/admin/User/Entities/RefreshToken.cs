using DeepAgenix.Common;
using SqlSugar;

namespace DeepAgenix.Admin.User;
[SugarTable("adm_refresh_token")]
[SugarIndex("adm_refresh_token_index_token", nameof(RefreshToken.Token), OrderByType.Asc, isUnique: true)]
public class RefreshToken : Entity
{
    public RefreshToken() { }
    public RefreshToken(string token, DateTime expiresAt, long userId)
    {
        Token = token;
        ExpiresAt = expiresAt;
        UserId = userId;
    }
    [SugarColumn(ColumnDescription = "refresh token", Length = 32)]
    public string Token { get; set; } = "";
    [SugarColumn(ColumnDescription = "refresh token 有效期")]
    public DateTime ExpiresAt { get; set; }
    [SugarColumn(ColumnDescription = "用户ID")]
    public long UserId { get; set; }
    [SugarColumn(ColumnDescription = "refresh token是否有效")]
    public bool Enable { get; set; } = true;
}