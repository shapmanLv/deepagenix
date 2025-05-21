using System.Text.Json;
using System.Text.Json.Serialization;

namespace DeepAgenix.Common.Extensions;

public class SnowflakeIdConverter : JsonConverter<long>
{
    public override long Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var value = reader.GetString();
            return long.TryParse(value, out var parseResult) ? parseResult : 0;
        }
        else
            return reader.GetInt64();
    }

    public override void Write(Utf8JsonWriter writer, long value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.ToString());
}