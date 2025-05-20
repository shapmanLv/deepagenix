namespace DeepAgenix.Common.Model;

public static class ApiResultExtension
{
    public static ApiResult FormatAsApiResult()
        => new ApiResult();
    public static ApiResult<T> FormatAsApiResult<T>(this T data)
        => new ApiResult<T>(data);
    public static async Task<ApiResult> FormatAsApiResult(this Task task)
    {
        await task;
        return new ApiResult();
    }
    public static async Task<ApiResult<T>> FormatAsApiResult<T>(this Task<T> task)
        => new ApiResult<T>(await task);
}