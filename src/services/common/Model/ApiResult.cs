namespace DeepAgenix.Common.Model;
public class ApiResult
{
    public ApiResult() { }
    public ApiResult(ApiResultCode apiResultCode, string msg)
    {
        Code = apiResultCode;
        Msg = msg;
    }
    public ApiResultCode Code { get; set; } = ApiResultCode.Success;
    public string Msg { get; set; } = "";
}

public class ApiResult<T> : ApiResult
{
    public ApiResult(T data) => Data = data;
    public T? Data { get; set; }
}

public enum ApiResultCode
{
    Success = 0,
    BadRequest = 1,
    InternalServerError = 500,
}