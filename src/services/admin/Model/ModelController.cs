using DeepAgenix.Common.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeepAgenix.Admin.Model;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ModelController(ModelService modelService)
{
    [HttpGet("embeddings")]
    public ApiResult<IEnumerable<EmbeddingModelVo>> GetEmbeddings()
        => modelService.GetEmbeddings().FormatAsApiResult();
    [HttpGet("chats/{modelUsageScenarios}")]
    public ApiResult<IEnumerable<ChatModelVo>> GetChats(ModelUsageScenarios modelUsageScenarios)
        => modelService.GetChats(modelUsageScenarios).FormatAsApiResult();
}