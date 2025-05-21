namespace DeepAgenix.Admin.Model;

public class EmbeddingModelVo
{
    public string? Name { get; set; }
    public string? Value { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int Dimension { get; set; }
    public string? Developer { get; set; }
    public IEnumerable<string>? Languages { get; set; }
}