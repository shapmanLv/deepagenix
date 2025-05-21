using DeepAgenix.Common.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeepAgenix.Knowledge.File;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class KnowledgeController(KnowledgeService knowledgeService)
{
    [HttpGet("languages")]
    public ApiResult<IEnumerable<KnowledgeLanguageVo>> GetLanguages()
        => knowledgeService.GetLanguages().FormatAsApiResult();
    [HttpPost]
    public async Task<ApiResult> CreateAsync(KnowledgeVo vo)
        => await knowledgeService.CreateAsync(vo).FormatAsApiResult();
    [HttpPut("{id}")]
    public async Task<ApiResult> UpdateAsync(long id, KnowledgeVo vo)
        => await knowledgeService.UpdateAsync(id, vo).FormatAsApiResult();
    [HttpDelete("{id}")]
    public async Task<ApiResult> RemoveAsync(long id)
        => await knowledgeService.RemoveAsync(id).FormatAsApiResult();
    [HttpGet("participle/plugins")]
    public ApiResult<IEnumerable<RagIndexOption.PluginOption>?> GetParticiplePlugins()
        => knowledgeService.GetParticiplePlugins().FormatAsApiResult();
    [HttpGet]
    public async Task<ApiResult<List<KnowledgeCardVo>>> GetKnowledgesAsync()
        => await knowledgeService.GetKnowledgesAsync().FormatAsApiResult();
    [HttpGet("{id}")]
    public async Task<ApiResult<KnowledgeVo>> GetKnowledgeAsync(long id)
        => await knowledgeService.GetKnowledgeAsync(id).FormatAsApiResult();
}