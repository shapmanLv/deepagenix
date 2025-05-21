using System.Threading.Tasks;
using DeepAgenix.Common.Authentication;
using DeepAgenix.Common.Extensions;
using Mapster;
using Microsoft.Extensions.Options;
using SqlSugar;

namespace DeepAgenix.Knowledge.File;

public class KnowledgeService(
    IOptions<KnowledgeOption> knowledgeOptions,
    SqlSugarClient sqlSugarClient,
    IUserContext userContext,
    RagIndexProviderFactory ragIndexProviderFactory,
    IOptions<RagIndexOption> ragIndexOptions)
{
    protected IRagIndexProvider RagIndexProvider { get; private set; } = ragIndexProviderFactory.GetProvider();
    protected KnowledgeOption KnowledgeOption { get; private set; } = knowledgeOptions.Value;
    protected RagIndexOption RagIndexOption { get; private set; } = ragIndexOptions.Value;

    public IEnumerable<KnowledgeLanguageVo> GetLanguages()
        => KnowledgeOption.Languages?.Select(_ => new KnowledgeLanguageVo(_.Name ?? "", _.Value ?? "")) ?? [];

    public async Task CreateAsync(KnowledgeVo vo)
    {
        await sqlSugarClient.Queryable<Knowledges>()
            .AnyAsync(_ => _.Name == vo.Name.Trim() && _.Deleted == false && _.CreatedBy == userContext.GetUserId())
            .AssertFalse("已存在同名知识库");
        var entity = vo.Adapt<Knowledges>();
        entity.SetCreationAudit(userContext.GetUserId());
        await RagIndexProvider.CreateAsync(entity.Id, vo.IndexConfig);
        await sqlSugarClient.Insertable(entity).ExecuteCommandAsync();
    }

    public async Task UpdateAsync(long id, KnowledgeVo vo)
    {
        await sqlSugarClient.Queryable<Knowledges>()
            .AnyAsync(_ => _.Id != id && _.Name == vo.Name.Trim() && _.Deleted == false && _.CreatedBy == userContext.GetUserId())
            .AssertFalse("已存在同名知识库");
        var entity = vo.Adapt<Knowledges>();
        entity.SetModificationAudit(userContext.GetUserId());
        await sqlSugarClient.Updateable(entity).ExecuteCommandAsync();
    }

    public async Task RemoveAsync(long id)
    {
        var entity = await sqlSugarClient.Queryable<Knowledges>()
            .Where(_ => _.Id == id && _.Deleted == false)
            .FirstAsync()
            .AssertNotNull("知识库不存在");
        entity.SetModificationAudit(userContext.GetUserId());
        entity.Deleted = true;
        await RagIndexProvider.RemoveAsync(id);
        await sqlSugarClient.Updateable(entity).ExecuteCommandAsync();
    }

    public IEnumerable<RagIndexOption.PluginOption>? GetParticiplePlugins()
        => RagIndexOption.Participles?.SelectMany(_ => _.Plugins ?? []);

    public async Task<List<KnowledgeCardVo>> GetKnowledgesAsync()
        => (await sqlSugarClient.Queryable<Knowledges>()
        .Where(_ =>
            _.CreatedBy == userContext.GetUserId()
            && _.Deleted == false)
        .OrderByDescending(_ => _.ModifiedTime)
        .ToListAsync())
        .Adapt<List<KnowledgeCardVo>>();

    public async Task<KnowledgeVo> GetKnowledgeAsync(long id)
        => (await sqlSugarClient.Queryable<Knowledges>()
        .Where(_ =>
            _.Deleted == false
            && _.Id == id)
        .FirstAsync()
        .AssertNotNull("无法找到该知识库"))
        .Adapt<KnowledgeVo>();
}