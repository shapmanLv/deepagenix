using DeepAgenix.Admin;
using DeepAgenix.Common.Authentication;
using DeepAgenix.Common.Exceptions;
using DeepAgenix.Common.Extensions;
using DeepAgenix.Knowledge;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Configuration.AddDeepAgenixConfigurationBuilder(builder.Environment.EnvironmentName);
builder.Services.AddScoped(service => builder.Configuration.BuildSqlSugarClientInstance());
var sqlSugarClient = builder.Configuration.BuildSqlSugarClientInstance();
sqlSugarClient.DbMaintenance.CreateDatabase();
builder.Services.AddKnowledgeModule(builder.Configuration, sqlSugarClient);
builder.Services.AddAdminModule(builder.Configuration, sqlSugarClient);

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
await app.UseConsul("main", 8080);
app.UseAuthentication();
app.UseMiddleware<UserContextMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();