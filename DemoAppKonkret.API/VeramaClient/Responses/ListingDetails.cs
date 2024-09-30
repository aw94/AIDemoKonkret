namespace DemoAppKonkret.API.VeramaClient.Responses;
    public class Location
    {
        public string City { get; set; }
    }
    public class ListingDetails
    {

        public string Description { get; set; }
        public SkillRole SkillRole { get; set; }
        public int Id { get; set; }
        public string Title { get; set; }
        public string StartDate { get; set; }
        public List<Location> Locations { get; set; }
        public List<Skills> Skills { get; set; }
    }

    public class Skills
    {
        public Skill2 Skill { get; set; }
    }

    public class Skill2
    {
        public string Name { get; set; }
    }

    public class SkillRole
    {
        public string Name { get; set; }
    }