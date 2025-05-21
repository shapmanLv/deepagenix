using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeepAgenix.Common.ModelGateway;

public static class ModelExtension
{
    public static IServiceCollection AddModelGateway(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ModelOption>(configuration.GetSection("Model"));
        return services;
    }
}