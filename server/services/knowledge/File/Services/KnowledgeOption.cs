namespace DeepAgenix.Knowledge.File;

public class KnowledgeOption
{
    public string? StorageType { get; set; }
    public LocalOption? Local { get; set; }
    public IEnumerable<LanguageOption>? Languages { get; set; }

    public class LocalOption
    {
        public string? BaseFolder { get; set; }
    }
    public class LanguageOption
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
    }
}