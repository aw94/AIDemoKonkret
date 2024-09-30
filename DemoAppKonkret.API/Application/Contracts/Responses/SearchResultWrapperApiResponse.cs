namespace DemoAppKonkret.API.Application.Contracts.Responses;

public record SearchResultWrapperApiResponse(IEnumerable<SearchResultApiResponse> SearchResults, int TotalPages, bool Last);