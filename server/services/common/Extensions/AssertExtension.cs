using DeepAgenix.Common.Exceptions;

namespace DeepAgenix.Common.Extensions;
public static class AssertExtension
{
    public static T AssertNotNull<T>(this T target, string msg, int statusCode = 200)
    {
        if (target is null)
            throw new BusinessException(msg, statusCode);
        return target;
    }

    public static T AssertNotNull<T>(this Nullable<T> target, string msg, int statusCode = 200)  where T : struct
    {
        if (target is null)
            throw new BusinessException(msg, statusCode);
        return target.Value;
    }

    public static async Task<T> AssertNotNull<T>(this Task<T> target, string msg, int statusCode = 200)
    {
        T value = await target;
        if (value is null)
            throw new BusinessException(msg, statusCode);
        return value;
    }

    public static void AssertTrue(this bool target, string msg, int statusCode = 200)
    {
        if (target is not true)
            throw new BusinessException(msg, statusCode);
    }

    public static async Task AssertTrue(this Task<bool> target, string msg, int statusCode = 200)
    {
        if (await target is not true)
            throw new BusinessException(msg, statusCode);
    }

    public static void AssertFalse(this bool target, string msg, int statusCode = 200)
    {
        if (target is not false)
            throw new BusinessException(msg, statusCode);
    }

    public static async Task AssertFalse(this Task<bool> target, string msg, int statusCode = 200)
    {
        if (await target is not false)
            throw new BusinessException(msg, statusCode);
    }
}