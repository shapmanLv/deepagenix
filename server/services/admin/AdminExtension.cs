using System.Reflection;
using DeepAgenix.Common;
using DeepAgenix.Common.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SqlSugar;

namespace DeepAgenix.Admin;
public static class AdminExtension
{
    public static IServiceCollection AddAdminModule(this IServiceCollection services, IConfiguration configuration, SqlSugarClient sqlSugarClient)
    {
        services.AddCommonModule(configuration);
        var types = Assembly.GetExecutingAssembly().GetTypes();
        services.AddModule(types, sqlSugarClient);
        return services;
    }
}