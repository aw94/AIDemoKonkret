using System.Text.Json.Serialization;

namespace DemoAppKonkret.API.VeramaClient.Responses;

public class SearchResult
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string City { get; set; }
    public string ClientLegalEntityName { get; set; }
}

public class SearchResultsWrapper
{
    [JsonPropertyName("content")] 
    public List<SearchResult> SearchResults { get; set; }
    public int TotalPages { get; set; }
    public bool Last { get; set; }
}