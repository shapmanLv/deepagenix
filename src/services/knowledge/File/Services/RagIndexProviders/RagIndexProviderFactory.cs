using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace DeepAgenix.Knowledge.File;

public class RagIndexProviderFactory(IOptions<RagIndexOption> options, IServiceProvider serviceProvider)
{
    private RagIndexOption _ragIndexOption = options.Value;
    public IRagIndexProvider GetProvider()
    {
        if (string.IsNullOrEmpty(_ragIndexOption.Type))
            throw new ArgumentException("无法识别rag索引实现方式配置");
        return serviceProvider.GetKeyedService<IRagIndexProvider>(_ragIndexOption.Type) ?? throw new ArgumentNullException($"获取rag索引实现类型【{_ragIndexOption.Type}】实例失败");
    }
}