namespace DeepAgenix.Common.Model;
public class ApiResult
{
    public ApiResult() { }
    public ApiResult(bool success, string msg)
    {
        Success = success;
        Msg = msg;
    }
    public bool Success { get; set; } = true;
    public string Msg { get; set; } = "";
}

public class ApiResult<T> : ApiResult
{
    public ApiResult(T data) => Data = data;
    public T? Data { get; set; }
}

public class BaseController
{
    private ApiResult ExecuteAndReturn(Action action)
    {
        action();
        return new ApiResult();
    }
    public ApiResult Execute(Action handler)
        => ExecuteAndReturn(() => handler());
    public ApiResult<TReturn> Execute<TReturn>(Func<TReturn> hander)
        => new ApiResult<TReturn>(hander());
    private async Task<ApiResult> ExecuteAndReturnAsync(Func<Task> func)
    {
        await func();
        return new ApiResult();
    }
    public async Task<ApiResult> Execute(Func<Task> handler)
        => await ExecuteAndReturnAsync(() => handler());
    public async Task<ApiResult<TReturn>> Execute<TReturn>(Func<Task<TReturn>> handler)
        => new ApiResult<TReturn>(await handler());
}