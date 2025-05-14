using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;

namespace DeepAgenix.Common.Extensions;

public static class IpAddressExtension
{
    public static async Task<string?> GetIpAsync() 
    {
        var ipAddresses = await Dns.GetHostAddressesAsync(Dns.GetHostName());
        return ipAddresses
            .FirstOrDefault(_ => _.AddressFamily is System.Net.Sockets.AddressFamily.InterNetwork)
            ?.ToString();
    }
}