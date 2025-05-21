using DeepAgenix.Common.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeepAgenix.Admin.User;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UserController(UserService userService)
{
    [HttpPost("refresh/{refreshToken}")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> RefreshAsync(string refreshToken)
        => await userService.RefreshAsync(refreshToken).FormatAsApiResult();
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> RegisterAsync(LoginVo vo)
        => await userService.RegisterAsync(vo.username!, vo.password!).FormatAsApiResult();
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> LoginAsync(LoginVo vo)
        => await userService.LoginAsync(vo.username!, vo.password!).FormatAsApiResult();
    [HttpPost("anonymous/login")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> LoginAsync()
        => await userService.LoginAsync(isAnonymousUser: true).FormatAsApiResult();
    [HttpPost("anonymous/register")]
    public async Task<ApiResult<TokenVo>> AnonymousRegisterAsync(LoginVo vo)
        => await userService.AnonymousRegisterAsync(vo.username!, vo.password!).FormatAsApiResult();
    [HttpPost("logout")]
    public async Task<ApiResult> LogoutAsync()
        => await userService.LogoutAsync().FormatAsApiResult();
}