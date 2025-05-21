using Microsoft.Extensions.Configuration;
using SqlSugar;

namespace DeepAgenix.Common.Extensions;
public static class SqlSugarExtension
{
    public static SqlSugarClient BuildSqlSugarClientInstance(this IConfiguration configuration)
    {
        var connectionString = $"server={configuration["Postgres:Host"]};port={configuration["Postgres:Port"]};database={configuration["Postgres:Database"]};uid={configuration["Postgres:User"]};pwd={configuration["Postgres:Password"]};trustServerCertificate=true";
        var client = new SqlSugarClient(
            new ConnectionConfig()
            {
                ConnectionString = connectionString,
                DbType = DbType.PostgreSQL,
                IsAutoCloseConnection = true
            },
            config => { }
        );
        client.Ado.CommandTimeOut = 30; // sql执行超时时间 30s
        return client;
    }
}