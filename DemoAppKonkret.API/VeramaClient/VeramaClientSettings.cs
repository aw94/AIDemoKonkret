using System.Text.Json;
using Refit;

namespace DemoAppKonkret.API.VeramaClient;

public class VeramaClientSettings
{
    public static string AuthToken = "";
    public static RefitSettings Instance { get; } = new()
    {
        ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true
        }),
        AuthorizationHeaderValueGetter = (requestMessage,cancellationToken) => Task.FromResult(AuthToken)
    };
}