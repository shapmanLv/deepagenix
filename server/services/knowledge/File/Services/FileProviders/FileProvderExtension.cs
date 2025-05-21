using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeepAgenix.Knowledge.File;
public static class FileProviderExtension
{
    public static IServiceCollection AddFileProvider(this IServiceCollection services, IConfiguration configuration)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var providerTypes = assembly.GetTypes()
            .Where(_ =>
                typeof(IFileProvider).IsAssignableFrom(_)
                && !_.IsInterface
                && !_.IsAbstract);

        var baseType = typeof(IFileProvider);
        foreach (var type in providerTypes)
        {
            var attr = type.GetCustomAttribute<FileProviderAttribute>();
            if (attr is null)
                continue;
            services.AddKeyedScoped(baseType, attr.Key, type);
        }
        services.AddScoped<FileProviderFactory>();
        return services;
    }
}