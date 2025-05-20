using DeepAgenix.Common.Model;
using DeepAgenix.Common.ModelGateway;
using Dm.util;
using Mapster;
using Microsoft.Extensions.Options;

namespace DeepAgenix.Admin.Model;

public class ModelService(IOptions<ModelOption> options)
{
    private readonly ModelOption _modelOption = options.Value;
    public IEnumerable<EmbeddingModelVo> GetEmbeddings()
    {
        var models = _modelOption.Embeddings?.Where(_ => _.Endpoints?.Any() is true);
        return models.Adapt<IEnumerable<EmbeddingModelVo>>();
    }

    public IEnumerable<ChatModelVo> GetChats(ModelUsageScenarios modelUsageScenarios)
    {
        var models = _modelOption.Chats?.Where(_ => _.Endpoints?.Any() is true) ?? [];
        var result = new List<ChatModelVo>();
        foreach (var item in models)
        {
            var model = item.Adapt<ChatModelVo>();
            if (item.DisableUsageScenarios?.Contains(modelUsageScenarios) is true)
                model.Disable = true;
            result.Add(model);
        }
        return result;
    }
}