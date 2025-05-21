using Microsoft.Extensions.Options;

namespace DeepAgenix.Knowledge.File;
[FileProvider("Local")]
public class LocalFileProvider(IOptions<KnowledgeOption> option) : IFileProvider
{
    protected string BaseFolder => option.Value.Local?.BaseFolder ?? throw new ArgumentNullException("无法获得本地存储目录配置");
    protected string GetFullPath(string folder, string fileName)
    {
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), BaseFolder, folder);
        if (Directory.Exists(folderPath) is not true)
            Directory.CreateDirectory(folderPath);
        return Path.Combine(folderPath, fileName);
    }

    public Task UploadAsync(string folder, string fileName, byte[] bytes)
    {
        var path = GetFullPath(folder, fileName);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        System.IO.File.WriteAllBytes(path, bytes);
        return Task.CompletedTask;
    }

    public Task<byte[]?> DownloadAsync(string folder, string fileName)
    {
        var path = GetFullPath(folder, fileName);
        if (!System.IO.File.Exists(path))
            return Task.FromResult<byte[]?>(null);

        var bytes = System.IO.File.ReadAllBytes(path);
        return Task.FromResult<byte[]?>(bytes);
    }

    public Task DeleteAsync(string folder, string fileName)
    {
        var path = GetFullPath(folder, fileName);
        if (System.IO.File.Exists(path))
            System.IO.File.Delete(path);

        return Task.CompletedTask;
    }
}