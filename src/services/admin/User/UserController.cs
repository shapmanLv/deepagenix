using DeepAgenix.Common.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeepAgenix.Admin.User;
[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UserController(UserService userService) : BaseController
{
    [HttpPost("refresh/{refreshToken}")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> RefreshAsync(string refreshToken)
        => await Execute(() => userService.RefreshAsync(refreshToken));
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> RegisterAsync(LoginVo vo)
        => await Execute(() => userService.RegisterAsync(vo.username!, vo.password!));
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> LoginAsync(LoginVo vo)
        => await Execute(() => userService.LoginAsync(vo.username!, vo.password!));

    [HttpPost("anonymous/login")]
    [AllowAnonymous]
    public async Task<ApiResult<TokenVo>> LoginAsync()
        => await Execute(() => userService.LoginAsync(isAnonymousUser: true));
    [HttpPost("anonymous/register")]
    public async Task<ApiResult<TokenVo>> AnonymousRegisterAsync(LoginVo vo)
        => await Execute(() => userService.AnonymousRegisterAsync(vo.username!, vo.password!));
}