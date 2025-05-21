namespace DeepAgenix.Knowledge.File;
public interface IFileProvider
{
    public Task UploadAsync(string folder, string fileName, byte[] bytes);
    public Task<byte[]?> DownloadAsync(string folder, string fileName);
    public Task DeleteAsync(string folder, string fileName);
}

public class FileProviderAttribute : Attribute
{
    public string Key { get; set; } = "";
    public FileProviderAttribute(string key) => Key = key;
}