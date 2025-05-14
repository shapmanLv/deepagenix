using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;

namespace DeepAgenix.Common.Authentication;
public class UserContextMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IUserContext userContext)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = context.User.FindFirst(JwtRegisteredClaimNames.Sub) ?? context.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
            if (userIdClaim is not null && long.TryParse(userIdClaim.Value, out var userId))
                userContext.UserId = userId;
        }

        await next(context);
    }
}