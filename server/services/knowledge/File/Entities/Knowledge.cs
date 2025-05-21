using DeepAgenix.Common.BaseEntity;
using SqlSugar;

namespace DeepAgenix.Knowledge.File;

[SugarTable("kno_knowledge", tableDescription: "知识库")]
public class Knowledges : AuditEntity
{
    [SugarColumn(ColumnDescription = "名称", Length = 100)]
    public string Name { get; set; } = "";
    [SugarColumn(ColumnDescription = "描述", Length = 1000)]
    public string Description { get; set; } = "";
    [SugarColumn(ColumnDescription = "索引配置", IsJson = true, IsNullable = true)]
    public RagIndexConfig? IndexConfig { get; set; }
    [SugarColumn(ColumnDescription = "语言", Length = 5)]
    public string Language { get; set; } = "";
    [SugarColumn(ColumnDescription = "图标", Length = 500, IsNullable = true)]
    public string? Icon { get; set; }
}