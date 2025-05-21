using DeepAgenix.Common.BaseEntity;
using SqlSugar;

namespace DeepAgenix.Admin.User;
[SugarTable("adm_user")]
public class Users : AuditEntity
{
    public Users() { }
    public Users(string username, string password)
    {
        Username = username;
        Password = password;
    }
    [SugarColumn(ColumnDescription = "用户名")]
    public string Username { get; set; } = "";
    [SugarColumn(ColumnDescription = "密码")]
    public string Password { get; set; } = "";
    [SugarColumn(ColumnDescription = "用户是否被启用：true启用 false禁用")]
    public bool Enable {get;set;} = true;
}