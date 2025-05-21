using System.Net;

namespace DeepAgenix.Common.Exceptions;
public class BusinessException(string msg, int statusCode = 200) : Exception
{
    public string Msg { get; set; } = msg;
    public int StatusCode { get; set; } = statusCode;
}