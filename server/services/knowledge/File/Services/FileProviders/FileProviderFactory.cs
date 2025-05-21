using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace DeepAgenix.Knowledge.File;
public class FileProviderFactory(IOptions<KnowledgeOption> option, IServiceProvider serviceProvider)
{
    public IFileProvider GetProvider()
    {
        var storageType = option.Value.StorageType;
        if (string.IsNullOrEmpty(storageType))
            throw new ArgumentException("无法识别文件存储实现方式配置");
        return serviceProvider.GetKeyedService<IFileProvider>(storageType) ?? throw new ArgumentNullException($"获取文件存储实现类型【{storageType}】实例失败");
    }
}