namespace DeepAgenix.Admin.Model;

public class ChatModelVo
{
    public string? Name { get; set; }
    public string? Value { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int MaxContextTokens { get; set; }
    public string? Series { get; set; }
    public bool Disable { get; set; } = false;
}