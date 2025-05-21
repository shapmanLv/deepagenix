
namespace DeepAgenix.Knowledge.File;

[RagIndexProvider("elasticsearch")]
public class ElasticsearchRagIndexProvider : IRagIndexProvider
{
    public Task CreateAsync(long knowledgeId, RagIndexConfig indexConfig)
        => Task.CompletedTask;

    public Task RemoveAsync(long knowledgeId)
        => Task.CompletedTask;
}