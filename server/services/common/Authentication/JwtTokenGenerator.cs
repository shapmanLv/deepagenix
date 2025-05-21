using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dm.util;
using Microsoft.IdentityModel.Tokens;

namespace DeepAgenix.Common.Authentication;
public class JwtTokenGenerator
{
    public static (string token, DateTime expires) GenerateToken(long userId, JwtTokenOption option, int? expireMinutes = null)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(option.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString())
        };

        var expires = DateTime.UtcNow.AddMinutes(expireMinutes ?? option.ExpireMinutes);
        var token = new JwtSecurityToken(
            issuer: option.Issuer,
            audience: option.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expires,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }
}

public class JwtTokenOption
{
    public string Secret { get; set; } = "";
    public string Issuer { get; set; } = "";
    public string Audience { get; set; } = "";
    public int ExpireMinutes { get; set; } = 120;
    public int RefreshTokenExpireDays { get; set; } = 7;
    public int AnonymousUserTokenExpireMonths { get; set; } = 120;
}