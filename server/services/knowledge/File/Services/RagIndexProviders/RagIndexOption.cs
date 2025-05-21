namespace DeepAgenix.Knowledge.File;

public class RagIndexOption
{
    public string? Type { get; set; }
    public IEnumerable<ParticipleOption>? Participles { get; set; }

    public class ParticipleOption
    {
        public string? Type { get; set; }
        public string? Description { get; set; }
        public IEnumerable<PluginOption>? Plugins { get; set; }
    }

    public class PluginOption
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public IEnumerable<string>? Languages { get; set; }
    }
}