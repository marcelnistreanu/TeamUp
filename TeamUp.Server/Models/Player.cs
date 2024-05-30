using Newtonsoft.Json;
using TeamUp.Server.Utils;

namespace TeamUp.Server.Models;

public class Player
{
    public int Id { get; set; }

    // [NameAttribute]
    public string FirstName { get; set; } = string.Empty;
    public string LastName {get; set;} = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? nickName { get; set; } = string.Empty;
    public DateTime? DOB { get; set; }
    public int Rating { get; set; }
    public List<Team> Teams { get; set; } = new();
    // [JsonIgnore]
    public List<Game> Games = new();
}
