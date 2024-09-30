using DemoAppKonkret.API.VeramaClient.Responses;
using Refit;

namespace DemoAppKonkret.API.VeramaClient;

[Headers("Accept: application/json", "Authorization: Bearer")]
public interface IVeramaClient
{
    [Get("/api/job-requests/v2?page={page}&size=20&tab=all-jobs&query=&dedicated=false&favouritesOnly=false&recommendedOnly=false&sort=firstDayOfApplications,DESC")]
    Task<SearchResultsWrapper> GetSearchResults(int page);
    [Get("/api/job-requests/{id}")]
    Task<ListingDetails> GetListingDetails(int id);
}