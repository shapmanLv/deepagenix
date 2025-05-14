using SqlSugar;

namespace DeepAgenix.Common.BaseEntity;

public class AuditEntity : Entity
{
    [SugarColumn(ColumnDescription = "修改人")]
    public long ModifiedBy { get; set; }
    [SugarColumn(ColumnDescription = "修改时间")]
    public DateTime ModifiedTime { get; set; }
    [SugarColumn(ColumnDescription = "创建人")]
    public long CreatedBy { get; set; }
    [SugarColumn(ColumnDescription = "创建时间")]
    public DateTime CreatedTime { get; set; }

    public void SetCreationAudit(long userId)
    {
        var now = DateTime.UtcNow;
        CreatedBy = userId;
        CreatedTime = now;
        ModifiedBy = userId;
        ModifiedTime = now;
    }

    public void SetModificationAudit(long userId)
    {
        ModifiedBy = userId;
        ModifiedTime = DateTime.UtcNow;
    }
}