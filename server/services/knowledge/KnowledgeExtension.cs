using System.Reflection;
using DeepAgenix.Common;
using DeepAgenix.Common.Extensions;
using DeepAgenix.Knowledge.File;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SqlSugar;

namespace DeepAgenix.Knowledge;
public static class KnowledgeExtension
{
    public static IServiceCollection AddKnowledgeModule(this IServiceCollection services, IConfiguration configuration, SqlSugarClient sqlSugarClient)
    {
        services.AddCommonModule(configuration);
        services.Configure<KnowledgeOption>(configuration.GetSection("Knowledge"));
        var types = Assembly.GetExecutingAssembly().GetTypes();
        services.AddModule(types, sqlSugarClient);
        services.AddFileProvider(configuration);
        services.AddRagIndexProvider(configuration);
        return services;
    }
}