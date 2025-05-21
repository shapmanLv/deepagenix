namespace DeepAgenix.Knowledge.File;

public record KnowledgeCardVo
{
    public long? Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
}