namespace DeepAgenix.Knowledge.File;

public record KnowledgeVo
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Language { get; set; } = "";
    public string Icon { get; set; } = "";
    public RagIndexConfig IndexConfig { get; set; } = new();
}