using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Yaml;

namespace DeepAgenix.Common.Extensions;
public static class ConfigurationExtension
{
    public static IConfigurationBuilder AddDeepAgenixConfigurationBuilder(this IConfigurationBuilder builder, string environmentName)
    {
        var configFolderPath = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "", "configs");
        if (Directory.Exists(configFolderPath) is not true)
            configFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "configs");
        return builder.AddConfiguration(new ConfigurationBuilder()
            .SetBasePath(configFolderPath)
            .AddYamlFile($"appsettings.yml", optional: true, reloadOnChange: true)
            .AddYamlFile($"appsettings.{environmentName}.yml", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build());
    }
}