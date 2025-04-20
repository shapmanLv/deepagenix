using Microsoft.Extensions.Configuration.Yaml;

var builder = WebApplication.CreateBuilder(args);
var configFolderPath = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())?.FullName ?? "", "configs");
if (Directory.Exists(configFolderPath) is not true)
    configFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "configs");

builder.Configuration.AddConfiguration(new ConfigurationBuilder()
    .SetBasePath(configFolderPath)
    .AddYamlFile($"appsettings.yml", optional: true, reloadOnChange: true)
    .AddYamlFile($"appsettings.{builder.Environment.EnvironmentName}.yml", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build());

Console.WriteLine(builder.Configuration["test"]);
var app = builder.Build();
app.MapGet("/health", () => "I am fine").WithName("health");

app.Run();