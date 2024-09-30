using DemoAppKonkret.API.VeramaClient.Responses;

namespace DemoAppKonkret.API.Application.Contracts.Responses;

public record SearchResultApiResponse(string Title, string Location, string Company, int Id)
{
    public static SearchResultApiResponse FromSearchResult(SearchResult searchResult)
    {
        return new SearchResultApiResponse(searchResult.Title,
            searchResult.City,
            searchResult.ClientLegalEntityName,
            searchResult.Id
            );
    }
}

