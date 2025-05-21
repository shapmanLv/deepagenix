using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeepAgenix.Knowledge.File;
public static class RagIndexProviderExtension
{
    public static IServiceCollection AddRagIndexProvider(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<RagIndexProviderFactory>();
        services.Configure<RagIndexOption>(configuration.GetSection("RagIndex"));
        
        var assembly = Assembly.GetExecutingAssembly();
        var providerTypes = assembly.GetTypes()
            .Where(_ =>
                typeof(IRagIndexProvider).IsAssignableFrom(_)
                && !_.IsInterface
                && !_.IsAbstract);

        var baseType = typeof(IRagIndexProvider);
        foreach (var type in providerTypes)
        {
            var attr = type.GetCustomAttribute<RagIndexProviderAttribute>();
            if (attr is null)
                continue;
            services.AddKeyedScoped(baseType, attr.Key, type);
        }

        return services;
    }
}