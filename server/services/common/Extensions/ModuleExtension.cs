using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using SqlSugar;

namespace DeepAgenix.Common.Extensions;
public static class MouduleExtension
{
    public static IServiceCollection AddModule(this IServiceCollection services, Type[] types, SqlSugarClient sqlSugarClient)
    {
        var sugarTypes = types
            .Where(t =>
                t.IsClass &&
                !t.IsAbstract &&
                t.GetCustomAttribute<SugarTable>() != null
            ).ToArray();
        if (sugarTypes.Length > 0)
            sqlSugarClient.CodeFirst.InitTables(sugarTypes);
        types.Where(t => t.IsClass && !t.IsAbstract && t.Name.EndsWith("Service"))
            .ToList()
            .ForEach(_ => services.AddScoped(_));
        return services;
    }
}