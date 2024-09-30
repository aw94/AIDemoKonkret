using DemoAppKonkret.API.VeramaClient.Responses;

namespace DemoAppKonkret.API.Application.Contracts.Responses;

public record ListingDetailsApiResponse(
    string Description,
    string Title,
    string Role,
    string Location,
    DateTime AssignmentPeriod,
    int Id,
    string[] Skills)
{
    // from
    public static ListingDetailsApiResponse FromListingDetails(ListingDetails listingDetails)
    {
        return new ListingDetailsApiResponse(
            listingDetails.Description,
            listingDetails.Title,
            listingDetails.SkillRole.Name,
            listingDetails.Locations[0]?.City ?? string.Empty,
            DateTime.Parse(listingDetails.StartDate),
            listingDetails.Id,
            listingDetails.Skills.Where(c => c.Skill is not null).Select(s => s.Skill.Name).ToArray());
    }
}