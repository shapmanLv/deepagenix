using SqlSugar;

namespace DeepAgenix.Common;

public class Entity
{
    private long? _id = null;
    [SugarColumn(IsPrimaryKey = true, ColumnDescription = "主键id")]
    public long Id
    {
        get
        {
            if (_id is null)
                _id = SnowflakeIdGenerator.Instanse.NextId();
            return _id.Value;
        }
        set => _id = value;
    }

    [SugarColumn(ColumnDescription = "软删除")]
    public bool Deleted { get; set; }
}