using DemoAppKonkret.API.Application.Contracts.Responses;
using DemoAppKonkret.API.VeramaClient;
using Microsoft.AspNetCore.Mvc;
using Refit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("Expire20", cachePolicyBuilder =>
        cachePolicyBuilder.Expire(TimeSpan.FromSeconds(20)));
});
builder.Services.AddRefitClient<IVeramaClient>(_ =>
    {
        VeramaClientSettings.AuthToken = builder.Configuration.GetValue<string>("AuthToken") ??
                                         throw new Exception("AuthToken");
        return VeramaClientSettings.Instance;
    })
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://app.verama.com"));
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(
            corsPolicyBuilder =>
            {
                corsPolicyBuilder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });
}

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}
app.UseOutputCache();
// Configure the HTTP request pipeline.


app.MapGet("/search/listings", async (IVeramaClient veramaClient, [FromQuery] int page) =>
    {
        var searchResults = await veramaClient.GetSearchResults(page);
        searchResults.TotalPages = searchResults.TotalPages;
        var searchResultsResponse = searchResults.SearchResults.Select(SearchResultApiResponse.FromSearchResult);
        return new SearchResultWrapperApiResponse(searchResultsResponse, searchResults.TotalPages, searchResults.Last);
    })
    .WithOpenApi()
    .WithName("GetSearchResults")
    .CacheOutput(policyName: "Expire20");

app.MapGet("/listing/{id:int}", async (IVeramaClient veramaClient, int id) =>
    {
        var listing = await veramaClient.GetListingDetails(id);
        return ListingDetailsApiResponse.FromListingDetails(listing);
    })
    .WithOpenApi()
    .WithName("GetListingDetails")
    .CacheOutput(policyName: "Expire20");

app.Run();