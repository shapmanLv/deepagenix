using DeepAgenix.Common.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DeepAgenix.Common.Exceptions;
public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (BusinessException ex)
        {
            context.Response.StatusCode = ex.StatusCode;
            context.Response.ContentType = "application/json";
            var apiResult = new ApiResult(ApiResultCode.BadRequest, ex.Msg);
            await context.Response.WriteAsJsonAsync(apiResult);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "全局异常拦截器捕获到异常");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            var apiResult = new ApiResult(ApiResultCode.InternalServerError, "Internal Server Error");
            await context.Response.WriteAsJsonAsync(apiResult);
        }
    }
}