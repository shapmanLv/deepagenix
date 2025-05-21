using DeepAgenix.Common.BaseEntity;
using SqlSugar;

namespace DeepAgenix.Knowledge.File;

[SugarTable("kno_file", tableDescription: "知识库文件")]
public class Files : AuditEntity
{
    [SugarColumn(ColumnDescription = "文件名", Length = 1000)]
    public string? Name { get; set; }
    [SugarColumn(ColumnDescription = "文件大小")]
    public long Size { get; set; }
    [SugarColumn(ColumnDescription = "知识库id")]
    public long KnowledgeId { get; set; }
}