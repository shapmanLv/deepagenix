using Consul;
using Microsoft.AspNetCore.Builder;

namespace DeepAgenix.Common.Extensions;

public static class CnosulExtension
{
    public static async Task UseConsul(this WebApplication app, string serviceName, int port)
    {
        var consulHost = app.Configuration["CONSUL_HOST"] ?? throw new ArgumentNullException("无法获得consul地址配置");
        var consulPort = app.Configuration["CONSUL_PORT"] ?? throw new ArgumentNullException("无法获得consul地址配置");
        var consulClient = new ConsulClient(config => config.Address = new Uri($"http://{consulHost}:{consulPort}"));
        var ip = app.Configuration["IP"] ?? await IpAddressExtension.GetIpAsync();
        var serviceId = Guid.NewGuid().ToString("N");
        app.MapGet("/health", () => "I am fine");
        await consulClient.Agent.ServiceRegister(new AgentServiceRegistration
        {
            ID = serviceId,
            Address = ip,
            Name = serviceName,
            Port = port,
            Check = new AgentServiceCheck
            {
                Interval = TimeSpan.FromSeconds(10),
                Timeout = TimeSpan.FromSeconds(5),
                HTTP = $"http://{ip}:{port}/health",
                DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(3),
            }
        });
        app.Lifetime.ApplicationStopping.Register(() =>
          consulClient.Agent.ServiceDeregister(serviceId));
    }
}