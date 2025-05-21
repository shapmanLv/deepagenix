namespace DeepAgenix.Knowledge.File;

public interface IRagIndexProvider
{
    Task CreateAsync(long knowledgeId, RagIndexConfig indexConfig);
    Task RemoveAsync(long knowledgeId);
}

public class RagIndexProviderAttribute : Attribute
{
    public string Key { get; set; } = "";
    public RagIndexProviderAttribute(string key) => Key = key;
}