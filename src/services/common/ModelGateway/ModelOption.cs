using DeepAgenix.Common.Model;

namespace DeepAgenix.Common.ModelGateway;

public class ModelOption
{
    public IEnumerable<EmbeddingModel>? Embeddings { get; set; }
    public IEnumerable<ChatModel>? Chats { get; set; }

    public class EmbeddingModel
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int Dimension { get; set; }
        public string? Developer { get; set; }
        public IEnumerable<string>? Languages { get; set; }
        public IEnumerable<Endpoint>? Endpoints { get; set; }
    }

    public class ChatModel
    {
        public string? Name { get; set; }
        public string? Value { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int MaxContextTokens { get; set; }
        public string? Series { get; set; }
        public IEnumerable<ModelUsageScenarios>? DisableUsageScenarios { get; set; }
        public IEnumerable<Endpoint>? Endpoints { get; set; }
    }

    public class Endpoint
    {
        public string? Url { get; set; }
        public string? ApiKey { get; set; }
        public int RPM { get; set; }
        public int TPM { get; set; }
        public string? ModelProvider { get; set; }
    }
}